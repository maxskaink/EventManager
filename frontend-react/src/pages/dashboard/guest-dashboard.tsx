import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { UnifiedHeader } from "../../components/layout/UnifiedHeader";
import { Badge } from "../../components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router";
import { BNavBarInterested } from "../../components/ui/b-navbar-interested";
import { EventAPI } from "../../services/api";

export function GuestDashboard() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<API.Event[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const events = await EventAPI.listUpcomingEvents();
        if (cancelled) return;
        setUpcomingEvents(events.slice(0, 3));
      } catch {
        if (cancelled) return;
        setError("No fue posible cargar los eventos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      {/* Header */}
      <UnifiedHeader 
        title="Bienvenido" 
        subtitle="Explora nuestros eventos y actividades"
      />
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
            {error && !loading && (
              <div className="col-span-full text-destructive">
                {error}
              </div>
            )}
            {loading && (
              <>
                <Card className="animate-pulse h-[360px]" />
                <Card className="animate-pulse h-[360px]" />
                <Card className="animate-pulse h-[360px]" />
              </>
            )}
            {!loading && upcomingEvents.length === 0 && (
              <div className="col-span-full text-muted-foreground">
                No hay eventos activos por ahora.
              </div>
            )}
            {!loading && upcomingEvents.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-md transition-shadow"
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  {/* Placeholder en ausencia de imagen en API.Event */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200" />
                  <Badge className="absolute top-2 right-2">
                    {event.event_type}
                  </Badge>
                </div>

                <CardHeader className="pb-2">
                  <h3 className="line-clamp-2">{event.name}</h3>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.start_date).toLocaleDateString("es-ES")}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(event.start_date).toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="capitalize">
                        {event.modality}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() =>
                      navigate(`/events/${event.id}`)
                    }
                  >
                    Ver detalle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Se elimina el bloque de registro para interesados */}
      </div>
      {/* Navigation Bar */}
      <BNavBarInterested />
    </div>
  );
}
