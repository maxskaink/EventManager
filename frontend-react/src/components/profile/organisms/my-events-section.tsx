import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Plus, Trash2, Calendar, Clock, MapPinIcon, CheckCircle2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  category: string;
  date: string; // ISO string
  time: string;
  modality: string;
}

interface Participation {
  id: string;
  eventId: string;
  registrationDate: string; // ISO string
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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="tracking-tight text-[#0a2740] font-semibold">Mis Eventos</h2>
        <Button
          onClick={onAddEvent}
          size="sm"
          className="rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Evento
        </Button>
      </div>

      {participatedEvents.length === 0 ? (
        <div className="p-8 text-center text-gray-600 flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
          <Calendar className="w-12 h-12 mb-3 text-sky-700" />
          <p>No has registrado participación en ningún evento aún.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {participatedEvents.map((event) => {
            const participation = userParticipations.find((p) => p.eventId === event.id);
            return (
              <Card
                key={event.id}
                className="rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-lg"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1 line-clamp-1 tracking-tight font-semibold text-[#0a2740]">
                        {event.title}
                      </h4>
                      <Badge variant="secondary" className="mb-2">
                        {event.category}
                      </Badge>
                      <div className="space-y-2 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-sky-800" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-sky-800" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-5 h-5 text-sky-800" />
                          <span className="capitalize">{event.modality}</span>
                        </div>
                        {participation && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-xs">
                              Registrado el {formatDate(participation.registrationDate)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {participation && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDeleteParticipation(participation.id)}
                        className="shrink-0 text-destructive transition-transform hover:scale-105 active:scale-95 hover:bg-destructive/10"
                        title="Eliminar participación"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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
