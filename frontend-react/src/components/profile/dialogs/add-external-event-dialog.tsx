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
import { externalEventQueries } from "@/services/react-query/queries";

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
        .max(200, "La ubicación no puede exceder 200 caracteres"),
    participation_url: z.string()
        .transform((url) => {
            if (!url) return "";
            const trimmed = url.trim();
            if (!/^https?:\/\//i.test(trimmed)) {
                return `https://${trimmed}`;
            }
            return trimmed;
        })
        .refine((url) => {
            if (!url) return true;
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

interface AddExternalEventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddEvent: (event: ExternalEventFormData) => void;
    isPending?: boolean;
}

export const AddExternalEventDialog = ({ open, onOpenChange, onAddEvent, isPending = false }: AddExternalEventDialogProps) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
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

    const modality = watch("modality");

    // Fetch trusted organizations
    const trustedOrgsQuery = useQuery(externalEventQueries.trustedDomains(open));
    const trustedOrganizations = trustedOrgsQuery.data ?? [];

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const onSubmit = (data: ExternalEventFormData) => {
        onAddEvent(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle>Agregar Evento Externo</DialogTitle>
                    <DialogDescription>Registra un evento externo en el que hayas participado.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="event-name">Nombre del evento *</Label>
                        <Input
                            id="event-name"
                            {...register("name")}
                            disabled={isPending}
                            className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="event-description">Descripción *</Label>
                        <Textarea
                            id="event-description"
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
                            <Label htmlFor="event-start-date">Fecha de inicio *</Label>
                            <Input
                                id="event-start-date"
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
                            <Label htmlFor="event-end-date">Fecha de fin *</Label>
                            <Input
                                id="event-end-date"
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
                        <Label htmlFor="event-modality">Modalidad *</Label>
                        <Controller
                            name="modality"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
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
                        <Label htmlFor="event-organization">Organización anfitriona *</Label>
                        <Controller
                            name="host_organization"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isPending || trustedOrgsQuery.isLoading}
                                >
                                    <SelectTrigger className={errors.host_organization ? "border-destructive" : ""}>
                                        <SelectValue placeholder={trustedOrgsQuery.isLoading ? "Cargando organizaciones..." : "Selecciona organización"} />
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

                    {(modality === "presencial" || modality === "mixta") && (
                    <div>
                        <Label htmlFor="event-location">Ubicación</Label>
                        <Input
                            id="event-location"
                            {...register("location")}
                            disabled={isPending}
                            className={errors.location ? "border-destructive" : ""}
                        />
                        {errors.location && (
                            <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
                        )}
                    </div>
                    )}
                    {(modality === "virtual" || modality === "mixta") &&
                    <div>
                        <Label htmlFor="event-url">URL de participación</Label>
                        <Input
                            id="event-url"
                            type="url"
                            {...register("participation_url")}
                            disabled={isPending}
                            className={errors.participation_url ? "border-destructive" : ""}
                        />
                        {errors.participation_url && (
                            <p className="text-sm text-destructive mt-1">{errors.participation_url.message}</p>
                        )}
                    </div>
                    }

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
                                    Agregando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    <span className="hidden xs:inline">Agregar Evento</span>
                                    <span className="xs:hidden">Agregar</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
