import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Plus, Trash2, ExternalLink, BookOpen } from "lucide-react";

// Tipo simulado
interface Article {
  id: string;
  title: string;
  description: string;
  authors: string;
  publicationDate: string;
  publicationUrl: string;
}

interface MyArticlesSectionProps {
  articles: Article[];
  onAddArticle: () => void;
  onDeleteArticle: (articleId: string) => void;
  formatDate: (dateString: string) => string;
}

export const MyArticlesSection = ({ articles, onAddArticle, onDeleteArticle, formatDate }: MyArticlesSectionProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2>Mis Artículos</h2>
        <Button onClick={onAddArticle} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Artículo
        </Button>
      </div>
      {articles.length === 0 ? (
        <Card className="text-center py-8">
            <CardContent>
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No has agregado ningún artículo aún.</p>
            </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="line-clamp-2 mb-2">{article.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{article.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                        <span><strong>Autores:</strong> {article.authors}</span>
                        <span>•</span>
                        <span>{formatDate(article.publicationDate)}</span>
                    </div>
                    <a href={article.publicationUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                        Ver publicación <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => onDeleteArticle(article.id)} className="text-destructive hover:text-destructive shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};
