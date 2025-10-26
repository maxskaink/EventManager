import { Navigate } from "react-router";
import { useAuthStore } from "../../stores/auth.store";
import { getDashboardRouteFromRole } from "../../services/navigation/redirects";

export default function DashboardRedirect() {
  const user = useAuthStore(s => s.user)
  const dashboardPath = getDashboardRouteFromRole(user?.role ?? "")
  return <Navigate to={dashboardPath} replace />;
}
