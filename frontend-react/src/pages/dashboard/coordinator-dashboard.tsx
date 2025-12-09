import {
  DashboardMetrics,
  DashboardPrimaryActions,
  DashboardContentManagement,
  DashboardUpcomingEvents,
  DashboardAdminActions,
} from '../../components/dashboard/coordinator';
import { useAuthStore } from '@/stores/auth.store';
import { useQuery, useQueries } from '@tanstack/react-query';
import { EventAPI } from '@/services/api';
import { mapEventsToContentItems } from '@/features/events';
import { HideOnScrollWrapper } from '@/components/layout/HideOnScrollWrapper';
import { useMemo, useState } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router';
import brainImage from '@/assets/brain.png';

// Nota: Renombrado a '...Page' para claridad, o puedes llamarlo 'CoordinatorDashboard'
export function CoordinatorDashboardPage() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const eventQuery = useQuery({
    queryKey: ['events'],
    queryFn: () => EventAPI.listAllEvents(),
  });
  const events = eventQuery.data ?? [];
  
  // Cargar participaciones para todos los eventos usando useQueries
  const participationsQueries = useQueries({
    queries: events.map(event => ({
      queryKey: ['event-participations', event.id],
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
  const averageParticipation = totalCapacity > 0 && totalEnrolled > 0
    ? Math.round((totalEnrolled / totalCapacity) * 100)
    : 0;

  const upcomingEvents = eventsWithParticipations.filter(
    (event) => (new Date(event.start_date)).getTime() - new Date().getTime() > -5 * 24 * 60 * 60 * 1000,
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
        <header className="bg-[#0a2740] text-white shadow-sm relative">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              {/* Logo + Título */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  alt="Logo del Semillero"
                  className="h-9 w-9 object-contain rounded-full bg-white flex-shrink-0"
                  src={brainImage}
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <h1 className="text-sm font-bold break-words leading-tight">Panel de Coordinación</h1>
                </div>
              </div>

              {/* Avatar, Badge, Notificaciones */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      title="Abrir menú de usuario"
                      aria-label="Abrir menú de usuario"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                        <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                          {user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowLogoutConfirm(true)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Badge className="bg-white/20 text-white hover:bg-white/30 border-0 flex-shrink-0">
                  Coordinador
                </Badge>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 h-9 w-9 flex-shrink-0"
                >
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>
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