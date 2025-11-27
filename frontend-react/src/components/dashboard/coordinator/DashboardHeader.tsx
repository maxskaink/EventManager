import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { LogOut } from 'lucide-react';
// Asumiendo que el tipo 'User' está disponible en tu contexto o en 'types.d.ts'

interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onLogout }) => {
  return (
    <div className="bg-[#0a2740] p-4 shadow-sm text-white">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar ?? undefined} />
          <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <button
          data-slot="button"
          onClick={onLogout}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 rounded-md"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1>Panel de Coordinación</h1>
          <p className="text-white/80">Bienvenido, {user.name}</p>
        </div>
      </div>
    </div>
  );
};