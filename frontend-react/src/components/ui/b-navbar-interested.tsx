import { Button } from "./button";
import {
  CalendarDays,
  User,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../stores/auth.store";

const BNavBarInterested = () => {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      <div className="max-w-4xl mx-auto flex justify-around">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard-guest")}
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
          onClick={() => navigate(isAuthenticated ? "/login" : "/profile")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <User className="h-5 w-5" />
          <span className="text-xs">
            {isAuthenticated ?
              "Perfil" :
              "Iniciar sesión"
            }
          </span>
        </Button>
      </div>
    </div>
  );
};

export { BNavBarInterested };
