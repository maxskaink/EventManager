import { Outlet } from "react-router";
import { Toaster } from "../ui/sonner";
import { useLocation } from "react-router-dom";

export function RootLayout() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  const wrapperClass = isLogin
    ? "min-h-screen bg-background"
    : "min-h-screen pb-20 bg-gradient-to-br from-[#f7fafd] via-[#eef2f7] to-[#dde3eb]";

  return (
    <div className={wrapperClass}>
      <Outlet />
      <Toaster />
    </div>
  );
}
