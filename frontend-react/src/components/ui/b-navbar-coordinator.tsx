import {
  User,
  BarChart,
  MessageSquare,
  CalendarDays,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { ResponsiveBottomNav, type NavItem } from "./responsive-bottom-nav";

const BNavBarCoordinator = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      onClick: () => navigate("/dashboard-coordinator"),
      isActive: location.pathname === "/dashboard-coordinator",
    },
    {
      icon: CalendarDays,
      label: "Eventos",
      onClick: () => navigate("/events"),
      isActive: location.pathname === "/events",
    },
    {
      icon: MessageSquare,
      label: "Publicaciones",
      onClick: () => navigate("/event-board"),
      isActive: location.pathname === "/event-board",
    },
    {
      icon: BarChart,
      label: "Reportes",
      onClick: () => navigate("/reports"),
      isActive: location.pathname === "/reports",
    },
    {
      icon: Users,
      label: "Usuarios",
      onClick: () => navigate("/users"),
      isActive: location.pathname === "/users",
    },
    {
      icon: User,
      label: "Perfil",
      onClick: () => navigate("/profile"),
      isActive: location.pathname === "/profile",
    },
  ];

  return <ResponsiveBottomNav items={navItems} />;
};

export { BNavBarCoordinator };
