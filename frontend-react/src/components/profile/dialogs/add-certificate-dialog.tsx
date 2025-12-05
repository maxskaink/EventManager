import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

// Zod validation schema
const certificateSchema = z.object({
    name: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(200, "El nombre no puede exceder 200 caracteres"),
    issuing_organization: z.string()
        .min(3, "La organización debe tener al menos 3 caracteres")
        .max(200, "La organización no puede exceder 200 caracteres"),
    issue_date: z.string()
        .refine((date) => {
            const parsed = new Date(date);
            return !isNaN(parsed.getTime());
        }, "Fecha de emisión inválida")
        .refine((date) => {
            const parsed = new Date(date);
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            return parsed <= today;
        }, "La fecha de emisión no puede ser futura"),
    expiration_date: z.string().optional(),
    does_not_expire: z.boolean().optional(),
    credential_id: z.string().optional(),
    credential_url: z.string()
        .optional()
        .transform((url) => {
            if (!url || url.trim() === "") return undefined;
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
        }, "URL inválida. Ej: https://ejemplo.com/credencial"),
}).refine((data) => {
    if (data.does_not_expire) return true;
    if (!data.expiration_date) return false;
    const issue = new Date(data.issue_date);
    const expiration = new Date(data.expiration_date);
    return expiration >= issue;
}, {
    message: "La fecha de expiración debe ser posterior o igual a la fecha de emisión",
    path: ["expiration_date"],
});

type CertificateFormData = Omit<z.infer<typeof certificateSchema>, "credential_url"> & {
    credential_url?: string | undefined;
};

interface AddCertificateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddCertificate: (certificate: CertificateFormData) => void;
    isPending?: boolean;
}

export const AddCertificateDialog = ({ open, onOpenChange, onAddCertificate, isPending = false }: AddCertificateDialogProps) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
        reset,
    } = useForm<CertificateFormData>({
        resolver: zodResolver(certificateSchema),
        defaultValues: {
            name: "",
            issuing_organization: "",
            issue_date: "",
            expiration_date: "",
            does_not_expire: false,
            credential_id: "",
            credential_url: "",
        },
    });

    const doesNotExpire = watch("does_not_expire");

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const onSubmit = (data: CertificateFormData) => {
        onAddCertificate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle>Agregar Certificado</DialogTitle>
                    <DialogDescription>Registra un certificado o credencial que hayas obtenido.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="cert-name">Nombre del certificado *</Label>
                        <Input
                            id="cert-name"
                            {...register("name")}
                            disabled={isPending}
                            className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="cert-organization">Organización emisora *</Label>
                        <Input
                            id="cert-organization"
                            {...register("issuing_organization")}
                            disabled={isPending}
                            className={errors.issuing_organization ? "border-destructive" : ""}
                        />
                        {errors.issuing_organization && (
                            <p className="text-sm text-destructive mt-1">{errors.issuing_organization.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="cert-issue-date">Fecha de emisión *</Label>
                            <Input
                                id="cert-issue-date"
                                type="date"
                                {...register("issue_date")}
                                disabled={isPending}
                                className={errors.issue_date ? "border-destructive" : ""}
                            />
                            {errors.issue_date && (
                                <p className="text-sm text-destructive mt-1">{errors.issue_date.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="cert-expiration-date">Fecha de expiración</Label>
                            <Input
                                id="cert-expiration-date"
                                type="date"
                                {...register("expiration_date")}
                                disabled={isPending || doesNotExpire}
                                className={errors.expiration_date ? "border-destructive" : ""}
                            />
                            {errors.expiration_date && (
                                <p className="text-sm text-destructive mt-1">{errors.expiration_date.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Controller
                            name="does_not_expire"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id="cert-no-expire"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isPending}
                                />
                            )}
                        />
                        <Label htmlFor="cert-no-expire" className="text-sm font-normal cursor-pointer">
                            Este certificado no expira
                        </Label>
                    </div>

                    <div>
                        <Label htmlFor="cert-credential-id">ID de credencial (opcional)</Label>
                        <Input
                            id="cert-credential-id"
                            {...register("credential_id")}
                            disabled={isPending}
                            placeholder="Ej: ABC123456"
                        />
                    </div>

                    <div>
                        <Label htmlFor="cert-credential-url">URL de credencial (opcional)</Label>
                        <Input
                            id="cert-credential-url"
                            type="url"
                            {...register("credential_url")}
                            disabled={isPending}
                            className={errors.credential_url ? "border-destructive" : ""}
                            placeholder="Ej: https://ejemplo.com/credencial"
                        />
                        {errors.credential_url && (
                            <p className="text-sm text-destructive mt-1">{errors.credential_url.message}</p>
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
                                    Agregando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    <span className="hidden xs:inline">Agregar Certificado</span>
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
