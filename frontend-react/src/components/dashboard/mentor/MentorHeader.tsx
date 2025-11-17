import React from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Bell, LogOut } from 'lucide-react';
import brainImage from '../../../assets/brain.png';

interface MentorHeaderProps {
  user: API.User;
  onLogout: () => void;
  onOpenNotifications: () => void;
  pendingCount: number;
}

export const MentorHeader: React.FC<MentorHeaderProps> = ({
  user,
  onLogout,
  onOpenNotifications,
  pendingCount,
}) => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={brainImage}
              alt="Logo del Semillero"
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1>Panel de Mentor</h1>
              <p className="text-muted-foreground">
                Gestión avanzada del semillero
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenNotifications}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {pendingCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                  {pendingCount}
                </Badge>
              )}
            </Button>

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

            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};