import { createBrowserRouter, Navigate } from "react-router";

import { LoginScreen } from "../components/auth/LoginScreen";
import { RegisterScreen } from "../components/auth/RegisterScreen";
import ForgotPasswordPage from "../pages/forgot-password";
import { GuestDashboard } from "../pages/dashboard/guest-dashboard";
import { MemberDashboard } from "../pages/dashboard/member-dashboard";
import { CoordinatorDashboardPage } from "../pages/dashboard/coordinator-dashboard";
import { MentorDashboardPage } from "../pages/dashboard/mentor-dashboard";

import { EventBoardScreen } from "../pages/admin/event-board";
import { CreatePublicationPage } from "../pages/admin/create-publication";
import { ReportsScreen } from "../components/reports/ReportsScreen";

import { PublicationsScreen } from "../pages/publications";
import CertificatesPage from "../pages/certificates";
import PublicationDetailPage from "../pages/publications/[publicationId]";
import { CreateArticleScreen } from "../components/publications/CreatePublicationScreen";
import { ProfileScreen } from "../pages/profile";
import NotificationsPage from "../pages/notifications";
import CreateEventPage from "../pages/admin/create-event";
import TrustedOrganizationsPage from "../pages/admin/trusted-organizations";
import { UserSearchScreen } from "../pages/users";
import { UserDetailScreen } from "../pages/users/[userId]";
import { RootLayout } from "../components/nav/RootLayout";
import { MainLayout } from "../components/layout/MainLayout";
import GoogleCallbackScreen from "../pages/auth/google-callback";
import DashboardRedirect from "../components/nav/DashboardRedirect";
import { authMiddleware } from "./middlewares/auth.middleware";
import { timingMiddleware } from "./middlewares/timing.middleware";
import NotFoundPage from "../pages/not-found-page";
import { ErrorPage } from "../pages/error-page";


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
      //{ path: "events", element: <EventsScreen /> },
      //{ path: "events/:eventId", element: <EventDetailWrapper /> },
      { path: "event-board", element: <EventBoardScreen /> },

      // If user state is needed to choose a dashboard, use special redirect
      { path: "dashboard", element: <DashboardRedirect /> },
      { path: "auth/google/callback", element: <GoogleCallbackScreen /> },
      { path: "dashboard-guest", element: <GuestDashboard /> },

      { path: "publications/:publicationId", element: <PublicationDetailPage /> },
      { path: "publications", element: <PublicationsScreen /> },
      
      // Autenticated
      {
        middleware: [authMiddleware],
        children: [
          // Layout Wrapper for pages with BottomNav
          {
            element: <MainLayout />,
            children: [
              // Dashboards
              { path: "dashboard-interested", element: <GuestDashboard /> },
              { path: "dashboard-member", element: <MemberDashboard /> },
              { path: "dashboard-coordinator", element: <CoordinatorDashboardPage /> },
              { path: "dashboard-mentor", element: <MentorDashboardPage /> },

              // Others
              { path: "reports", element: <ReportsScreen /> },
              
              { path: "create-article", element: <CreateArticleScreen /> },
              { path: "profile", element: <ProfileScreen /> },
              { path: "certificates", element: <CertificatesPage /> },
              { path: "notifications", element: <NotificationsPage /> },
              { path: "users", element: <UserSearchScreen /> },
              { path: "users/:userId", element: <UserDetailScreen /> },
              // Create Event usually has its own header but we can wrap it too if we want the bottom nav
              // The user asked to unify headers, so let's wrap it and handle the header inside
              { path: "create-event", element: <CreateEventPage /> },
              { path: "create-publication", element: <CreatePublicationPage /> },
              { path: "trusted-organizations", element: <TrustedOrganizationsPage /> },
            ]
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
    errorElement: <ErrorPage />

  },
]);
