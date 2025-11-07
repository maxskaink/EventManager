import {
  LayoutDashboard,
  CalendarDays,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

const BNavBarMentor = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
      <div className="mx-auto flex max-w-4xl justify-around">
        {/* Botón de Dashboard */}
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard-mentor")}
          className="flex h-auto flex-col items-center gap-1 py-2"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-xs">Dashboard</span>
        </Button>

        {/* Botón de Eventos */}
        <Button
          variant="ghost"
          onClick={() => navigate("/events")}
          className="flex h-auto flex-col items-center gap-1 py-2"
        >
          <CalendarDays className="h-5 w-5" />
          <span className="text-xs">Eventos</span>
        </Button>

        {/* Botón de Perfil */}
        <Button
          variant="ghost"
          onClick={() => navigate("/profile")}
          className="flex h-auto flex-col items-center gap-1 py-2"
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Perfil</span>
        </Button>
      </div>
    </div>
  );
};

export { BNavBarMentor };
