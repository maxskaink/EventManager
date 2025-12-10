import { useState, useEffect } from "react";
import { UserAPI } from "../../services/api";
import { toast } from "sonner";
import { BNavBarMentor } from "../../components/ui/b-navbar-mentor";
import {
  MentorHeader,
  MentorMetrics,
  MentorTabs,
  MentorQuickActions,
  GeneralReportModal,
  NotificationsModal,
  ProfileModal,
  ProfileReportModal,
  InterestManagerModal,
  type MemberProgressData,
} from "../../components/dashboard/mentor";
import { getErrorMessageForToast } from "../../features/errors/error.helpers";
import { useAuthStore } from "../../stores/auth.store";
import { HideOnScrollWrapper } from "@/components/layout/HideOnScrollWrapper";
import { MentorPrimaryActions } from "@/components/dashboard/mentor/MentorPrimaryActions";

export function MentorDashboardPage() {
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const [users, setUsers] = useState<API.User[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado centralizado para todos los modales
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberProgressData | null>(null);
  const [isGeneralReportOpen, setIsGeneralReportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await UserAPI.listUsersByFilters({ 
        status: 'active',
        per_page: 100
      });
      setUsers(response.data);
    } catch (error) {
      toast.error("Error al cargar usuarios");
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler para cambiar el rol de un usuario existente
  const handleRoleChange = async (userId: number, newRole: API.UserRole) => {
    try {
      await UserAPI.toggleUserRole(userId, newRole);
      toast.success("Rol cambiado exitosamente");
      loadUsers(); // Recargar lista
      return true;
    } catch (error) {
      const message = getErrorMessageForToast(error, "Error al cambiar rol");
      toast.error(message);
      console.error("Error changing role:", error);
      return false;
    }
  };

  // Handlers para abrir modales
  const handleViewProfile = (member: MemberProgressData) => {
    setSelectedMember(member);
    setIsProfileModalOpen(true);
  };

  const handleGenerateReport = (member: MemberProgressData) => {
    setSelectedMember(member);
    setIsReportModalOpen(true);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 bg-gray-50/50 min-h-screen pb-10">
      <HideOnScrollWrapper>
        <MentorHeader
          user={user}
          onLogout={logout}
        />
      </HideOnScrollWrapper>

      <div className="container mx-auto px-4 md:px-6 py-8 space-y-8 max-w-7xl">
        {/* Acciones Rápidas */}
        <MentorQuickActions
          onOpenGeneralReport={() => setIsGeneralReportOpen(true)}
          onOpenInterests={() => setIsInterestModalOpen(true)}
        />

        <MentorPrimaryActions />

        {/* Métricas */}
        <MentorMetrics users={users} loading={loading} />

        {/* Contenido principal (Pestañas) */}
        <MentorTabs
          users={users}
          loadingUsers={loading}
          onChangeRole={handleRoleChange}
          onViewProfile={handleViewProfile}
          onGenerateReport={handleGenerateReport}
        />
      </div>

      {/* 5. Barra de Navegación */}
      <BNavBarMentor />

      {/* 6. Modales (gestionados por la página) */}
      <ProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        member={selectedMember}
      />

      <ProfileReportModal
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        member={selectedMember}
      />

      <GeneralReportModal
        open={isGeneralReportOpen}
        onOpenChange={setIsGeneralReportOpen}
        users={users}
      />

      <NotificationsModal
        open={isNotificationsOpen}
        onOpenChange={setIsNotificationsOpen}
      />

      <InterestManagerModal
        open={isInterestModalOpen}
        onOpenChange={setIsInterestModalOpen}
      />
    </div>
  );
}