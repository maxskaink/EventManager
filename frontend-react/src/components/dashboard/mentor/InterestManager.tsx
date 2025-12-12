import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InterestsAPI } from "../../../services/api";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";
import { ConfirmDeleteDialog } from "../../profile/dialogs/confirm-delete-dialog";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessageForToast } from "../../../features/errors/error.helpers";

export function InterestManager() {
    const queryClient = useQueryClient();
    const [newInterest, setNewInterest] = useState("");
    const [interestToDelete, setInterestToDelete] = useState<number | null>(null);

    // Fetch interests
    const { data: interestsData, isLoading } = useQuery({
        queryKey: ["interests"],
        queryFn: InterestsAPI.listInterests,
    });

    const interests = interestsData?.interests ?? [];

    // Add interest mutation
    const addInterestMutation = useMutation({
        mutationFn: InterestsAPI.addInterest,
        onSuccess: () => {
            toast.success("Interés creado exitosamente");
            setNewInterest("");
            queryClient.invalidateQueries({ queryKey: ["interests"] });
        },
        onError: (error) => {
            toast.error(getErrorMessageForToast(error, "Error al crear interés"));
        },
    });

    // Delete interest mutation
    const deleteInterestMutation = useMutation({
        mutationFn: InterestsAPI.deleteInterest,
        onSuccess: () => {
            toast.success("Interés eliminado exitosamente");
            queryClient.invalidateQueries({ queryKey: ["interests"] });
            setInterestToDelete(null);
        },
        onError: (error) => {
            toast.error(getErrorMessageForToast(error, "Error al eliminar interés"));
        },
    });

    const handleAddInterest = () => {
        if (!newInterest.trim()) return;
        addInterestMutation.mutate({ keyword: newInterest.trim() });
    };

    const handleDeleteClick = (id: number) => {
        setInterestToDelete(id);
    };

    const confirmDelete = () => {
        if (interestToDelete !== null) {
            deleteInterestMutation.mutate(interestToDelete);
        }
    };

    return (
        <>
            <Card>
                <CardContent className="space-y-6 pt-6">
                    {/* Add Interest Form */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="Nuevo interés (ej. Machine Learning)"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddInterest()}
                            disabled={addInterestMutation.isPending}
                        />
                        <Button
                            onClick={handleAddInterest}
                            disabled={!newInterest.trim() || addInterestMutation.isPending}
                            className="w-auto"
                        >
                            {addInterestMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 md:mr-2" />
                                    <span className="hidden md:inline">Agregar</span>
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Interests List */}
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {interests.length > 0 ? (
                                interests.map((interest) => (
                                    <Badge
                                        key={interest.id}
                                        variant="secondary"
                                        className="pl-3 pr-1 py-1 flex items-center gap-1 text-sm"
                                    >
                                        {interest.keyword}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 rounded-full hover:bg-destructive/20 hover:text-destructive ml-1"
                                            onClick={() => handleDeleteClick(interest.id)}
                                            disabled={deleteInterestMutation.isPending}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-sm italic">
                                    No hay intereses registrados.
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <ConfirmDeleteDialog
                open={interestToDelete !== null}
                onOpenChange={(open) => !open && setInterestToDelete(null)}
                onConfirm={confirmDelete}
                title="¿Estás seguro?"
                description="Esta acción no se puede deshacer. Se eliminará este interés de todos los perfiles de usuario que lo tengan seleccionado."
            />
        </>
    );
}
