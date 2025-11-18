import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../stores/auth.store";
import { EventAPI } from "../services/api";
import { getDashboardRouteFromRole } from "../services/navigation/redirects";
import BottomNavbarWrapper from "../components/nav/BottomNavbarWrapper";
import {
  EventsHeader,
  EventsSearchBar,
  EventsCategoryTabs,
  EventList,
  EventsLoading,
  EventsEmpty,
  type TransformedEvent,
} from "../components/events/wall";

// Imágenes predefinidas (movidas aquí)
const eventImages = [
  "https://images.unsplash.com/photo-1582192904915-d89c7250b235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcHJlc2VudGF0aW9uJTIwdGVjaHxlbnwxfHx8fDE3NTYwMTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1623121608226-ca93dec4d94e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMHRyYWluaW5nJTIwbWVldGluZ3xlbnwxfHx8fDE3NTYwNTU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1650784853619-0845742430b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHJlc2VhcmNoJTIwdGVhbXxlbnwxfHx8fDE3NTYwNTU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
];

const getEventImage = (index: number) => eventImages[index % eventImages.length];

// Función para detectar si un evento está próximo (dentro de 7 días)
const isEventComingSoon = (eventDate: string) => {
  if (!eventDate) return false;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar 'hoy'
    const eventDateTime = new Date(eventDate + "T00:00:00"); // Asumir UTC
    const diffTime = eventDateTime.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  } catch {
    return false;
  }
};

// Función para transformar datos de API
const transformApiEvents = (apiEvents: API.Event[]): TransformedEvent[] => {
  return apiEvents.map((event, index) => {
    const date = event.start_date.split("T")[0];
    return {
      id: event.id.toString(),
      title: event.name,
      description: event.description,
      date: date,
      time: event.start_date.split("T")[1]?.substring(0, 5) || "",
      category: event.event_type, // Asumiendo que 'charla', 'curso', etc.
      modality: event.modality,
      location: event.location,
      status:
        event.status === "activo"
          ? "upcoming"
          : event.status === "inactivo"
            ? "completed"
            : event.status === "cancelado"
              ? "cancelled"
              : "upcoming",
      capacity: event.capacity || 0,
      enrolled: 0, // TODO: implementar conteo de inscritos
      image: getEventImage(index),
      isComingSoon: isEventComingSoon(date),
    };
  });
};

export function EventsScreen() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? "";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [apiEvents, setApiEvents] = useState<API.Event[]>([]);

  // Cargar eventos
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await EventAPI.listUpcomingEvents();
        setApiEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (error) {
        console.error("Error loading events:", error);
        toast.error("Error al cargar eventos");
        setApiEvents([]);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Transformar y filtrar eventos usando useMemo
  const filteredEvents = useMemo(() => {
    return transformApiEvents(apiEvents).filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "todos" || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [apiEvents, searchTerm, selectedCategory]);

  // Lógica de registro
  const registerEvent = (eventId: string, eventTitle: string) => {
    // TODO: Reemplazar con llamada real a la API
    console.log("Registering for event:", eventId);
    toast.success(`🎉 ¡Inscripción exitosa!`, {
      description: `Te has inscrito a: ${eventTitle}`,
      duration: 4000,
    });
  };

  const dashboardRoute = useMemo(() => "/" + getDashboardRouteFromRole(role), [role]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <EventsHeader backRoute={dashboardRoute} />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <EventsSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <EventsCategoryTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory}>
          {loading && <EventsLoading />}

          {!loading && filteredEvents.length > 0 && (
            <EventList events={filteredEvents} hasUser={!!user} onRegister={registerEvent} />
          )}
          {!loading && filteredEvents.length === 0 && <EventsEmpty />}
        </EventsCategoryTabs>
      </div>

      <BottomNavbarWrapper role={role} />
    </div>
  );
}
