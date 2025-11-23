import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../../stores/auth.store";
import { useApp } from "../context/AppContext";
import useLogout from "../../hooks/useLogout";
import useGoToDashboard from "../../hooks/useGoToDashboard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileAPI, ArticleAPI } from "../../services/api";
import { toast } from "sonner";

// Importaciones de la nueva estructura
import { UnifiedHeader } from "../layout/UnifiedHeader";
import { ProfileTemplate } from "./templates/profile-template";
// import { ProfileHeader } from "./atoms/profile-header"; // Removed
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

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const extractErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      message?: string;
      response?: { data?: { message?: string } };
    };

    if (maybeError.response?.data?.message) {
      return maybeError.response.data.message;
    }

    if (maybeError.message) {
      return maybeError.message;
    }
  }

  return fallback;
};

type ProfileArticle = {
  id: string;
  title: string;
  description: string;
  authors: string;
  publicationDate: string;
  publicationUrl: string;
  userId?: string;
};

type AddArticleFormValues = {
  title: string;
  description: string;
  publicationDate: string;
  authors: string;
  publicationUrl: string;
};

const mapContextArticleToProfile = (article: {
  id: string;
  title: string;
  description: string;
  publicationDate: string;
  authors: string;
  publicationUrl: string;
  userId: string;
}): ProfileArticle => ({
  id: article.id,
  title: article.title,
  description: article.description,
  authors: article.authors,
  publicationDate: article.publicationDate,
  publicationUrl: article.publicationUrl,
  userId: article.userId,
});

const mapApiArticleToProfile = (
  apiArticle: API.Article | null | undefined,
  fallback: APIPayloads.AddArticle
): ProfileArticle => ({
  id: apiArticle ? String(apiArticle.id) : `art-${Date.now()}`,
  title: apiArticle?.title ?? fallback.title,
  description: apiArticle?.description ?? fallback.description ?? "",
  authors: apiArticle?.authors ?? fallback.authors,
  publicationDate: apiArticle?.publication_date ?? fallback.publication_date,
  publicationUrl: apiArticle?.publication_url ?? fallback.publication_url ?? "",
  userId: apiArticle ? String(apiArticle.user_id) : String(fallback.user_id),
});

const mapDialogArticleToPayload = (data: AddArticleFormValues, userId: number): APIPayloads.AddArticle => ({
  user_id: userId,
  title: data.title,
  description: data.description,
  authors: data.authors,
  publication_date: data.publicationDate,
  publication_url: data.publicationUrl,
});

type ProfileEvent = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  modality: string;
};

const mapContentToProfileEvent = (event: Content): ProfileEvent => ({
  id: event.id,
  title: event.title,
  category: event.type,
  date: event.date,
  time: event.time ?? "Por definir",
  modality: event.modality ?? "por definir",
});

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

  const userIdString = user ? String(user.id) : "";
  const normalizedRole = role === "active-member" || role === "seed" ? "member" : role;

  const baseUserArticles = useMemo<ProfileArticle[]>(() => {
    if (!userIdString) {
      return [];
    }

    return articles
      .filter((article) => article.userId === userIdString)
      .map(mapContextArticleToProfile);
  }, [articles, userIdString]);

  const [myArticles, setMyArticles] = useState<ProfileArticle[]>(baseUserArticles);

  useEffect(() => {
    setMyArticles(baseUserArticles);
  }, [baseUserArticles]);
  // const [isAddEventOpen, setAddEventOpen] = useState(false);
  // const [participationToDelete, setParticipationToDelete] = useState<string | null>(null);

  // --- API DATA FETCHING ---
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: ProfileAPI.getProfile,
    enabled: !!user,
  });

  // --- API MUTATIONS ---
  const updateProfileMutation = useMutation<API.Profile, unknown, APIPayloads.UpdateProfile>({
    mutationFn: ProfileAPI.updateProfile,
    onSuccess: () => {
      toast.success("Perfil actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      setEditContactOpen(false);
    },
    onError: (error) => toast.error(extractErrorMessage(error, "Error al actualizar el perfil")),
  });

  const addArticleMutation = useMutation<ArticleAPI.ArticleRes, unknown, APIPayloads.AddArticle>({
    mutationFn: ArticleAPI.addArticle,
    onSuccess: (resp, variables) => {
      const displayArticle = mapApiArticleToProfile(resp?.article, variables);
      setMyArticles((prev) => [displayArticle, ...prev]);
      toast.success("Artículo agregado exitosamente");
      setAddArticleOpen(false);
    },
    onError: (error) => toast.error(extractErrorMessage(error, "Error al agregar el artículo")),
  });

  // Lógica de logout
  const handleLogout = () => logout().then((success) => success && goToDashboard());

  const userInterests = useMemo(
    () => profile?.interests?.map((interest) => interest.keyword) ?? [],
    [profile]
  );

  // const dashboardRoute = useMemo(
  //   () => getDashboardRouteFromRole(normalizedRole),
  //   [normalizedRole]
  // );

  if (!user) return null; // o un loader/redirect

  const personalInfoUser: API.User & { interests: string[] } = {
    ...user,
    interests: userInterests,
  };

  // --- DATA DERIVATION ---
  const userCertificates = certificates.filter((cert) => cert.userId === userIdString);
  const userParticipations = userEventParticipations.filter((p) => p.userId === userIdString);
  const participatedEvents = events
    .filter((event) => userParticipations.some((p) => p.eventId === event.id))
    .map(mapContentToProfileEvent);

  const handleConfirmDeleteArticle = () => {
    if (!articleToDelete) {
      return;
    }

    setMyArticles((prev) => prev.filter((article) => article.id !== articleToDelete));
    toast.success("Artículo eliminado de la vista");
    setArticleToDelete(null);
  };

  const getRoleLabel = (role: string) =>
    ({
      mentor: "Mentor",
      interested: "Interesado",
      coordinator: "Coordinador",
      member: "Miembro",
    })[role] || "Rol no definido";

  return (
    <ProfileTemplate
      header={
        <UnifiedHeader
          title="Mi Perfil"
          onGoBack={() => goToDashboard()}
        />
      }
      personalInfo={
        <PersonalInfoCard
          user={personalInfoUser}
          role={role}
          getRoleLabel={getRoleLabel}
        />
      }
      contactInfo={
        <ContactInfoCard
          isLoading={isLoadingProfile || updateProfileMutation.isPending}
          contactInfo={profile}
          email={user.email}
          onEdit={() => setEditContactOpen(true)}
        />
      }
      participationStats={
        <ParticipationStats
          eventsCount={userParticipations.length}
          certificatesCount={userCertificates.length}
          articlesCount={myArticles.length}
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
          articles={myArticles}
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
            onSave={(data) => updateProfileMutation.mutate(data)}
          />
          <AddArticleDialog
            open={isAddArticleOpen}
            onOpenChange={setAddArticleOpen}
            onAddArticle={(data) => addArticleMutation.mutate(mapDialogArticleToPayload(data, user.id))}
          />
          <ConfirmDeleteDialog
            open={!!articleToDelete}
            onOpenChange={(open) => {
              if (!open) {
                setArticleToDelete(null);
              }
            }}
            onConfirm={handleConfirmDeleteArticle}
            title="¿Eliminar artículo?"
            description="Esta acción no se puede deshacer. El artículo será eliminado permanentemente."
          />
        </>
      }
      navbar={<BottomNavbarWrapper role={role} />}
    />
  );
}
