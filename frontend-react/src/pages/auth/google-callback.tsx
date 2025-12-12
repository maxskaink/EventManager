import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { AuthAPI } from '../../services/api';
import { initializeCsrf } from '../../services/api/axios-instance';
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
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const USED_CODE_KEY = 'oauth_code_used';

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

      // Evitar reutilizar el mismo código si el usuario recarga o vuelve a esta URL
      const lastUsed = sessionStorage.getItem(USED_CODE_KEY);
      if (lastUsed === code) {
        setError({ message: 'Este enlace de autenticación ya fue procesado. Vuelve al inicio e intenta de nuevo.' });
        setLoading(false);
        return;
      }

      if (isCancelled) return;

      try {
        // Asegurar cookie CSRF antes del POST para evitar 419 y reintentos duplicados
        await initializeCsrf();

        const res = await AuthAPI.googleCallback({ code });

        if (isCancelled) return;

        if (!res.user || !res.access_token) {
          setError({ message: 'Respuesta incompleta del servidor' });
          setLoading(false);
          // Marcar código como usado para evitar reposts con el mismo code
          sessionStorage.setItem(USED_CODE_KEY, code);
          return;
        }

        login(res.user, res.access_token);
        // Guardar el code como usado (previene reintentos accidentales por recarga)
        sessionStorage.setItem(USED_CODE_KEY, code);
        setLoading(false);
      } catch (err) {
        if (isCancelled) return;
        let errorMessage = 'Ocurrió un error desconocido';
        let details: string | undefined;
        if (err instanceof AxiosError) {
          const data = err.response?.data as Record<string, unknown> | undefined;
          // Priorizar claves estándar y luego 'error' (asegurando que sea string)
          const rawMessage = data?.message ?? data?.error ?? err.message;
          if (typeof rawMessage === 'string') {
            errorMessage = rawMessage;
          } else if (rawMessage !== undefined) {
            try {
              errorMessage = JSON.stringify(rawMessage);
            } catch {
              errorMessage = String(rawMessage);
            }
          } else {
            errorMessage = err.message;
          }
          details = data ? JSON.stringify(data) : undefined;
          // Si fue timeout o network y aún no reintentamos, reintentar una vez
          if ((err.code === 'ECONNABORTED' || err.message.includes('Network')) && attempt < 1) {
            setAttempt(a => a + 1);
            setTimeout(() => {
              if (!isCancelled) callCallback();
            }, 600); // breve backoff
            return; // No marcar error todavía
          }
          // Mensaje más claro para invalid_grant
          if (errorMessage === 'invalid_grant') {
            errorMessage = 'Código OAuth inválido o expirado. Intenta iniciar sesión nuevamente.';
          }
          // Para cualquier error no recuperable, marcar el code como usado
          sessionStorage.setItem(USED_CODE_KEY, code);
        } else if (err instanceof Error) {
          errorMessage = err.message;
          sessionStorage.setItem(USED_CODE_KEY, code);
        }
        setError({ message: errorMessage, details });
        setLoading(false);
      }
    }

  callCallback();

    return () => {
      isCancelled = true;
    };
  }, [params, login, attempt]);

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