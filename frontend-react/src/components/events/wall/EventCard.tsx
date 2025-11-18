import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';

// Tipo para un evento transformado
export type TransformedEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: string;
  modality: string;
  location: string | null;
  status: 'upcoming' | 'completed' | 'cancelled';
  capacity: number;
  enrolled: number;
  image: string;
  isComingSoon: boolean;
};

interface Props {
  event: TransformedEvent;
  hasUser: boolean;
  onRegister: (eventId: string, eventTitle: string) => void;
}

export const EventCard: React.FC<Props> = ({ event, hasUser, onRegister }) => {
  const navigate = useNavigate();
  const isFull = event.enrolled >= event.capacity;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <ImageWithFallback
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <Badge
          className="absolute top-2 right-2"
          variant={
            event.category === 'curso'
              ? 'default'
              : event.category === 'charla'
              ? 'secondary'
              : 'outline'
          }
        >
          {event.category}
        </Badge>
        {event.status === 'upcoming' && event.isComingSoon && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-coral-primary to-orange-500 text-white animate-pulse shadow-lg border-0">
            🔥 ¡Pronto!
          </Badge>
        )}
        {event.status === 'upcoming' && !event.isComingSoon && (
          <Badge className="absolute top-2 left-2 bg-green-500 text-white">
            Próximo
          </Badge>
        )}
        {event.status === 'completed' && (
          <Badge className="absolute top-2 left-2 bg-gray-500 text-white">
            Finalizado
          </Badge>
        )}
        {event.status === 'cancelled' && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            Cancelado
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        <h3 className="line-clamp-2">{event.title}</h3>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 text-sm">
          <div
            className={`flex items-center gap-2 ${
              event.isComingSoon
                ? 'text-coral-primary font-medium p-2 bg-coral-primary/10 rounded-lg border border-coral-primary/20'
                : 'text-muted-foreground'
            }`}
          >
            <Calendar
              className={`h-4 w-4 ${
                event.isComingSoon ? 'text-coral-primary' : ''
              }`}
            />
            <span>{new Date(event.date).toLocaleDateString('es-ES')}</span>
            {event.isComingSoon && (
              <Badge
                variant="outline"
                className="ml-auto bg-coral-primary/10 text-coral-primary border-coral-primary/30 text-xs"
              >
                ¡Pronto!
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{event.time || 'Todo el día'}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="capitalize">{event.modality}</span>
            {event.location && event.modality === 'presencial' && (
              <span className="text-xs">• {event.location}</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {event.enrolled}/{event.capacity} inscritos
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/events/${event.id}`)}
          >
            Ver detalle
          </Button>
          {hasUser && (
            <Button
              size="sm"
              className="flex-1"
              disabled={isFull}
              onClick={() => onRegister(event.id, event.title)}
            >
              {isFull ? 'Lleno' : 'Inscribirme'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};