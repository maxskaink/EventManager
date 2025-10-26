import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Plus, Trash2, Calendar, Clock, MapPinIcon, CheckCircle2 } from "lucide-react";

// Tipos simulados - reemplázalos con los tipos reales de tu API
interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  modality: string;
}
interface Participation {
  id: string;
  eventId: string;
  registrationDate: string;
}

interface MyEventsSectionProps {
  participatedEvents: Event[];
  userParticipations: Participation[];
  onAddEvent: () => void;
  onDeleteParticipation: (participationId: string) => void;
  formatDate: (dateString: string) => string;
}

export const MyEventsSection = ({
  participatedEvents,
  userParticipations,
  onAddEvent,
  onDeleteParticipation,
  formatDate,
}: MyEventsSectionProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2>Mis Eventos</h2>
        <Button onClick={onAddEvent} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Evento
        </Button>
      </div>

      {participatedEvents.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No has registrado participación en ningún evento aún.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {participatedEvents.map((event) => {
            const participation = userParticipations.find((p) => p.eventId === event.id);
            return (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="line-clamp-1 mb-1">{event.title}</h4>
                      <Badge variant="secondary" className="mb-2">{event.category}</Badge>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><Calendar className="h-3 w-3" /><span>{formatDate(event.date)}</span></div>
                        <div className="flex items-center gap-2"><Clock className="h-3 w-3" /><span>{event.time}</span></div>
                        <div className="flex items-center gap-2"><MapPinIcon className="h-3 w-3" /><span className="capitalize">{event.modality}</span></div>
                        {participation && (
                            <div className="flex items-center gap-2 text-green-600"><CheckCircle2 className="h-3 w-3" /><span className="text-xs">Registrado el {formatDate(participation.registrationDate)}</span></div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDeleteParticipation(participation?.id || "")}
                      className="text-destructive hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};
