import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthAPI, UserAPI } from "../../services/api";
import { useAuthStore } from "../../stores/auth.store";
import DashboardRedirect from "../../components/nav/DashboardRedirect";

function GoogleCallbackScreen() {
  const [params] = useSearchParams();

  const authStore = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const user = authStore.user;

  // On page load, we take "search" parameters
  // and proxy them to /api/auth/callback on our Laravel API
  useEffect(() => {
    async function callCallback() {
      if (authStore.isAuthenticated) return;
      const code = params.get("code") ?? "";
      try {
        const res = await AuthAPI.googleCallback({ code });
        authStore.login(res.user, res.access_token);
      } catch (err) {
        console.log(err);
        setError(err instanceof AxiosError ? err.response?.data : err);
      }
      setLoading(false);
    }
    callCallback();
  }, [params, authStore]);

  useEffect(() => {
    async function fetchUserData() {
      if (!authStore.isAuthenticated) return;
      const res = await UserAPI.getUser();
      setLoading(false)
      authStore.setUser(res.user);
    }
    fetchUserData();
  }, [authStore.isAuthenticated]);

  if (loading) {
    return <DisplayLoading />;
  }

  if (authStore.isAuthenticated) {
    return <DashboardRedirect/>
  }

  return (
    <div>
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
