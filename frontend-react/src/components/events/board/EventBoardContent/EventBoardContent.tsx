import { Button } from "../../../ui/button";
import { Plus } from "lucide-react";
import type { ContentItem, ItemToDelete } from "@/features/events";
import EventGridItem from "./EventGridItem";
import EventListItem from "./EventListItem";

interface EventBoardContentProps {
  loading: boolean;
  viewMode: "grid" | "list";
  content: ContentItem[];
  pinnedContent: string[];
  onViewDetails: (item: ContentItem) => void;
  onDeleteClick: (item: ItemToDelete) => void;
  onPublish: (item: ContentItem) => void;
  onAttendance: (item: ContentItem) => void;
  onCreateEvent: () => void;
  onCreatePublication: () => void;
}

const EventBoardContent = ({
  loading,
  viewMode,
  content,
  pinnedContent,
  onViewDetails,
  onDeleteClick,
  onPublish,
  onAttendance,
  onCreateEvent,
  onCreatePublication,
}: EventBoardContentProps) => {
  if (loading) {
    return <div className="text-center py-10">Cargando contenido...</div>;
  }

  if (content.length === 0) {
      return <div className="text-center py-10 text-muted-foreground">No hay contenido para mostrar.</div>;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Contenido ({content.length})</h2>
        <div className="flex gap-2">
            <Button onClick={onCreateEvent}>
                <Plus className="mr-2 h-4 w-4" /> Nuevo Evento
            </Button>
            <Button variant="outline" onClick={onCreatePublication}>
                <Plus className="mr-2 h-4 w-4" /> Nueva Publicación
            </Button>
        </div>
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
              onAttendance={onAttendance}
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
              onAttendance={onAttendance}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default EventBoardContent;