import type { ReactNode } from "react";

interface ProfileTemplateProps {
  header: ReactNode;
  personalInfo: ReactNode;
  contactInfo: ReactNode;
  participationStats: ReactNode;
  myExternalEvents: ReactNode;
  myCertificates: ReactNode;
  myArticles: ReactNode;
  recentCertificates: ReactNode;
  settings: ReactNode;
  dialogs: ReactNode; // Para todos los modales
}

export const ProfileTemplate = ({
  header,
  personalInfo,
  contactInfo,
  participationStats,
  myExternalEvents,
  myCertificates,
  myArticles,
  recentCertificates,
  settings,
  dialogs,
}: ProfileTemplateProps) => (
  <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] via-[#eef2f7] to-[#dde3eb]">
    {header}
    <main className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-4 md:p-6">
        <section className="space-y-6">
          {personalInfo}
          <div className="border-t border-gray-200 my-6" />
          {contactInfo}
          <div className="border-t border-gray-200 my-6" />
          {participationStats}
          <div className="border-t border-gray-200 my-6" />
          {myExternalEvents}
          <div className="border-t border-gray-200 my-6" />
          {myCertificates}
          <div className="border-t border-gray-200 my-6" />
          {myArticles}
          <div className="border-t border-gray-200 my-6" />
          {recentCertificates}
          <div className="border-t border-gray-200 my-6" />
          {settings}
        </section>
      </div>
    </main>
    {dialogs}
  </div>
);
