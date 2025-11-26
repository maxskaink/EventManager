import React from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Bell, LogOut } from 'lucide-react';
import brainImage from '../../../assets/brain.png';
import { NotificationPopover } from '@/components/notifications/NotificationPopover';

interface MentorHeaderProps {
  user: API.User;
  onLogout: () => void;
}

export const MentorHeader: React.FC<MentorHeaderProps> = ({
  user,
  onLogout
}) => {
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
              <p className="text-muted-foreground">
                Gestión avanzada del semillero
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">


            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">{user?.name}</span>
              <Badge variant="secondary">Mentor</Badge>
            </div>

            <NotificationPopover />
            <Button variant="ghost-destructive" size="icon" onClick={onLogout} title="Cerrar sesión" aria-label="Cerrar sesión">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};