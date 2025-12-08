import { useState } from "react";
import { useNavigate } from "react-router";
import { EventAPI, ArticleAPI, PublicationAPI } from "../../services/api";
import { toast } from "sonner";
import BottomNavbarWrapper from "../../components/nav/BottomNavbarWrapper";
import { EventBoardFilters } from "../../components/events/board/EventBoardFilters";
import EventBoardContent from "../../components/events/board/EventBoardContent";
import { EventBoardStats } from "../../components/events/board/EventBoardStats";
import { EventDetailModal } from "../../components/events/board/EventDetailModal";
import { EventDeleteDialog } from "../../components/events/board/EventDeleteDialog";
import { EditEventDialog } from "../../components/events/board/EditEventDialog";
import { EditPublicationDialog } from "../../components/events/board/EditPublicationDialog";
import { getErrorMessageForToast } from "../../features/errors/error.helpers";
import { type ContentItem, type ItemToDelete, isEventType, mapEventsToContentItems, mapPublicationsToContentItems } from "../../features/events";
import { PublishContentModal } from "../../components/events/board/PublishContentModal";
import { AttendanceModal } from "../../components/events/board/AttendanceModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventQueries, publicationQueries } from "../../services/react-query/queries";
import { useAuthStore } from "@/stores/auth.store";
import { UnifiedHeader } from "@/components/layout/UnifiedHeader";

