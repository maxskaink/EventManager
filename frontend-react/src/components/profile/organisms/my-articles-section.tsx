import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Plus, Trash2, ExternalLink, BookOpen, Pencil } from "lucide-react";

interface Article {
  id: string;
  title: string;
  description: string;
  authors: string;
  publicationDate: string; // ISO string
  publicationUrl: string;
}

interface MyArticlesSectionProps {
  articles: Article[];
  onAddArticle: () => void;
  onEditArticle: (id: string) => void;
  onDeleteArticle: (id: string) => void;
  formatDate: (dateString: string) => string;
}

export const MyArticlesSection = ({ articles, onAddArticle, onEditArticle, onDeleteArticle, formatDate }: MyArticlesSectionProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="tracking-tight text-[#0a2740] font-semibold">Mis Artículos</h2>
        <Button
          onClick={onAddArticle}
          size="sm"
          className="rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </div>

      {articles.length === 0 ? (
        <div className="p-8 text-center text-gray-600 flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
          <BookOpen className="w-12 h-12 mb-3 text-sky-700" />
          <p>No has agregado ningún artículo aún.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-2 tracking-tight font-semibold text-[#0a2740] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {article.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{article.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                      <span>
                        <strong>Autores:</strong> {article.authors}
                      </span>
                      <span>•</span>
                      <span>{formatDate(article.publicationDate)}</span>
                    </div>
                    <a
                      href={article.publicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-sky-700 hover:underline flex items-center gap-1"
                    >
                      Ver anuncio <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEditArticle(article.id)}
                      className="transition-transform hover:scale-105 active:scale-95"
                      title="Editar artículo"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDeleteArticle(article.id)}
                      className="text-destructive hover:text-destructive transition-transform hover:scale-105 active:scale-95"
                      title="Eliminar artículo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};
