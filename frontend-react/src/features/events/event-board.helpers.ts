// En: src/features/events/event-board.helpers.ts

import type { ContentItem } from "./types";
import { translatePublicationStatus } from "./publication.helpers";

export const getTypeColor = (type: string) => {
  switch (type) {
    case "charla":
      return "bg-blue-100 text-blue-700";
    case "curso":
      return "bg-green-100 text-green-700";
    case "convocatoria":
      return "bg-purple-100 text-purple-700";
    case "comunicado":
      return "bg-cyan-100 text-cyan-700";
    case "articulo":
      return "bg-teal-100 text-teal-700";
    case "aviso":
      return "bg-orange-100 text-orange-700";
    case "material":
      return "bg-indigo-100 text-indigo-700";
    case "evento":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-700";
    case "ongoing":
      return "bg-green-100 text-green-700";
    case "completed":
    case "inactivo":
      return "bg-gray-100 text-gray-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "published":
    case "activo":
      return "bg-green-100 text-green-700";
    case "draft":
    case "borrador":
      return "bg-yellow-100 text-yellow-700";
    case "pendiente":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "upcoming":
      return "Próximo";
    case "ongoing":
      return "En curso";
    case "completed":
      return "Completado";
    case "cancelled":
      return "Cancelado";
    case "published":
    case "activo":
      return "Publicado";
    case "draft":
    case "borrador":
      return "Borrador";
    case "inactivo":
      return "Inactivo";
    case "pendiente":
      return "Pendiente";
    default:
      return translatePublicationStatus(status as API.PublicationStatus, status);
  }
};

export const getOccupancyLevel = (enrolled: number, capacity: number) => {
  if (capacity === 0) return { color: "text-gray-600", label: "Cerrado" };
  const percentage = (enrolled / capacity) * 100;
  if (percentage >= 90) return { color: "text-red-600", label: "Lleno" };
  if (percentage >= 70) return { color: "text-yellow-600", label: "Alto" };
  if (percentage >= 40) return { color: "text-blue-600", label: "Medio" };
  return { color: "text-green-600", label: "Bajo" };
};

export const isEventType = (type: string) => {
  return type === "charla" || type === "curso" || type === "convocatoria" || type === "semillero" || type === "taller" || type === "conferencia" || type === "evento";
};

export const mapEventsToContentItems = (events: API.Event[]): ContentItem[] => {
  return events.map((event) => ({
    id: event.id.toString(),
    type: "evento",
    subtype: event.event_type,
    title: event.name,
    description: event.description,
    date: event.start_date.split("T")[0],
    time: event.start_date.split("T")[1]?.substring(0, 5) || undefined,
    location: event.location || event.modality,
    status:
      event.publication_id ? "published" :
        event.status === "activo"
          ? "upcoming"
          : event.status === "inactivo"
            ? "completed"
            : event.status === "cancelado"
              ? "cancelled"
              : "upcoming",
    capacity: event.capacity ?? 0,
    enrolled: event.enrolled_participants ?? 0,
    views: undefined,
    original: event,
    kind: 'event' as const,
  }));
};

export const mapPublicationsToContentItems = (
  publications: API.Publication[],
  events: API.Event[] = []
): ContentItem[] => {
  return publications.map((pub) => {
    // For event publications, find the associated event to get its subtype
    const isEventPublication = pub.event_id !== null && pub.type === "evento";
    const associatedEvent = isEventPublication 
      ? events.find(e => e.id === pub.event_id)
      : undefined;

    return {
      id: `pub-${pub.id}`,
      type: pub.type,
      subtype: associatedEvent?.event_type,  // Set subtype for event publications
      title: pub.title,
      description: pub.summary || pub.content || "",
      date: pub.published_at ? pub.published_at.split("T")[0] : pub.created_at.split("T")[0],
      status: pub.status,
      views: 0,
      original: pub,
      kind: 'publication' as const,
    };
  });
};