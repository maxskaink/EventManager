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
import { useMemo } from 'react';
import { LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import brainImage from '@/assets/brain.png';

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
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* 1. Cabecera Personalizada */}
      <HideOnScrollWrapper>
        <header className="bg-[#0a2740] text-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  alt="Logo del Semillero"
                  className="h-10 w-10 object-contain rounded-full bg-white"
                  src={brainImage}
                />
                <div>
                  <h1 className="text-lg font-bold">Panel de Coordinación</h1>
                  <p className="text-white/80 text-sm">Bienvenido, {user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || undefined} />
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">{user?.name}</span>
                  <Badge className="bg-white/20 text-white hover:bg-white/30 border-0">
                    Coordinador
                  </Badge>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 h-9 w-9"
                >
                  <Bell className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 h-9 w-9"
                  onClick={() => useAuthStore.setState({ user: null })}
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>
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