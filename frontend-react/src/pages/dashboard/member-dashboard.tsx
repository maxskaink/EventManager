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
import { EventAPI } from "@/services/api";
import { toast } from "sonner";
import { HideOnScrollWrapper } from "@/components/layout/HideOnScrollWrapper";
import { getErrorMessageForToast } from "@/features/errors/error.helpers";

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

  const handleRegister = async (eventId: number) => {
    try {
      await EventAPI.enroll(eventId);
      toast.success("¡Te has inscrito exitosamente al evento!");
    } catch (error) {
      toast.error(getErrorMessageForToast(error));
    }
  };

  return (
    <div className="space-y-8 bg-gray-50/50 min-h-screen pb-10">
      {/* Header */}
      <HideOnScrollWrapper>
        <UnifiedHeader
          leftImage
          title={`Hola, ${user?.name}`}
          subtitle="Integrante del semillero"
          user={user}
        />
      </HideOnScrollWrapper>

      <div className="max-w-5xl mx-auto p-6 space-y-10">
        {/* Eventos según intereses */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Eventos para ti</h2>
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 rounded-full px-4" onClick={() => navigate("/publications")}>
              Ver todos
            </Button>
          </div>

          {recommendedEvents.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {recommendedEvents.map((event) => (
                  <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
                    <Card className="hover:shadow-lg transition-all duration-300 h-full border-0 shadow-md rounded-3xl overflow-hidden group bg-white">
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                        <Badge className="absolute top-3 right-3 z-20 bg-white/90 text-primary hover:bg-white border-0 shadow-sm backdrop-blur-sm">Recomendado</Badge>
                      </div>

                      <CardHeader className="pb-2 pt-5 px-6">
                        <h3 className="line-clamp-2 text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">{event.name}</h3>
                      </CardHeader>

                      <CardContent className="space-y-4 px-6 pb-6">
                        <div className="space-y-2.5 text-sm text-gray-500">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                              <Calendar className="h-4 w-4" />
                            </div>
                            <span className="font-medium">
                              {new Date(event.start_date).toLocaleDateString("es-ES", { dateStyle: 'long' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                              <Users className="h-4 w-4" />
                            </div>
                            <span className="font-medium">
                              {event.capacity}/{event.capacity} inscritos
                            </span>
                          </div>
                        </div>

                        <Button
                          className="w-full rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                          size="lg"
                          onClick={() => handleRegister(event.id)}
                        >
                          Inscribirme
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 w-10 h-10 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white text-primary" />
              <CarouselNext className="hidden md:flex -right-4 w-10 h-10 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white text-primary" />
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Mis Certificados</h2>
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 rounded-full px-4" onClick={() => navigate("/certificates")}>
              Ver todos
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {recentCertificates.map((cert) => (
              <Card key={cert.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group">
                <CardContent className="p-5 flex items-center gap-5">
                  <div className="p-3 bg-linear-to-br from-primary/20 to-primary/5 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(cert.issue_date).toLocaleDateString("es-ES", { dateStyle: 'medium' })}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full px-4 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary">
                    Descargar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Próximos eventos */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Próximos Eventos</h2>
          <div className="space-y-4">
            {events.slice(0, 3).map((event) => (
              <Card key={event.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden">
                <CardContent className="p-4 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {/* Placeholder image or event image */}
                    <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 line-clamp-1 text-lg">{event.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(event.start_date).toLocaleDateString("es-ES", { dateStyle: 'full' })}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full px-6 font-medium shadow-sm"
                    onClick={() => navigate(`/publications/${event.id}`)}
                  >
                    Ver
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button
              variant="link"
              className="text-primary underline decoration-2 underline-offset-4 hover:text-primary/80 text-base font-medium"
              onClick={() => navigate("/publications")}
            >
              Ver más eventos
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
