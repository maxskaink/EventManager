import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import type { ContentItem } from "../../../features/events";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: ContentItem | null;
  onConfirmDelete: () => void;
  onCancel: () => void;
};

export function EventDeleteDialog({
  isOpen,
  onOpenChange,
  item,
  onConfirmDelete,
  onCancel,
}: Props) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            ¿Eliminar {item?.kind === "publication" ? "anuncio" : "evento"}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no es permanente, el {item?.kind === "publication" ? "anuncio" : "evento"}{" "}
            <strong>"{item?.title}"</strong> pasara a un estado inactivo/cancelado
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}