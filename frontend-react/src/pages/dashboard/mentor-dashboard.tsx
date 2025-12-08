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
  InterestManagerModal,
  type Submission,
  type MemberProgressData,
} from "../../components/dashboard/mentor";
import { getErrorMessageForToast } from "../../features/errors/error.helpers";
import { useAuthStore } from "../../stores/auth.store";
import { HideOnScrollWrapper } from "@/components/layout/HideOnScrollWrapper";

// Submissions se construirán dinámicamente a partir de eventos y publicaciones reales

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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
    loadContentForReview();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await UserAPI.listUsersByFilters({ 
        status: 'active',
        per_page: 1000 // Get all active users in one request
      });
      setUsers(response.data);
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
      const [eventsData, publicationsResponse] = await Promise.all([
        EventAPI.listAllEvents().catch((error: unknown) => {
          console.error("Error cargando eventos:", error);
          toast.error("No se pudieron cargar los eventos para revisión");
          return [] as API.Event[];
        }),
        PublicationAPI.listAllPublications().then((data) => ({ data })).catch((error: unknown) => {
          console.warn("Publicaciones no disponibles:", error);
          return { data: [] as API.Publication[] };
        }),
      ]);

      const publicationsData = publicationsResponse.data || [];

      const eventSubs: Submission[] = eventsData.map((event: API.Event) => ({
        id: String(event.id),
        type: "event",
        title: event.name,
        submittedById: null,
        date: event.start_date,
        status: normalizeEventStatus(event.status),
        description: event.description,
      }));

      const publicationSubs: Submission[] = publicationsData.map((publication: API.Publication) => ({
        id: String(publication.id),
        type: "publication",
        title: publication.title,
        submittedById: null, // TODO: Add author_id to Publication entity
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

  // Handlers para lógica de submissions
  const handleApproveSubmission = (submissionId: string) => {
    setSubmissions(submissions.map(sub =>
      sub.id === submissionId
        ? { ...sub, status: "approved" as const }
        : sub
    ));
    toast.success("✅ Contenido aprobado exitosamente");
    // Recargar contenido después de aprobar
    setTimeout(() => loadContentForReview(), 500);
  };

  const handleRejectSubmission = (submissionId: string) => {
    setSubmissions(submissions.map(sub =>
      sub.id === submissionId
        ? { ...sub, status: "rejected" as const }
        : sub
    ));
    toast.error("❌ Contenido rechazado");
    // Recargar contenido después de rechazar
    setTimeout(() => loadContentForReview(), 500);
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

  if (!user) return null; // O un spinner de carga

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