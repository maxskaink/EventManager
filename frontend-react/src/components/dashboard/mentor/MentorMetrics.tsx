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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Usuarios</p>
              <p className="text-2xl font-bold">{getStat()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Mentores</p>
              <p className="text-2xl font-bold">{getStat("mentor")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-indigo-500">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Settings className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Coordinadores</p>
              <p className="text-2xl font-bold">{getStat("coordinator")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Miembros Activos</p>
              <p className="text-2xl font-bold">{getStat("active-member")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-emerald-500">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-full">
              <Sprout className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Semillas</p>
              <p className="text-2xl font-bold">{getStat("seed")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-orange-500">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <UserIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Interesados</p>
              <p className="text-2xl font-bold">{getStat("interested")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};