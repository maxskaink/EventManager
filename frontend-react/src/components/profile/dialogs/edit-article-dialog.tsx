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
import { useCallback, useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { articleQueries } from "@/services/react-query/queries";

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
    setValue,
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

  const trustedOrgsQuery = useQuery(articleQueries.trustedOrganizations());
  const trustedOrganizations = useMemo(() => trustedOrgsQuery.data ?? [], [trustedOrgsQuery.data]);

  const matchSelectedOrg = useCallback((url: string) => {
    if (!url) {
      setSelectedOrg("");
      return;
    }
    try {
      // const urlToCheck = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      // new URL(urlToCheck);

      const matched = trustedOrganizations.find((org) => url.toLowerCase().includes(org.toLowerCase()));

      if (matched) {
        setSelectedOrg(matched);
        clearErrors("publicationUrl");
      } else {
        setSelectedOrg("");
        /*
        setError("publicationUrl", {
          type: "manual",
          message: "La organización no está en la lista de confianza",
        });
        */
      }
    } catch {
      // Invalid URL, let Zod handle it
    }
  }, [trustedOrganizations, clearErrors]);

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
      matchSelectedOrg(article.publicationUrl || "");
    }
  }, [article, open, reset, matchSelectedOrg]);

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
            <div className="mt-1 flex items-start gap-2">
              <Select
                value={selectedOrg}
                onValueChange={(value) => {
                  setSelectedOrg(value);
                  setValue("publicationUrl", value);
                  clearErrors("publicationUrl");
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
                  id="edit-article-url"
                  type="text"
                  {...(() => {
                    const { onBlur, ...rest } = register("publicationUrl");
                    return {
                      ...rest,
                      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                        onBlur(e);
                        matchSelectedOrg(e.target.value);
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
