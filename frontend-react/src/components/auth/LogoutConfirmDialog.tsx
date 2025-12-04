import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";

interface LogoutConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export const LogoutConfirmDialog: React.FC<LogoutConfirmDialogProps> = ({
    open,
    onOpenChange,
    onConfirm,
}) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro que deseas cerrar sesión?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tendrás que iniciar sesión nuevamente para acceder a tu cuenta.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Cerrar sesión
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
