import { Button } from "./button";
import {
  Award,
  Home,
  CalendarDays,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";

const BNavBarInterested = () => {
  const navigate = useNavigate()
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      <div className="max-w-4xl mx-auto flex justify-around">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard-member")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Inicio</span>
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
          onClick={() => navigate("/certificates")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <Award className="h-5 w-5" />
          <span className="text-xs">Certificados</span>
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

export { BNavBarInterested };
