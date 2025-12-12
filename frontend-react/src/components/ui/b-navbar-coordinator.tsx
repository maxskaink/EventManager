import {
  User,
  MessageSquare,
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
      icon: MessageSquare,
      label: "Anuncios",
      onClick: () => navigate("/publications"),
      isActive: location.pathname === "/publications",
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
