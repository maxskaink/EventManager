// En: src/features/events/event-board.helpers.ts

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
    case "anuncio":
      return "bg-orange-100 text-orange-700";
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
      return "bg-gray-100 text-gray-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "published":
      return "bg-green-100 text-green-700";
    case "draft":
        return "bg-yellow-100 text-yellow-700";
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
      return "Publicado";
    case "draft":
      return "Borrador";
    default:
      return status;
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
  return type === "charla" || type === "curso" || type === "convocatoria";
};