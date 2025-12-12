import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { LogoutConfirmDialog } from '../../auth/LogoutConfirmDialog';

interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <div className="bg-[#0a2740] p-4 shadow-sm text-white">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={handleLogoutClick}
            className="hover:opacity-80 transition-opacity"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar ?? undefined} />
              <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </button>
          <div className="flex-1">
            <h1>Panel de Coordinación</h1>
            <p className="text-white/80 hidden md:block">Bienvenido, {user.name}</p>
            <p className="text-white/80 md:hidden text-sm">{user.name?.split(' ')[0]}</p>
          </div>
        </div>
      </div>
      <LogoutConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};