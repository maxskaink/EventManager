import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react'; // Asumo que se usan iconos Lucide o similar
import { Button } from '../components/ui/button';

// --- CONSTANTES DE ESTILO ---
const PRIMARY_COLOR = '#013950'; // Azul Oscuro
const SECONDARY_COLOR = '#f6f6f6'; // Gris Claro/Fondo
// ---------------------------

interface ErrorDetails {
  title: string;
  message: string;
  statusCode: number;
  statusText: string;
}

/**
 * Componente de página de error que actúa como ErrorElement para React Router v6.
 * Muestra una vista completa y profesional en caso de fallo de navegación o renderizado.
 */
export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const isRouterError = isRouteErrorResponse(error);
  
  // 1. Lógica para determinar el tipo de error y los mensajes a mostrar
  const errorInfo: ErrorDetails = {
    title: 'Ha ocurrido un error inesperado',
    message: 'Lamentamos el inconveniente. Por favor, intenta regresar a la página de inicio. Si el problema persiste, contacta al soporte técnico.',
    statusCode: 500,
    statusText: 'Error Desconocido',
  };

  if (isRouterError) {
    errorInfo.statusCode = error.status;
    errorInfo.statusText = error.statusText || 'Error de Ruta';

    switch (errorInfo.statusCode) {
      case 404:
        errorInfo.title = 'Página No Encontrada (404)';
        errorInfo.message = 'La URL a la que intentas acceder no existe. Verifica la dirección o usa el botón de abajo para navegar.';
        break;
      case 401:
        errorInfo.title = 'Acceso No Autorizado (401)';
        errorInfo.message = 'No tienes permisos para ver este contenido. Por favor, inicia sesión con una cuenta autorizada.';
        break;
      default:
        // Intenta obtener el mensaje de error de la respuesta si está disponible
        { const dataMessage = typeof error.data === 'object' && error.data !== null ? (error.data as { message?: string })?.message : String(error.data);
        errorInfo.title = `Error de Enrutamiento (${errorInfo.statusCode})`;
        errorInfo.message = dataMessage || errorInfo.message;
        break; }
    }
  } else if (error instanceof Error) {
    errorInfo.title = 'Error de Renderizado en la Aplicación';
    errorInfo.message = error.message;
  }
  
  // 2. Estructura y Estilo
  return (
    <div
      style={{ backgroundColor: SECONDARY_COLOR }}
      className="flex flex-col items-center justify-center min-h-screen p-8 text-center font-sans"
    >
      <div className="max-w-xl space-y-8 p-10 rounded-lg shadow-xl" style={{ backgroundColor: 'white', color: PRIMARY_COLOR }}>
        
        {/* Icono de Alerta */}
        <TriangleAlert size={64} style={{ color: PRIMARY_COLOR }} className="mx-auto" />

        {/* Código de Estado/Error */}
        <h1
          style={{ color: PRIMARY_COLOR }}
          className="text-7xl font-extrabold tracking-tight"
        >
          {errorInfo.statusCode}
        </h1>

        {/* Título Principal */}
        <h2
          style={{ color: PRIMARY_COLOR }}
          className="text-3xl font-bold"
        >
          {errorInfo.title}
        </h2>

        {/* Mensaje Descriptivo */}
        <p className="text-gray-700 text-lg">
          {errorInfo.message}
        </p>

        {/* Botón de Navegación */}
        <Link to="/" replace>
          {/* El botón usa el color primario como fondo y el secundario como texto */}
          <Button
            style={{ backgroundColor: PRIMARY_COLOR, color: SECONDARY_COLOR }}
            className="mt-4 shadow-md transition-shadow duration-300 hover:shadow-lg"
            size="lg"
          >
            Volver a la Página de Inicio
          </Button>
        </Link>

        {/* Detalles Técnicos (Opcional: para desarrolladores) */}
        {import.meta.env.DEV && ( // Mostrar detalles solo en modo de desarrollo
            <details className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500 cursor-pointer text-left">
                <summary className="font-medium hover:text-gray-600 transition-colors">Detalles Técnicos (Debug)</summary>
                <pre className="mt-4 p-4 rounded-md overflow-x-auto" style={{ backgroundColor: SECONDARY_COLOR, color: PRIMARY_COLOR, border: `1px solid ${PRIMARY_COLOR}20` }}>
                    {isRouterError ? JSON.stringify(error, null, 2) : error instanceof Error ? error.stack : String(error)}
                </pre>
            </details>
        )}
      </div>
    </div>
  );
};