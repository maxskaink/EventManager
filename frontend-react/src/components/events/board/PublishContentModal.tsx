import React, { useState, useEffect, type FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { toast } from "sonner";
import { ImagePlus, X, Loader2 } from "lucide-react";
// Asumiendo que ContentItem y la API están en estas rutas
import {
  // Una lista con todos los estados de anuncio
  PUBLICATION_STATUSES,
  // Una lista con todos los tipos de anuncio
  PUBLICATION_TYPES,
  // Una lista con todos los tipos de visibilidad de anuncio
  PUBLICATION_VISIBILITIES,
  translatePublicationStatus,
  translatePublicationType,
  translatePublicationVisibility,
  type ContentItem,
} from "../../../features/events"; // Tipo de entrada
import { PublicationAPI } from "../../../services/api"; // API de salida

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: () => void; // Callback al éxito
  item: ContentItem | null; // Contenido para pre-llenar
};


/**
 * Modal para crear una publicació a partir de un posible contenido
 */
export function PublishContentModal({ isOpen, onOpenChange, item, onPublish }: Props) {
  // Estado del formulario
  const [summary, setSummary] = useState("");
  const [type, setType] = useState<API.PublicationType>("articulo");
  const [status, setStatus] = useState<API.PublicationStatus>("activo");
  const [visibility, setVisibility] = useState<API.PublicationVisibility>("public");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-llenar el formulario cuando el 'item' cambie
  useEffect(() => {
    if (item) {
      // Usar una parte de la descripción/contenido como resumen inicial
      setSummary(item.description?.split("\n")[0].slice(0, 200) || "");
      if (item.type === 'evento') {
        setType('evento');
      }
    }
  }, [item]);

  // Manejar la selección y vista previa de la imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que es una imagen
    if (!file.type.startsWith("image/")) {
      toast.error("El archivo seleccionado no es una imagen.");
      return;
    }

    setImage(file);

    // Crear vista previa
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Limpiar la URL de la vista previa para evitar memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!item || !image) {
      toast.error("Por favor completa todos los campos, incluye una imagen.");
      return;
    }

    setIsLoading(true);

    // Construir el FormData para el envío
    const data = {
      title: item.title,
      content: item.description || "", // Asumiendo 'description' es 'content'
      type: type,
      status: status,
      visibility: visibility,
      image: image,
      summary: summary,
    };
    
    const apiCall = item.type === 'evento' 
        ? PublicationAPI.addEventPublication(Number(item.id), data)
        : PublicationAPI.createPublication(data);


    // Usar toast.promise para la llamada a la API
    toast.promise(apiCall, {
      loading: "Publicando contenido...",
      success: () => {
        setIsLoading(false);
        onPublish(); // Llamar al callback de éxito
        onOpenChange(false); // Cerrar el modal
        // Resetear estado
        setImage(null);
        setImagePreview(null);
        setSummary("");
        return "Contenido publicado exitosamente.";
      },
      error: () => {
        setIsLoading(false);
        // Puedes personalizar el mensaje basado en 'err'
        return "Error al publicar. Intenta de nuevo.";
      },
    });
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-1000 max-w-[90vw] max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Publicar Contenido</DialogTitle>
          <DialogDescription>
            Añade detalles de anuncio para: <span className="font-semibold">{item.title}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 py-4">
            {/* Columna Izquierda - Imagen */}
            <div className="space-y-2">
              <Label htmlFor="image">Imagen de Portada</Label>
              {imagePreview ? (
                <div className="relative w-fit m-auto">
                  <img src={imagePreview} alt="Vista previa" className="max-h-100 w-full object-contain rounded-md border" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImagePlus className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="mb-2 text-sm text-muted-foreground">Haz clic para subir una imagen</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG o WebP (max. 5MB)</p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* Columna Derecha - Campos */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="summary">Resumen (Summary)</Label>
                <Textarea
                  id="summary"
                  placeholder="Un breve resumen del contenido para la tarjeta de vista previa..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={type} onValueChange={(v: API.PublicationType) => setType(v)} disabled={item.type === 'evento'}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    {/** TODO: Bloquear selección si el tipo se puede deducir de el contenido */}
                    <SelectContent>
                      {PUBLICATION_TYPES.map((type) => {
                        return (
                          <SelectItem key={type} value={type}>
                            {translatePublicationType(type)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select value={status} onValueChange={(v: API.PublicationStatus) => setStatus(v)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {PUBLICATION_STATUSES.filter((status) => status !== "pendiente" && status !== "inactivo").map((status) => {
                        return (
                          <SelectItem key={status} value={status}>
                            {translatePublicationStatus(status)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="visibility">Visibilidad</Label>
                  <Select value={visibility} onValueChange={(v: API.PublicationVisibility) => setVisibility(v)}>
                    <SelectTrigger id="visibility">
                      <SelectValue placeholder="Visibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {PUBLICATION_VISIBILITIES.map((visibility) => {
                        return (
                          <SelectItem key={visibility} value={visibility}>
                            {translatePublicationVisibility(visibility)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !image}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {status === "borrador" ? "Guardar Borrador" : "Publicar Ahora"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// se edito la function de la api para que ejecutara una llamada postForm en vez de post
