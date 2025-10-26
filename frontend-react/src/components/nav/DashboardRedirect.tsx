import { Navigate } from "react-router";
import { useAuthStore } from "../../stores/auth.store";

export default function DashboardRedirect() {
  const user = useAuthStore(s => s.user)
  const dashboardPath =
    user?.role === "guest"
      ? "/dashboard-guest"
      : user?.role === "coordinator"
        ? "/dashboard-coordinator"
        : user?.role === "mentor"
          ? "/dashboard-mentor"
          : "/dashboard-member";
  return <Navigate to={dashboardPath} replace />;
}
