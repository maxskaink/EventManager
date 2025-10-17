import { Button } from "./button";
import { useApp } from "../AppContext";
import {
  CalendarDays,
  User,
  BarChart3,
  UserCheck,
  LayoutDashboard,
  LogOut,
  Home,
} from "lucide-react";

const BNavBarGuest = () => {
  const { setCurrentView } = useApp();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      <div className="max-w-4xl mx-auto flex justify-around">
        <Button
          variant="ghost"
          onClick={() => setCurrentView("dashboard-guest")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Inicio</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setCurrentView("events")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <CalendarDays className="h-5 w-5" />
          <span className="text-xs">Eventos</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => setCurrentView("login")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Iniciar sesión</span>
        </Button>
      </div>
    </div>
  );
};

export { BNavBarGuest };