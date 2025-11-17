import React from "react";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Calendar, Award, BarChart3 } from "lucide-react";

type MemberProgressData = API.User & {
  joinDate: string;
  progress: number;
  eventsAttended: number;
  certificatesEarned: number;
};

interface ProgressTrackingTabProps {
  users: API.User[];
  loadingUsers: boolean;
  onViewProfile: (member: MemberProgressData) => void;
  onGenerateReport: (member: MemberProgressData) => void;
}

export const ProgressTrackingTab: React.FC<ProgressTrackingTabProps> = ({
  users,
  loadingUsers,
  onViewProfile,
  onGenerateReport,
}) => {
  const memberUsers = users.filter((user) => user.role === "miembro");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seguimiento de Progreso de Integrantes</CardTitle>
      </CardHeader>
      <CardContent>
        {loadingUsers ? (
          <p>Cargando integrantes...</p>
        ) : memberUsers.length === 0 ? (
          <p>No hay integrantes registrados.</p>
        ) : (
          <div className="space-y-6">
            {memberUsers.map((user) => {
              // Datos mock para métricas (como en el original)
              const progress = Math.floor(Math.random() * 40) + 40;
              const eventsAttended = Math.floor(Math.random() * 10) + 1;
              const certificatesEarned = Math.floor(Math.random() * 5);
              const memberData = {
                ...user,
                joinDate: user.email_verified_at
                  ? new Date(user.email_verified_at).toLocaleDateString()
                  : "N/A",
                progress,
                eventsAttended,
                certificatesEarned,
              } as MemberProgressData;

              return (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name?.split(" ").map((n) => n[0]).join("") ||
                            "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          {user.name || "Sin nombre"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{progress}% Completado</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Eventos Asistidos
                      </p>
                      <p className="text-lg font-semibold">{eventsAttended}</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Certificados
                      </p>
                      <p className="text-lg font-semibold">
                        {certificatesEarned}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <BarChart3 className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Progreso</p>
                      <div className="w-full bg-background rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewProfile(memberData)}
                    >
                      Ver Perfil Completo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGenerateReport(memberData)}
                    >
                      Generar Reporte
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};