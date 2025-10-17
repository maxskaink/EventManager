import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";

export default function PlaceholderNav({ title, children }: { title: string; children?: React.ReactNode }) {
    const { user } = useApp();
    const navigate = useNavigate();
    const dashboardPath =
        user?.role === "guest"
            ? "/dashboard-guest"
            : user?.role === "coordinator"
                ? "/dashboard-coordinator"
                : user?.role === "mentor"
                    ? "/dashboard-mentor"
                    : "/dashboard-member";

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <h2 className="mb-4">{title}</h2>
                <div className="text-muted-foreground mb-4">{children}</div>
                <button
                    onClick={() => navigate(dashboardPath)}
                    className="text-primary hover:underline"
                >
                    Volver al dashboard
                </button>
            </div>
        </div>
    );
}
