import { useState, useEffect, useCallback } from "react";
import { useApp } from "../../components/context/AppContext";
import { useNavigate, useLocation } from "react-router";
import { EventAPI, ArticleAPI, PublicationAPI } from "../../services/api";
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

export function EventBoardScreen() {
  const { user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Estado de UI y Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("events");

  // Estado de Datos
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<API.Event[]>([]);
  const [publications, setPublications] = useState<API.Publication[]>([]);
  const [pinnedContent] = useState<string[]>([]); // Mock

  // Estado de Modales y Diálogos
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);

      // Carga de eventos en paralelo con el contenido
      const [eventsData, contentData] = await Promise.all([
        EventAPI.listAllEvents().catch(() => []),
        loadRoleBasedContent(user?.role),
      ]);

      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setPublications(Array.isArray(contentData) ? contentData : []);
    } catch (error) {
      console.error("Error loading content:", error);
      toast.error("Error al cargar el contenido");
      setEvents([]);
      setPublications([]);
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  // Carga de Contenido
  useEffect(() => {
    loadContent();
  }, [location.pathname, loadContent]); // Recargar si cambia la ruta o el rol

  // Función auxiliar para cargar contenido basado en el rol
  const loadRoleBasedContent = async (role?: string): Promise<API.Publication[]> => {
    try {
      // TODO: Implement role based fetching if needed, for now list all or specific logic
      // For now we list all publications for coordinators/mentors
      let data: API.Publication[];
      switch (role) {
        case "coordinator":
        case "mentor":
          data = await PublicationAPI.listAllPublications();
          break;
        default:
          // If there is a "listMyPublications" use it, otherwise listAll or empty
          // Assuming listAllPublications for now as per previous logic but adapted
          data = await PublicationAPI.listAllPublications();
          break;
      }
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

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

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (isEventType(itemToDelete.type)) {
        const eventId = Number(itemToDelete.id);
        if (Number.isNaN(eventId)) {
          throw new Error("ID de evento no válido");
        }
        await EventAPI.deleteEvent(eventId);
        toast.success("✅ Evento eliminado exitosamente");
      } else {
        // It's a publication
        const idMatch = itemToDelete.id.match(/(\d+)$/);
        if (!idMatch) {
          throw new Error("ID de publicación no válido");
        }
        const articleId = Number(idMatch[1]);
        await ArticleAPI.deleteArticle(articleId);
        toast.success("✅ Publicación eliminada exitosamente");
      }

      await loadContent();
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(getErrorMessageForToast(error, "Error al eliminar"));
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <EventBoardHeader userRole={user?.role || ""} onNavigate={navigate} />

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="publications">Publicaciones</TabsTrigger>
          </TabsList>

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

          <EventBoardStats
            loading={loading}
            totalContent={content.length} // Total overall
            totalEvents={safeEvents.length}
            totalArticles={safePublications.length}
            totalPinned={pinnedContent.length}
          />

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
