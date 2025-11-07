import { useNavigate } from "react-router";
import { getDashboardRouteFromRole } from "../services/navigation/redirects";
import { useAuthStore } from "../stores/auth.store";
import { useCallback } from "react";

const useGoToDashboard = () => {
  const navigate = useNavigate();
  return useCallback(() => {
    const authStore = useAuthStore.getState()
    const dashboardPath = getDashboardRouteFromRole(authStore.user?.role ?? "")
    navigate(dashboardPath, {
      replace: true
    })
  }, [navigate])
}

export default useGoToDashboard
