import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { CheckCircle2, Loader2, ImagePlus, X, AlertCircle, Info } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "../../ui/alert";
import { PUBLICATION_VISIBILITIES, translatePublicationVisibility } from "@/features/events";

const publicationSchema = z.object({
  title: z.string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(200, "El título no puede exceder 200 caracteres"),
  content: z.string()
    .min(10, "El contenido debe tener al menos 10 caracteres")
    .max(5000, "El contenido no puede exceder 5000 caracteres"),
  type: z.enum(["aviso", "comunicado", "material", "evento", "articulo"], {
    message: "Selecciona un tipo de anuncio",
  }),
  summary: z.string()
    .max(500, "El resumen no puede exceder 500 caracteres")
    .optional(),
  visibility: z.enum(["public", "private", "role_based"]),
  status: z.enum(["borrador", "activo", "pendiente"]),
});

type PublicationFormData = z.infer<typeof publicationSchema>;

interface EditPublicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdatePublication: (data: PublicationFormData & { image?: File; saveAsDraft?: boolean }) => void;
  isPending?: boolean;
  publication: API.Publication | null;
}

export const EditPublicationDialog = ({
  open,
  onOpenChange,
  onUpdatePublication,
  isPending = false,
  publication,
}: EditPublicationDialogProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<PublicationFormData>({
    resolver: zodResolver(publicationSchema),
  });

  const visibility = watch("visibility");

  // Reset form when dialog opens with publication data
  useEffect(() => {
    if (open && publication) {
      reset({
        title: publication.title,
        content: publication.content,
        type: publication.type,
        summary: publication.summary || "",
        visibility: publication.visibility,
        status: publication.status === "inactivo" ? "activo" : publication.status,
      });
      
      if (publication.image_url) {
        setImagePreview(publication.image_url);
      }
    }
  }, [open, publication, reset]);

  // Reset image when dialog closes
  useEffect(() => {
    if (!open) {
      setImage(null);
      setImagePreview(null);
    }
  }, [open]);

  // Clean up image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    setImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(null);
    setImagePreview(publication?.image_url || null);
  };

  const onSubmit = (data: PublicationFormData, isDraft: boolean) => {
    onUpdatePublication({
      ...data,
      status: isDraft ? "borrador" : "activo",
      image: image || undefined,
      saveAsDraft: isDraft,
    });
  };

  const handleSubmitWithStatus = (isDraft: boolean) => {
    return handleSubmit((data) => onSubmit(data, isDraft));
  };

  const isEventPublication = publication?.type === "evento";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Editar Anuncio</DialogTitle>
          <DialogDescription>
            Actualiza la información de la anuncio.
          </DialogDescription>
        </DialogHeader>

        {isEventPublication && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Esta es una anuncio de evento. Los cambios aquí no afectarán el evento original.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3 sm:space-y-4 overflow-x-hidden">
          <div className="w-full">
            <Label htmlFor="pub-title">Título *</Label>
            <Input
              id="pub-title"
              {...register("title")}
              disabled={isPending}
              className={errors.title ? "border-destructive" : ""}
              placeholder="Título de la anuncio"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="w-full">
            <Label htmlFor="pub-type">Tipo de anuncio *</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending || isEventPublication}
                >
                  <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aviso">Aviso</SelectItem>
                    <SelectItem value="comunicado">Comunicado</SelectItem>
                    <SelectItem value="material">Material Educativo</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-sm text-destructive mt-1">{errors.type.message}</p>
            )}
          </div>

          <div className="w-full">
            <Label htmlFor="pub-content">Contenido *</Label>
            <Textarea
              id="pub-content"
              {...register("content")}
              disabled={isPending}
              className={errors.content ? "border-destructive" : ""}
              placeholder="Escribe el contenido de la anuncio..."
              rows={4}
            />
            {errors.content && (
              <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
            )}
          </div>

          <div className="w-full">
            <Label htmlFor="pub-summary">Resumen (opcional)</Label>
            <Textarea
              id="pub-summary"
              {...register("summary")}
              disabled={isPending}
              className={errors.summary ? "border-destructive" : ""}
              placeholder="Breve resumen de la anuncio..."
              rows={2}
            />
            {errors.summary && (
              <p className="text-sm text-destructive mt-1">{errors.summary.message}</p>
            )}
          </div>

          <div className="w-full">
            <Label htmlFor="pub-visibility">Visibilidad *</Label>
            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PUBLICATION_VISIBILITIES.map(value =>(
                      <SelectItem key={value} value={value}>{translatePublicationVisibility(value)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {visibility === "private" && (
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Al establecer la visibilidad como <strong>Privada</strong>, deberá configurar los permisos de acceso en las opciones de la publicación (Compartir).
              </AlertDescription>
            </Alert>
          )}

          <div className="w-full">
            <Label>Imagen (opcional)</Label>
            {!imagePreview ? (
              <div className="mt-2">
                <label
                  htmlFor="pub-image"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click para subir imagen</span>
                  </div>
                  <input
                    id="pub-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isPending}
                  />
                </label>
              </div>
            ) : (
              <div className="mt-2 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                  disabled={isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            
            <Button 
                type="button" 
                variant="secondary"
                disabled={isPending} 
                className="w-full sm:w-auto"
                onClick={handleSubmitWithStatus(true)}
            >
               {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar como borrador"
              )}
            </Button>

            <Button 
                type="button" 
                disabled={isPending} 
                className="w-full sm:w-auto"
                onClick={handleSubmitWithStatus(false)}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Actualizar y Publicar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
