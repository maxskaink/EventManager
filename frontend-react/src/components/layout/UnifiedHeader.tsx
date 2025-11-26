import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, ArrowLeft, Loader2 } from "lucide-react";
import { useAuthStore } from "../../stores/auth.store";
import { NotificationPopover } from "../notifications/NotificationPopover";

interface UnifiedHeaderProps {
    title?: string;
    subtitle?: string;
    onGoBack?: () => void;
    actions?: React.ReactNode;
    user?: API.User | null;
    loading?: boolean;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
    title,
    subtitle,
    onGoBack,
    actions,
    user: propUser,
    loading = false,
}) => {
    const { user: authUser, logout } = useAuthStore();
    const user = propUser || authUser;

    return (
        <div className="bg-[#0a2740] p-4 shadow-sm text-white transition-all duration-300">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">

                {/* Left Section: Back Button or Avatar */}
                <div className="flex items-center gap-4">
                    {onGoBack ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onGoBack}
                            className="text-white hover:bg-white/10 hover:text-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    ) : (
                        <Avatar className="h-10 w-10 border-2 border-white/20">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback className="bg-blue-800 text-white">
                                {user?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    )}

                    <div className="flex flex-col">
                        <h1 className="text-lg font-semibold leading-none">
                            {title || `Hola, ${user?.name?.split(" ")[0]}`}
                        </h1>
                        {subtitle && (
                            <p className="text-xs text-white/70 mt-1 font-light">{subtitle}</p>
                        )}
                    </div>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-2">
                    {loading && <Loader2 className="h-5 w-5 animate-spin text-white/50 mr-2" />}

                    {actions}
                    
                    {/* Default Actions if none provided */}
                    {!actions && (
                        <NotificationPopover />
                    )}

                    {!onGoBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={logout}
                            className="text-white/80 hover:bg-red-500/20 hover:text-red-200"
                            title="Cerrar sesión"
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
