import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { BNavBarMentor } from "../ui/b-navbar-mentor";
import { BNavBarMember } from "../ui/b-navbar-member";
import { BNavBarCoordinator } from "../ui/b-navbar-coordinator";
import { BNavBarGuest } from "../ui/b-navbar-guest";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import { useApp } from "../context/AppContext";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Search,
  ArrowLeft,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useNavigate } from "react-router";
import BottomNavbarWrapper from "../nav/BottomNavbarWrapper";
import { useAuthStore } from "../../stores/auth.store";
import { EventAPI } from "../../services/api";
import { toast } from "sonner";

export function EventsScreen() {
  const { user } = useApp();
  const someUser = useAuthStore(s => s.user)
  const role = someUser?.role ?? ""
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [apiEvents, setApiEvents] = useState<API.Event[]>([]);

  // Imágenes predefinidas para reutilizar
  const eventImages = [
    "https://images.unsplash.com/photo-1582192904915-d89c7250b235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcHJlc2VudGF0aW9uJTIwdGVjaHxlbnwxfHx8fDE3NTYwMTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1623121608226-ca93dec4d94e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMHRyYWluaW5nJTIwbWVldGluZ3xlbnwxfHx8fDE3NTYwNTU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1650784853619-0845742430b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHJlc2VhcmNoJTIwdGVhbXxlbnwxfHx8fDE3NTYwNTU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  // Función para obtener imagen rotativa
  const getEventImage = (index: number) => {
    return eventImages[index % eventImages.length];
  };

  // Cargar eventos desde la API
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await EventAPI.listUpcomingEvents();
      setApiEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Error al cargar eventos');
      setApiEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Transformar eventos de la API al formato esperado
  const transformedEvents = apiEvents.map((event, index) => ({
    id: event.id.toString(),
    title: event.name,
    description: event.description,
    date: event.start_date.split('T')[0],
    time: event.start_date.split('T')[1]?.substring(0, 5) || '',
    category: event.event_type,
    modality: event.modality,
    location: event.location,
    status: event.status === 'activo' ? 'upcoming' : 
            event.status === 'inactivo' ? 'completed' : 
            event.status === 'cancelado' ? 'cancelled' : 'upcoming',
    capacity: event.capacity || 0,
    enrolled: 0, // TODO: implementar conteo de inscritos
    image: getEventImage(index), // Asignar imagen rotativa
  }));

  // Función para detectar si un evento está próximo (dentro de 7 días)
  const isEventComingSoon = (eventDate: string) => {
    const today = new Date();
    const eventDateTime = new Date(eventDate);
    const diffTime = eventDateTime.getTime() - today.getTime();
    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24),
    );
    return diffDays >= 0 && diffDays <= 7;
  };

  const filteredEvents = transformedEvents.filter((event) => {
    const matchesSearch =
      event.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      event.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "todos" ||
      event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getBackView = () => {
    if (!user) return "login";
    if (role === "guest") return "dashboard-guest";
    if (role === "coordinator")
      return "dashboard-coordinator";
    return "dashboard-member";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/" + getBackView())}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1>Eventos</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtros por categoría */}
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="charla">Charlas</TabsTrigger>
            <TabsTrigger value="curso">Cursos</TabsTrigger>
            <TabsTrigger value="convocatoria">
              Convocatorias
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value={selectedCategory}
            className="mt-6"
          >
            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando eventos...</p>
                </CardContent>
              </Card>
            ) : filteredEvents.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No se encontraron eventos con los filtros
                    seleccionados.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredEvents.map((event, index) => (
                  <Card
                    key={event.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        className="absolute top-2 right-2"
                        variant={
                          event.category === "curso"
                            ? "default"
                            : event.category === "charla"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {event.category}
                      </Badge>
                      {event.status === "upcoming" &&
                        isEventComingSoon(event.date) && (
                          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-coral-primary to-orange-500 text-white animate-pulse shadow-lg border-0">
                            🔥 ¡Pronto!
                          </Badge>
                        )}
                        {event.status === "upcoming" &&
                        !isEventComingSoon(event.date) && (
                          <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                            Próximo
                          </Badge>
                        )}
                        {event.status === "completed" && (
                          <Badge className="absolute top-2 left-2 bg-gray-500 text-white">
                            Finalizado
                          </Badge>
                        )}
                        {event.status === "cancelled" && (
                          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                            Cancelado
                          </Badge>
                        )}
                    </div>

                    <CardHeader className="pb-2">
                      <h3 className="line-clamp-2">
                        {event.title}
                      </h3>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div
                          className={`flex items-center gap-2 ${isEventComingSoon(event.date)
                              ? "text-coral-primary font-medium p-2 bg-coral-primary/10 rounded-lg border border-coral-primary/20"
                              : "text-muted-foreground"
                            }`}
                        >
                          <Calendar
                            className={`h-4 w-4 ${isEventComingSoon(event.date)
                                ? "text-coral-primary"
                                : ""
                              }`}
                          />
                          <span>
                            {new Date(
                              event.date,
                            ).toLocaleDateString("es-ES")}
                          </span>
                          {isEventComingSoon(event.date) && (
                            <Badge
                              variant="outline"
                              className="ml-auto bg-coral-primary/10 text-coral-primary border-coral-primary/30 text-xs"
                            >
                              ¡Pronto!
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="capitalize">
                            {event.modality}
                          </span>
                          {event.location && event.modality === 'presencial' && (
                            <span className="text-xs">• {event.location}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            {event.enrolled}/{event.capacity}{" "}
                            inscritos
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            navigate(
                              `/events/${event.id}`,
                            )
                          }
                        >
                          Ver detalle
                        </Button>
                        {role !== "guest" && (
                          <Button
                            size="sm"
                            className="flex-1"
                            disabled={
                              event.enrolled >= event.capacity
                            }
                            onClick={() => {
                              registerEvent(event.id);
                              toast.success("🎉 ¡Te has inscrito exitosamente al evento!", {
                                description: `Ahora eres parte de: ${event.title}`,
                                duration: 4000,
                              });
                            }}
                          >
                            {event.enrolled >= event.capacity
                              ? "Lleno"
                              : "Inscribirme"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Navigation Bar */}
      <BottomNavbarWrapper role={role}/>
    </div>
  );
}
