import React from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Info, Calendar, MapPin, Users, Save, Send } from "lucide-react";
import { EVENT_MODALITIES, EVENT_STATUSES } from "../../../features/events/event.constants";
import { translateEventModality, translateEventStatus } from "../../../features/events";

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

interface Props {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: unknown) => void;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  loading: boolean;
}

export const CreateEventForm: React.FC<Props> = ({
  formData,
  onInputChange,
  onCancel,
  onSaveDraft,
  onPublish,
  loading,
}) => {
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

      {/* Botones de acción */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="outline" onClick={onSaveDraft} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          Guardar como Borrador
        </Button>
        <Button onClick={onPublish} disabled={loading}>
          <Send className="h-4 w-4 mr-2" />
          Publicar Evento
        </Button>
      </div>
    </div>
  );
};
