import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { EventAPI } from "../../services/api";
import { useAuthStore } from "../../stores/auth.store";
import { getDashboardRouteFromRole } from "../../services/navigation/redirects";
import BottomNavbarWrapper from "../../components/nav/BottomNavbarWrapper";
import { CreateEventHeader, CreateEventForm, CreateEventPreview } from "../../components/events/create";
import { getErrorMessageForToast } from "../../features/errors/error.helpers";

// Definir el tipo para el estado del formulario
type EventFormData = {
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

export default function CreateEventPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    event_type: "charla", // Valor inicial
    modality: "presencial",
    location: "",
    capacity: "",
    status: "activo",
  });

  const handleInputChange = (field: keyof EventFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDateTime = (date: string, time: string): string => {
    if (!date) return "";
    const dateTime = time ? `${date}T${time}:00` : `${date}T00:00:00`;
    return dateTime;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    // Validaciones
    if (!formData.name.trim()) {
      toast.error("El nombre del evento es obligatorio");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("La descripción del evento es obligatoria");
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      toast.error("Las fechas de inicio y finalización son obligatorias");
      return;
    }

    const startDateTime = new Date(formatDateTime(formData.start_date, formData.start_time));
    const endDateTime = new Date(formatDateTime(formData.end_date, formData.end_time));

    if (endDateTime <= startDateTime) {
      toast.error("La fecha de finalización debe ser posterior a la fecha de inicio");
      return;
    }

    try {
      setLoading(true);

      const eventData: APIPayloads.AddEvent = {
        name: formData.name,
        description: formData.description,
        start_date: formatDateTime(formData.start_date, formData.start_time),
        end_date: formatDateTime(formData.end_date, formData.end_time),
        event_type: formData.event_type,
        modality: formData.modality,
        location: formData.location || null,
        status: isDraft ? "pendiente" : formData.status,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
      };

      await EventAPI.addEvent(eventData);

      toast.success(isDraft ? "✅ Evento guardado como borrador" : "🎉 Evento creado exitosamente");

      navigate("/event-board");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(getErrorMessageForToast(error, "Error al crear el evento"));
    } finally {
      setLoading(false);
    }
  };

  // Renderizar la vista previa
  if (preview) {
    return (
      <CreateEventPreview
        formData={formData}
        onEdit={() => setPreview(false)}
        onSaveDraft={() => handleSubmit(true)}
        onPublish={() => handleSubmit(false)}
        loading={loading}
      />
    );
  }

  // Renderizar el formulario de creación
  return (
    <div className="min-h-screen pb-20">
      <CreateEventHeader
        onBack={() => navigate(getDashboardRouteFromRole(user?.role || ""))}
        onPreview={() => setPreview(true)}
        onSaveDraft={() => handleSubmit(true)}
        loading={loading}
      />
      <CreateEventForm
        formData={formData}
        onInputChange={handleInputChange}
        onCancel={() => navigate(getDashboardRouteFromRole(user?.role || ""))}
        onSaveDraft={() => handleSubmit(true)}
        onPublish={() => handleSubmit(false)}
        loading={loading}
      />
      <BottomNavbarWrapper role={user?.role ?? ""} />
    </div>
  );
}
