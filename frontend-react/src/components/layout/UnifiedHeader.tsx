import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, ArrowLeft, Loader2, User as UserIcon } from "lucide-react";
import { useAuthStore } from "../../stores/auth.store";
import { NotificationPopover } from "../notifications/NotificationPopover";
import { LogoutConfirmDialog } from "../auth/LogoutConfirmDialog";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface UnifiedHeaderProps {
    title?: string;
    subtitle?: string;
    onGoBack?: () => void;
    actions?: React.ReactNode;
    user?: API.User | null;
    loading?: boolean;
    showAvatar?: boolean;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
    title,
    subtitle,
    onGoBack,
    actions,
    user: propUser,
    loading = false,
    showAvatar = true,
}) => {
    const { user: authUser, logout } = useAuthStore();
    const user = propUser ?? authUser;
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const handleConfirmLogout = () => {
        logout();
        setShowLogoutConfirm(false);
    };

    return (
        <div className="bg-[#0a2740] px-4 md:px-6 py-4 shadow-sm text-white transition-all duration-300">
            <div className="flex items-center justify-between gap-4">

                {/* Left Section: Back Button Only (Avatar moved to right) */}
                <div className="flex items-center gap-4 min-w-0">
                    {onGoBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onGoBack}
                            className="text-white hover:bg-white/10 hover:text-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}

                    <div className="flex flex-col min-w-0">
                        <h1 className="text-lg font-semibold leading-none overflow-hidden text-ellipsis whitespace-nowrap">
                            {title || `Hola, ${user?.name?.split(" ")[0]}`}
                        </h1>
                        {subtitle && (
                            <p className="text-xs text-white/70 mt-1 font-light whitespace-nowrap overflow-hidden text-ellipsis">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Section: Actions & User Dropdown */}
                <div className="flex items-center gap-2">
                    {loading && <Loader2 className="h-5 w-5 animate-spin text-white/50 mr-2" />}

                    {actions}

                    {/* Notifications */}
                    {user && (
                        <NotificationPopover />
                    )}

                    {/* User Dropdown */}
                    {showAvatar && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border-2 border-white/20 hover:bg-transparent">
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src={user?.avatar ?? undefined} />
                                        <AvatarFallback className="bg-blue-800 text-white">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate("/profile")}>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Mi Perfil</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogoutClick} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : null}
                </div>
            </div>

            <LogoutConfirmDialog
                open={showLogoutConfirm}
                onOpenChange={setShowLogoutConfirm}
                onConfirm={handleConfirmLogout}
            />
        </div>
    );
};
