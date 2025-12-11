import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Progress } from "../../ui/progress";
import { 
  Info, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Monitor, 
  CalendarDays
} from "lucide-react";
import {
  getTypeColor,
  getStatusColor,
  getStatusLabel,
  isEventType,
  getOccupancyLevel
} from "../../../features/events/event-board.helpers";
import type { ContentItem } from "../../../features/events";
import { cn } from "../../ui/utils";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: ContentItem | null;
};

export function EventDetailModal({ isOpen, onOpenChange, item }: Props) {
  if (!item) return null;

  const isEvent = isEventType(item.type);
  // Cast original to access specific fields if needed safely
  const eventData = isEvent ? (item.original as API.Event) : null; 
  
  // Calculate specific display values
  const capacity = item.capacity ?? 0;
  const enrolled = item.enrolled ?? 0;

  const occupancy = isEvent && capacity > 0 
    ? Math.min((enrolled / capacity) * 100, 100) 
    : 0;
    
  const occupancyInfo = isEvent ? getOccupancyLevel(enrolled, capacity) : null;
  const isVirtual = eventData?.modality === "virtual";
  const hasSubtype = !!item.subtype;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item.title}
          </DialogTitle>
          <DialogDescription>
            Detalle del evento
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2 items-center">
            <Badge className={cn("px-2.5 py-0.5", getTypeColor(item.type))}>
              {item.type.toUpperCase()}
            </Badge>
            {hasSubtype && (
               <Badge variant="outline" className="capitalize border-primary/20 text-primary bg-primary/5">
                 {item.subtype}
               </Badge>
            )}
            <Badge className={cn("ml-auto", getStatusColor(item.status))}>
              {getStatusLabel(item.status)}
            </Badge>
          </div>

        <div className="space-y-6 pt-2">
          {/* Description Section */}
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-primary font-medium">
               <Info className="h-5 w-5" />
               <h3>Descripción</h3>
             </div>
             <DialogDescription className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
               {item.description || "Sin descripción disponible."}
             </DialogDescription>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/40 rounded-xl border border-border/50">
            {/* Date */}
            <div className="flex items-start gap-3">
               <div className="p-2.5 bg-background rounded-lg border shadow-sm text-primary">
                 <CalendarDays className="h-5 w-5" />
               </div>
               <div className="space-y-1">
                 <p className="text-sm font-medium text-muted-foreground">Fecha</p>
                 <p className="font-semibold text-foreground">
                   {item.date 
                     ? new Date(item.date).toLocaleDateString('es-ES', { dateStyle: 'long' }) 
                     : "Fecha no definida"}
                 </p>
               </div>
            </div>

            {/* Time */}
            {item.time && (
              <div className="flex items-start gap-3">
                 <div className="p-2.5 bg-background rounded-lg border shadow-sm text-primary">
                   <Clock className="h-5 w-5" />
                 </div>
                 <div className="space-y-1">
                   <p className="text-sm font-medium text-muted-foreground">Hora</p>
                   <p className="font-semibold text-foreground">
                     {item.time}
                   </p>
                 </div>
              </div>
            )}

            {/* Location / Modality */}
            {(item.location || isEvent) && (
              <div className="flex items-start gap-3">
                 <div className="p-2.5 bg-background rounded-lg border shadow-sm text-primary">
                   {isVirtual ? <Monitor className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                 </div>
                 <div className="space-y-1">
                   <p className="text-sm font-medium text-muted-foreground">
                     {isVirtual ? "Modalidad Virtual" : "Ubicación"}
                   </p>
                   <p className="font-semibold text-foreground capitalize">
                     {item.location || eventData?.modality || "Por definir"}
                   </p>
                   {isVirtual && eventData?.virtual_url && (
                      <a href={eventData.virtual_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline block truncate max-w-[200px]">
                        {eventData.virtual_url}
                      </a>
                   )}
                 </div>
              </div>
            )}

             {/* Event Specific: Capacity */}
             {isEvent && (
              <div className="flex items-start gap-3 col-span-1 md:col-span-2">
                 <div className="p-2.5 bg-background rounded-lg border shadow-sm text-primary">
                   <Users className="h-5 w-5" />
                 </div>
                 <div className="space-y-2 flex-1">
                   <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-muted-foreground">Participación</p>
                      <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full bg-muted", occupancyInfo?.color)}>
                        {occupancyInfo?.label}
                      </span>
                   </div>
                   <div className="space-y-1.5">
                      <div className="flex justify-between text-sm font-medium">
                        <span>{enrolled} inscritos</span>
                        <span className="text-muted-foreground">Capacidad: {capacity}</span>
                      </div>
                      <Progress value={occupancy} className="h-2.5" />
                   </div>
                 </div>
              </div>
            )}

            {/* Metadata ID */}
            <div className="flex items-start gap-4 col-span-1 md:col-span-2 pt-2 border-t border-dashed border-border/60">
                <div className="p-1.5 rounded-full bg-muted text-muted-foreground self-center">
                   <Tag className="h-3 w-3" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs text-muted-foreground flex-1">
                   <span>ID: <code className="bg-muted px-1.5 py-0.5 rounded font-mono select-all">{item.id}</code></span>
                   {eventData?.created_at && (
                     <span>Creado: {new Date(eventData.created_at).toLocaleDateString()}</span>
                   )}
                </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="default" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cerrar
          </Button>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
