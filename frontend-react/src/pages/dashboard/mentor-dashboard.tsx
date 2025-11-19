import { useState, useEffect } from "react";
import { BNavBarMentor } from "../../components/ui/b-navbar-mentor";
import { UserAPI } from "../../services/api";
import { toast } from "sonner";
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

// Mock data (movido desde el componente original)
const mockSubmissions: Submission[] = [
  {
    id: "1",
    type: "event",
    title: "Workshop de IA Generativa",
    submittedById: null,
    date: "2025-09-25",
    status: "pending",
    description: "Taller sobre herramientas de IA generativa para estudiantes",
  },
  {
    id: "2",
    type: "certificate",
    title: "Certificado React Avanzado",
    submittedById: null,
    date: "2025-09-20",
    status: "pending",
    description: "Certificado por completar el curso de React avanzado",
  },
  {
    id: "3",
    type: "article",
    title: "Artículo sobre Machine Learning",
    submittedById: null,
    date: "2025-09-18",
    status: "approved",
    description: "Artículo de investigación sobre algoritmos de ML",
  },
];

export function MentorDashboardPage() {
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const [users, setUsers] = useState<API.User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado de las submissions (manejado en la página)
  const [submissions, setSubmissions] = useState(mockSubmissions);

  // Estado centralizado para todos los modales
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberProgressData | null>(null);
  const [isGeneralReportOpen, setIsGeneralReportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Cargar usuarios
  useEffect(() => {
    loadUsers();
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

  // Handlers para lógica de negocio (API)
  const handleCreateUser = async (name: string, email: string, role: API.UserRole) => {
    try {
      await UserAPI.createUser(name, email, role);
      toast.success("Usuario creado exitosamente");
      loadUsers(); // Recargar lista
      return true;
    } catch (error) {
      const message = getErrorMessageForToast(error, "Error al crear usuario");
      toast.error(message);
      console.error("Error creating user:", error);
      return false;
    }
  };

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

  if (!user) return null; // O un spinner de carga

  return (
    <div className="min-h-screen pb-20">
      {/* Cabecera */}
      <MentorHeader 
        user={user} 
        onLogout={logout} 
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        pendingCount={3} // Valor estático del mock original
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
          onCreateUser={handleCreateUser}
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