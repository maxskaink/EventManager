import { useApp } from '../../components/context/AppContext';
import { BNavBarCoordinator } from '../../components/ui/b-navbar-coordinator';
import {
  DashboardHeader,
  DashboardMetrics,
  DashboardPrimaryActions,
  DashboardContentManagement,
  DashboardUpcomingEvents,
  DashboardAdminActions,
} from '../../components/dashboard/coordinator';

// Nota: Renombrado a '...Page' para claridad, o puedes llamarlo 'CoordinatorDashboard'
export function CoordinatorDashboardPage() {
  const { user, events } = useApp();

  // Lógica y datos derivados se mantienen en el componente 'padre'
  const totalEvents = events.length;
  const totalEnrolled = events.reduce((sum, event) => sum + (event.enrolled ?? 0), 0);
  const totalCapacity = events.reduce((sum, event) => sum + (event.capacity ?? 0), 0);
  
  // Evitar división por cero
  const averageParticipation = totalCapacity > 0 
    ? Math.round((totalEnrolled / totalCapacity) * 100) 
    : 0;

  const upcomingEvents = events.filter(
    (event) => event.status === 'upcoming',
  );

  // Idealmente, deberías tener un estado de carga o un 'early return'
  if (!user) {
    return null; // O un componente de carga
  }

  return (
    <div className="min-h-screen pb-20">
      {/* 1. Cabecera */}
      <DashboardHeader user={user} />

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
        <DashboardUpcomingEvents events={upcomingEvents} />

        {/* 6. Administración */}
        <DashboardAdminActions />
      </div>

      {/* Barra de Navegación */}
      <BNavBarCoordinator />
    </div>
  );
}