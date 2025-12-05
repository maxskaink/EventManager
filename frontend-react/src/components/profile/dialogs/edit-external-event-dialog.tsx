import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalEventsAPI } from "../../../services/api";

// Zod validation schema
const externalEventSchema = z.object({
    name: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(200, "El nombre no puede exceder 200 caracteres"),
    description: z.string()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .max(1000, "La descripción no puede exceder 1000 caracteres"),
    start_date: z.string()
        .refine((date) => {
            const parsed = new Date(date);
            return !isNaN(parsed.getTime());
        }, "Fecha de inicio inválida"),
    end_date: z.string()
        .refine((date) => {
            const parsed = new Date(date);
            return !isNaN(parsed.getTime());
        }, "Fecha de fin inválida"),
    modality: z.enum(["presencial", "virtual", "mixta"]),
    host_organization: z.string().min(1, "Selecciona una organización"),
    location: z.string()
        .min(3, "La ubicación debe tener al menos 3 caracteres")
        .max(200, "La ubicación no puede exceder 200 caracteres"),
    participation_url: z.string()
        .min(1, "La URL es requerida")
        .transform((url) => {
            const trimmed = url.trim();
            if (!/^https?:\/\//i.test(trimmed)) {
                return `https://${trimmed}`;
            }
            return trimmed;
        })
        .refine((url) => {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        }, "URL inválida. Ej: https://ejemplo.com/evento"),
}).refine((data) => {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    return end >= start;
}, {
    message: "La fecha de fin debe ser posterior o igual a la fecha de inicio",
    path: ["end_date"],
});

type ExternalEventFormData = z.infer<typeof externalEventSchema>;

interface EditExternalEventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEditEvent: (event: ExternalEventFormData) => void;
    isPending?: boolean;
    event: API.ExternalEvent | null;
}

export const EditExternalEventDialog = ({ open, onOpenChange, onEditEvent, isPending = false, event }: EditExternalEventDialogProps) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<ExternalEventFormData>({
        resolver: zodResolver(externalEventSchema),
        defaultValues: {
            name: "",
            description: "",
            start_date: "",
            end_date: "",
            modality: "presencial",
            host_organization: "",
            location: "",
            participation_url: "",
        },
    });

    // Fetch trusted organizations
    const { data: organizationsData, isLoading: isLoadingOrganizations } = useQuery({
        queryKey: ["trusted-organizations"],
        queryFn: ExternalEventsAPI.getTrustedDomains,
        enabled: open,
    });

    const trustedOrganizations = organizationsData?.trusted_organizations ?? [];

    // Update form when event changes
    useEffect(() => {
        if (event && open) {
            reset({
                name: event.name,
                description: event.description,
                start_date: event.start_date,
                end_date: event.end_date,
                modality: event.modality as "presencial" | "virtual" | "mixta",
                host_organization: event.host_organization,
                location: event.location,
                participation_url: event.participation_url || "",
            });
        }
    }, [event, open, reset]);

    const onSubmit = (data: ExternalEventFormData) => {
        onEditEvent(data);
    };

    if (!event) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle>Editar Evento Externo</DialogTitle>
                    <DialogDescription>Actualiza la información del evento externo.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="edit-event-name">Nombre del evento *</Label>
                        <Input
                            id="edit-event-name"
                            {...register("name")}
                            disabled={isPending}
                            className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="edit-event-description">Descripción *</Label>
                        <Textarea
                            id="edit-event-description"
                            {...register("description")}
                            disabled={isPending}
                            className={errors.description ? "border-destructive" : ""}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="edit-event-start-date">Fecha de inicio *</Label>
                            <Input
                                id="edit-event-start-date"
                                type="date"
                                {...register("start_date")}
                                disabled={isPending}
                                className={errors.start_date ? "border-destructive" : ""}
                            />
                            {errors.start_date && (
                                <p className="text-sm text-destructive mt-1">{errors.start_date.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="edit-event-end-date">Fecha de fin *</Label>
                            <Input
                                id="edit-event-end-date"
                                type="date"
                                {...register("end_date")}
                                disabled={isPending}
                                className={errors.end_date ? "border-destructive" : ""}
                            />
                            {errors.end_date && (
                                <p className="text-sm text-destructive mt-1">{errors.end_date.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="edit-event-modality">Modalidad *</Label>
                        <Controller
                            name="modality"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isPending}
                                >
                                    <SelectTrigger className={errors.modality ? "border-destructive" : ""}>
                                        <SelectValue placeholder="Selecciona modalidad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="presencial">Presencial</SelectItem>
                                        <SelectItem value="virtual">Virtual</SelectItem>
                                        <SelectItem value="mixta">Mixta</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.modality && (
                            <p className="text-sm text-destructive mt-1">{errors.modality.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="edit-event-organization">Organización anfitriona *</Label>
                        <Controller
                            name="host_organization"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isPending || isLoadingOrganizations}
                                >
                                    <SelectTrigger className={errors.host_organization ? "border-destructive" : ""}>
                                        <SelectValue placeholder={isLoadingOrganizations ? "Cargando organizaciones..." : "Selecciona organización"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {trustedOrganizations.length > 0 ? (
                                            trustedOrganizations.map((org) => (
                                                <SelectItem key={org} value={org}>
                                                    {org}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-sm text-muted-foreground text-center">
                                                No hay organizaciones disponibles
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.host_organization && (
                            <p className="text-sm text-destructive mt-1">{errors.host_organization.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="edit-event-location">Ubicación *</Label>
                        <Input
                            id="edit-event-location"
                            {...register("location")}
                            disabled={isPending}
                            className={errors.location ? "border-destructive" : ""}
                        />
                        {errors.location && (
                            <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="edit-event-url">URL de participación *</Label>
                        <Input
                            id="edit-event-url"
                            type="url"
                            {...register("participation_url")}
                            disabled={isPending}
                            className={errors.participation_url ? "border-destructive" : ""}
                        />
                        {errors.participation_url && (
                            <p className="text-sm text-destructive mt-1">{errors.participation_url.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    <span className="hidden xs:inline">Guardar Cambios</span>
                                    <span className="xs:hidden">Guardar</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
