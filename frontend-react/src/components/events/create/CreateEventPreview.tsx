import React from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { ArrowLeft, Save, Send, Calendar, MapPin, Users, Clock } from "lucide-react";
import BottomNavbarWrapper from "../../nav/BottomNavbarWrapper";
import { useAuthStore } from "../../../stores/auth.store";

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
  onEdit: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  loading: boolean;
}

export const CreateEventPreview: React.FC<Props> = ({ formData, onEdit, onSaveDraft, onPublish, loading }) => {
  const user = useAuthStore((s) => s.user);
  const getLocaleDate = (date: string) => {
    try {
      // Asumir que la fecha 'YYYY-MM-DD' viene en UTC y mostrarla
      const dateObj = new Date(date + "T00:00:00");
      return dateObj.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-[#0a2740] p-4 shadow-sm text-white">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1>Vista Previa del Evento</h1>
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" onClick={onSaveDraft} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Borrador
            </Button>
            <Button variant="secondary" onClick={onPublish} disabled={loading}>
              <Send className="h-4 w-4 mr-2" />
              Publicar Evento
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full capitalize">
                {formData.event_type}
              </span>
              <span className="text-sm font-medium px-3 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-full capitalize">
                {formData.modality}
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-4">{formData.name || "Nombre del Evento"}</h1>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>
                  Inicio: {formData.start_date ? getLocaleDate(formData.start_date) : "Por definir"}
                  {formData.start_time && ` a las ${formData.start_time}`}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>
                  Fin: {formData.end_date ? getLocaleDate(formData.end_date) : "Por definir"}
                  {formData.end_time && ` a las ${formData.end_time}`}
                </span>
              </div>
              {formData.location && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{formData.location}</span>
                </div>
              )}
              {formData.capacity && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <span>Capacidad: {formData.capacity} personas</span>
                </div>
              )}
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-2">Descripción</h2>
              {/* Usar whiteSpace: 'pre-wrap' para respetar saltos de línea */}
              <div style={{ whiteSpace: "pre-wrap" }}>
                {formData.description || "La descripción del evento aparecerá aquí..."}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <BottomNavbarWrapper role={user?.role ?? ""} />
    </div>
  );
};
