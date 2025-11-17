import React from 'react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Users, BarChart3, Calendar, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Submission = { id: string; status: string; }; // Tipo simplificado

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: API.User;
  users: API.User[];
  submissions: Submission[];
  pendingSubmissions: Submission[];
  onOpenNotifications: () => void;
  onOpenGeneralReport: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  open, onOpenChange, user, users, submissions, pendingSubmissions, onOpenNotifications, onOpenGeneralReport 
}) => {
  const navigate = useNavigate();
  const getStat = (role: API.UserRole) => users.filter(u => u.role === role).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>⚙️ Configuración del Panel de Mentor</DialogTitle>
          <DialogDescription>Gestiona las preferencias y configuraciones</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Mentor */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3"><Users /> Tu Información</h4>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.split(" ").map(n => n[0]).join("") || "?"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-lg">{user?.name || "Sin nombre"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <Badge variant="secondary" className="mt-2">Mentor</Badge>
              </div>
            </div>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3"><BarChart3 /> Estadísticas de Gestión</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg"><p>Usuarios Gestionados</p><p>{users.length}</p></div>
              <div className="p-4 bg-yellow-50 rounded-lg"><p>Pendientes</p><p>{pendingSubmissions.length}</p></div>
              <div className="p-4 bg-green-50 rounded-lg"><p>Integrantes Activos</p><p>{getStat("member")}</p></div>
              <div className="p-4 bg-purple-50 rounded-lg"><p>Total Aprobados</p><p>{submissions.filter(s => s.status === "approved").length}</p></div>
            </div>
          </div>

          {/* Accesos Rápidos */}
          <div>
            <h4 className="font-semibold mb-3"><Calendar /> Accesos Rápidos</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => { onOpenChange(false); navigate("/event-board"); }}><Calendar /> Contenido</Button>
              <Button variant="outline" onClick={() => { onOpenChange(false); navigate("/profile"); }}><Users /> Mi Perfil</Button>
              <Button variant="outline" onClick={() => { onOpenChange(false); onOpenNotifications(); }}><Bell /> Notificaciones</Button>
              <Button variant="outline" onClick={() => { onOpenChange(false); onOpenGeneralReport(); }}><BarChart3 /> Reportes</Button>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
            <Button onClick={() => {
              toast.success("⚙️ Configuración guardada");
              onOpenChange(false);
            }}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};