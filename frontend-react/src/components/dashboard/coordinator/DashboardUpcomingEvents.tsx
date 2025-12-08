import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Eye } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Próximos Eventos</h2>
        <Button variant="outline" onClick={() => navigate('/publications')} className="border-slate-300">
          Ver todas
        </Button>
      </div>

      <div className="space-y-4">
        {events.length > 0 ? (
          events.slice(0, 3).map((event) => (
            <Card key={event.id} className="bg-white border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="line-clamp-1 font-semibold text-slate-900 text-lg">{event.title}</h4>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      📅 {new Date(event.date).toLocaleDateString('es-ES')} • 🕐 {event.time}
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-slate-700 font-medium">
                        👥 {event.enrolled}/{event.capacity} inscritos
                      </span>
                      <span className="text-slate-700 font-medium">
                        📊 {Math.round(((event.enrolled ?? 0) / (event.capacity ?? 1)) * 100)}% ocupación
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => navigate(`/publications/${event.original?.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-slate-50 border border-slate-200">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-slate-600 font-medium">
                📭 No hay eventos próximos programados.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};