import type { ReactNode } from "react";

interface ProfileTemplateProps {
  header: ReactNode;
  personalInfo: ReactNode;
  contactInfo: ReactNode;
  participationStats: ReactNode;
  myEvents: ReactNode;
  myArticles: ReactNode;
  recentCertificates: ReactNode;
  settings: ReactNode;
  dialogs: ReactNode; // Para todos los modales
  navbar: ReactNode;
}

export const ProfileTemplate = ({
  header,
  personalInfo,
  contactInfo,
  participationStats,
  myEvents,
  myArticles,
  recentCertificates,
  settings,
  dialogs,
  navbar,
}: ProfileTemplateProps) => (
  <div className="min-h-screen bg-background pb-20">
    {header}
    <main className="mx-auto max-w-4xl space-y-6 p-4">
      <section>{personalInfo}</section>
      <section>{contactInfo}</section>
      {participationStats}
      {myEvents}
      {myArticles}
      {recentCertificates}
      <section>{settings}</section>
    </main>
    {dialogs}
    {navbar}
  </div>
);
