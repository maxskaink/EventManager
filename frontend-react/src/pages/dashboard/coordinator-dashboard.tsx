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
  
  // Métricas basadas en datos reales
  const totalEvents = events.length;
  const totalEnrolled = 0; // Placeholder - se actualizará cuando haya API de participantes reales
  const totalCapacity = events.reduce((sum, event) => sum + (event.capacity ?? 0), 0);

  // Evitar división por cero
  const averageParticipation = totalCapacity > 0 && totalEnrolled > 0
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
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* 1. Cabecera */}
      <HideOnScrollWrapper>
        <UnifiedHeader
          title="Panel de Coordinación"
          subtitle={`Bienvenido, ${user.name}`}
        />
      </HideOnScrollWrapper>

      {/* Contenedor principal del contenido */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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