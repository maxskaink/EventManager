import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { useApp } from "../context/AppContext";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { BNavBarMentor } from "../ui/b-navbar-mentor";
import { BNavBarMember } from "../ui/b-navbar-member";
import { BNavBarCoordinator } from "../ui/b-navbar-coordinator";
import { BNavBarGuest } from "../ui/b-navbar-guest";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { EventAPI } from "../../services/api";
import { useState, useEffect } from "react";

interface EventDetailScreenProps {
  eventId: string;
}

export function EventDetailScreen({
  eventId,
}: EventDetailScreenProps) {
  const { user, registerEvent } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<API.Event | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Imágenes predefinidas para reutilizar
  const eventImages = [
    "https://images.unsplash.com/photo-1582192904915-d89c7250b235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcHJlc2VudGF0aW9uJTIwdGVjaHxlbnwxfHx8fDE3NTYwMTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1623121608226-ca93dec4d94e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMHRyYWluaW5nJTIwbWVldGluZ3xlbnwxfHx8fDE3NTYwNTU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1650784853619-0845742430b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHJlc2VhcmNoJTIwdGVhbXxlbnwxfHx8fDE3NTYwNTU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  // Función para obtener imagen rotativa
  const getEventImage = (id: number) => {
    return eventImages[id % eventImages.length];
  };

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventIdNum = parseInt(eventId, 10);
      if (isNaN(eventIdNum)) {
        setError("ID de evento inválido");
        return;
      }
      const eventData = await EventAPI.getEventById(eventIdNum);
      setEvent(eventData);
    } catch (err: any) {
      console.error('Error loading event:', err);
      setError(err.response?.status === 404 ? "Evento no encontrado" : "Error al cargar el evento");
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando evento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              {error || "Evento no encontrado"}
            </p>
            <Button onClick={() => navigate("/events")}>
              Volver a eventos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Transformar evento de la API al formato esperado
  const transformedEvent = {
    id: event.id.toString(),
    title: event.name,
    description: event.description,
    date: event.start_date.split('T')[0],
    time: event.start_date.split('T')[1]?.substring(0, 5) || '',
    type: event.event_type,
    modality: event.modality,
    location: event.location,
    status: event.status === 'activo' ? 'upcoming' : 
            event.status === 'inactivo' ? 'completed' : 
            event.status === 'cancelado' ? 'cancelled' : 'upcoming',
    capacity: event.capacity || 0,
    enrolled: 0, // TODO: implementar conteo de inscritos
    image: getEventImage(event.id), // Asignar imagen rotativa
  };

  const isEventFull = transformedEvent.capacity && transformedEvent.enrolled ? transformedEvent.enrolled >= transformedEvent.capacity : false;
  const canRegister =
    user && user.role !== "guest" && !isEventFull;

  const handleRegister = () => {
    if (canRegister) {
      registerEvent(transformedEvent.id);
      // Success feedback with toast
      toast.success("🎉 ¡Te has inscrito exitosamente al evento!", {
        description: `Ahora eres parte de: ${transformedEvent.title}`,
        duration: 4000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/events")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="line-clamp-1">Detalle del Evento</h1>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Imagen principal */}
        <div className="aspect-video relative overflow-hidden">
          <ImageWithFallback
            src={transformedEvent.image}
            alt={transformedEvent.title}
            className="w-full h-full object-cover"
          />
          <Badge
            className="absolute top-4 right-4"
            variant={
              transformedEvent.type === "curso"
                ? "default"
                : transformedEvent.type === "charla"
                  ? "secondary"
                  : "outline"
            }
          >
            {transformedEvent.type}
          </Badge>
          {transformedEvent.status === "upcoming" && (
            <Badge className="absolute top-4 left-4 bg-green-500">
              Próximo
            </Badge>
          )}
          {transformedEvent.status === "completed" && (
            <Badge className="absolute top-4 left-4 bg-gray-500">
              Finalizado
            </Badge>
          )}
          {transformedEvent.status === "cancelled" && (
            <Badge className="absolute top-4 left-4 bg-red-500">
              Cancelado
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-6">
          {/* Información principal */}
          <section>
            <h1 className="mb-2">{transformedEvent.title}</h1>
            <p className="text-muted-foreground">
              {transformedEvent.description}
            </p>
          </section>

          {/* Detalles del evento */}
          <section>
            <Card>
              <CardHeader>
                <h3>Información del Evento</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Fecha
                      </p>
                      <p>
                        {new Date(
                          transformedEvent.date,
                        ).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Hora
                      </p>
                      <p>{transformedEvent.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Modalidad
                      </p>
                      <p className="capitalize">
                        {transformedEvent.modality}
                        {transformedEvent.location && transformedEvent.modality === 'presencial' && (
                          <span className="text-xs ml-2">• {transformedEvent.location}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Cupos
                      </p>
                      <p>
                        {transformedEvent.enrolled}/{transformedEvent.capacity}{" "}
                        inscritos
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{
                            width: transformedEvent.capacity && transformedEvent.enrolled ? `${(transformedEvent.enrolled / transformedEvent.capacity) * 100}%` : '0%',
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Botón de acción */}
          <section>
            {!user ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Inicia sesión para inscribirte a este evento
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                  >
                    Iniciar Sesión
                  </Button>
                </CardContent>
              </Card>
            ) : user.role === "guest" ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Los invitados pueden participar pero no
                    reciben certificados
                  </p>
                  <Button
                    onClick={handleRegister}
                    disabled={isEventFull}
                  >
                    {isEventFull
                      ? "Evento lleno"
                      : "Participar como invitado"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                <Button
                  size="lg"
                  onClick={handleRegister}
                  disabled={isEventFull}
                  className="w-full"
                >
                  {isEventFull
                    ? "Evento lleno"
                    : "Inscribirme al evento"}
                </Button>

                {isEventFull && (
                  <p className="text-center text-sm text-muted-foreground">
                    Este evento ha alcanzado su capacidad máxima
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Información adicional */}
          <section>
            <Card>
              <CardHeader>
                <h3>¿Qué aprenderás?</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Fundamentos teóricos del tema</li>
                  <li>• Ejercicios prácticos y casos de uso</li>
                  <li>• Herramientas y recursos útiles</li>
                  <li>
                    • Certificado de participación (solo
                    integrantes)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      
      {/* Navigation Bar */}
      {user && user.role === "coordinator" && (
        <BNavBarCoordinator />
      )}
      {user && user.role === "guest" && <BNavBarGuest />}
      {user && user.role === "member" && <BNavBarMember />}
      {user && user.role === "mentor" && <BNavBarMentor />}
    </div>
  );
}