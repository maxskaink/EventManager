import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
// Asumiendo que el tipo 'User' está disponible en tu contexto o en 'types.d.ts'

interface DashboardHeaderProps {
  user: User;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  return (
    <div className="bg-primary text-primary-foreground p-4">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1>Panel de Coordinación</h1>
          <p className="text-primary-foreground/80">Bienvenido, {user.name}</p>
        </div>
      </div>
    </div>
  );
};