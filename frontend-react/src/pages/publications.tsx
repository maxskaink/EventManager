import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "../stores/auth.store";
import { getDashboardRouteFromRole } from "../services/navigation/redirects";
import { PublicationAPI } from "../services/api"; // Asumiendo que existe
import BottomNavbarWrapper from "../components/nav/BottomNavbarWrapper";

import { PublicationList, PublicationLoading, PublicationEmpty } from "../components/publications";

// Clave de la query para react-query
const PUBLICATIONS_QUERY_KEY = ["publications"];

// Hook para obtener las publicaciones
function usePublications() {
  return useQuery<API.Publication[], Error>({
    queryKey: PUBLICATIONS_QUERY_KEY,
    queryFn: PublicationAPI.listAllPublications, // Asumiendo que esta función existe
    // staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
}

export function PublicationsScreen() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? "";
  const navigate = useNavigate();

  const { data: publications, isLoading, isError } = usePublications();

  const normalizedRole = React.useMemo(() => {
    if (role === "active-member" || role === "seed") {
      return "member";
    }
    return role;
  }, [role]);

  const dashboardRoute = React.useMemo(() => getDashboardRouteFromRole(normalizedRole), [normalizedRole]);

  const renderContent = () => {
    if (isLoading) {
      return <PublicationLoading />;
    }

    if (isError) {
      return <p className="text-center text-destructive">Error al cargar las publicaciones.</p>;
    }

    if (!publications || publications.length === 0) {
      return <PublicationEmpty />;
    }

    return <PublicationList publications={publications} />;
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Reutilizamos el header de Eventos, solo cambiamos el título */}

      <div className="bg-[#0a2740] p-4 shadow-sm text-white">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            data-slot="button"
            type="button"
            onClick={() => navigate(dashboardRoute)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 rounded-md text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-[20px] leading-9 font-semibold tracking-tight">Publicaciones</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Aquí irían filtros si los tuvieras, ej: SearchBar, Tabs */}
        {renderContent()}
      </div>

      <BottomNavbarWrapper role={role} />
    </div>
  );
}
