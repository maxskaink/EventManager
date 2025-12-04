import { Button } from "../../ui/button";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import { getDashboardRouteFromRole } from "../../../services/navigation/redirects";
import type { NavigateFunction } from "react-router";
import { LogoutConfirmDialog } from "../../auth/LogoutConfirmDialog";
import { useAuthStore } from "../../../stores/auth.store";
import { useState } from "react";
import { LogOut } from "lucide-react";

type Props = {
  userRole: string;
  onNavigate: NavigateFunction;
  onCreatePublication?: () => void;
};

export function EventBoardHeader({ userRole, onNavigate, onCreatePublication }: Props) {
  const { logout } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <div className="bg-[#0a2740] px-4 md:px-6 py-4 shadow-sm text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate(getDashboardRouteFromRole(userRole))}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold">Contenido del Semillero</h1>
          <p className="text-xs sm:text-sm text-primary-foreground/80">
            Administra eventos y publicaciones
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={() => onNavigate("/create-event")}
            className="gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto sm:h-9"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Nuevo Evento</span>
            <span className="sm:hidden">Evento</span>
          </Button>
          {onCreatePublication && (
            <Button
              variant="secondary"
              onClick={onCreatePublication}
              className="gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto sm:h-9"
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Crear Publicación</span>
              <span className="sm:hidden">Pub.</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogoutClick}
            className="text-white/80 hover:bg-red-500/20 hover:text-red-200 h-9 w-9"
            title="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <LogoutConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}