import { UnifiedHeader } from '../../components/layout/UnifiedHeader';
import {
  DashboardMetrics,
  DashboardPrimaryActions,
  DashboardContentManagement,
  DashboardUpcomingEvents,
  DashboardAdminActions,
} from '../../components/dashboard/coordinator';
import { useAuthStore } from '@/stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { EventAPI } from '@/services/api';
import { mapEventsToContentItems } from '@/features/events';
import { HideOnScrollWrapper } from '@/components/layout/HideOnScrollWrapper';

// Nota: Renombrado a '...Page' para claridad, o puedes llamarlo 'CoordinatorDashboard'
export function CoordinatorDashboardPage() {
  const user = useAuthStore(s => s.user);

  const eventQuery = useQuery({
    queryKey: ['events'],
    queryFn: () => EventAPI.listAllEvents(),
  });
  const events = eventQuery.data ?? [];
  // Lógica y datos derivados se mantienen en el componente 'padre'
  const totalEvents = events.length;
  const totalEnrolled = events.reduce((sum, event) => sum + (event.capacity ?? 0), 0);
  const totalCapacity = events.reduce((sum, event) => sum + (event.capacity ?? 0), 0);

  // Evitar división por cero
  const averageParticipation = totalCapacity > 0
    ? Math.round((totalEnrolled / totalCapacity) * 100)
    : 0;

  const upcomingEvents = events.filter(
    (event) => (new Date(event.start_date)).getTime() - new Date().getTime() > -5 * 24 * 60 * 60 * 1000,
  );


  const upcomingContent = mapEventsToContentItems(upcomingEvents);

  // Idealmente, deberías tener un estado de carga o un 'early return'
  if (!user) {
    return null; // O un componente de carga
  }

  return (
    <div className="space-y-6">
      {/* 1. Cabecera */}
      <HideOnScrollWrapper>
        <UnifiedHeader
          title="Panel de Coordinación"
          subtitle={`Bienvenido, ${user.name}`}
        />
      </HideOnScrollWrapper>

      {/* Contenedor principal del contenido */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
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