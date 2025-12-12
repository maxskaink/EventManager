import { useMemo, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import useLogout from "@/hooks/useLogout";
import useGoToDashboard from "@/hooks/useGoToDashboard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileAPI, ArticleAPI, InterestsAPI, ExternalEventsAPI, CertificateAPI } from "@/services/api";
import { toast } from "sonner";

// Importaciones de la nueva estructura
import { UnifiedHeader } from "@/components/layout/UnifiedHeader";
import { ProfileTemplate } from "@/components/profile/templates/profile-template";
// import { ProfileHeader } from "./atoms/profile-header"; // Removed
import { PersonalInfoCard } from "@/components/profile/molecules/personal-info-card";
import { ContactInfoCard } from "@/components/profile/molecules/contact-info-card";
import { ParticipationStats } from "@/components/profile/organisms/participation-stats";
import { MyExternalEventsSection } from "@/components/profile/organisms/my-external-events-section";
import { MyCertificatesSection } from "@/components/profile/organisms/my-certificates-section";
import { MyArticlesSection } from "@/components/profile/organisms/my-articles-section";
// import { RecentCertificatesSection } from "@/components/profile/organisms/recent-certificates-section";
import { SettingsSection } from "@/components/profile/organisms/settings-section";
import { EditContactDialog } from "@/components/profile/dialogs/edit-contact-dialog";
import { AddArticleDialog } from "@/components/profile/dialogs/add-article-dialog";
import { EditArticleDialog } from "@/components/profile/dialogs/edit-article-dialog";
import { AddExternalEventDialog } from "@/components/profile/dialogs/add-external-event-dialog";
import { EditExternalEventDialog } from "@/components/profile/dialogs/edit-external-event-dialog";
import { AddCertificateDialog } from "@/components/profile/dialogs/add-certificate-dialog";
import { EditCertificateDialog } from "@/components/profile/dialogs/edit-certificate-dialog";
import { ConfirmDeleteDialog } from "@/components/profile/dialogs/confirm-delete-dialog";
import { LogoutConfirmDialog } from "@/components/auth/LogoutConfirmDialog";
import { translateUserRole } from "@/features/users/users.helpers";
import { HideOnScrollWrapper } from "@/components/layout/HideOnScrollWrapper";

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
  }
  return fallback;
};

/**
 * Profile screen
 */
