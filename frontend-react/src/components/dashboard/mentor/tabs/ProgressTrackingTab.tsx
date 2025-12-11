import React, { useEffect, useState } from "react";
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
  const memberUsers = users;
  
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
          <div className="space-y-3">
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
                <div
                  key={user.id}
                  className="border rounded-lg p-3 flex flex-col md:flex-row md:items-center gap-4 transition-all hover:bg-muted/5"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={user.avatar ?? undefined} />
                      <AvatarFallback>
                        {user.name?.split(" ").map((n) => n[0]).join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {user.name || "Sin nombre"}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm md:ml-auto">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div className="flex flex-col leading-none">
                        <span className="text-xs text-muted-foreground">Eventos</span>
                        <span className="font-semibold">
                          {progress.loading ? "..." : progress.eventsAttended}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Award className="h-4 w-4 text-primary" />
                      <div className="flex flex-col leading-none">
                        <span className="text-xs text-muted-foreground">Certificados</span>
                        <span className="font-semibold">
                          {progress.loading ? "..." : progress.certificatesEarned}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 mt-2 md:mt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewProfile(memberData)}
                      className="h-8 text-xs"
                    >
                      Ver Perfil
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGenerateReport(memberData)}
                      className="h-8 text-xs"
                    >
                      Reporte
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
