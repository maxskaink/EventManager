import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BNavBarInterested } from "../../components/ui/b-navbar-interested";
import { publicationQueries } from "@/services/react-query/queries";
import { RecentPublicationsSection } from "@/components/dashboard/guest/RecentPublicationsSection";
import { HideOnScrollWrapper } from "@/components/layout/HideOnScrollWrapper";
import { useAuthStore } from "@/stores/auth.store";
import { RecommendedEventsSection } from "@/components/dashboard/guest/RecommendedEventsSection";
import { LogoutConfirmDialog } from "@/components/auth/LogoutConfirmDialog";
import { UnifiedHeader } from "@/components/layout/UnifiedHeader";

export function GuestDashboard() {
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
        <UnifiedHeader
        title={`Panel de ${getRoleLabel(user?.role)}`}
        subtitle="Explora nuestros eventos y actividades"
        user={user}
        />
      </HideOnScrollWrapper>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog 
      open={showLogoutConfirm}
      onOpenChange={setShowLogoutConfirm}
      onConfirm={logout}
      />

      <div className="mx-auto max-w-4xl space-y-6 p-4">
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