export function EventBoardScreen() {

  const user = useAuthStore(s => s.user);
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
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedEventForAttendance, setSelectedEventForAttendance] = useState<{ id: number; title: string } | null>(null);
  
  // Edit state
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [isEditPublicationOpen, setIsEditPublicationOpen] = useState(false);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState<API.Event | null>(null);
  const [selectedPublicationForEdit, setSelectedPublicationForEdit] = useState<API.Publication | null>(null);

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

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<API.Event>}) => {
      await EventAPI.updateEvent(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("✅ Evento actualizado exitosamente");
      setIsEditEventOpen(false);
      setSelectedEventForEdit(null);
    },
    onError: (error) => {
      console.error("Error updating event:", error);
      toast.error(getErrorMessageForToast(error, "Error al actualizar evento"));
    },
  });

  const updatePublicationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: APIPayloads.UpdatePublication }) => {
      await PublicationAPI.updatePublication(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      toast.success("✅ Publicación actualizada exitosamente");
      setIsEditPublicationOpen(false);
      setSelectedPublicationForEdit(null);
    },
    onError: (error) => {
      console.error("Error updating publication:", error);
      toast.error(getErrorMessageForToast(error, "Error al actualizar publicación"));
    },
  });

  // Transformación de Datos
  const safeEvents = Array.isArray(events) ? events : [];
  const safePublications = Array.isArray(publications) ? publications : [];

  const eventItems: ContentItem[] = mapEventsToContentItems(safeEvents);
  const publicationItems: ContentItem[] = mapPublicationsToContentItems(safePublications, safeEvents);

  // Filtrado y Ordenamiento
  const filterAndSort = (items: ContentItem[]) => {
    const filtered = items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "all" || item.type === filterCategory;
      const matchesStatus = filterStatus === "all" || item.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    return filtered.sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  const sortedEvents = filterAndSort(eventItems);
  const sortedPublications = filterAndSort(publicationItems);

  const totalContent = sortedPublications.reduce((acc, item) => acc + (item.type === "evento" ? 0 : 1), 0) + sortedEvents.length;

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

  const handleAttendance = (item: ContentItem) => {
    const eventId = Number(item.id);
    if (!isNaN(eventId)) {
      setSelectedEventForAttendance({ id: eventId, title: item.title });
      setIsAttendanceModalOpen(true);
    }
  };

  const handleEditEvent = (item: ContentItem) => {
    // Check if it's an event or a publication with an event
    if (item.kind === 'event') {
      // It's an event
      const eventId = Number(item.id);
      const event = safeEvents.find(e => e.id === eventId);
      
      if (event) {
        setSelectedEventForEdit(event);
        setIsEditEventOpen(true);
      }
    } else if (item.kind === 'publication' && item.original?.event) {
      // It's a publication with an associated event
      const event = item.original.event;
      setSelectedEventForEdit(event);
      setIsEditEventOpen(true);
    }
  };

  const handleEditPublication = (item: ContentItem) => {
    // This is called when editing a publication
    if (item.kind === 'publication') {
      // It's a direct publication
      const idMatch = item.id.match(/(\d+)$/);
      if (idMatch) {
        const publicationId = Number(idMatch[1]);
        const publication = safePublications.find(p => p.id === publicationId);
        
        if (publication) {
          setSelectedPublicationForEdit(publication);
          setIsEditPublicationOpen(true);
        }
      }
    } else if (item.kind === 'event' && item.original?.publication_id) {
      // It's an event with a publication
      const publicationId = item.original.publication_id;
      const publication = safePublications.find(p => p.id === publicationId);
      
      if (publication) {
        setSelectedPublicationForEdit(publication);
        setIsEditPublicationOpen(true);
      }
    }
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
    <div className="min-h-screen pb-20 bg-gray-50/50">
      <UnifiedHeader 
        user={user}
        onGoBack={() => navigate(-1)}
        title="Contenido del semillero"
        subtitle="Administra eventos y publicaciones"
      />

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <EventBoardStats
            loading={loading}
            totalContent={totalContent} // Total overall
            totalEvents={safeEvents.length}
            totalPinned={0}
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
              content={sortedEvents}
              pinnedContent={[]}
              onViewDetails={handleViewDetails}
              onDeleteClick={handleDeleteClick}
              onPublish={handlePublish}
              onAttendance={handleAttendance}
              onEditEvent={handleEditEvent}
              onEditPublication={handleEditPublication}
              onCreateEvent={() => navigate("/create-event")}
              onCreatePublication={() => navigate("/create-publication")}
            />
          </TabsContent>

          <TabsContent value="publications" className="mt-0">
            <EventBoardContent
              loading={loading}
              viewMode={viewMode}
              content={sortedPublications}
              pinnedContent={[]}
              onViewDetails={handleViewDetails}
              onDeleteClick={handleDeleteClick}
              onPublish={handlePublish}
              onAttendance={handleAttendance}
              onEditEvent={handleEditEvent}
              onEditPublication={handleEditPublication}
              onCreateEvent={() => navigate("/create-event")}
              onCreatePublication={() => navigate("/create-publication")}
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

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onOpenChange={setIsAttendanceModalOpen}
        eventId={selectedEventForAttendance?.id || null}
        eventTitle={selectedEventForAttendance?.title || ""}
      />

      <EditEventDialog
        open={isEditEventOpen}
        onOpenChange={setIsEditEventOpen}
        event={selectedEventForEdit}
        hasPublication={selectedEventForEdit?.publication_id !== null}
        onUpdateEvent={(data) => {
          if (selectedEventForEdit) {
            updateEventMutation.mutate({
              id: selectedEventForEdit.id,
              data,
            });
          }
        }}
        isPending={updateEventMutation.isPending}
      />

      <EditPublicationDialog
        open={isEditPublicationOpen}
        onOpenChange={setIsEditPublicationOpen}
        publication={selectedPublicationForEdit}
        onUpdatePublication={(data) => {
          if (selectedPublicationForEdit) {
            updatePublicationMutation.mutate({
              id: selectedPublicationForEdit.id,
              data: {
                title: data.title,
                content: data.content,
                type: data.type,
                status: data.saveAsDraft ? "borrador" : data.status,
                visibility: data.visibility,
                summary: data.summary || "",
                image_url: typeof data.image === "string" ? data.image : (data.image instanceof File ? URL.createObjectURL(data.image) : undefined),
              },
            });
          }
        }}
        isPending={updatePublicationMutation.isPending}
      />
    </div>
  );
}
