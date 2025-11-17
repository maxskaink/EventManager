import React from 'react';
import { Button } from '../../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../ui/dialog';
import { Users, BarChart3, Calendar, Award } from 'lucide-react';
import { toast } from 'sonner';

type MemberProgressData = (API.User & {
  joinDate: string;
  progress: number;
  eventsAttended: number;
  certificatesEarned: number;
}) | null;

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: MemberProgressData;
}

export const ProfileReportModal: React.FC<ReportModalProps> = ({ open, onOpenChange, member }) => {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reporte de Progreso - {member.name}</DialogTitle>
          <DialogDescription>Informe detallado de actividades y desempeño</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Información General */}
          <div className="border-b pb-2">
            <h4 className="font-semibold mb-3 flex items-center gap-2"><Users /> Información General</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Nombre:</p><p className="font-medium">{member.name}</p></div>
              <div><p className="text-muted-foreground">Email:</p><p className="font-medium">{member.email}</p></div>
              <div><p className="text-muted-foreground">Rol:</p><p className="font-medium">Integrante</p></div>
              <div><p className="text-muted-foreground">Fecha de Ingreso:</p><p className="font-medium">{member.joinDate}</p></div>
            </div>
          </div>

          {/* Métricas de Desempeño */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2"><BarChart3 /> Métricas</h4>
            <div className="space-y-4">              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg"><Calendar className="mx-auto" /><p>{member.eventsAttended}</p><p>Eventos</p></div>
                <div className="text-center p-3 bg-green-50 rounded-lg"><Award className="mx-auto" /><p>{member.certificatesEarned}</p><p>Certificados</p></div>
              </div>
            </div>
          </div>

          {/* Resumen */}
          {/*
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">📊 Resumen</h4>
            <p className="text-sm text-muted-foreground">
              {member.name} ha completado el {member.progress}% de sus actividades.
            </p>
          </div>
*/}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
            <Button onClick={() => {
              toast.success("📄 Reporte generado correctamente");
              onOpenChange(false);
            }}>
              Descargar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};