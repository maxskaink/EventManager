import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { PublicationAPI } from "@/services/api";
import { toast } from "sonner";
import { UnifiedHeader } from "@/components/layout/UnifiedHeader";
import { HideOnScrollWrapper } from "@/components/layout/HideOnScrollWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus, ArrowLeft, Info } from "lucide-react";
import { getErrorMessageForToast } from "@/features/errors/error.helpers";

export function CreatePublicationPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "aviso",
    content: "",
    summary: "",
    visibility: "public",
    status: "activo",
    image: null as File | null,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Por favor, completa los campos requeridos");
      return;
    }

    setIsLoading(true);

    try {
      await PublicationAPI.createPublication({
        title: formData.title,
        content: formData.content,
        type: formData.type as API.PublicationType,
        status: formData.status as API.PublicationStatus,
        visibility: formData.visibility as API.PublicationVisibility,
        summary: formData.summary || "",
        image: formData.image || undefined,
      });

      toast.success("✅ Anuncio creada exitosamente");
      navigate("/publications");
    } catch (error) {
      const message = getErrorMessageForToast(error, "Error al crear la anuncio");
      toast.error(message);
      console.error("Error creating publication:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <HideOnScrollWrapper>
        <UnifiedHeader
          title="Crear Anuncio"
          subtitle="Crea una anuncio simple (aviso, comunicado o material educativo)"
          onGoBack={handleCancel}
        />
      </HideOnScrollWrapper>

      <div className="max-w-3xl mx-auto p-0 md:px-6 lg:px-8 md:py-8 space-y-8">
        <Card className="border-0 md:border md:border-slate-200 shadow-none md:shadow-lg md:rounded-2xl rounded-none">
          <CardHeader className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-6 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Info className="h-5 w-5 shrink-0" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6 lg:p-8 min-h-[calc(100vh-200px)] md:min-h-auto">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 px-2 sm:px-4 md:px-0">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-700 font-semibold">
                  Título <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Título de la anuncio"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              {/* Tipo y Visibilidad - 2 columnas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Tipo de Anuncio */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-700 font-semibold">
                    Tipo de Anuncio <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aviso">Aviso</SelectItem>
                      <SelectItem value="comunicado">Comunicado</SelectItem>
                      <SelectItem value="material">Material Educativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Visibilidad */}
                <div className="space-y-2">
                  <Label htmlFor="visibility" className="text-slate-700 font-semibold">
                    Visibilidad <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.visibility}
                    onValueChange={(value) => handleSelectChange("visibility", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Pública</SelectItem>
                      <SelectItem value="private">Privada</SelectItem>
                      <SelectItem value="role_based">Por Rol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-700 font-semibold">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="borrador">Borrador</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contenido */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-slate-700 font-semibold">
                  Contenido <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Escribe el contenido de la anuncio..."
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* Resumen */}
              <div className="space-y-2">
                <Label htmlFor="summary" className="text-slate-700 font-semibold">
                  Resumen <span className="text-slate-500 text-sm">(opcional)</span>
                </Label>
                <Textarea
                  id="summary"
                  name="summary"
                  placeholder="Breve resumen de la anuncio..."
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows={3}
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  disabled={isLoading}
                />
              </div>

              {/* Imagen */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">
                  Imagen <span className="text-slate-500 text-sm">(opcional)</span>
                </Label>
                <div className="mt-2">
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full px-3 sm:px-6 py-6 sm:py-12 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ImagePlus className="h-10 w-10 text-slate-400 mb-3 group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm text-slate-600 group-hover:text-slate-700 font-medium">
                        Click para subir imagen
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        PNG, JPG o GIF (máx. 5MB)
                      </span>
                    </div>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                  {formData.image && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                      <div className="text-green-600">✓</div>
                      <span className="text-sm text-green-700">{formData.image.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t px-2 sm:px-4 md:px-0 pb-2 sm:pb-0">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2text-xs sm:text-sm py-2 sm:py-auto h-auto sm:h-9"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  
                  disabled={isLoading}
                  className="w-full sm:w-auto font-semibold shadow-md hover:shadow-lg transition-all text-xs sm:text-sm py-2 sm:py-auto h-auto sm:h-9"
                >
                  {isLoading ? "Creando..." : "Crear Anuncio"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
