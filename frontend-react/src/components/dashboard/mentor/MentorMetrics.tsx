import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Users, Award, Settings, Sprout, User as UserIcon, Shield } from 'lucide-react';

interface MentorMetricsProps {
  users: API.User[];
  loading: boolean;
}

export const MentorMetrics: React.FC<MentorMetricsProps> = ({ users, loading }) => {
  const getStat = (role?: API.UserRole) => {
    if (loading) return "...";
    if (!role) return users.length;
    return users.filter(u => u.role === role).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Usuarios</p>
              <p className="text-2xl font-semibold">{getStat()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Mentores</p>
              <p className="text-2xl font-semibold">{getStat("mentor")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Settings className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Coordinadores</p>
              <p className="text-2xl font-semibold">{getStat("coordinator")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Award className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Miembros Activos</p>
              <p className="text-2xl font-semibold">{getStat("active-member")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Sprout className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Semillas</p>
              <p className="text-2xl font-semibold">{getStat("seed")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <UserIcon className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Interesados</p>
              <p className="text-2xl font-semibold">{getStat("interested")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};