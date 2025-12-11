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
    }, "Fecha de anuncio inválida"),
  publicationUrl: z.string()
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
    }, "URL inválida. Ej: https://ejemplo.com/articulo"),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface EditArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditArticle: (data: ArticleFormData) => void;
  isPending?: boolean;
  article: {
    id: string;
    title: string;
    description: string;
    authors: string;
    publicationDate: string;
    publicationUrl: string;
  } | null;
}

export const EditArticleDialog = ({ open, onOpenChange, onEditArticle, isPending = false, article }: EditArticleDialogProps) => {
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

  // Update form when article changes
  useEffect(() => {
    if (article && open) {
      reset({
        title: article.title,
        description: article.description,
        authors: article.authors,
        publicationDate: article.publicationDate,
        publicationUrl: article.publicationUrl,
      });
    }
  }, [article, open, reset]);

  const onSubmit = (data: ArticleFormData) => {
    onEditArticle(data);
  };

  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Editar Artículo</DialogTitle>
          <DialogDescription>Actualiza la información del artículo.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="edit-article-title">Título *</Label>
            <Input
              id="edit-article-title"
              {...register("title")}
              disabled={isPending}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="edit-article-description">Descripción *</Label>
            <Textarea
              id="edit-article-description"
              {...register("description")}
              disabled={isPending}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="edit-article-authors">Autores *</Label>
            <Input
              id="edit-article-authors"
              {...register("authors")}
              disabled={isPending}
              className={errors.authors ? "border-destructive" : ""}
            />
            {errors.authors && (
              <p className="text-sm text-destructive mt-1">{errors.authors.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="edit-article-date">Fecha de publicación *</Label>
            <Input
              id="edit-article-date"
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
            <Label htmlFor="edit-article-url">URL de publicación *</Label>
            <Input
              id="edit-article-url"
              type="url"
              {...register("publicationUrl")}
              disabled={isPending}
              className={errors.publicationUrl ? "border-destructive" : ""}
            />
            {errors.publicationUrl && (
              <p className="text-sm text-destructive mt-1">{errors.publicationUrl.message}</p>
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
