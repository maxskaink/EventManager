import { Button } from "../../../ui/button";
import { Plus } from "lucide-react";
import type { ContentItem, ItemToDelete } from "@/features/events";
import EventGridItem from "./EventGridItem";
import EventListItem from "./EventListItem";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../ui/pagination";

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
  onSharePublication: (item: ContentItem) => void;
  onCreateEvent: () => void;
  onCreatePublication: () => void;
  // Pagination Props
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
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
  onSharePublication,
  onCreateEvent,
  onCreatePublication,
  currentPage,
  totalPages,
  onPageChange,
}: EventBoardContentProps) => {

  const renderPagination = () => {
    if (!currentPage || !totalPages || totalPages <= 1 || !onPageChange) return null;

    // Helper to generate page numbers to show
    // Simple logic: show first, last, current, and neighbors
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push(-1); // Ellipsis
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push(-1);
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push(-1);
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push(-1);
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
                <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); if (currentPage > 1) onPageChange(currentPage - 1); }} 
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
            </PaginationItem>
            
            {getPageNumbers().map((page, idx) => (
                <PaginationItem key={idx}>
                    {page === -1 ? (
                        <PaginationEllipsis />
                    ) : (
                        <PaginationLink 
                            href="#" 
                            isActive={page === currentPage} 
                            onClick={(e) => { e.preventDefault(); onPageChange(page); }}
                            className="cursor-pointer"
                        >
                            {page}
                        </PaginationLink>
                    )}
                </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) onPageChange(currentPage + 1); }}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}    
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-10">Cargando contenido...</div>;
  }

  if (content.length === 0) {
      return (
        <div className="flex flex-col h-full">
            <section>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold">Contenido (0)</h2>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button onClick={onCreateEvent} className="text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto sm:h-9">
                            <Plus className="mr-2 h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Nuevo Evento</span><span className="sm:hidden">Evento</span>
                        </Button>
                        <Button variant="outline" onClick={onCreatePublication} className="text-xs sm:text-sm px-2 sm:px-4 py-2 h-auto sm:h-9">
                            <Plus className="mr-2 h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Nuevo anuncio</span><span className="sm:hidden">Anuncio</span>
                        </Button>
                    </div>
                </div>
            </section>
            <div className="text-center py-10 text-muted-foreground">No hay contenido para mostrar.</div>
        </div>
      );
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
              onSharePublication={onSharePublication}
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
              onSharePublication={onSharePublication}
            />
          ))}
        </div>
      )}
      
      {renderPagination()}
    </section>
  );
}

export default EventBoardContent;