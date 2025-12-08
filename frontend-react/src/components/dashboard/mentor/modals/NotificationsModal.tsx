import React from 'react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Bell, Users, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2"><Bell /> Notificaciones</DialogTitle>
          <DialogDescription>Últimas actualizaciones del semillero</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {/* Notificación 1 */}
          <div className="p-4 border rounded-lg bg-blue-50">
            <div className="flex items-start gap-3">
              <Users />
              <div className="flex-1">
                <p className="font-semibold text-sm">Nuevo usuario registrado <Badge>Nueva</Badge></p>
                <p className="text-sm">Juan Pérez se ha registrado.</p>
                <p className="text-xs text-muted-foreground">Hace 5 minutos</p>
              </div>
            </div>
          </div>
          {/* Notificación 2 */}
          <div className="p-4 border rounded-lg bg-green-50">
            <div className="flex items-start gap-3">
              <CheckCircle2 />
              <div className="flex-1">
                <p className="font-semibold text-sm">Evento aprobado <Badge>Nueva</Badge></p>
                <p className="text-sm">"Workshop de IA" ha sido aprobado.</p>
                <p className="text-xs text-muted-foreground">Hace 1 hora</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end flex-shrink-0 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => {
              toast.success("Notificaciones marcadas como leídas");
              onOpenChange(false);
            }}
          >
            Marcar como leídas
          </Button>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};