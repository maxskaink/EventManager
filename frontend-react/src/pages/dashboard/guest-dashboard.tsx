import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Calendar, Clock, MapPin, LogOut, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { BNavBarInterested } from "../../components/ui/b-navbar-interested";
import { publicationQueries } from "@/services/react-query/queries";
import { getErrorMessageForToast } from "@/features/errors/error.helpers";
import { RecentPublicationsSection } from "@/components/dashboard/guest/RecentPublicationsSection";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { resolveImageUrl } from "@/features/api";
import { HideOnScrollWrapper } from "@/components/layout/HideOnScrollWrapper";
import { useAuthStore } from "@/stores/auth.store";
import brainImage from "@/assets/brain.png";

export function GuestDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  const {
    data: publications,
    isLoading: publicationsLoading,
    error: publicationsError,
  } = useQuery(publicationQueries.published());

  const loading = publicationsLoading;
  const error = publicationsError;

  const upcomingEvents = useMemo(
    () => publications?.filter((publication: API.Publication) => Boolean(publication.event)).slice(0, 3) || [],
    [publications],
  );
  const recentPosts = useMemo(
    () => publications?.filter((publication: API.Publication) => !publication.event).slice(0, 3) || [],
    [publications],
  );

  console.log(publications);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header Personalizado */}
      <HideOnScrollWrapper>
        <header className="bg-[#0a2740] text-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  alt="Logo del Semillero"
                  className="h-10 w-10 object-contain rounded-full bg-white"
                  src={brainImage}
                />
                <div>
                  <h1 className="text-lg font-bold">Bienvenido</h1>
                  <p className="text-white/80 text-sm">Explora nuestros eventos y actividades</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || undefined} />
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">{user?.name}</span>
                  <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                    Visitante
                  </Badge>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 h-9 w-9"
                >
                  <Bell className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 h-9 w-9"
                  onClick={logout}
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>
      </HideOnScrollWrapper>
      
      <div className="mx-auto max-w-4xl space-y-6 p-4">
        {/* Eventos Recomendados */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2>Eventos Recomendados</h2>
            <Button
              variant="outline"
              onClick={() => navigate("/publications")}
              className="h-9 rounded-md px-4 py-2 text-sm font-medium"
            >
              Ver todos
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Boolean(error) && !loading && (
              <div className="text-destructive col-span-full">{getErrorMessageForToast(error)}</div>
            )}
            {loading && (
              <>
                <Card className="h-[360px] animate-pulse" />
                <Card className="h-[360px] animate-pulse" />
                <Card className="h-[360px] animate-pulse" />
              </>
            )}
            {!loading && upcomingEvents.length === 0 && (
              <div className="text-muted-foreground col-span-full">No hay eventos activos por ahora.</div>
            )}
            {!loading &&
              upcomingEvents.map((publication: API.Publication) => <NextEventCard key={publication.id} publication={publication} />)}
          </div>
        </section>

        <RecentPublicationsSection publications={recentPosts} isLoading={loading} error={error} />
        {/* Se elimina el bloque de registro para interesados */}
      </div>
      {/* Navigation Bar */}
      <BNavBarInterested />
    </div>
  );
}

const NextEventCard = ({ publication }: { publication: API.Publication }) => {
  const navigate = useNavigate();
  return (
    <Card className="bg-card text-card-foreground flex flex-col gap-4 overflow-hidden rounded-xl border transition-shadow hover:shadow-md">
      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        {/* Placeholder en ausencia de imagen en API.Event */}
        {publication.image_url ? (
          <ImageWithFallback
            src={resolveImageUrl(publication.image_url ?? "")}
            alt={publication.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-blue-100 to-blue-200" />
        )}
        <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 absolute top-2 right-2 inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap shadow-sm">
          {publication.type}
        </Badge>
      </div>
      <CardContent className="flex flex-1 flex-col space-y-3 px-6 pb-6">
        <h3 className="line-clamp-2 text-lg font-semibold">{publication.title}</h3>
        <div className="flex flex-row">
          <div className="mt-auto mr-4 space-y-2 border-r pr-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(publication.event?.start_date ?? "").toLocaleDateString("es-ES")}</span>
            </div>

            <div className="text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(publication.event?.start_date ?? "").toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="capitalize">{publication.event?.modality}</span>
            </div>
          </div>
          <p className="text-muted-foreground line-clamp-2 flex-1 text-sm">{publication.summary}</p>
        </div>

        <Button
          className="mt-4 h-9 w-full rounded-md px-4 py-2 text-sm font-medium shadow-sm"
          onClick={() => navigate(`/publications/${publication.id}`)}
        >
          Ver detalle
        </Button>
      </CardContent>
    </Card>
  );
};
