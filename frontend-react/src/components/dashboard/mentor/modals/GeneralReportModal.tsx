import React from 'react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Users, FileText, Award } from 'lucide-react';
import { toast } from 'sonner';
import { translateUserRole } from '../../../../features/users/users.helpers';
import { USER_ROLES } from '../../../../features/users/user.contants';

type Submission = { id: string; status: string; }; // Tipo simplificado

interface GeneralReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: API.User[];
  submissions: Submission[];
  pendingSubmissions: Submission[];
}

export const GeneralReportModal: React.FC<GeneralReportModalProps> = ({ 
  open, onOpenChange, users, submissions, pendingSubmissions 
}) => {
  const getStat = (role: API.UserRole) => users.filter(u => u.role === role).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>📊 Reporte General del Semillero</DialogTitle>
          <DialogDescription>Informe completo de actividades y usuarios</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          {/* Resumen Ejecutivo */}
          <div className="p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">📈 Resumen Ejecutivo</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div className="text-center"><div className="text-3xl font-bold">{users.length}</div><p>Total Usuarios</p></div>
              <div className="text-center"><div className="text-3xl font-bold">{pendingSubmissions.length}</div><p>Pendientes</p></div>
            </div>
          </div>

          {/* Distribución por Roles */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2"><Users /> Distribución de Roles</h4>
            {/* ... (Lógica de barras de progreso de roles) ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
            </div>
            <div className="grid grid-cols-3">
              {USER_ROLES.map(role => {
                  return <div className="text-center p-4 bg-yellow-50 rounded-lg"><p >{getStat(role)}</p><p>{translateUserRole(role)}</p></div>
              })}
            </div>
          </div>

          {/* Estado de Submissions */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2"><FileText /> Estado de Contenido</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg"><p>{submissions.filter(s => s.status === "pending").length}</p><p>Pendientes</p></div>
              <div className="text-center p-4 bg-green-50 rounded-lg"><p>{submissions.filter(s => s.status === "approved").length}</p><p>Aprobados</p></div>
              <div className="text-center p-4 bg-red-50 rounded-lg"><p>{submissions.filter(s => s.status === "rejected").length}</p><p>Rechazados</p></div>
            </div>
          </div>

          {/* Últimos Usuarios */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2"><Award /> Últimos Usuarios</h4>
            <div className="space-y-2">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar ?? undefined} />
                      <AvatarFallback>{user.name?.split(" ").map(n => n[0]).join("") || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.name || "Sin nombre"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end flex-shrink-0 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button onClick={() => {
            toast.success("📄 Reporte general generado");
            onOpenChange(false);
          }}>
            Descargar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};