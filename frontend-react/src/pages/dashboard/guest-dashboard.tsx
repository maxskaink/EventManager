import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {  Bell, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { BNavBarInterested } from "../../components/ui/b-navbar-interested";
import { publicationQueries } from "@/services/react-query/queries";
import { RecentPublicationsSection } from "@/components/dashboard/guest/RecentPublicationsSection";
import { HideOnScrollWrapper } from "@/components/layout/HideOnScrollWrapper";
import { useAuthStore } from "@/stores/auth.store";
import brainImage from "@/assets/brain.png";
import { RecommendedEventsSection } from "@/components/dashboard/guest/RecommendedEventsSection";
import { LogoutConfirmDialog } from "@/components/auth/LogoutConfirmDialog";

export function GuestDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getRoleLabel = (role?: string) => {
    const roleMap: { [key: string]: string } = {
      guest: "Visitante",
      interested: "Interesado",
      member: "Miembro",
      coordinator: "Coordinador",
      mentor: "Mentor",
      seed: "Semilla",
    };
    return roleMap[role || "guest"] || role || "Panel";
  };

  const {
    data: publications,
    isLoading: publicationsLoading,
    error: publicationsError,
  } = useQuery(publicationQueries.published());

  const loading = publicationsLoading;
  const error = publicationsError;

  const upcomingEvents = useMemo(
    () => publications?.filter((publication: API.Publication) => Boolean(publication.event)).slice(0, 3) || [],
    [publications],
  );
  const recentPosts = useMemo(
    () => publications?.filter((publication: API.Publication) => !publication.event).slice(0, 3) || [],
    [publications],
  );

  console.log(publications);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header Personalizado */}
      <HideOnScrollWrapper>
        <header className="bg-[#0a2740] text-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  alt="Logo del Semillero"
                  className="h-10 w-10 rounded-full bg-white object-contain"
                  src={brainImage}
                />
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold">Panel de {getRoleLabel(user?.role)}</h1>
                  <p className="hidden text-sm text-white/80 md:block">Explora nuestros eventos y actividades</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        title="Abrir menú de usuario"
                        aria-label="Abrir menú de usuario"
                        className="transition-opacity hover:opacity-80"
                      >
                        <Avatar className="h-8 w-8 shrink-0">
                          {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                          <AvatarFallback className="bg-blue-500 text-xs font-semibold text-white">
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
                        <p className="text-sm leading-none font-medium">{user?.name}</p>
                        <p className="text-muted-foreground text-xs leading-none">{user?.email}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Mi Perfil</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setShowLogoutConfirm(true)}
                        className="text-red-600 focus:bg-red-50 focus:text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <span className="hidden text-sm sm:inline">{user?.name}</span>
                  <Badge className="border-0 bg-white/20 text-white hover:bg-white/30">
                    {getRoleLabel(user?.role)}
                  </Badge>
                </div>

                <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/10">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>
      </HideOnScrollWrapper>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog 
      open={showLogoutConfirm}
      onOpenChange={setShowLogoutConfirm}
      onConfirm={logout}
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Welcome Banner */}
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2">¡Bienvenido, {user?.name?.split(" ")[0]}!</h2>
          <p className="text-blue-100">Descubre eventos y actividades en el semillero</p>
        </div>

        {/* Eventos Recomendados */}
        <RecommendedEventsSection
          upcomingEvents={upcomingEvents}
          loading={loading}
          error={error}
        />

        <RecentPublicationsSection publications={recentPosts} isLoading={loading} error={error} />
        {/* Se elimina el bloque de registro para interesados */}
      </div>
      {/* Navigation Bar */}
      <BNavBarInterested />
    </div>
  );
}
