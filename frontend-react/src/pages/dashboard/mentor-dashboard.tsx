import { useState, useEffect } from "react";
import { UserAPI, EventAPI, PublicationAPI } from "../../services/api";
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
  SettingsModal,
  type Submission,
} from "../../components/dashboard/mentor";
import { getErrorMessageForToast } from "../../features/errors/error.helpers";
import { useAuthStore } from "../../stores/auth.store";

// Tipos para los datos de progreso (basados en el mock original)
type MemberProgressData = API.User & {
  joinDate: string;
  progress: number;
  eventsAttended: number;
  certificatesEarned: number;
};

// Submissions se construirán dinámicamente a partir de eventos y publicaciones reales

export function MentorDashboardPage() {
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const [users, setUsers] = useState<API.User[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado de submissions generado dinámicamente
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Estado centralizado para todos los modales
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberProgressData | null>(null);
  const [isGeneralReportOpen, setIsGeneralReportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    loadUsers();
    loadContentForReview();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await UserAPI.listActiveUsers();
      setUsers(response);
    } catch (error) {
      toast.error("Error al cargar usuarios");
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeEventStatus = (status: string | null | undefined): Submission["status"] => {
    const normalized = status?.toLowerCase();
    if (!normalized) return "pending";
    if (["rejected", "rechazado", "cancelado", "cancelled", "inactivo"].includes(normalized)) {
      return "rejected";
    }
    if (["approved", "aprobado", "publicado", "finalizado", "activo"].includes(normalized)) {
      return normalized === "activo" ? "pending" : "approved";
    }
    return "pending";
  };

  const normalizePublicationStatus = (status: string | null | undefined): Submission["status"] => {
    const normalized = status?.toLowerCase();
    if (!normalized) return "pending";
    if (["inactivo", "rechazado", "rejected"].includes(normalized)) {
      return "rejected";
    }
    if (["activo", "publicado", "approved"].includes(normalized)) {
      return "approved";
    }
    return "pending";
  };

  const loadContentForReview = async () => {
    try {
      const [eventsData, publicationsData] = await Promise.all([
        EventAPI.listAllEvents().catch((error) => {
          console.error("Error cargando eventos:", error);
          toast.error("No se pudieron cargar los eventos para revisión");
          return [] as API.Event[];
        }),
        PublicationAPI.listAllPublications().catch((error) => {
          console.warn("Publicaciones no disponibles:", error);
          return [] as API.Publication[];
        }),
      ]);

      const eventSubs: Submission[] = eventsData.map((event) => ({
        id: String(event.id),
        type: "event",
        title: event.name,
        submittedById: null,
        date: event.start_date,
        status: normalizeEventStatus(event.status),
        description: event.description,
      }));

      const publicationSubs: Submission[] = publicationsData.map((publication) => ({
        id: String(publication.id),
        type: "publication",
        title: publication.title,
        submittedById: publication.author_id ? String(publication.author_id) : null,
        date: publication.published_at,
        status: normalizePublicationStatus(publication.status),
        description: publication.summary ?? publication.content,
      }));

      setSubmissions([...eventSubs, ...publicationSubs]);
    } catch (error) {
      console.error("Error general cargando contenido:", error);
      toast.error("Ocurrió un error al cargar el contenido para revisión");
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

  // Handlers para lógica de submissions (mock)
  const handleApproveSubmission = (submissionId: string) => {
    setSubmissions(submissions.map(sub =>
      sub.id === submissionId
        ? { ...sub, status: "approved" as const }
        : sub
    ));
    toast.success("✅ Contenido aprobado exitosamente");
  };

  const handleRejectSubmission = (submissionId: string) => {
    setSubmissions(submissions.map(sub =>
      sub.id === submissionId
        ? { ...sub, status: "rejected" as const }
        : sub
    ));
    toast.error("❌ Contenido rechazado");
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

  const pendingSubmissions = submissions.filter(s => s.status === "pending");
  const pendingCount = 3; // Mock value

  if (!user) return null; // O un spinner de carga

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      {/* Cabecera */}
      <MentorHeader
        user={user}
        onLogout={logout}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        pendingCount={pendingCount} // Valor estático del mock original
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Acciones Rápidas */}
        <MentorQuickActions
          onOpenGeneralReport={() => setIsGeneralReportOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Métricas */}
        <MentorMetrics users={users} loading={loading} />

        {/* Contenido principal (Pestañas) */}
        <MentorTabs
          users={users}
          loadingUsers={loading}
          submissions={submissions}
          onApproveSubmission={handleApproveSubmission}
          onRejectSubmission={handleRejectSubmission}
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
        submissions={submissions}
        pendingSubmissions={pendingSubmissions}
      />

      <SettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        user={user}
        users={users}
        submissions={submissions}
        pendingSubmissions={pendingSubmissions}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenGeneralReport={() => setIsGeneralReportOpen(true)}
      />

      <NotificationsModal
        open={isNotificationsOpen}
        onOpenChange={setIsNotificationsOpen}
      />
    </div>
  );
}