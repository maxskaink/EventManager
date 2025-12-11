import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { certificateQueries } from "@/services/react-query/queries";

// Zod validation schema
const articleSchema = z.object({
    title: z.string()
        .min(3, "El título debe tener al menos 3 caracteres")
        .max(200, "El título no puede exceder 200 caracteres"),
    description: z.string()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .max(1000, "La descripción no puede exceder 1000 caracteres"),
    authors: z.string()
        .min(3, "Los autores deben tener al menos 3 caracteres")
        .max(200, "Los autores no pueden exceder 200 caracteres"),
    publicationDate: z.string()
        .refine((date) => {
            const parsed = new Date(date);
            return !isNaN(parsed.getTime());
        }, "Fecha inválida")
        .refine((date) => {
            const parsed = new Date(date);
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            return parsed <= today;
        }, "La fecha no puede ser futura"),
    publicationUrl: z.string()
    
        .transform((url) => {
            if (!url) return "";
            // Normalize URL: add https:// if no protocol
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
        }, "URL inválida. Ej: https://ejemplo.com/articulo"),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface AddArticleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddArticle: (article: ArticleFormData) => void;
    isPending?: boolean;
}

export const AddArticleDialog = ({ open, onOpenChange, onAddArticle, isPending = false }: AddArticleDialogProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        setError,
        clearErrors,
    } = useForm<ArticleFormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: "",
            description: "",
            authors: "",
            publicationDate: "",
            publicationUrl: "",
        },
    });

    const [selectedOrg, setSelectedOrg] = useState<string>("");

    const trustedOrgsQuery = useQuery(certificateQueries.trustedOrganizations());
    const trustedOrganizations = trustedOrgsQuery.data ?? [];

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            reset();
            setSelectedOrg("");
        }
    }, [open, reset]);

    const onSubmit = (data: ArticleFormData) => {
        onAddArticle(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Artículo</DialogTitle>
                    <DialogDescription>Registra una anuncio en la que hayas participado.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="article-title">Título *</Label>
                        <Input
                            id="article-title"
                            {...register("title")}
                            disabled={isPending}
                            className={errors.title ? "border-destructive" : ""}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="article-description">Descripción *</Label>
                        <Textarea
                            id="article-description"
                            {...register("description")}
                            disabled={isPending}
                            className={errors.description ? "border-destructive" : ""}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="article-authors">Autores *</Label>
                        <Input
                            id="article-authors"
                            {...register("authors")}
                            disabled={isPending}
                            className={errors.authors ? "border-destructive" : ""}
                        />
                        {errors.authors && (
                            <p className="text-sm text-destructive mt-1">{errors.authors.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="article-date">Fecha de publicación *</Label>
                        <Input
                            id="article-date"
                            type="date"
                            {...register("publicationDate")}
                            disabled={isPending}
                            className={errors.publicationDate ? "border-destructive" : ""}
                        />
                        {errors.publicationDate && (
                            <p className="text-sm text-destructive mt-1">{errors.publicationDate.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="article-url">URL de publicación</Label>
                        <div className="flex gap-2 items-start mt-1">
                            <Select
                                value={selectedOrg}
                                onValueChange={(value) => {
                                    setSelectedOrg(value);
                                    setValue("publicationUrl", value);
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
                                    id="article-url"
                                    type="text"
                                    {...(() => {
                                        const { onBlur, ...rest } = register("publicationUrl");
                                        return {
                                            ...rest,
                                            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                                                onBlur(e);
                                                const val = e.target.value;
                                                
                                                if (!val) {
                                                    setSelectedOrg("");
                                                    return;
                                                }

                                                try {
                                                    // const urlToCheck = /^https?:\/\//i.test(val) ? val : `https://${val}`;
                                                    // new URL(urlToCheck);
                                                    
                                                    const matched = trustedOrganizations.find((org) =>
                                                        val.toLowerCase().includes(org.toLowerCase())
                                                    );
                                                    
                                                    if (matched) {
                                                        setSelectedOrg(matched);
                                                        clearErrors("publicationUrl");
                                                    } else {
                                                        setSelectedOrg("");
                                                        // Optional: Validate if it must be a trusted org
                                                        /*
                                                        setError("publicationUrl", {
                                                            type: "manual",
                                                            message: "La organización no está en la lista de confianza"
                                                        });
                                                        */
                                                    }
                                                } catch {
                                                    // Invalid URL, let Zod schema handle it or ignore
                                                }
                                            },
                                        };
                                    })()}
                                    disabled={isPending}
                                    className={errors.publicationUrl ? "border-destructive" : ""}
                                    placeholder="Ej: https://ejemplo.com/articulo"
                                />
                                {errors.publicationUrl && (
                                    <p className="text-sm text-destructive mt-1">{errors.publicationUrl.message}</p>
                                )}
                            </div>
                        </div>
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
                                    <span className="hidden xs:inline">Agregar Artículo</span>
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
