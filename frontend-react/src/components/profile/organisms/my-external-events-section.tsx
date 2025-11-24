import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Plus, Trash2, Calendar, MapPinIcon, Building2, Loader2, Pencil } from "lucide-react";

interface MyExternalEventsSectionProps {
    events: API.ExternalEvent[];
    onAddEvent: () => void;
    onEditEvent: (eventId: number) => void;
    onDeleteEvent: (eventId: number) => void;
    formatDate: (dateString: string) => string;
    isLoading?: boolean;
}

export const MyExternalEventsSection = ({
    events,
    onAddEvent,
    onEditEvent,
    onDeleteEvent,
    formatDate,
    isLoading = false,
}: MyExternalEventsSectionProps) => {
    return (
        <section>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="tracking-tight text-[#0a2740] font-semibold">Eventos Externos</h2>
                <Button
                    onClick={onAddEvent}
                    size="sm"
                    className="rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 active:scale-95"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Evento Externo
                </Button>
            </div>

            {isLoading ? (
                <div className="p-8 text-center flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
                    <Loader2 className="w-12 h-12 mb-3 text-sky-700 animate-spin" />
                    <p className="text-gray-600">Cargando eventos externos...</p>
                </div>
            ) : events.length === 0 ? (
                <div className="p-8 text-center text-gray-600 flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
                    <Calendar className="w-12 h-12 mb-3 text-sky-700" />
                    <p>No has registrado ningún evento externo aún.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <Card
                            key={event.id}
                            className="rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-lg"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="mb-1 tracking-tight font-semibold text-[#0a2740] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {event.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {event.description}
                                        </p>
                                        <Badge variant="secondary" className="mb-2 capitalize">
                                            {event.modality}
                                        </Badge>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-sky-800 shrink-0" />
                                                <span className="text-xs">
                                                    {formatDate(event.start_date)} - {formatDate(event.end_date)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-sky-800 shrink-0" />
                                                <span className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">{event.host_organization}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPinIcon className="w-4 h-4 text-sky-800 shrink-0" />
                                                <span className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">{event.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 shrink-0">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onEditEvent(event.id)}
                                            className="transition-transform hover:scale-105 active:scale-95"
                                            title="Editar evento"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onDeleteEvent(event.id)}
                                            className="shrink-0 text-destructive transition-transform hover:scale-105 active:scale-95 hover:bg-destructive/10"
                                            title="Eliminar evento"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
};
