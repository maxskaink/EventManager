import { useState } from "react";
import { useApp } from "../../components/context/AppContext";
import { useNavigate } from "react-router";
import { EventAPI, ArticleAPI } from "../../services/api";
import { toast } from "sonner";
import BottomNavbarWrapper from "../../components/nav/BottomNavbarWrapper";
import { EventBoardHeader } from "../../components/events/board/EventBoardHeader";
import { EventBoardFilters } from "../../components/events/board/EventBoardFilters";
import EventBoardContent from "../../components/events/board/EventBoardContent";
import { EventBoardStats } from "../../components/events/board/EventBoardStats";
import { EventDetailModal } from "../../components/events/board/EventDetailModal";
import { EventDeleteDialog } from "../../components/events/board/EventDeleteDialog";
import { getErrorMessageForToast } from "../../features/errors/error.helpers";
import { mergeEventsAndPublications, type ContentItem, type ItemToDelete, isEventType } from "../../features/events";
import { PublishContentModal } from "../../components/events/board/PublishContentModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventQueries, publicationQueries } from "../../services/react-query/queries";

export function EventBoardScreen() {
  const { user } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Estado de UI y Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("events");

  // Estado de Modales y Diálogos
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [pinnedContent] = useState<string[]>([]); // Mock

  // Queries
  const { data: events = [], isLoading: isLoadingEvents } = useQuery(eventQueries.all());

  const { data: publications = [], isLoading: isLoadingPublications } = useQuery(publicationQueries.all());

  const loading = isLoadingEvents || isLoadingPublications;

  // Mutations
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      await EventAPI.deleteEvent(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("✅ Evento eliminado exitosamente");
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
      toast.error(getErrorMessageForToast(error, "Error al eliminar evento"));
    }
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (articleId: number) => {
      await ArticleAPI.deleteArticle(articleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast.success("✅ Publicación eliminada exitosamente");
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting publication:", error);
      toast.error(getErrorMessageForToast(error, "Error al eliminar publicación"));
    }
  });

  // Transformación de Datos
  const safeEvents = Array.isArray(events) ? events : [];
  const safePublications = Array.isArray(publications) ? publications : [];

  const content: ContentItem[] = mergeEventsAndPublications(safeEvents, safePublications);

  // Filtrado y Ordenamiento
  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.type === filterCategory;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;

    // Tab filtering
    const matchesTab = activeTab === "events" ? item.kind === 'event' : item.kind === 'publication';

    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  const sortedContent = [...filteredContent].sort((a, b) => {
    const aPinned = pinnedContent.includes(a.id);
    const bPinned = pinnedContent.includes(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime(); // Más recientes primero
  });

  // Handlers de Modales
  const handleViewDetails = (item: ContentItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (item: ItemToDelete) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handlePublish = (item: ContentItem) => {
    setSelectedItem(item);
    setIsPublishModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (isEventType(itemToDelete.type)) {
      const eventId = Number(itemToDelete.id);
      if (Number.isNaN(eventId)) {
        toast.error("ID de evento no válido");
        return;
      }
      deleteEventMutation.mutate(eventId);
    } else {
      // It's a publication
      const idMatch = itemToDelete.id.match(/(\d+)$/);
      if (!idMatch) {
        toast.error("ID de publicación no válido");
        return;
      }
      const articleId = Number(idMatch[1]);
      deleteArticleMutation.mutate(articleId);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <EventBoardHeader userRole={user?.role || ""} onNavigate={navigate} />

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          <EventBoardStats
            loading={loading}
            totalContent={content.length} // Total overall
            totalEvents={safeEvents.length}
            totalPinned={pinnedContent.length}
          />

          <EventBoardFilters
            searchQuery={searchQuery}
            filterCategory={filterCategory}
            filterStatus={filterStatus}
            viewMode={viewMode}
            onSearchQueryChange={setSearchQuery}
            onFilterCategoryChange={setFilterCategory}
            onFilterStatusChange={setFilterStatus}
            onViewModeChange={setViewMode}
          />

          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="publications">Publicaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-0">
            <EventBoardContent
              loading={loading}
              viewMode={viewMode}
              content={sortedContent}
              pinnedContent={pinnedContent}
              onViewDetails={handleViewDetails}
              onDeleteClick={handleDeleteClick}
              onPublish={handlePublish}
              onNavigate={navigate}
            />
          </TabsContent>

          <TabsContent value="publications" className="mt-0">
            <EventBoardContent
              loading={loading}
              viewMode={viewMode}
              content={sortedContent}
              pinnedContent={pinnedContent}
              onViewDetails={handleViewDetails}
              onDeleteClick={handleDeleteClick}
              onPublish={handlePublish}
              onNavigate={navigate}
            />
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavbarWrapper role={user?.role ?? ""} />

      <EventDetailModal isOpen={isDetailModalOpen} onOpenChange={setIsDetailModalOpen} item={selectedItem} />

      <EventDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        item={itemToDelete}
        onConfirmDelete={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
      <PublishContentModal
        isOpen={isPublishModalOpen}
        onOpenChange={setIsPublishModalOpen}
        onPublish={() => console.log("Publicado")}
        item={selectedItem}
      />
    </div>
  );
}
