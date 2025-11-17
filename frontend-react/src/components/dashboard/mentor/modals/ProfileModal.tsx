import React from 'react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Avatar, AvatarFallback } from '../../../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../ui/dialog';

// Tipo duplicado para mantener el componente aislado
type MemberProgressData = (API.User & {
  joinDate: string;
  eventsAttended: number;
  certificatesEarned: number;
}) | null;

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: MemberProgressData;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ open, onOpenChange, member }) => {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Perfil Completo - {member.name}</DialogTitle>
          <DialogDescription>Información detallada del integrante</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {member.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-muted-foreground">{member.email}</p>
              <Badge variant="outline" className="mt-2">Integrante</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Fecha de Ingreso</p>
              <p className="text-lg font-semibold">{member.joinDate}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Eventos Asistidos</p>
              <p className="text-lg font-semibold">{member.eventsAttended}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Certificados Obtenidos</p>
              <p className="text-lg font-semibold">{member.certificatesEarned}</p>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};