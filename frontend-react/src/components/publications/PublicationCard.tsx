import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { resolveImageUrl } from "../../features/api";
import type { ContentItem } from "../../features/events/types";
import { getTypeColor } from "../../features/events/event-board.helpers";

interface PublicationCardProps {
  publication: ContentItem;
}


const getTimeCategory = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const eventDateOnly = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = eventDateOnly.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Finalizado';
  } else if (diffDays === 0) {
    return 'En curso';
  } else if (diffDays <= 5) {
    return '¡Pronto!';
  }
  return null;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ publication }) => {
  const isEvent = publication.kind === 'event' || publication.type === 'evento';

  // Determine image source
  let imageSrc = null;
  if (publication.kind === 'publication' && publication.original?.image_url) {
    imageSrc = resolveImageUrl(publication.original.image_url);
  } else if (isEvent && publication.original) {
    // Fallback logic for event images if needed, or use a placeholder
    // For now, we'll assume no image for events unless we add logic to fetch/generate one
    // But if the publication representing the event has an image, use it.
    if (publication.original.image_url) {
      imageSrc = resolveImageUrl(publication.original.image_url);
    }
  }


  const timeCategory = getTimeCategory(publication.date);

  return (
    <Link to={`/publications/${publication.id.replace('pub-', '')}`}>
      <div className="bg-white rounded-3xl shadow-md overflow-hidden transition-all duration-500 ease-out cursor-pointer flex flex-col h-full hover:-translate-y-2 hover:shadow-2xl group border border-transparent hover:border-blue-100 animate-in fade-in zoom-in-95">
        <div className="relative">
          {imageSrc ? (
            <>
              <img
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                src={imageSrc}
                alt={publication.title}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80"; // Fallback
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="h-8" />
          )}
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            <Badge className={`${getTypeColor(publication.type)} shadow-sm backdrop-blur-md opacity-90`}>
              {publication.subtype || publication.type}
            </Badge>
          </div>
          <div className="absolute top-2 left-2">
            {isEvent && timeCategory && <Badge
              className={`${timeCategory === 'Finalizado' ?
                'bg-gray-500'
                : timeCategory === 'En curso' ?
                  'bg-green-600'
                  : 'bg-orange-500'} shadow-sm`}>
              {timeCategory}
            </Badge>}
          </div>
        </div>

        <div className="p-5 flex flex-col grow space-y-4">
          <h3 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {publication.title}
          </h3>

          {isEvent ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className={`flex items-center gap-2 ${timeCategory === '¡Pronto!' ? 'bg-orange-500 text-white p-1 rounded-md' : ''}`}>
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{new Date(publication.date).toLocaleDateString('es-ES', { dateStyle: 'long' })}</span>
              </div>
              {publication.time && (
                <div className={`flex items-center gap-2`}>
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{publication.time}</span>
                </div>
              )}
              {publication.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{publication.location}</span>
                </div>
              )}
              {publication.capacity !== undefined && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 shrink-0" />
                  {publication.capacity === 0 || (publication.enrolled ?? 0) >= publication.capacity ? (
                    <span className="font-medium text-red-600">🔴 Evento lleno</span>
                  ) : (
                    <span>
                      {publication.capacity - (publication.enrolled ?? 0)} cupos disponibles
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {publication.description}
            </p>
          )}

          <div className="pt-2 mt-auto flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
            Ver más <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PublicationCard;
