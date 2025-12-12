import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Eventos Recomendados</h2>
          <p className="text-slate-500 text-sm mt-1">Descubre eventos que coinciden con tus intereses</p>
        </div>
        <Button
          onClick={() => navigate("/publications")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Ver todos
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Boolean(error) && !loading && (
          <div className="text-destructive col-span-full">{getErrorMessageForToast(error)}</div>
        )}
        {loading && (
          <>
            <Card className="h-[380px] animate-pulse bg-slate-200" />
            <Card className="h-[380px] animate-pulse bg-slate-200" />
            <Card className="h-[380px] animate-pulse bg-slate-200" />
          </>
        )}
        {!loading && upcomingEvents.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-500 text-lg">No hay eventos disponibles en este momento</p>
            <p className="text-slate-400 text-sm mt-2">Vuelve pronto para ver nuevas actividades</p>
          </div>
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
    <Card className="bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
        {/* Placeholder en ausencia de imagen en API.Event */}
        {publication.image_url ? (
          <ImageWithFallback
            src={resolveImageUrl(publication.image_url ?? "")}
            alt={publication.title}
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <div className="text-blue-200 text-6xl">📅</div>
          </div>
        )}
        <Badge className="bg-blue-600 text-white hover:bg-blue-700 absolute top-3 right-3 px-3 py-1 text-xs font-semibold">
          {publication.type}
        </Badge>
      </div>
      <CardContent className="flex flex-1 flex-col space-y-4 px-6 py-6">
        <h3 className="line-clamp-2 text-lg font-bold text-slate-900">{publication.title}</h3>
        
        <div className="space-y-3 text-sm text-slate-600">
          {publication.event?.start_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span>{new Date(publication.event.start_date).toLocaleDateString("es-ES", {
                weekday: "short",
                day: "numeric",
                month: "short"
              })}</span>
            </div>
          )}

          {publication.event?.start_date && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span>
                {new Date(publication.event.start_date).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}

          {publication.event?.modality && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="capitalize">{publication.event.modality}</span>
            </div>
          )}
        </div>

        {publication.summary && (
          <p className="text-slate-600 text-sm line-clamp-2 flex-1">{publication.summary}</p>
        )}

        <Button
          className="mt-2 h-10 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          onClick={() => navigate(`/publications/${publication.id}`)}
        >
          Ver detalle →
        </Button>
      </CardContent>
    </Card>
  );
};
