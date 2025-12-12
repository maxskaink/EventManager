import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../../ui/dialog";
import { InterestManager } from "../InterestManager";

interface InterestManagerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function InterestManagerModal({ open, onOpenChange }: InterestManagerModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Gestión de Intereses</DialogTitle>
                    <DialogDescription>
                        Administra los temas de interés disponibles para los usuarios.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <InterestManager />
                </div>
            </DialogContent>
        </Dialog>
    );
}
