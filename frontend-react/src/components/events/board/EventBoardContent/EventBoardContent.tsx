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
  onEditEvent: (item: ContentItem) => void;
  onEditPublication: (item: ContentItem) => void;
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
  onEditEvent,
  onEditPublication,
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold">Contenido ({content.length})</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={onCreateEvent} className="text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto sm:h-9">
                <Plus className="mr-2 h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Nuevo Evento</span><span className="sm:hidden">Evento</span>
            </Button>
            <Button variant="outline" onClick={onCreatePublication} className="text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto sm:h-9">
                <Plus className="mr-2 h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Nueva Publicación</span><span className="sm:hidden">Publicación</span>
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
              onEditEvent={onEditEvent}
              onEditPublication={onEditPublication}
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
              onEditEvent={onEditEvent}
              onEditPublication={onEditPublication}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default EventBoardContent;