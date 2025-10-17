import React from "react";
import { AppProvider, useApp } from "./components/AppContext";
import { LoginScreen } from "./components/auth/LoginScreen";
import { RegisterScreen } from "./components/auth/RegisterScreen";
import { GuestDashboard } from "./components/dashboard/GuestDashboard";
import { MemberDashboard } from "./components/dashboard/MemberDashboard";
import { CoordinatorDashboard } from "./components/dashboard/CoordinatorDashboard";
import { MentorDashboard } from "./components/dashboard/MentorDashboard";
import { EventsScreen } from "./components/events/EventsScreen";
import { EventDetailScreen } from "./components/events/EventDetailScreen";
import { EventBoardScreen } from "./components/events/EventBoardScreen";
import { ProfileScreen } from "./components/profile/ProfileScreen";
import { ReportsScreen } from "./components/reports/ReportsScreen";
import { PublicationsScreen } from "./components/publications/PublicationsScreen";
import { CreatePublicationScreen } from "./components/publications/CreatePublicationScreen";
import { CertificatesScreen } from "./components/certificates/CertificatesScreen";
import { Toaster } from "./components/ui/sonner";

function AppContent() {
  const { currentView, setCurrentView, user } = useApp();

  // Handle event detail views
  if (currentView.startsWith("event-detail-")) {
    const eventId = currentView.replace("event-detail-", "");
    return <EventDetailScreen eventId={eventId} />;
  }

  switch (currentView) {
    case "login":
      return <LoginScreen />;
    case "register":
      return <RegisterScreen />;
    case "dashboard-guest":
      return <GuestDashboard />;
    case "dashboard-member":
      return <MemberDashboard />;
    case "dashboard-coordinator":
      return <CoordinatorDashboard />;
    case "dashboard-mentor":
      return <MentorDashboard />;
    case "events":
      return <EventsScreen />;
    case "event-board":
      return <EventBoardScreen />;
    case "reports":
      return <ReportsScreen />;
    case "publications":
      return <PublicationsScreen />;
    case "create-publication":
      return <CreatePublicationScreen />;
    case "profile":
      return <ProfileScreen />;
    case "certificates":
      return <CertificatesScreen />;
    case "notifications":
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="mb-4">Notificaciones</h2>
            <p className="text-muted-foreground mb-4">
              La sección de notificaciones estará disponible
              próximamente.
            </p>
            <button
              onClick={() => {
                const dashboardView =
                  user?.role === "guest"
                    ? "dashboard-guest"
                    : user?.role === "coordinator"
                      ? "dashboard-coordinator"
                      : user?.role === "mentor"
                        ? "dashboard-mentor"
                        : "dashboard-member";
                setCurrentView(dashboardView);
              }}
              className="text-primary hover:underline"
            >
              Volver al dashboard
            </button>
          </div>
        </div>
      );
    case "create-event":
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="mb-4">Crear Evento</h2>
            <p className="text-muted-foreground mb-4">
              La funcionalidad de crear eventos estará
              disponible próximamente.
            </p>
            <button
              onClick={() => {
                const dashboardView =
                  user?.role === "mentor"
                    ? "dashboard-mentor"
                    : "dashboard-coordinator";
                setCurrentView(dashboardView);
              }}
              className="text-primary hover:underline"
            >
              Volver al dashboard
            </button>
          </div>
        </div>
      );
    case "admin":
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="mb-4">Panel de Administración</h2>
            <p className="text-muted-foreground mb-4">
              El panel de administración estará disponible
              próximamente. Incluirá gráficos de asistencia,
              exportación de datos y gestión de integrantes.
            </p>
            <button
              onClick={() => {
                const dashboardView =
                  user?.role === "mentor"
                    ? "dashboard-mentor"
                    : "dashboard-coordinator";
                setCurrentView(dashboardView);
              }}
              className="text-primary hover:underline"
            >
              Volver al dashboard
            </button>
          </div>
        </div>
      );
    case "forgot-password":
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="mb-4">Recuperar Contraseña</h2>
            <p className="text-muted-foreground mb-4">
              Esta funcionalidad estará disponible próximamente.
            </p>
            <button
              onClick={() => setCurrentView("login")}
              className="text-primary hover:underline"
            >
              Volver al login
            </button>
          </div>
        </div>
      );
    default:
      return <LoginScreen />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <AppContent />
        <Toaster />
      </div>
    </AppProvider>
  );
}