export function ProfileScreen() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? "";
  const { logout } = useLogout();
  const goToDashboard = useGoToDashboard();

  // State para manejar visibilidad de dialogs
  const [isEditContactOpen, setEditContactOpen] = useState(false);
  const [isAddArticleOpen, setAddArticleOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<string | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [isAddExternalEventOpen, setAddExternalEventOpen] = useState(false);
  const [externalEventToEdit, setExternalEventToEdit] = useState<number | null>(null);
  const [externalEventToDelete, setExternalEventToDelete] = useState<number | null>(null);
  const [isAddCertificateOpen, setAddCertificateOpen] = useState(false);
  const [certificateToEdit, setCertificateToEdit] = useState<number | null>(null);
  const [certificateToDelete, setCertificateToDelete] = useState<number | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // const [isAddEventOpen, setAddEventOpen] = useState(false);
  // const [participationToDelete, setParticipationToDelete] = useState<string | null>(null);

  // --- API DATA FETCHING ---
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: ProfileAPI.getProfile,
    enabled: !!user,
  });

  const { data: interestsData } = useQuery({
    queryKey: ["interests"],
    queryFn: InterestsAPI.listInterests,
  });

  const allInterests = useMemo(() => interestsData?.interests ?? [], [interestsData]);

  const { data: userProfileInterests = [] } = useQuery({
    queryKey: ["user-interests", user?.id],
    queryFn: ProfileAPI.getInterests,
    enabled: !!user,
  });

  const { data: externalEventsData, isLoading: isLoadingExternalEvents } = useQuery({
    queryKey: ["external-events", "my"],
    queryFn: ExternalEventsAPI.listMyExternalEvents,
    enabled: !!user,
  });

  const externalEvents = externalEventsData?.external_events ?? [];

  // -- API QUERIES --
  const { data: certificatesData, isLoading: isLoadingCertificates } = useQuery({
    queryKey: ["certificates", "my"],
    queryFn: CertificateAPI.listMyCertificates,
    select: (data) => data.certificates,
    enabled: !!user,
  });
  const certificates = certificatesData ?? [];

  const { data: articlesData } = useQuery({
    queryKey: ["articles", "my"],
    queryFn: ArticleAPI.listMyArticles,
    enabled: !!user,
  });
  const articles = articlesData ?? [];

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

  const addInterestMutation = useMutation({
    mutationFn: async (interestId: number) => {
      await ProfileAPI.addInterest({ interests: [interestId] });
    },
    onSuccess: () => {
      toast.success("Interés agregado");
      queryClient.invalidateQueries({ queryKey: ["user-interests", user?.id] });
    },
    onError: (error) => toast.error(extractErrorMessage(error, "Error al agregar interés")),
  });

  const deleteInterestMutation = useMutation({
    mutationFn: ProfileAPI.deleteInterest,
    onSuccess: () => {
      toast.success("Interés eliminado");
      queryClient.invalidateQueries({ queryKey: ["user-interests", user?.id] });
    },
    onError: (error) => toast.error(extractErrorMessage(error, "Error al eliminar interés")),
  });

  const addArticleMutation = useMutation({
    mutationFn: ArticleAPI.addArticle,
    onSuccess: () => {
      toast.success("Artículo agregado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["articles", "my"] });
      setAddArticleOpen(false);
    },
    onError: (error) => toast.error(extractErrorMessage(error, "Error al agregar el artículo")),
  });

  const addExternalEventMutation = useMutation({
    mutationFn: ExternalEventsAPI.createExternalEvent,
    onSuccess: () => {
      toast.success("Evento externo agregado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["external-events", "my"] });
      setAddExternalEventOpen(false);
    },
    onError: (error) => toast.error(extractErrorMessage(error, "Error al agregar evento externo")),
  });

  const deleteExternalEventMutation = useMutation({
    mutationFn: ExternalEventsAPI.deleteExternalEvent,
    onSuccess: () => {
      toast.success("Evento externo eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["external-events", "my"] });
      setExternalEventToDelete(null);
    },
    onError: (error) => toast.error(extractErrorMessage(error, "Error al eliminar evento externo")),
  });

  const addCertificateMutation = useMutation({
    mutationFn: CertificateAPI.addCertificate,
    onSuccess: () => {
      toast.success("Certificado agregado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["certificates", "my"] });
      setAddCertificateOpen(false);
    },
    onError: (error) => toast.error(extractErrorMessage(error, "Error al agregar certificado")),
  });

  const deleteCertificateMutation = useMutation({
    mutationFn: CertificateAPI.deleteCertificate,
    onSuccess: () => {
      toast.success("Certificado eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["certificates", "my"] });
      setCertificateToDelete(null);
    },
    onError: (error) => toast.error(extractErrorMessage(error, "Error al eliminar certificado")),
  });

  const updateArticleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: APIPayloads.UpdateArticle }) => ArticleAPI.updateArticle(id, data),
    onSuccess: () => {
      toast.success("Artículo actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["articles", "my"] });
      setArticleToEdit(null);
    },
    onError: (error) => toast.error(extractErrorMessage(error, "Error al actualizar artículo")),
  });

  const updateExternalEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: APIPayloads.PatchExternalEvent }) => ExternalEventsAPI.patchExternalEvent(id, data),
    onSuccess: () => {
      toast.success("Evento externo actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["external-events", "my"] });
      setExternalEventToEdit(null);
    },
    onError: (error) => toast.error(extractErrorMessage(error, "Error al actualizar evento externo")),
  });

  const updateCertificateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: APIPayloads.UpdateCertificate }) => CertificateAPI.updateCertificate(id, data),
    onSuccess: () => {
      toast.success("Certificado actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["certificates", "my"] });
      setCertificateToEdit(null);
    },
    onError: (error) => toast.error(extractErrorMessage(error, "Error al actualizar certificado")),
  });

  // Lógica de logout
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => logout().then((success) => success && goToDashboard());

  const userInterests = useMemo(() => {
    return userProfileInterests
      .map((pi) => allInterests.find((i) => i.id === pi.interest_id))
      .filter((i): i is API.Interest => i !== undefined);
  }, [userProfileInterests, allInterests]);

  if (!user) return null; // o un loader/redirect

  const personalInfoUser: API.User & { interests: API.Interest[] } = {
    ...user,
    interests: userInterests,
  };

  // --- DATA DERIVATION ---
  const handleConfirmDeleteArticle = () => {
    if (!articleToDelete) {
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["articles", "my"] });
    toast.success("Artículo eliminado");
    setArticleToDelete(null);
  };

  const getRoleLabel = (role: string) => {
    return translateUserRole(role as "mentor") ?? "Rol no definido";
  };

  return (
    <>
      <ProfileTemplate
        header={
          <HideOnScrollWrapper>
            <UnifiedHeader
              title="Mi Perfil"
              onGoBack={goToDashboard}
            />
          </HideOnScrollWrapper>
        }
        personalInfo={
          <PersonalInfoCard
            user={personalInfoUser}
            role={role}
            getRoleLabel={getRoleLabel}
            allInterests={allInterests}
            onAddInterest={(id) => addInterestMutation.mutate(id)}
            onDeleteInterest={(id) => deleteInterestMutation.mutate(id)}
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
            eventsCount={externalEvents.length}
            certificatesCount={certificates.length}
            articlesCount={articles.length}
          />
        }
        myExternalEvents={
          <MyExternalEventsSection
            events={externalEvents}
            onAddEvent={() => setAddExternalEventOpen(true)}
            onEditEvent={(id) => setExternalEventToEdit(id)}
            onDeleteEvent={(id) => setExternalEventToDelete(id)}
            formatDate={formatDate}
            isLoading={isLoadingExternalEvents}
          />
        }
        myArticles={
          <MyArticlesSection
            articles={articles.map((article) => ({
              id: String(article.id),
              title: article.title,
              description: article.description ?? "",
              authors: article.authors,
              publicationDate: article.publication_date,
              publicationUrl: article.publication_url ?? "",
            }))}
            onAddArticle={() => setAddArticleOpen(true)}
            onEditArticle={(id) => setArticleToEdit(id)}
            onDeleteArticle={(id) => setArticleToDelete(id)}
            formatDate={formatDate}
          />
        }
        myCertificates={
          <MyCertificatesSection
            certificates={certificates}
            onAddCertificate={() => setAddCertificateOpen(true)}
            onEditCertificate={(id) => setCertificateToEdit(id)}
            onDeleteCertificate={(id) => setCertificateToDelete(id)}
            formatDate={formatDate}
            isLoading={isLoadingCertificates}
          />
        }
        recentCertificates={null}
        settings={<SettingsSection onLogout={handleLogoutClick} />}
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
              onAddArticle={(data) => addArticleMutation.mutate({
                user_id: user.id,
                title: data.title,
                description: data.description,
                authors: data.authors,
                publication_date: data.publicationDate,
                publication_url: data.publicationUrl,
              })}
              isPending={addArticleMutation.isPending}
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

            <EditArticleDialog
              open={articleToEdit !== null}
              onOpenChange={(open) => !open && setArticleToEdit(null)}
              article={articleToEdit ? articles.find(a => String(a.id) === articleToEdit) ? {
                id: String(articles.find(a => String(a.id) === articleToEdit)!.id),
                title: articles.find(a => String(a.id) === articleToEdit)!.title,
                description: articles.find(a => String(a.id) === articleToEdit)!.description ?? "",
                authors: articles.find(a => String(a.id) === articleToEdit)!.authors,
                publicationDate: articles.find(a => String(a.id) === articleToEdit)!.publication_date,
                publicationUrl: articles.find(a => String(a.id) === articleToEdit)!.publication_url ?? "",
              } : null : null}
              onEditArticle={(data) => updateArticleMutation.mutate({
                id: Number(articleToEdit),
                data: {
                  title: data.title,
                  description: data.description,
                  authors: data.authors,
                  publication_date: data.publicationDate,
                  publication_url: data.publicationUrl,
                }
              })}
              isPending={updateArticleMutation.isPending}
            />

            <AddExternalEventDialog
              open={isAddExternalEventOpen}
              onOpenChange={setAddExternalEventOpen}
              onAddEvent={(data) => addExternalEventMutation.mutate({
                ...data,
                user_id: user.id,
              })}
              isPending={addExternalEventMutation.isPending}
            />

            <ConfirmDeleteDialog
              open={externalEventToDelete !== null}
              onOpenChange={(open) => !open && setExternalEventToDelete(null)}
              onConfirm={() => deleteExternalEventMutation.mutate(externalEventToDelete!)}
              title="¿Eliminar evento externo?"
              description="Esta acción no se puede deshacer. El evento será eliminado permanentemente."
            />

            <EditExternalEventDialog
              open={externalEventToEdit !== null}
              onOpenChange={(open) => !open && setExternalEventToEdit(null)}
              event={externalEventToEdit ? externalEvents.find(e => e.id === externalEventToEdit) ?? null : null}
              onEditEvent={(data) => updateExternalEventMutation.mutate({
                id: externalEventToEdit!,
                data: data
              })}
              isPending={updateExternalEventMutation.isPending}
            />

            <AddCertificateDialog
              open={isAddCertificateOpen}
              onOpenChange={setAddCertificateOpen}
              onAddCertificate={(data) => addCertificateMutation.mutate({
                ...data,
                user_id: user.id,
                expiration_date: data.expiration_date || null,
                credential_id: data.credential_id || null,
                credential_url: data.credential_url || null,
                does_not_expire: data.does_not_expire || false,
              })}
              isPending={addCertificateMutation.isPending}
            />

            <ConfirmDeleteDialog
              open={certificateToDelete !== null}
              onOpenChange={(open) => !open && setCertificateToDelete(null)}
              onConfirm={() => deleteCertificateMutation.mutate(certificateToDelete!)}
              title="¿Eliminar certificado?"
              description="Esta acción no se puede deshacer. El certificado será eliminado permanentemente."
            />

            <EditCertificateDialog
              open={certificateToEdit !== null}
              onOpenChange={(open) => !open && setCertificateToEdit(null)}
              certificate={certificateToEdit ? certificates.find(c => c.id === certificateToEdit) ?? null : null}
              onEditCertificate={(data) => updateCertificateMutation.mutate({
                id: certificateToEdit!,
                data: {
                  name: data.name,
                  issuing_organization: data.issuing_organization,
                  issue_date: data.issue_date,
                  expiration_date: data.expiration_date || null,
                  does_not_expire: data.does_not_expire || false,
                  credential_id: data.credential_id || null,
                  credential_url: data.credential_url || null,
                }
              })}
              isPending={updateCertificateMutation.isPending}
            />
          </>
        }

      />
      <LogoutConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
