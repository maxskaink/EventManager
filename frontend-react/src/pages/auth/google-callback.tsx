import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { AuthAPI } from '../../services/api';
import { useAuthStore } from '../../stores/auth.store';
import DashboardRedirect from '../../components/nav/DashboardRedirect';

// Importar los nuevos componentes de UI
import { GoogleCallbackLoading } from '../../components/google-callback/GoogleCallbackLoading';
import { GoogleCallbackError } from '../../components/google-callback/GoogleCallbackError';
import { GoogleCallbackUnexpected } from '../../components/google-callback/GoogleCallbackUnexpected';

// NOTA: No se importa ningún archivo .css en este componente

/**
 * Componente de página (contenedor) que maneja la lógica
 * del callback de autenticación de Google.
 */
function GoogleCallbackScreen() {
  const [params] = useSearchParams();

  // Suscripción al store de Zustand
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  // Estado local del componente
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string } | null>(null);

  // Efecto para procesar el callback
  useEffect(() => {
    let isCancelled = false;

    async function callCallback() {
      const code = params.get('code') ?? '';

      if (!code) {
        setError({ message: 'No se recibió código de autorización de Google' });
        setLoading(false);
        return;
      }

      if (isCancelled) return;

      try {
        const res = await AuthAPI.googleCallback({ code });

        if (isCancelled) return;

        if (!res.user || !res.access_token) {
          setError({ message: 'Respuesta incompleta del servidor' });
          setLoading(false);
          return;
        }

        login(res.user, res.access_token);
        setLoading(false);
      } catch (err) {
        if (isCancelled) return;

        // Mejorar la extracción del mensaje de error
        let errorMessage = 'Ocurrió un error desconocido';
        if (err instanceof AxiosError && err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError({ message: errorMessage });
        setLoading(false);
      }
    }

    callCallback();

    return () => {
      isCancelled = true;
    };
  }, [params, login]);

  // Renderizado condicional basado en el estado
  
  if (loading) {
    return <GoogleCallbackLoading />;
  }

  if (isAuthenticated && user) {
    return <DashboardRedirect />;
  }

  if (error) {
    return <GoogleCallbackError error={error} />;
  }

  // Fallback (Estado inesperado)
  return <GoogleCallbackUnexpected />;
}

export default GoogleCallbackScreen;