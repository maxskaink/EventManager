import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthAPI, UserAPI } from "../../services/api";
import { useAuthStore } from "../../stores/auth.store";
import DashboardRedirect from "../../components/nav/DashboardRedirect";

function GoogleCallbackScreen() {
  const [params] = useSearchParams();

  // Suscribirse a los cambios del store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  // On page load, we take "search" parameters
  // and proxy them to /api/auth/callback on our Laravel API
  useEffect(() => {
    let isCancelled = false;
    
    async function callCallback() {
      const code = params.get("code") ?? "";
      
      if (!code) {
        setError({ message: "No se recibió código de autorización de Google" });
        setLoading(false);
        return;
      }

      if (isCancelled) return;

      try {
        const res = await AuthAPI.googleCallback({ code });
        
        if (isCancelled) return;
        
        if (!res.user || !res.access_token) {
          setError({ message: "Respuesta incompleta del servidor" });
          setLoading(false);
          return;
        }
        
        login(res.user, res.access_token);
        setLoading(false);
      } catch (err) {
        if (isCancelled) return;
        
        setError(err instanceof AxiosError ? err.response?.data : err);
        setLoading(false);
      }
    }
    
    callCallback();
    
    return () => {
      isCancelled = true;
    };
  }, [params]); // Removido authStore de las dependencias

  // Remover este useEffect que causa conflicto
  // El usuario ya viene del backend en el callback

  if (loading) {
    return <DisplayLoading />;
  }

  if (isAuthenticated && user) {
    return <DashboardRedirect/>
  }

  if (error) {
    return (
      <div>
        <h1>Error en la autenticación</h1>
        <DisplayData error={error} user={user} />
      </div>
    );
  }

  return (
    <div>
      <h1>Procesando autenticación...</h1>
      <DisplayData error={error} user={user} />
    </div>
  );
}

function DisplayLoading() {
  return <div>Loading....</div>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DisplayData({ data, error, user }: { data?: any; error?: any; user?: any }) {
  return (
    <div>
      {data && <samp>{JSON.stringify(data, null, 2)}</samp>}
      {error && (
        <div>
          <h1>An error has ocurred</h1>
          <samp>{JSON.stringify(error, null, 2)}</samp>
        </div>
      )}
      {user && (
        <div>
          <h1>Fetched user: </h1>
          <samp>{JSON.stringify(user, null, 2)}</samp>
        </div>
      )}
    </div>
  );
}

export default GoogleCallbackScreen;
