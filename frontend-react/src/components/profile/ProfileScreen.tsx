import { useState } from "react";
import { useAuthStore } from "../../stores/auth.store";
import { useApp } from "../context/AppContext";
import useLogout from "../../hooks/useLogout";
import useGoToDashboard from "../../hooks/useGoToDashboard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileAPI, ArticleAPI } from "../../services/api"; // Asumiendo que exportas los servicios
import { toast } from "sonner";

// Importaciones de la nueva estructura
import { ProfileTemplate } from "./templates/profile-template";
import { ProfileHeader } from "./atoms/profile-header";
import { PersonalInfoCard } from "./molecules/personal-info-card";
import { ContactInfoCard } from "./molecules/contact-info-card";
import { ParticipationStats } from "./organisms/participation-stats";
import { MyEventsSection } from "./organisms/my-events-section";
import { MyArticlesSection } from "./organisms/my-articles-section";
import { RecentCertificatesSection } from "./organisms/recent-certificates-section";
import { SettingsSection } from "./organisms/settings-section";
import { EditContactDialog } from "./dialogs/edit-contact-dialog";
import { AddArticleDialog } from "./dialogs/add-article-dialog";
import { ConfirmDeleteDialog } from "./dialogs/confirm-delete-dialog";
// import { AddEventDialog } from "./dialogs/add-event-dialog"; // Necesitarías crear este dialog
import BottomNavbarWrapper from "../nav/BottomNavbarWrapper";
import { getDashboardRouteFromRole } from "../../services/navigation/redirects";

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
};

export function ProfileScreen() {
  const queryClient = useQueryClient();
  const { certificates, events, articles, userEventParticipations } = useApp(); // Usando mock data por ahora
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? "";
  const { logout } = useLogout();
  const goToDashboard = useGoToDashboard();

  // State para manejar visibilidad de dialogs
  const [isEditContactOpen, setEditContactOpen] = useState(false);
  const [isAddArticleOpen, setAddArticleOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  // const [isAddEventOpen, setAddEventOpen] = useState(false);
  // const [participationToDelete, setParticipationToDelete] = useState<string | null>(null);

  // --- API DATA FETCHING ---
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: ProfileAPI.getProfile,
    enabled: !!user,
  });

  // --- API MUTATIONS ---
  const updateProfileMutation = useMutation({
    mutationFn: ProfileAPI.updateProfile,
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      setEditContactOpen(false);
    },
    onError: () => toast.error("Error al actualizar el perfil"),
  });

  const addArticleMutation = useMutation({
    mutationFn: ArticleAPI.addArticle, // Asumiendo que la función de API espera el objeto correcto
    onSuccess: () => {
      toast.success("Artículo agregado exitosamente");
      // queryClient.invalidateQueries({ queryKey: ['articles'] }); // Invalidar query de artículos
      setAddArticleOpen(false);
    },
    onError: () => toast.error("Error al agregar el artículo"),
  });

  // Lógica de logout
  const handleLogout = () => logout().then((success) => success && goToDashboard());

  if (!user) return null; // o un loader/redirect

  // --- DATA DERIVATION ---
  const userCertificates = certificates.filter((cert) => cert.userId === user?.id);
  const userArticles = articles.filter((article) => article.userId === user?.id);
  const userParticipations = userEventParticipations.filter((p) => p.userId === user?.id);
  const participatedEvents = events.filter((event) => userParticipations.some((p) => p.eventId === event.id));

  const getRoleLabel = (role: string) =>
    ({
      mentor: "Mentor",
      interested: "Interesado",
      coordinator: "Coordinador",
      member: "Miembro",
    })[role] || "Rol no definido";

  return (
    <ProfileTemplate
      header={<ProfileHeader backViewUrl={getDashboardRouteFromRole(role)} />}
      personalInfo={<PersonalInfoCard user={{ ...user, interests: [] }} role={role} getRoleLabel={getRoleLabel} />}
      contactInfo={
        <ContactInfoCard
          isLoading={isLoadingProfile}
          contactInfo={{
            phone: profile?.phone ?? "No especificado",
            university: profile?.university ?? "No especificada",
            program: profile?.academic_program ?? "No especificado",
          }}
          email={user.email}
          onEdit={() => setEditContactOpen(true)}
        />
      }
      participationStats={
        <ParticipationStats
          eventsCount={userParticipations.length}
          certificatesCount={userCertificates.length}
          articlesCount={userArticles.length}
        />
      }
      myEvents={
        <MyEventsSection
          participatedEvents={participatedEvents}
          userParticipations={userParticipations}
          onAddEvent={() => toast.info("Funcionalidad pendiente")} // () => setAddEventOpen(true)
          onDeleteParticipation={(id) => toast.info(`Eliminar participación ${id}`)} // () => setParticipationToDelete(id)
          formatDate={formatDate}
        />
      }
      myArticles={
        <MyArticlesSection
          articles={userArticles}
          onAddArticle={() => setAddArticleOpen(true)}
          onDeleteArticle={(id) => setArticleToDelete(id)}
          formatDate={formatDate}
        />
      }
      recentCertificates={<RecentCertificatesSection certificates={userCertificates} formatDate={formatDate} />}
      settings={<SettingsSection onLogout={handleLogout} />}
      dialogs={
        <>
          <EditContactDialog
            open={isEditContactOpen}
            onOpenChange={setEditContactOpen}
            initialData={profile}
            onSave={(data) => {
              console.log(data)
              updateProfileMutation.mutate(data)
            }}
          />
          <AddArticleDialog
            open={isAddArticleOpen}
            onOpenChange={setAddArticleOpen}
            onAddArticle={(data) =>
              addArticleMutation.mutate({
                ...data,
                user_id: user.id,
              })
            }
          />
          <ConfirmDeleteDialog
            open={!!articleToDelete}
            onOpenChange={() => setArticleToDelete(null)}
            onConfirm={() => toast.info(`Eliminar artículo ${articleToDelete}`)} // Aquí iría la mutación de borrado
            title="¿Eliminar artículo?"
            description="Esta acción no se puede deshacer. El artículo será eliminado permanentemente."
          />
        </>
      }
      navbar={<BottomNavbarWrapper role={role} />}
    />
  );
}
