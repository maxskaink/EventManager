import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Settings, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ContentItem } from '@/features/events';

interface DashboardUpcomingEventsProps {
  events: ContentItem[];
}

export const DashboardUpcomingEvents: React.FC<DashboardUpcomingEventsProps> = ({
  events,
}) => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2>Próximos Eventos</h2>
        <Button variant="outline" onClick={() => navigate('/events')}>
          Gestionar todos
        </Button>
      </div>

      <div className="space-y-3">
        {events.length > 0 ? (
          events.slice(0, 3).map((event) => (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="line-clamp-1">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('es-ES')} •{' '}
                      {event.time}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">
                        {event.enrolled}/{event.capacity} inscritos
                      </span>
                      <span className="text-muted-foreground">
                        {Math.round(((event.enrolled ?? 0) / (event.capacity ?? 1)) * 100)}%
                        ocupación
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No hay eventos próximos programados.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};