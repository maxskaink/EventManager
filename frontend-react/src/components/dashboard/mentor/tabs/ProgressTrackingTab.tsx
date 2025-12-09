import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Calendar, Award } from "lucide-react";
import { EventAPI, CertificateAPI } from "../../../../services/api";
import type { MemberProgressData } from "./types";

interface ProgressTrackingTabProps {
  users: API.User[];
  loadingUsers: boolean;
  onViewProfile: (member: MemberProgressData) => void;
  onGenerateReport: (member: MemberProgressData) => void;
}

interface UserProgress {
  userId: number;
  eventsAttended: number;
  certificatesEarned: number;
  loading: boolean;
}

export const ProgressTrackingTab: React.FC<ProgressTrackingTabProps> = ({
  users,
  loadingUsers,
  onViewProfile,
  onGenerateReport,
}) => {
  // Memoizar memberUsers para evitar recalcular en cada render
  const memberUsers = useMemo(
    () => users.filter((user) => user.role === "active-member" || user.role === "seed" || user.role === "interested"),
    [users]
  );
  
  const [userProgressMap, setUserProgressMap] = useState<Record<number, UserProgress>>({});

  // Cargar datos de participación y certificados para cada usuario (sin sobrecargar)
  useEffect(() => {
    let isMounted = true; // Para evitar actualizaciones en unmounted components

    const loadUserProgress = async () => {
      const progressMap: Record<number, UserProgress> = {};

      for (const user of memberUsers) {
        progressMap[user.id] = {
          userId: user.id,
          eventsAttended: 0,
          certificatesEarned: 0,
          loading: true,
        };
      }

      if (isMounted) {
        setUserProgressMap(progressMap);
      }

      // Cargar datos con un delay para no saturar el servidor
      for (let i = 0; i < memberUsers.length; i++) {
        if (!isMounted) break; // Salir si el componente fue unmounted

        const user = memberUsers[i];
        
        try {
          const [enrollments, certificates] = await Promise.all([
            EventAPI.listEnrollmentsByUser(user.id).catch(() => []),
            CertificateAPI.listCertificatesByUser(user.id).catch(() => []),
          ]);

          if (isMounted) {
            setUserProgressMap((prev) => ({
              ...prev,
              [user.id]: {
                userId: user.id,
                eventsAttended: Array.isArray(enrollments) ? enrollments.length : 0,
                certificatesEarned: Array.isArray(certificates) ? certificates.length : 0,
                loading: false,
              },
            }));
          }

          // Agregar un pequeño delay entre solicitudes para no saturar el servidor
          if (i < memberUsers.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error(`Error loading progress for user ${user.id}:`, error);
          if (isMounted) {
            setUserProgressMap((prev) => ({
              ...prev,
              [user.id]: {
                userId: user.id,
                eventsAttended: 0,
                certificatesEarned: 0,
                loading: false,
              },
            }));
          }
        }
      }
    };

    if (memberUsers.length > 0) {
      loadUserProgress();
    }

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [memberUsers]);

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
              const progress = userProgressMap[user.id] || {
                eventsAttended: 0,
                certificatesEarned: 0,
                loading: true,
              };

              const memberData = {
                ...user,
                joinDate: user.email_verified_at
                  ? new Date(user.email_verified_at).toLocaleDateString()
                  : "N/A",
                eventsAttended: progress.eventsAttended,
                certificatesEarned: progress.certificatesEarned,
              } as MemberProgressData;

              return (
                <div key={user.id} className="border rounded-lg p-4">
                  {/* Mobile S: flex-col (avatar + info vertical), md+: flex-row (avatar + info horizontal) */}
                  <div className="flex flex-col items-center gap-3 mb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar ?? undefined} />
                        <AvatarFallback>
                          {user.name?.split(" ").map((n) => n[0]).join("") ||
                            "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center sm:text-left">
                        <h3 className="font-medium">
                          {user.name || "Sin nombre"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Eventos Asistidos
                      </p>
                      <p className="text-lg font-semibold">
                        {progress.loading ? "..." : progress.eventsAttended}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Certificados
                      </p>
                      <p className="text-lg font-semibold">
                        {progress.loading ? "..." : progress.certificatesEarned}
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewProfile(memberData)}
                      className="w-full sm:w-auto"
                    >
                      Ver Perfil Completo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGenerateReport(memberData)}
                      className="w-full sm:w-auto"
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

export default ProgressTrackingTab;
