import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { EventAPI, PublicationAPI } from "../../services/api";
import { useAuthStore } from "../../stores/auth.store";
import { getDashboardRouteFromRole } from "../../services/navigation/redirects";
import { CreateEventForm, type PublicationFormData, type EventFormData } from "../../components/events/create";
import { getErrorMessageForToast } from "../../features/errors/error.helpers";
import { UnifiedHeader } from "../../components/layout/UnifiedHeader";
import { HideOnScrollWrapper } from "@/components/layout/HideOnScrollWrapper";

// Definir el tipo para el estado del formulario

export default function CreateEventPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);

  const [publishImmediately, setPublishImmediately] = useState(false);
  const [publicationData, setPublicationData] = useState<PublicationFormData>({
    summary: "",
    type: "evento",
    visibility: "public",
    image: null,
  });

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
    virtual_url: "",
    capacity: "",
    status: "pendiente",
  });

  const handleInputChange = (field: keyof EventFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePublicationChange = (field: keyof PublicationFormData, value: unknown) => {
    setPublicationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDateTime = (date: string, time: string): string => {
    if (!date) return "";
    const dateTime = time ? `${date}T${time}:00` : `${date}T00:00:00`;
    return dateTime;
  };

  const handleSubmit = async () => {
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

    if (endDateTime < startDateTime) {
      toast.error("La fecha de finalización debe ser posterior a la fecha de inicio");
      return;
    }

    /* 
    if (publishImmediately && !publicationData.image) {
      toast.error("Para publicar inmediatamente, debes subir una imagen de portada.");
      return;
    } 
    */

    try {
      setLoading(true);

      const eventData: APIPayloads.AddEvent = {
        name: formData.name,
        description: formData.description,
        start_date: formatDateTime(formData.start_date, formData.start_time),
        end_date: formatDateTime(formData.end_date, formData.end_time),
        event_type: formData.event_type,
        modality: formData.modality,
        location: formData.modality === "virtual" ? null : formData.location,
        virtual_url: formData.modality === "presencial" ? null : formData.location,
        status: "pendiente", // El evento en sí puede quedar pendiente o activo, pero la anuncio es lo que importa
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
      };

      // 1. Crear Evento
      const createdEvent = await EventAPI.addEvent(eventData);

      // 2. Si se seleccionó publicar, crear la anuncio
      if (publishImmediately && createdEvent.id) {
        const pubPayload = {
          title: formData.name,
          content: formData.description,
          type: publicationData.type,
          status: "activo" as API.PublicationStatus,
          visibility: publicationData.visibility,
          image: publicationData.image ?? undefined,
          summary: publicationData.summary || formData.description.slice(0, 200),
        };

        await PublicationAPI.addEventPublication(createdEvent.id, pubPayload);
        toast.success("🎉 Evento y anuncio creados exitosamente");
      } else {
        toast.success("🎉 Evento creado exitosamente");
      }

      navigate("/event-board");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(getErrorMessageForToast(error, "Error al crear el evento"));
    } finally {
      setLoading(false);
    }
  };

  // Renderizar el formulario de creación
  return (
    <div >
      <HideOnScrollWrapper>
        <UnifiedHeader
          title="Crear Nuevo Evento"
          subtitle="Completa la información para registrar un evento"
          onGoBack={() => navigate("/event-board")}
          loading={loading}
        />
      </HideOnScrollWrapper>
      <div className="max-w-4xl mx-auto p-0 md:p-6 space-y-8 md:space-y-8">
        <div className="bg-white md:rounded-3xl shadow-none md:shadow-lg border-0 md:border p-0 md:p-8 min-h-[calc(100vh-200px)] md:min-h-auto">
          <CreateEventForm
            formData={formData}
            onInputChange={handleInputChange}

            publishImmediately={publishImmediately}
            onPublishImmediatelyChange={setPublishImmediately}
            publicationData={publicationData}
            onPublicationChange={handlePublicationChange}

            onCancel={() => navigate(getDashboardRouteFromRole(user?.role || ""))}
            onPublish={() => handleSubmit()}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
