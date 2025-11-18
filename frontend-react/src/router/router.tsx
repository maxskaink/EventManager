import { createBrowserRouter, Navigate } from "react-router";

import { LoginScreen } from "../components/auth/LoginScreen";
import { RegisterScreen } from "../components/auth/RegisterScreen";
import ForgotPasswordPage from "../pages/forgot-password";
import { GuestDashboard } from "../pages/dashboard/guest-dashboard";
import { MemberDashboard } from "../pages/dashboard/member-dashboard";
import { CoordinatorDashboardPage } from "../pages/dashboard/coordinator-dashboard";
import { MentorDashboardPage } from "../pages/dashboard/mentor-dashboard";
import { EventsScreen } from "../pages/events";
import { EventBoardScreen } from "../pages/admin/event-board";
import { ReportsScreen } from "../components/reports/ReportsScreen";
import { PublicationsScreen } from "../components/publications/PublicationsScreen";
import { CreateArticleScreen } from "../components/publications/CreatePublicationScreen";
import { ProfileScreen } from "../components/profile/ProfileScreen";
import { CertificatesScreen } from "../components/certificates/CertificatesScreen";
import NotificationsPage from "../pages/notifications";
import CreateEventPage from "../pages/admin/create-event";
import { RootLayout } from "../components/nav/RootLayout";
import GoogleCallbackScreen from "../pages/auth/google-callback";
import DashboardRedirect from "../components/nav/DashboardRedirect";
import EventDetailWrapper from "../components/nav/EventDetailWrapper";
import { authMiddleware } from "./middlewares/auth.middleware";
import { timingMiddleware } from "./middlewares/timing.middleware";
import NotFoundPage from "../pages/not-found-page";

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
          { path: "dashboard-coordinator", element: <CoordinatorDashboardPage /> },
          { path: "dashboard-mentor", element: <MentorDashboardPage /> },

          // Others
          { path: "reports", element: <ReportsScreen /> },
          { path: "publications", element: <PublicationsScreen /> },
          { path: "create-article", element: <CreateArticleScreen /> },
          { path: "profile", element: <ProfileScreen /> },
          { path: "certificates", element: <CertificatesScreen /> },
          { path: "notifications", element: <NotificationsPage /> },
          { path: "create-event", element: <CreateEventPage /> },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
