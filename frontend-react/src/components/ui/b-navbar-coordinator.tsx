import { Button } from "./button";
import {
  User,
  BarChart,
  MessageSquare,
  CalendarDays,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router";

const BNavBarCoordinator = () => {
  const navigate = useNavigate()
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      <div className="max-w-4xl mx-auto flex justify-around">
        <Button
          variant="ghost"
          onClick={() =>
            navigate("/dashboard-coordinator")
          }
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-xs">Dashboard</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/events")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <CalendarDays className="h-5 w-5" />
          <span className="text-xs">Eventos</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/publications")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs">Publicaciones</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/reports")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <BarChart className="h-5 w-5" />
          <span className="text-xs">Reportes</span>
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Perfil</span>
        </Button>
      </div>
    </div>
  );
};

export { BNavBarCoordinator };
