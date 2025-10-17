import { Outlet } from "react-router";
import { Toaster } from "../ui/sonner";

export function RootLayout() {  

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <Toaster />
    </div>
  );
}
