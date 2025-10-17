import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { useApp } from "../AppContext";
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

interface EventDetailScreenProps {
  eventId: string;
}

export function EventDetailScreen({
  eventId,
}: EventDetailScreenProps) {
  const { user, events, setCurrentView, registerEvent } =
    useApp();

  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Evento no encontrado
            </p>
            <Button onClick={() => setCurrentView("events")}>
              Volver a eventos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isEventFull = event.enrolled >= event.capacity;
  const canRegister =
    user && user.role !== "guest" && !isEventFull;

  const handleRegister = () => {
    if (canRegister) {
      registerEvent(event.id);
      // Mock success feedback
      alert("¡Te has inscrito exitosamente al evento!");
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
            onClick={() => setCurrentView("events")}
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
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <Badge
            className="absolute top-4 right-4"
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
          {event.status === "upcoming" && (
            <Badge className="absolute top-4 left-4 bg-green-500">
              Próximo
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-6">
          {/* Información principal */}
          <section>
            <h1 className="mb-2">{event.title}</h1>
            <p className="text-muted-foreground">
              {event.description}
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
                          event.date,
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
                      <p>{event.time}</p>
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
                        {event.modality}
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
                        {event.enrolled}/{event.capacity}{" "}
                        inscritos
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{
                            width: `${(event.enrolled / event.capacity) * 100}%`,
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
                    onClick={() => setCurrentView("login")}
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