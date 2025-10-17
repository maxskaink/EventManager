import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { BNavBarGuest } from "../ui/b-navbar-guest";
import { useApp } from "../context/AppContext";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Home,
  CalendarDays,
  User,
  LogOut,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useNavigate } from "react-router";

export function GuestDashboard() {
  const { user, events } = useApp();
  const navigate = useNavigate()

  const upcomingEvents = events
    .filter((event) => event.status === "upcoming")
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto">
          <h1>Bienvenido</h1>
          <p className="text-primary-foreground/80 mt-1">
            Explora nuestros eventos y actividades
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Eventos Recomendados */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2>Eventos Recomendados</h2>
            <Button
              variant="outline"
              onClick={() => navigate("/events")}
            >
              Ver todos
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
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
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(
                          event.date,
                        ).toLocaleDateString("es-ES")}
                      </span>
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
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.enrolled}/{event.capacity}{" "}
                        inscritos
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() =>
                      navigate(`/event-detail-${event.id}`)
                    }
                  >
                    Ver detalle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Información adicional */}
        <section>
          <Card>
            <CardHeader>
              <h3>¿Quieres participar más activamente?</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Como integrante podrás acceder a certificados,
                participar en proyectos de investigación y
                recibir recomendaciones personalizadas.
              </p>
              <Button
                onClick={() => navigate("/register")}
              >
                Registrarme como integrante
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
      {/* Navigation Bar */}
      <BNavBarGuest />
    </div>
  );
}