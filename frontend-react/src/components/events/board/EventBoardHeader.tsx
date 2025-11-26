import { Button } from "../../ui/button";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import { getDashboardRouteFromRole } from "../../../services/navigation/redirects";
import type { NavigateFunction } from "react-router";

type Props = {
  userRole: string;
  onNavigate: NavigateFunction;
  onCreatePublication?: () => void;
};

export function EventBoardHeader({ userRole, onNavigate, onCreatePublication }: Props) {
  return (
    <div className="bg-[#0a2740] p-4 shadow-sm text-white">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate(getDashboardRouteFromRole(userRole))}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1>Contenido del Semillero</h1>
          <p className="text-primary-foreground/80">
            Administra eventos y publicaciones
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => onNavigate("/create-event")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nuevo Evento
          </Button>
          {onCreatePublication && (
            <Button
              variant="secondary"
              onClick={onCreatePublication}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Crear Publicación
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}