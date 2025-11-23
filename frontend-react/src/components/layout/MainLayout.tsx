import { Outlet } from "react-router";
import BottomNavbarWrapper from "../nav/BottomNavbarWrapper";
import { useAuthStore } from "../../stores/auth.store";

export const MainLayout = () => {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen pb-20 bg-background">
            {/* 
        The UnifiedHeader is NOT rendered here because we want to allow 
        each page to customize it (title, actions, back button).
        Pages will render UnifiedHeader as their first element.
      */}

            <Outlet />

            <BottomNavbarWrapper role={user?.role || ""} />
        </div>
    );
};
