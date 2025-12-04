import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { UnifiedHeader } from "../../components/layout/UnifiedHeader";
import { Calendar, Users, Award } from "lucide-react";
import { useNavigate } from "react-router";
import { certificateQueries, eventQueries } from "@/services/react-query/queries";
import { useQuery } from "@tanstack/react-query";
import { isEventUpcoming } from "@/features/events";
import { useAuthStore } from "@/stores/auth.store";

export function MemberDashboard() {
  const user = useAuthStore((state) => state.user);

  //const userInterestsQuery = useQuery(profileQueries.interests());
  //const userInterests = userInterestsQuery.data;

  const navigate = useNavigate();

  const eventQuery = useQuery(eventQueries.all());
  const events = eventQuery.data ?? [];

  const certificateQuery = useQuery(certificateQueries.my());
  const certificates = certificateQuery.data ?? [];

  const recommendedEvents = events
    .filter((event) => isEventUpcoming(event))
    /*
    .filter((event) =>
      userInterests?.some(
        (interest) =>
          event.name.toLowerCase().includes(interest..toLowerCase()) ||
          event.description.toLowerCase().includes(interest.toLowerCase()),
      ),
      
    )
      */
    .filter((event) => isEventUpcoming(event));

  const recentCertificates = certificates.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <UnifiedHeader
        title={`Hola, ${user?.name}`}
        subtitle="Integrante del semillero"
      />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Eventos según intereses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2>Eventos para ti</h2>
            <Button variant="outline" onClick={() => navigate("/publications")}>
              Ver todos
            </Button>
          </div>

          {recommendedEvents.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {recommendedEvents.map((event) => (
                  <CarouselItem key={event.id} className="md:basis-1/2">
                    <Card className="hover:shadow-md transition-shadow h-full">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gray-100">
                        <Badge className="absolute top-2 right-2">Recomendado</Badge>
                      </div>

                      <CardHeader className="pb-2">
                        <h3 className="line-clamp-2">{event.name}</h3>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(event.start_date).toLocaleDateString("es-ES")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>
                              {event.capacity}/{event.capacity} inscritos
                            </span>
                          </div>
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          Inscribirme
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No hay eventos recomendados basados en tus intereses actuales.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/profile")}>
                  Actualizar intereses
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Mis Certificados */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2>Mis Certificados</h2>
            <Button variant="outline" onClick={() => navigate("/certificates")}>
              Ver todos
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {recentCertificates.map((cert) => (
              <Card key={cert.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4>{cert.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(cert.issue_date).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Descargar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Próximos eventos */}
        <section>
          <h2 className="mb-4">Próximos Eventos</h2>
          <div className="space-y-3">
            {events.slice(0, 3).map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                  </div>
                  <div className="flex-1">
                    <h4 className="line-clamp-1">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.start_date).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/publications/${event.id}`)}
                  >
                    Ver
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              className="text-primary underline"
              onClick={() => navigate("/publications")}
            >
              Ver más
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
