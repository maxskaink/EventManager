import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { certificateQueries } from "@/services/react-query/queries";

// Zod validation schema
const certificateSchema = z
  .object({
    name: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(200, "El nombre no puede exceder 200 caracteres"),
    issuing_organization: z
      .string()
      .min(3, "La organización debe tener al menos 3 caracteres")
      .max(200, "La organización no puede exceder 200 caracteres"),
    issue_date: z
      .string()
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
    credential_url: z
      .string()
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
  })
  .refine(
    (data) => {
      if (data.does_not_expire) return true;
      if (!data.expiration_date) return false;
      const issue = new Date(data.issue_date);
      const expiration = new Date(data.expiration_date);
      return expiration >= issue;
    },
    {
      message: "La fecha de expiración debe ser posterior o igual a la fecha de emisión",
      path: ["expiration_date"],
    },
  );

type CertificateFormData = Omit<z.infer<typeof certificateSchema>, "credential_url"> & {
  credential_url?: string | undefined;
};

interface EditCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditCertificate: (data: CertificateFormData) => void;
  isPending?: boolean;
  certificate: API.Certificate | null;
}

export const EditCertificateDialog = ({
  open,
  onOpenChange,
  onEditCertificate,
  isPending = false,
  certificate,
}: EditCertificateDialogProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    setValue,
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

  const [selectedOrg, setSelectedOrg] = useState<string>("");

  const trustedOrgsQuery = useQuery(certificateQueries.trustedOrganizations());
  const trustedOrganizations = trustedOrgsQuery.data ?? [];

  const matchSelectedOrg = useCallback((url: string) => {
    if (!url) {
      setSelectedOrg("");
      return;
    }
    try {
      const urlToCheck = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      new URL(urlToCheck);

      const matched = trustedOrganizations.find((org) => url.toLowerCase().includes(org.toLowerCase()));

      if (matched) {
        setSelectedOrg(matched);
        clearErrors("credential_url");
      } else {
        setSelectedOrg("");
        setError("credential_url", {
          type: "manual",
          message: "La organización no está en la lista de confianza",
        });
      }
    } catch {
      // Invalid URL, let Zod handle it
    }
  }, [trustedOrganizations]);

  // Update form when certificate changes
  useEffect(() => {
    if (certificate && open) {
      reset({
        name: certificate.name,
        issuing_organization: certificate.issuing_organization,
        issue_date: certificate.issue_date,
        expiration_date: certificate.expiration_date || "",
        does_not_expire: certificate.does_not_expire || false,
        credential_id: certificate.credential_id || "",
        credential_url: certificate.credential_url || "",
      });
      matchSelectedOrg(certificate.credential_url || "");
    }
  }, [certificate, open, reset, matchSelectedOrg]);

  const onSubmit = (data: CertificateFormData) => {
    onEditCertificate(data);
  };

  if (!certificate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-lg sm:p-6">
        <DialogHeader>
          <DialogTitle>Editar Certificado</DialogTitle>
          <DialogDescription>Actualiza la información del certificado.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="edit-cert-name">Nombre del certificado *</Label>
            <Input
              id="edit-cert-name"
              {...register("name")}
              disabled={isPending}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-destructive mt-1 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="edit-cert-organization">Organización emisora *</Label>
            <Input
              id="edit-cert-organization"
              {...register("issuing_organization")}
              disabled={isPending}
              className={errors.issuing_organization ? "border-destructive" : ""}
            />
            {errors.issuing_organization && (
              <p className="text-destructive mt-1 text-sm">{errors.issuing_organization.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="edit-cert-issue-date">Fecha de emisión *</Label>
              <Input
                id="edit-cert-issue-date"
                type="date"
                {...register("issue_date")}
                disabled={isPending}
                className={errors.issue_date ? "border-destructive" : ""}
              />
              {errors.issue_date && <p className="text-destructive mt-1 text-sm">{errors.issue_date.message}</p>}
            </div>

            <div>
              <Label htmlFor="edit-cert-expiration-date">Fecha de expiración</Label>
              <Input
                id="edit-cert-expiration-date"
                type="date"
                {...register("expiration_date")}
                disabled={isPending || doesNotExpire}
                className={errors.expiration_date ? "border-destructive" : ""}
              />
              {errors.expiration_date && (
                <p className="text-destructive mt-1 text-sm">{errors.expiration_date.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="does_not_expire"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="edit-cert-no-expire"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              )}
            />
            <Label htmlFor="edit-cert-no-expire" className="cursor-pointer text-sm font-normal">
              Este certificado no expira
            </Label>
          </div>

          <div>
            <Label htmlFor="edit-cert-credential-id">ID de credencial (opcional)</Label>
            <Input
              id="edit-cert-credential-id"
              {...register("credential_id")}
              disabled={isPending}
              placeholder="Ej: ABC123456"
            />
          </div>

          <div>
            <Label htmlFor="edit-cert-credential-url">URL de credencial (opcional)</Label>
            <div className="mt-1 flex items-start gap-2">
              <Select
                value={selectedOrg}
                onValueChange={(value) => {
                  setSelectedOrg(value);
                  setValue("credential_url", value);
                  clearErrors("credential_url");
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Org." />
                </SelectTrigger>
                <SelectContent>
                  {trustedOrganizations.map((org) => (
                    <SelectItem key={org} value={org}>
                      {org}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1">
                <Input
                  id="edit-cert-credential-url"
                  type="text"
                  {...(() => {
                    const { onBlur, ...rest } = register("credential_url");
                    return {
                      ...rest,
                      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                        onBlur(e);
                        matchSelectedOrg(e.target.value);
                      },
                    };
                  })()}
                  disabled={isPending}
                  className={errors.credential_url ? "border-destructive" : ""}
                  placeholder="Ej: https://ejemplo.com/credencial"
                />
                {errors.credential_url && (
                  <p className="text-destructive mt-1 text-sm">{errors.credential_url.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse justify-end gap-2 pt-4 sm:flex-row">
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span className="xs:inline hidden">Guardar Cambios</span>
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
