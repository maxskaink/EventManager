import React from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Info, Calendar, MapPin, Users, Send, ImagePlus, X, FileText } from "lucide-react";
import { EVENT_MODALITIES, EVENT_STATUSES } from "../../../features/events/event.constants";
import { translateEventModality, translateEventStatus, PUBLICATION_VISIBILITIES, translatePublicationVisibility } from "../../../features/events";

type FormData = {
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  event_type: string;
  modality: API.EventModality;
  location: string;
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
  formData: FormData;
  onInputChange: (field: keyof FormData, value: unknown) => void;

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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Información Básica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Evento *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              placeholder="Ej: Workshop de Machine Learning"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="event_type">Tipo de Evento *</Label>
            <Select
              value={formData.event_type}
              onValueChange={(value: API.EventType) => onInputChange("event_type", value)}
            >
              <SelectTrigger id="event_type" className="mt-1">
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
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Fecha y hora */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Fecha y Hora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Fecha de Inicio *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => onInputChange("start_date", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="start_time">Hora de Inicio</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => onInputChange("start_time", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="end_date">Fecha de Finalización *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => onInputChange("end_date", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="end_time">Hora de Finalización</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => onInputChange("end_time", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modalidad y ubicación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Modalidad y Ubicación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div>
            <Label htmlFor="location">{formData.modality === "virtual" ? "Enlace" : "Ubicación"}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => onInputChange("location", e.target.value)}
              placeholder={
                formData.modality === "virtual"
                  ? "Ej: Enlace de Zoom o Teams"
                  : formData.modality === "mixta"
                    ? "Ej: Salón 201 + Enlace virtual"
                    : "Ej: Auditorio Principal, Edificio de Ingeniería"
              }
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Capacidad y estado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Capacidad y Estado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="capacity">Capacidad Máxima (opcional)</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => onInputChange("capacity", e.target.value)}
              placeholder="Ej: 50"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="status">Estado del Evento</Label>
            <Select value={formData.status} onValueChange={(value: API.EventStatus) => onInputChange("status", value)}>
              <SelectTrigger id="status" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {translateEventStatus(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Publicación */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <FileText className="h-5 w-5" />
              Publicación
            </CardTitle>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="publishImmediately"
                checked={publishImmediately}
                onChange={(e) => onPublishImmediatelyChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="publishImmediately" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Publicar inmediatamente
              </label>
            </div>
          </div>
        </CardHeader>

        {publishImmediately && (
          <CardContent className="space-y-6 pt-0 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 gap-6 py-4">
              {/* Imagen */}
              <div className="space-y-2">
                <Label htmlFor="image">Imagen de Portada</Label>
                {imagePreview ? (
                  <div className="relative w-fit">
                    <img src={imagePreview} alt="Vista previa" className="max-h-48 w-full object-contain rounded-md border" />
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
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Subir imagen</p>
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
                    className="min-h-[80px]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectTrigger id="visibility">
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
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onPublish} disabled={loading}>
          <Send className="h-4 w-4 mr-2" />
          {publishImmediately ? "Crear y Publicar" : "Crear Evento"}
        </Button>
      </div>
    </div>
  );
};
