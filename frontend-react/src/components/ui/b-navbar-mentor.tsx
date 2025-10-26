import {
  LayoutDashboard,
  CalendarDays,
  User,
  MoreVertical,
  UserCheck,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"; // Asegúrate de que la ruta de importación sea correcta

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

        {/* Menú Desplegable "Más Opciones" */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-auto flex-col items-center gap-1 py-2"
            >
              <MoreVertical className="h-5 w-5" />
              <span className="text-xs">Más</span>
            </Button>
          </DropdownMenuTrigger>
          {/* Posiciona el menú encima del botón */}
          <DropdownMenuContent side="top" align="center" className="mb-2">
            <DropdownMenuItem onClick={() => navigate("/admin")}>
              <UserCheck className="mr-2 h-4 w-4" />
              <span>Administrar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/reports")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Reportes</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export { BNavBarMentor };
