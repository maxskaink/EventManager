import {
  LayoutDashboard,
  CalendarDays,
  User,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ResponsiveBottomNav, type NavItem } from "./responsive-bottom-nav";

const BNavBarMentor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      onClick: () => navigate("/dashboard-mentor"),
      isActive: location.pathname === "/dashboard-mentor",
    },
    {
      icon: CalendarDays,
      label: "Publicaciones",
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

export { BNavBarMentor };
