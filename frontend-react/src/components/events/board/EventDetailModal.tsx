import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Info, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  getTypeColor,
  getStatusColor,
  getStatusLabel,
  isEventType,
} from "../../../features/events/event-board.helpers";
import type { ContentItem } from "../../../features/events";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: ContentItem | null;
};

export function EventDetailModal({ isOpen, onOpenChange, item }: Props) {
  if (!item) return null;

  const isEvent = isEventType(item.type);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{item.title}</DialogTitle>
          <div className="flex gap-2 mt-2">
            <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
            <Badge className={getStatusColor(item.status)}>{getStatusLabel(item.status)}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <DialogDescription>
              <span className="font-semibold mb-2 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Descripción
              </span>
              <span className="text-muted-foreground whitespace-pre-wrap">{item.description}</span>
            </DialogDescription>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{/* ... (Info de Fecha y Hora) ... */}</div>

          {isEvent && <>{/* ... (Info de Ubicación y Capacidad) ... */}</>}

          {!isEvent && item.views !== undefined && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Eye className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Visualizaciones</p>
                <p className="font-medium">{item.views} vistas</p>
              </div>
            </div>
          )}

          <div className="border-t pt-4">{/* ... (Info Adicional ID y Estado) ... */}</div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          {isEvent && (
            <Button
              onClick={() => {
                toast.info("Funcionalidad de inscripción próximamente");
              }}
            >
              Inscribirse
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
