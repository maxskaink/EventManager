import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

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
        .min(1, "La URL es requerida")
        .transform((url) => {
            // Normalize URL: add https:// if no protocol
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

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const onSubmit = (data: ArticleFormData) => {
        onAddArticle(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Artículo</DialogTitle>
                    <DialogDescription>Registra una publicación en la que hayas participado.</DialogDescription>
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
                        <Label htmlFor="article-url">URL de publicación *</Label>
                        <Input
                            id="article-url"
                            type="url"
                            {...register("publicationUrl")}
                            disabled={isPending}
                            className={errors.publicationUrl ? "border-destructive" : ""}
                        />
                        {errors.publicationUrl && (
                            <p className="text-sm text-destructive mt-1">{errors.publicationUrl.message}</p>
                        )}
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Agregando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Agregar Artículo
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
