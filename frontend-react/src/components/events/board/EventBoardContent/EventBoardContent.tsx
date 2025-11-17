import { Card, CardContent } from "../../../ui/card";
import { Button } from "../../../ui/button";
import {
  Plus,
  Calendar,
} from "lucide-react";
import type { NavigateFunction } from "react-router";
import EventGridItem from "./EventGridItem";
import EventListItem from "./EventListItem";
import type { ContentItem, ItemToDelete } from "../../../../features/events";

type Props = {
  loading: boolean;
  viewMode: "grid" | "list";
  content: ContentItem[];
  pinnedContent: string[];
  onViewDetails: (item: ContentItem) => void;
  onDeleteClick: (item: ItemToDelete) => void;
  onPublish: (item: ContentItem) => void;
  onNavigate: NavigateFunction;
};


// Componente Principal de Contenido
export function EventBoardContent({
  loading,
  viewMode,
  content,
  pinnedContent,
  onViewDetails,
  onDeleteClick,
  onPublish,
  onNavigate,
}: Props) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando contenido...</p>
        </CardContent>
      </Card>
    );
  }

  if (content.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3>No se encontró contenido</h3>
          <p className="text-muted-foreground mb-4">
            Intenta ajustar los filtros o crea nuevo contenido.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => onNavigate("/create-event")}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Evento
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate("/create-article")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Articulo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2>Contenido ({content.length})</h2>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.map((item) => (
            <EventGridItem
              key={item.id}
              item={item}
              isPinned={pinnedContent.includes(item.id)}
              onViewDetails={onViewDetails}
              onDeleteClick={onDeleteClick}
              onPublish={onPublish}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {content.map((item) => (
            <EventListItem
              key={item.id}
              item={item}
              isPinned={pinnedContent.includes(item.id)}
              onViewDetails={onViewDetails}
              onDeleteClick={onDeleteClick}
              onPublish={onPublish}
            />
          ))}
        </div>
      )}
    </section>
  );
}