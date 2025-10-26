import { createBrowserRouter, Navigate } from "react-router";

import { LoginScreen } from "../components/auth/LoginScreen";
import { RegisterScreen } from "../components/auth/RegisterScreen";
import ForgotPasswordPage from "../pages/forgot-passoword";
import { GuestDashboard } from "../components/dashboard/GuestDashboard";
import { MemberDashboard } from "../components/dashboard/MemberDashboard";
import { CoordinatorDashboard } from "../components/dashboard/CoordinatorDashboard";
import { MentorDashboard } from "../components/dashboard/MentorDashboard";
import { EventsScreen } from "../components/events/EventsScreen";
import { EventBoardScreen } from "../components/events/EventBoardScreen";
import { ReportsScreen } from "../components/reports/ReportsScreen";
import { PublicationsScreen } from "../components/publications/PublicationsScreen";
import { CreatePublicationScreen } from "../components/publications/CreatePublicationScreen";
import { ProfileScreen } from "../components/profile/ProfileScreenNew";
import { CertificatesScreen } from "../components/certificates/CertificatesScreen";
import NotificationsPage from "../pages/notifications";
import CreateEventPage from "../pages/create-event";
import AdminPage from "../pages/admin";
import { RootLayout } from "../components/nav/RootLayout";
import GoogleCallbackScreen from "../pages/auth/google-callback";
import DashboardRedirect from "../components/nav/DashboardRedirect";
import EventDetailWrapper from "../components/nav/EventDetailWrapper";
import { authMiddleware } from "./middlewares/auth.middleware";
import { timingMiddleware } from "./middlewares/timing.middleware";

// Create the data router and export it for main.tsx to mount
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    middleware: [timingMiddleware],
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "login", element: <LoginScreen /> },
      { path: "register", element: <RegisterScreen /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },

      // Dashboards
      { path: "dashboard-guest", element: <GuestDashboard /> },

      // Events
      { path: "events", element: <EventsScreen /> },
      { path: "events/:eventId", element: <EventDetailWrapper /> },
      { path: "event-board", element: <EventBoardScreen /> },

      // If user state is needed to choose a dashboard, use special redirect
      { path: "dashboard", element: <DashboardRedirect /> },
      { path: "auth/google/callback", element: <GoogleCallbackScreen /> },

      // Autenticated
      {
        middleware: [authMiddleware],
        children: [
          // Dashboards
          { path: "dashboard-interested", element: <GuestDashboard /> },
          { path: "dashboard-member", element: <MemberDashboard /> },
          { path: "dashboard-coordinator", element: <CoordinatorDashboard /> },
          { path: "dashboard-mentor", element: <MentorDashboard /> },

          // Others
          { path: "reports", element: <ReportsScreen /> },
          { path: "publications", element: <PublicationsScreen /> },
          { path: "create-publication", element: <CreatePublicationScreen /> },
          { path: "profile", element: <ProfileScreen /> },
          { path: "certificates", element: <CertificatesScreen /> },
          { path: "notifications", element: <NotificationsPage /> },
          { path: "create-event", element: <CreateEventPage /> },
          { path: "admin", element: <AdminPage /> },
        ],
      },


    ],
  },
]);
