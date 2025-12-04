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
    <div className="min-h-screen pb-20 bg-gray-50/50">
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
              onClick={() => navigate("/publications")}
              className="rounded-md h-9 px-4 py-2 text-sm font-medium"
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
                className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  {/* Placeholder en ausencia de imagen en API.Event */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200" />
                  <Badge className="absolute top-2 right-2 inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden border-transparent bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                    {event.event_type}
                  </Badge>
                </div>

                <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 pb-2">
                  <h3 className="line-clamp-2 font-semibold text-lg">{event.name}</h3>
                </CardHeader>

                <CardContent className="px-6 pb-6 space-y-3 flex-1 flex flex-col">
                  <p className="text-muted-foreground text-sm line-clamp-2 flex-1">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm mt-auto">
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
                    className="w-full mt-4 rounded-md h-9 px-4 py-2 text-sm font-medium shadow-sm"
                    onClick={() =>
                      navigate(`/publications/${event.id}`)
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
