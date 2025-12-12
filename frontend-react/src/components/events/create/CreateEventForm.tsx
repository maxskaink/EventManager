import React from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Info, Calendar, MapPin, Users, Send, ImagePlus, X, FileText } from "lucide-react";
import { EVENT_MODALITIES } from "../../../features/events/event.constants";
import {
  translateEventModality,
  PUBLICATION_VISIBILITIES,
  translatePublicationVisibility,
} from "../../../features/events";

export type EventFormData = {
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  event_type: string;
  modality: API.EventModality;
  location: string | null;
  virtual_url: string | null;
  capacity: string;
  status: API.EventStatus;
};

export type PublicationFormData = {
  summary: string;
  type: API.PublicationType;
  visibility: API.PublicationVisibility;
  image: File | null;
};

interface Props {
  formData: EventFormData;
  onInputChange: (field: keyof EventFormData, value: unknown) => void;

  publishImmediately: boolean;
  onPublishImmediatelyChange: (value: boolean) => void;
  publicationData: PublicationFormData;
  onPublicationChange: (field: keyof PublicationFormData, value: unknown) => void;

  onCancel: () => void;
  onPublish: () => void;
  loading: boolean;
}

export const CreateEventForm: React.FC<Props> = ({
  formData,
  onInputChange,
  publishImmediately,
  onPublishImmediatelyChange,
  publicationData,
  onPublicationChange,
  onCancel,
  onPublish,
  loading,
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPublicationChange("image", file);
    }
  };

  const removeImage = () => {
    onPublicationChange("image", null);
  };

  const imagePreview = publicationData.image ? URL.createObjectURL(publicationData.image) : null;

  // Cleanup image preview
  React.useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [publicationData.image]);

  return (
    <div className="mx-auto max-w-4xl space-y-3 p-2 sm:space-y-4 sm:p-4 md:space-y-6 md:p-0">
      {/* Información básica */}
      <Card className="rounded-none border-0 shadow-none transition-shadow duration-300 md:rounded-xl md:border md:shadow-md md:hover:shadow-lg">
        <CardHeader className="px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Info className="h-5 w-5 shrink-0" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-2 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
          <div>
            <Label htmlFor="name">Nombre del Evento *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              placeholder="Ej: Workshop de Machine Learning"
              className="mt-1 transition-all focus-visible:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="event_type">Tipo de Evento *</Label>
            <Select
              value={formData.event_type}
              onValueChange={(value: API.EventType) => onInputChange("event_type", value)}
            >
              <SelectTrigger id="event_type" className="mt-1 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="charla">Charla</SelectItem>
                <SelectItem value="curso">Curso</SelectItem>
                <SelectItem value="convocatoria">Convocatoria</SelectItem>
                <SelectItem value="taller">Taller</SelectItem>
                <SelectItem value="conferencia">Conferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
              placeholder="Describe el evento, objetivos, temas a tratar, etc..."
              rows={6}
              className="mt-1 transition-all"
            />
          </div>
        </CardContent>
      </Card>

      {/* Fecha y hora */}
      <Card className="rounded-none border-0 shadow-none transition-shadow duration-300 md:rounded-xl md:border md:shadow-md md:hover:shadow-lg">
        <CardHeader className="px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-5 w-5 shrink-0" />
            Fecha y Hora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-2 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="start_date">Fecha de Inicio *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => onInputChange("start_date", e.target.value)}
                className="mt-1 transition-all"
              />
            </div>
            <div>
              <Label htmlFor="start_time">Hora de Inicio</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => onInputChange("start_time", e.target.value)}
                className="mt-1 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="end_date">Fecha de Finalización *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => onInputChange("end_date", e.target.value)}
                className="mt-1 transition-all focus-visible:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="end_time">Hora de Finalización</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => onInputChange("end_time", e.target.value)}
                className="mt-1 transition-all"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modalidad y ubicación */}
      <Card className="rounded-none border-0 shadow-none transition-shadow duration-300 md:rounded-xl md:border md:shadow-md md:hover:shadow-lg">
        <CardHeader className="px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <MapPin className="h-5 w-5 shrink-0" />
            Modalidad y Ubicación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-2 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
          <div>
            <Label htmlFor="modality">Modalidad *</Label>
            <Select
              value={formData.modality}
              onValueChange={(value: API.EventModality) => onInputChange("modality", value)}
            >
              <SelectTrigger id="modality" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_MODALITIES.map((modality) => (
                  <SelectItem key={modality} value={modality}>
                    {translateEventModality(modality)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(formData.modality === "presencial" || formData.modality === "mixta") && (
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location ?? ""}
                onChange={(e) => onInputChange("location", e.target.value)}
                placeholder="Ej: Auditorio Principal, Edificio de Ingeniería"
                className="mt-1 transition-all"
              />
            </div>
          )}
          {(formData.modality === "virtual" || formData.modality === "mixta") && (
            <div>
              <Label htmlFor="virtual_url">Enlace</Label>
              <Input
                id="virtual_url"
                value={formData.virtual_url ?? ""}
                onChange={(e) => onInputChange("virtual_url", e.target.value)}
                placeholder="Ej: https://zoom.com/123456789"
                className="mt-1 transition-all"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Capacidad y estado */}
      <Card className="rounded-none border-0 shadow-none transition-shadow duration-300 md:rounded-xl md:border md:shadow-md md:hover:shadow-lg">
        <CardHeader className="px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Users className="h-5 w-5 shrink-0" />
            Capacidad y Estado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-2 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
          <div>
            <Label htmlFor="capacity">Capacidad (opcional)</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => onInputChange("capacity", e.target.value)}
              placeholder="Ej: 50"
              className="mt-1 transition-all focus-visible:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Anuncio */}
      <Card className="rounded-none border-0 border-blue-200 shadow-none transition-shadow duration-300 md:rounded-xl md:border md:shadow-md md:hover:shadow-lg dark:border-blue-800">
        <CardHeader className="px-2 pt-2 pb-2 sm:px-4 sm:pt-3 sm:pb-3 md:px-6 md:pt-6 md:pb-3">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <CardTitle className="flex items-center gap-2 text-base text-blue-700 sm:text-lg dark:text-blue-400">
              <FileText className="h-5 w-5 shrink-0" />
              Anuncio
            </CardTitle>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="checkbox"
                id="publishImmediately"
                checked={publishImmediately}
                onChange={(e) => onPublishImmediatelyChange(e.target.checked)}
                className="h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="publishImmediately"
                className="cursor-pointer text-xs font-medium text-gray-700 sm:text-sm dark:text-gray-300"
              >
                Publicar inmediatamente
              </label>
            </div>
          </div>
        </CardHeader>

        {publishImmediately && (
          <CardContent className="animate-in fade-in slide-in-from-top-4 space-y-6 px-2 pt-0 pb-3 duration-300 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
            <div className="grid grid-cols-1 gap-6 py-4">
              {/* Imagen */}
              <div className="space-y-2">
                <Label htmlFor="image">Imagen de Portada</Label>
                {imagePreview ? (
                  <div className="relative w-fit">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="max-h-48 w-full rounded-md border object-contain"
                    />
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
                    className="bg-muted hover:bg-muted/80 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImagePlus className="text-muted-foreground mb-2 h-8 w-8" />
                      <p className="text-muted-foreground text-sm">Subir imagen</p>
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

              {/* Campos */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="summary">Resumen (Descripción corta)</Label>
                  <Textarea
                    id="summary"
                    placeholder="Un breve resumen del contenido..."
                    value={publicationData.summary}
                    onChange={(e) => onPublicationChange("summary", e.target.value)}
                    className="min-h-[80px] transition-all focus-visible:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* 
                  <div>
                    <Label htmlFor="pub_type">Tipo</Label>
                    <Select
                      value={publicationData.type}
                      onValueChange={(v: API.PublicationType) => onPublicationChange("type", v)}
                    >
                      <SelectTrigger id="pub_type">
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {PUBLICATION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {translatePublicationType(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div> 
                  */}
                  <div>
                    <Label htmlFor="visibility">Visibilidad</Label>
                    <Select
                      value={publicationData.visibility}
                      onValueChange={(v: API.PublicationVisibility) => onPublicationChange("visibility", v)}
                    >
                      <SelectTrigger id="visibility" className="focus:ring-blue-500">
                        <SelectValue placeholder="Visibilidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {PUBLICATION_VISIBILITIES.map((visibility) => (
                          <SelectItem key={visibility} value={visibility}>
                            {translatePublicationVisibility(visibility)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Botones de acción */}
      <div className="flex flex-col-reverse justify-end gap-2 px-2 pb-2 sm:flex-row sm:gap-3 sm:px-4 sm:pb-0 md:px-0">
        <Button
          variant="outline"
          onClick={onCancel}
          className="sm:py-auto h-auto w-full py-2 text-xs sm:h-9 sm:w-auto sm:text-sm"
        >
          Cancelar
        </Button>
        <Button
          onClick={onPublish}
          disabled={loading}
          className="sm:py-auto h-auto w-full py-2 text-xs sm:h-9 sm:w-auto sm:text-sm"
        >
          <Send className="mr-2 h-4 w-4 shrink-0" />
          {publishImmediately ? "Crear y Publicar" : "Crear Evento"}
        </Button>
      </div>
    </div>
  );
};
