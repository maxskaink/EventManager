import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth.store';
import { getDashboardRouteFromRole } from '../services/navigation/redirects';
import { PublicationAPI } from '../services/api'; // Asumiendo que existe
import BottomNavbarWrapper from '../components/nav/BottomNavbarWrapper';

import {
  PublicationList,
  PublicationLoading,
  PublicationEmpty,
} from '../components/publications';

// Clave de la query para react-query
const PUBLICATIONS_QUERY_KEY = ['publications'];

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
  const role = user?.role ?? '';
  const navigate = useNavigate();
  
  const { 
    data: publications, 
    isLoading, 
    isError 
  } = usePublications();

  const dashboardRoute = React.useMemo(
    () => '/' + getDashboardRouteFromRole(role),
    [role],
  );

  const renderContent = () => {
    if (isLoading) {
      return <PublicationLoading />;
    }

    if (isError) {
      return (
        <p className="text-center text-destructive">
          Error al cargar las publicaciones.
        </p>
      );
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
            onClick={() => navigate(dashboardRoute)}
            className="text-white/80 hover:text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95"
          >
            <svg /* Icono de ArrowLeft */ width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86461 3.84188L5.43521 7.50005L8.86461 11.1582C9.05348 11.3597 9.04327 11.6761 8.84182 11.865C8.64036 12.0538 8.32394 12.0436 8.13508 11.8421L4.38508 7.84214C4.20467 7.65074 4.20467 7.34935 4.38508 7.15795L8.13508 3.15795C8.32394 2.95649 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </button>
          <h1>Publicaciones</h1>
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