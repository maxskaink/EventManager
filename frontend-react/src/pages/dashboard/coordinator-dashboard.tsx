import {
  DashboardMetrics,
  DashboardPrimaryActions,
  DashboardContentManagement,
  DashboardUpcomingEvents,
  DashboardAdminActions,
} from "../../components/dashboard/coordinator";
import { useAuthStore } from "@/stores/auth.store";
import { useQuery, useQueries } from "@tanstack/react-query";
import { EventAPI } from "@/services/api";
import { mapEventsToContentItems } from "@/features/events";
import { HideOnScrollWrapper } from "@/components/layout/HideOnScrollWrapper";
import { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UnifiedHeader } from "@/components/layout/UnifiedHeader";
import { translateUserRole } from "@/features/users/users.helpers";

// Nota: Renombrado a '...Page' para claridad, o puedes llamarlo 'CoordinatorDashboard'
export function CoordinatorDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const eventQuery = useQuery({
    queryKey: ["events"],
    queryFn: () => EventAPI.listAllEvents(),
  });
  const events = eventQuery.data ?? [];

  // Cargar participaciones para todos los eventos usando useQueries
  const participationsQueries = useQueries({
    queries: events.map((event) => ({
      queryKey: ["event-participations", event.id],
      queryFn: () => EventAPI.listEnrollmentsByEvent(event.id),
    })),
  });

  // Enriquecer eventos con datos de participaciones
  const eventsWithParticipations = useMemo(() => {
    return events.map((event, index) => {
      const participations = participationsQueries[index]?.data ?? [];
      return {
        ...event,
        enrolled: participations.length,
      };
    });
  }, [events, participationsQueries]);

  // Métricas basadas en datos reales
  const totalEvents = eventsWithParticipations.length;
  const totalEnrolled = eventsWithParticipations.reduce((sum, event) => sum + (event.enrolled ?? 0), 0);
  const totalCapacity = eventsWithParticipations.reduce((sum, event) => sum + (event.capacity ?? 0), 0);

  // Evitar división por cero
  const averageParticipation =
    totalCapacity > 0 && totalEnrolled > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  const upcomingEvents = eventsWithParticipations.filter(
    (event) => new Date(event.start_date).getTime() - new Date().getTime() > -5 * 24 * 60 * 60 * 1000,
  );

  const upcomingContent = mapEventsToContentItems(upcomingEvents).map((item, idx) => ({
    ...item,
    enrolled: upcomingEvents[idx]?.enrolled ?? 0,
  }));

  // Idealmente, deberías tener un estado de carga o un 'early return'
  if (!user) {
    return null; // O un componente de carga
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* 1. Cabecera Personalizada */}
      <HideOnScrollWrapper>
        <UnifiedHeader
          leftImage
          title={`Panel de ${translateUserRole(user?.role)}`}
          subtitle="Gestionar eventos y actividades"
          user={user}
        />
      </HideOnScrollWrapper>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro que deseas cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              Tendrás que iniciar sesión nuevamente para acceder a tu cuenta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={logout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cerrar sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Contenedor principal del contenido */}
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* 2. Métricas */}
        <DashboardMetrics
          totalEvents={totalEvents}
          totalEnrolled={totalEnrolled}
          averageParticipation={averageParticipation}
        />

        {/* 3. Acciones Principales */}
        <DashboardPrimaryActions />

        {/* 4. Gestión de Contenido */}
        <DashboardContentManagement />

        {/* 5. Próximos Eventos */}
        <DashboardUpcomingEvents events={upcomingContent} />

        {/* 6. Administración */}
        <DashboardAdminActions />
      </div>
    </div>
  );
}
