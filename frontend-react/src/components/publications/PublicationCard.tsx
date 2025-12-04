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

// these are dummy values
// const EVENT_CARD_HEIGHT_WITH_IMAGE = 350;
// const EVENT_CARD_HEIGHT_WITHOUT_IMAGE = 250;
// const PUBLICATION_CARD_HEIGHT = 250;
// const PUBLICATION_CARD_HEIGHT_WITH_IMAGE = 350;

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
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden transition-all duration-300 ease-in-out cursor-pointer flex flex-col h-full hover:shadow-xl hover:-translate-y-1 group border border-gray-100/50">
        <div className="relative overflow-hidden">
          {imageSrc ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <img
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                src={imageSrc}
                alt={publication.title}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80"; // Fallback
                }}
              />
            </>
          ) : (
            <div className="h-2 bg-primary/5" />
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-20">
            <Badge className={`${getTypeColor(publication.type)} shadow-sm backdrop-blur-sm border-0`}>
              {publication.subtype || publication.type}
            </Badge>
          </div>
          <div className="absolute top-3 left-3 z-20">
            {isEvent && timeCategory && <Badge
              className={`${timeCategory === 'Finalizado' ?
                'bg-gray-500/90'
                : timeCategory === 'En curso' ?
                  'bg-green-600/90'
                  : 'bg-orange-500/90'} shadow-sm backdrop-blur-sm border-0 text-white`}>
              {timeCategory}
            </Badge>}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow space-y-4">
          <h3 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {publication.title}
          </h3>

          {isEvent ? (
            <div className="space-y-2.5 text-sm text-gray-500">
              <div className={`flex items-center gap-2.5 ${timeCategory === '¡Pronto!' ? 'bg-orange-50 text-orange-700 p-2 rounded-lg' : ''}`}>
                <div className={`p-1.5 rounded-full ${timeCategory === '¡Pronto!' ? 'bg-orange-100' : 'bg-primary/10'} text-primary`}>
                  <Calendar className="h-4 w-4 shrink-0" />
                </div>
                <span className="font-medium">{new Date(publication.date).toLocaleDateString('es-ES', { dateStyle: 'long' })}</span>
              </div>
              {publication.time && (
                <div className={`flex items-center gap-2.5`}>
                  <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                    <Clock className="h-4 w-4 shrink-0" />
                  </div>
                  <span className="font-medium">{publication.time}</span>
                </div>
              )}
              {publication.location && (
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4 shrink-0" />
                  </div>
                  <span className="line-clamp-1 font-medium">{publication.location}</span>
                </div>
              )}
              {publication.capacity !== undefined && (
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                    <Users className="h-4 w-4 shrink-0" />
                  </div>
                  <span className="font-medium">Cupos: {publication.capacity}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {publication.description}
            </p>
          )}

          <div className="pt-2 mt-auto flex items-center justify-end">
            <span className="text-primary font-semibold text-sm group-hover:underline decoration-2 underline-offset-4 flex items-center gap-1">
              Ver detalles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PublicationCard;
