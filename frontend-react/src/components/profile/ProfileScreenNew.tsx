// Todos los imports necesarios (useState, hooks, stores, etc.)
import { useState } from "react";
import { useAuthStore } from "../../stores/auth.store";
import { useApp } from "../context/AppContext";
import useLogout from "../../hooks/useLogout";
import useGoToDashboard from "../../hooks/useGoToDashboard";

// Importaciones de la nueva estructura
import { ProfileTemplate } from "./templates/profile-template";
import { ProfileHeader } from "./atoms/profile-header";
import { PersonalInfoCard } from "./molecules/personal-info-card";
import { ContactInfoCard } from "./molecules/contact-info-card";
import { ParticipationStats } from "./organisms/participation-stats";
// ... otros componentes de organismos y dialogs que necesitarías crear ...
import BottomNavbarWrapper from "../nav/BottomNavbarWrapper";
import { getDashboardRouteFromRole } from "../../services/navigation/redirects";
import { MyEventsSection } from "./organisms/my-events-section";
import { MyArticlesSection } from "./organisms/my-articles-sectiont";
import { SettingsSection } from "./organisms/settings-section";
import { useQuery } from "@tanstack/react-query"
import { ProfileAPI } from "../../services/api";

const formatDate = (date: string) => date;

export function ProfileScreen() {
  const { certificates, events, articles, userEventParticipations } = useApp();
  const user = useAuthStore((s) => s.user);

  const role = user?.role ?? "";
  const { logout } = useLogout();
  const goToDashboard = useGoToDashboard();

  const profile_query = useQuery({
    queryFn: ProfileAPI.getProfile,
  })

  // ... (toda la lógica de estado: isEditing, dialogs, handlers, etc.)

  const [contactInfo, setContactInfo] = useState({
    /* ... */
  });

  if (!user) return null;

  const getRoleLabel = (role: string) => {
    const roles = {
      mentor: "Mentor",
      interested: "Interesado",
      coordinator: "Coordinador",
      member: "Miembro",
    } as Record<string, string>
    return roles[role] ?? "ERR: Role no definido"
  };

  const handleLogout = () =>
    logout().then((success) => {
      if (success) {
        goToDashboard();
      }
    });

  const userCertificatesCount = certificates.filter((cert) => cert.userId === user?.id).length;
  const userArticlesCount = articles.filter((article) => article.userId === user?.id).length;
  const userParticipationsCount = userEventParticipations.filter((p) => p.userId === user?.id).length;

  return (
    <ProfileTemplate
      header={<ProfileHeader backViewUrl={getDashboardRouteFromRole(role)} />}
      personalInfo={
        <PersonalInfoCard
          user={{
            ...user,
            interests: ["no definidos aun"],
          }}
          role={role}
          getRoleLabel={getRoleLabel}
        />
      }
      contactInfo={
        <ContactInfoCard
          contactInfo={contactInfo}
          email={user.email}
          onEdit={() => {
            /* Lógica para abrir dialog */
          }}
        />
      }
      participationStats={
        <ParticipationStats
          eventsCount={userParticipationsCount}
          certificatesCount={userCertificatesCount}
          articlesCount={userArticlesCount}
        />
      }
      // Aquí iría el organismo <MyEventsSection /> que contendría la lógica de esa sección
      myEvents={
        <MyEventsSection
          participatedEvents={[]}
          userParticipations={[]}
          onAddEvent={() => {}}
          onDeleteParticipation={() => {}}
          formatDate={formatDate}
        />
      }
      //Aquí iría el organismo <MyArticlesSection />
      myArticles={
        <MyArticlesSection articles={[]} onAddArticle={() => {}} onDeleteArticle={() => {}} formatDate={formatDate} />
      }
      // Aquí iría el organismo <RecentCertificatesSection />
      recentCertificates={null}
      // Aquí iría el organismo <SettingsSection /> con el botón de logout
      settings={<SettingsSection onLogout={handleLogout} />}
      // Aquí renderizarías todos los Dialogs y AlertDialogs
      dialogs={<></>}
      navbar={<BottomNavbarWrapper role={role} />}
    />
  );
}
