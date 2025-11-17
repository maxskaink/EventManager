import { useState, useEffect } from "react";
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


// Tipos de datos (asumiendo que los tipos API.* existen globalmente)
// ... (Estos tipos deberían moverse a un archivo types.d.ts)
type ContentItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  status: string;
  capacity?: number;
  enrolled?: number;
  views?: number;
};

type ItemToDelete = {
  id: string;
  type: string;
  title: string;
};

export function EventBoardScreen() {
  const { user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Estado de UI y Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Estado de Datos
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<API.Event[]>([]);
  const [articles, setArticles] = useState<API.Article[]>([]); // Puede contener Articles o Publications
  const [pinnedContent] = useState<string[]>([]); // Mock

  // Estado de Modales y Diálogos
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Carga de Contenido
  useEffect(() => {
    loadContent();
  }, [location.pathname, user?.role]); // Recargar si cambia la ruta o el rol

  const loadContent = async () => {
    try {
      setLoading(true);
      
      const eventsData = await EventAPI.listAllEvents();
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      
      let articlesData: any[] = [];
      if (user?.role === 'coordinator') {
        // ... (lógica de carga de publicaciones/artículos para coordinador)
         try {
          const publicationsData = await PublicationAPI.listAllPublications();
          articlesData = Array.isArray(publicationsData) ? publicationsData : [];
        } catch (pubError) {
          articlesData = [];
        }
      } else if (user?.role === 'mentor') {
        // ... (lógica para mentor)
         try {
          articlesData = await ArticleAPI.listAllArticles();
          articlesData = Array.isArray(articlesData) ? articlesData : [];
        } catch (error) {
          articlesData = [];
        }
      } else {
        // ... (lógica para otros roles)
         try {
          articlesData = await ArticleAPI.listMyArticles();
          articlesData = Array.isArray(articlesData) ? articlesData : [];
        } catch (error) {
          articlesData = [];
        }
      }
      
      setArticles(articlesData);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Error al cargar el contenido');
      setEvents([]);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Transformación de Datos
  const safeEvents = Array.isArray(events) ? events : [];
  const safeArticles = Array.isArray(articles) ? articles : [];

  const content: ContentItem[] = [
    ...safeEvents.map(event => ({
      id: event.id.toString(),
      type: event.event_type,
      title: event.name,
      description: event.description,
      date: event.start_date.split('T')[0],
      time: event.start_date.split('T')[1]?.substring(0, 5) || undefined,
      location: event.location || event.modality,
      status: event.status === 'activo' ? 'upcoming' : 
              event.status === "finalizado" ? 'completed' : 
              event.status === 'cancelado' ? 'cancelled' : 'upcoming',
      capacity: event.capacity,
      enrolled: 0, // TODO
      views: undefined,
    })),
    ...safeArticles.map(item => {
      if ((item).publication_date || (item).user_id) { // Es Publication
        const pub = item
        return {
          id: `article-${pub.id}`,
          type: 'article',
          title: pub.title,
          description: pub.description || '',
          date: pub.created_at || pub.created_at,
          status: 'published',
          views: 0,
        };
      }
      const art = item as API.Article; // Es Article
      return {
        id: `article-${art.id}`,
        type: 'articulo',
        title: art.title,
        description: art.description || '',
        date: art.publication_date,
        status: 'published',
        views: 0,
      };
    }),
  ];

  // Filtrado y Ordenamiento
  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || item.type === filterCategory;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
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

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'articulo') {
        const articleId = parseInt(itemToDelete.id.replace('article-', ''));
        await ArticleAPI.deleteArticle(articleId);
        toast.success('✅ Artículo eliminado exitosamente');
      } else {
        toast.error('La funcionalidad de eliminar eventos aún no está disponible');
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
        return;
      }

      await loadContent();
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Error deleting item:', error);
      const message = error.response?.data?.message || 'Error al eliminar';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <EventBoardHeader
        userRole={user?.role || ""}
        onNavigate={navigate}
      />

      <div className="max-w-6xl mx-auto p-4 space-y-6">
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
          totalContent={content.length}
          totalEvents={safeEvents.length}
          totalArticles={safeArticles.length}
          totalPinned={pinnedContent.length}
        />

        <EventBoardContent
          loading={loading}
          viewMode={viewMode}
          content={sortedContent}
          pinnedContent={pinnedContent}
          onViewDetails={handleViewDetails}
          onDeleteClick={handleDeleteClick}
          onNavigate={navigate}
        />
      </div>

      <BottomNavbarWrapper role={user?.role ?? ""} />

      <EventDetailModal
        isOpen={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        item={selectedItem}
      />

      <EventDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        item={itemToDelete}
        onConfirmDelete={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}