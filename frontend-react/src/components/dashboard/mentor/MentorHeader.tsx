import React from 'react';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import brainImage from '../../../assets/brain.png';
import { NotificationPopover } from '@/components/notifications/NotificationPopover';
import { LogoutConfirmDialog } from '../../auth/LogoutConfirmDialog';
import { useState } from 'react';

interface MentorHeaderProps {
  user: API.User;
  onLogout: () => void;
}

export const MentorHeader: React.FC<MentorHeaderProps> = ({
  user,
  onLogout
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  return (
    <header className="bg-[#0a2740] text-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={brainImage}
              alt="Logo del Semillero"
              className="h-10 w-10 object-contain rounded-full bg-white"
            />
            <div>
              <h1>Panel de Mentor</h1>
              <p className="text-muted-foreground hidden md:block">
                Gestión avanzada del semillero
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogoutClick}
                className="hover:opacity-80 transition-opacity"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar ?? undefined} />
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </button>
              <span className="hidden sm:inline">{user?.name}</span>
              <Badge variant="secondary">Mentor</Badge>
            </div>

            <NotificationPopover />
          </div>
        </div>
      </div>
      <LogoutConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
};