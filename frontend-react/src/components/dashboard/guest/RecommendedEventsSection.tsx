import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resolveImageUrl } from "@/features/api";
import { getErrorMessageForToast } from "@/features/errors/error.helpers";
import {  Clock, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router";

export const RecommendedEventsSection = ({
  upcomingEvents,
  loading,
  error,
}: {
  upcomingEvents: API.Publication[];
  loading: boolean;
  error: unknown;
}) => {
  const navigate = useNavigate();
  return (
    <section>
      <SectionHeader
        title="Eventos Recomendados"
        actions={
          <Button
            variant="outline"
            onClick={() => navigate("/publications")}
            className="h-9 rounded-md px-4 py-2 text-sm font-medium"
          >
            Ver todos
          </Button>
        }
      />
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
          upcomingEvents.map((publication: API.Publication) => (
            <NextEventCard key={publication.id} publication={publication} />
          ))}
      </div>
    </section>
  );
};

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
