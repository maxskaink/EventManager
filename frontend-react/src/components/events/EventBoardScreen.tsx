import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { BNavBarMentor } from "../ui/b-navbar-mentor";
import { BNavBarMember } from "../ui/b-navbar-member";
import { BNavBarCoordinator } from "../ui/b-navbar-coordinator";
import { BNavBarGuest } from "../ui/b-navbar-guest";
import { useApp } from "../context/AppContext";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  AlertTriangle,
  Users,
  Calendar,
  MapPin,
  Clock,
  Settings,
  MoreVertical,
  Pin,
  Share,
  Info,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { getDashboardRouteFromRole } from "../../services/navigation/redirects";
import { EventAPI, ArticleAPI, PublicationAPI } from "../../services/api";
import { toast } from "sonner";

export function EventBoardScreen() {
  const { user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<API.Event[]>([]);
  const [articles, setArticles] = useState<API.Article[]>([]);
  const [selectedItem, setSelectedItem] = useState<{
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
  } | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: string;
    title: string;
  } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleViewDetails = (item: typeof selectedItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (item: { id: string; type: string; title: string }) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'articulo') {
        // Extraer el ID numérico del artículo (el formato es "article-{id}")
        const articleId = parseInt(itemToDelete.id.replace('article-', ''));
        await ArticleAPI.deleteArticle(articleId);
        toast.success('✅ Artículo eliminado exitosamente');
      } else {
        // Para eventos, necesitaríamos un endpoint de delete
        // Por ahora, mostrar un mensaje
        toast.error('La funcionalidad de eliminar eventos aún no está disponible');
        setIsDeleteDialogOpen(false);
        setItemToDelete(null);
        return;
      }

      // Recargar el contenido
      await loadContent();
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Error deleting item:', error);
      const message = error.response?.data?.message || 'Error al eliminar el elemento';
      toast.error(message);
    }
  };

  // Mock pinned content (TODO: implement pinning feature)
  const [pinnedContent] = useState<string[]>([]);

  // Load events and articles from API
  // Recargar cuando se navega a esta página (útil después de crear un evento)
  useEffect(() => {
    loadContent();
  }, [location.pathname]);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      // Cargar eventos
      const eventsData = await EventAPI.listAllEvents();
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      
      // Cargar artículos/publicaciones según el rol del usuario
      // Los coordinadores usan Publications, los mentores usan Articles
      let articlesData: any[] = [];
      if (user?.role === 'coordinator') {
        try {
          const publicationsData = await PublicationAPI.listAllPublications();
          articlesData = Array.isArray(publicationsData) ? publicationsData : [];
        } catch (pubError: any) {
          console.error('Error loading publications:', pubError);
          // Si falla, intentar con articles propios
          try {
            articlesData = await ArticleAPI.listMyArticles();
            articlesData = Array.isArray(articlesData) ? articlesData : [];
          } catch (articleError) {
            console.error('Error loading my articles:', articleError);
            articlesData = [];
          }
        }
      } else if (user?.role === 'mentor') {
        // Los mentores pueden ver todos los artículos
        try {
          articlesData = await ArticleAPI.listAllArticles();
          articlesData = Array.isArray(articlesData) ? articlesData : [];
        } catch (error) {
          console.error('Error loading articles:', error);
          articlesData = [];
        }
      } else {
        // Para otros roles, usar sus propios artículos
        try {
          articlesData = await ArticleAPI.listMyArticles();
          articlesData = Array.isArray(articlesData) ? articlesData : [];
        } catch (error) {
          console.error('Error loading my articles:', error);
          articlesData = [];
        }
      }
      
      setArticles(articlesData);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Error al cargar el contenido');
      // En caso de error, asegurar que sean arrays vacíos
      setEvents([]);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to match the old content format
  // Asegurar que events y articles sean arrays antes de hacer map
  const safeEvents = Array.isArray(events) ? events : [];
  const safeArticles = Array.isArray(articles) ? articles : [];
  
  const content = [
    // Events
    ...safeEvents.map(event => ({
      id: event.id.toString(),
      type: event.event_type,
      title: event.name,
      description: event.description,
      date: event.start_date.split('T')[0],
      time: event.start_date.split('T')[1]?.substring(0, 5) || undefined,
      location: event.location || event.modality,
      status: event.status === 'activo' ? 'upcoming' : 
              event.status === 'inactivo' ? 'completed' : 
              event.status === 'cancelado' ? 'cancelled' : 'upcoming',
      capacity: event.capacity,
      enrolled: 0, // TODO: implement enrollment tracking
      views: undefined,
    })),
    // Articles or Publications as publications
    ...safeArticles.map(item => {
      // Si es una Publication (tiene published_at o author_id)
      if (item.published_at || item.author_id) {
        return {
          id: `publication-${item.id}`,
          type: item.type || 'publicacion',
          title: item.title,
          description: item.summary || item.content || '',
          date: item.published_at || item.created_at,
          time: undefined,
          location: undefined,
          status: item.status === 'published' ? 'published' : 'draft',
          capacity: undefined,
          enrolled: undefined,
          views: 0,
        };
      }
      // Si es un Article (tiene publication_date y authors)
      return {
        id: `article-${item.id}`,
        type: 'articulo',
        title: item.title,
        description: item.description || '',
        date: item.publication_date,
        time: undefined,
        location: undefined,
        status: 'published',
        capacity: undefined,
        enrolled: undefined,
        views: 0, // TODO: implement view tracking
      };
    }),
  ];

  const filteredContent = content.filter((item) => {
    const matchesSearch =
      item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ||
      item.type === filterCategory;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedContent = [...filteredContent].sort((a, b) => {
    // Pinned content first
    const aPinned = pinnedContent.includes(a.id);
    const bPinned = pinnedContent.includes(b.id);

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    // Then by date
    return (
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "charla":
        return "bg-blue-100 text-blue-700";
      case "curso":
        return "bg-green-100 text-green-700";
      case "convocatoria":
        return "bg-purple-100 text-purple-700";
      case "comunicado":
        return "bg-cyan-100 text-cyan-700";
      case "articulo":
        return "bg-teal-100 text-teal-700";
      case "anuncio":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const isEventType = (type: string) => {
    return type === "charla" || type === "curso" || type === "convocatoria";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Próximo";
      case "ongoing":
        return "En curso";
      case "completed":
        return "Completado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getOccupancyLevel = (
    enrolled: number,
    capacity: number,
  ) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90)
      return { color: "text-red-600", label: "Lleno" };
    if (percentage >= 70)
      return { color: "text-yellow-600", label: "Alto" };
    if (percentage >= 40)
      return { color: "text-blue-600", label: "Medio" };
    return { color: "text-green-600", label: "Bajo" };
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              navigate(getDashboardRouteFromRole(user?.role || ""))
            }
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1>Contenido del Semillero</h1>
            <p className="text-primary-foreground/80">
              Administra eventos y publicaciones
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate("/create-event")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nuevo Evento
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/create-publication")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nueva Publicación
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Búsqueda y filtros */}
        <section>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar contenido..."
                      value={searchQuery}
                      onChange={(e) =>
                        setSearchQuery(e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        Todos los tipos
                      </SelectItem>
                      <SelectItem value="charla">
                        Charlas
                      </SelectItem>
                      <SelectItem value="curso">
                        Cursos
                      </SelectItem>
                      <SelectItem value="convocatoria">
                        Convocatorias
                      </SelectItem>
                      <SelectItem value="comunicado">
                        Comunicados
                      </SelectItem>
                      <SelectItem value="articulo">
                        Artículos
                      </SelectItem>
                      <SelectItem value="anuncio">
                        Anuncios
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filterStatus}
                    onValueChange={setFilterStatus}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="upcoming">
                        Próximos
                      </SelectItem>
                      <SelectItem value="ongoing">
                        En curso
                      </SelectItem>
                      <SelectItem value="completed">
                        Completados
                      </SelectItem>
                      <SelectItem value="published">
                        Publicados
                      </SelectItem>
                      <SelectItem value="draft">
                        Borradores
                      </SelectItem>
                      <SelectItem value="archived">
                        Archivados
                      </SelectItem>
                      <SelectItem value="cancelled">
                        Cancelados
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={viewMode}
                    onValueChange={(value: "grid" | "list") =>
                      setViewMode(value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">
                        Cuadrícula
                      </SelectItem>
                      <SelectItem value="list">
                        Lista
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Estadísticas rápidas */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl">{loading ? "..." : content.length}</h3>
              <p className="text-sm text-muted-foreground">
                Total Contenido
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl">
                {loading ? "..." : safeEvents.length}
              </h3>
              <p className="text-sm text-muted-foreground">
                Eventos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
                <Pin className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl">
                {loading ? "..." : safeArticles.length}
              </h3>
              <p className="text-sm text-muted-foreground">
                Artículos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-orange-100 rounded-lg w-fit mx-auto mb-2">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl">
                {loading ? "..." : pinnedContent.length}
              </h3>
              <p className="text-sm text-muted-foreground">
                Destacados
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Lista/Grid de contenido */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2>Contenido ({loading ? "..." : sortedContent.length})</h2>
          </div>

          {loading && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando contenido...</p>
              </CardContent>
            </Card>
          )}

          {!loading && viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedContent.map((item) => {
                const isPinned = pinnedContent.includes(
                  item.id,
                );
                const isEvent = isEventType(item.type);
                const occupancy = isEvent && item.capacity && item.enrolled ? getOccupancyLevel(
                  item.enrolled,
                  item.capacity,
                ) : null;

                return (
                  <Card
                    key={item.id}
                    className={
                      isPinned ? "border-blue-500 border-2" : ""
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex gap-2">
                          <Badge
                            className={`text-xs ${getTypeColor(item.type)}`}
                          >
                            {item.type}
                          </Badge>
                          <Badge
                            className={`text-xs ${getStatusColor(item.status)}`}
                          >
                            {getStatusLabel(item.status)}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1">
                          {isPinned && (
                            <Pin className="h-4 w-4 text-blue-500" />
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => handleDeleteClick({
                                  id: item.id,
                                  type: item.type,
                                  title: item.title
                                })}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <h4 className="line-clamp-2 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {item.description}
                      </p>

                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(
                              item.date,
                            ).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                        {isEvent && item.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{item.time}</span>
                          </div>
                        )}
                        {isEvent && item.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{item.location}</span>
                          </div>
                        )}
                        {isEvent && occupancy && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className={occupancy.color}>
                              {item.enrolled}/{item.capacity} -{" "}
                              {occupancy.label}
                            </span>
                          </div>
                        )}
                        {!isEvent && item.views !== undefined && (
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>{item.views} visualizaciones</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewDetails(item)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : !loading ? (
            <div className="space-y-3">
              {sortedContent.map((item) => {
                const isPinned = pinnedContent.includes(
                  item.id,
                );
                const isEvent = isEventType(item.type);
                const occupancy = isEvent && item.capacity && item.enrolled ? getOccupancyLevel(
                  item.enrolled,
                  item.capacity,
                ) : null;

                return (
                  <Card
                    key={item.id}
                    className={
                      isPinned
                        ? "border-blue-500 border-l-4"
                        : ""
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {isPinned && (
                              <Pin className="h-4 w-4 text-blue-500" />
                            )}
                            <h4 className="line-clamp-1">
                              {item.title}
                            </h4>
                            <Badge
                              className={`text-xs ${getTypeColor(item.type)}`}
                            >
                              {item.type}
                            </Badge>
                            <Badge
                              className={`text-xs ${getStatusColor(item.status)}`}
                            >
                              {getStatusLabel(item.status)}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {item.description}
                          </p>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(
                                  item.date,
                                ).toLocaleDateString("es-ES")}
                              </span>
                            </div>
                            {isEvent && item.time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{item.time}</span>
                              </div>
                            )}
                            {isEvent && item.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{item.location}</span>
                              </div>
                            )}
                            {isEvent && occupancy && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span className={occupancy.color}>
                                  {item.enrolled}/
                                  {item.capacity}
                                </span>
                              </div>
                            )}
                            {!isEvent && item.views !== undefined && (
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>{item.views} vistas</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleViewDetails(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : null}

          {!loading && sortedContent.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3>No se encontró contenido</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ||
                  filterCategory !== "all" ||
                  filterStatus !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Aún no hay contenido creado."}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => navigate("/create-event")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Evento
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/create-publication")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Publicación
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      {/* Navigation Bar */}
      {user && user.role === "coordinator" && (
        <BNavBarCoordinator />
      )}
      {user && user.role === "guest" && <BNavBarGuest />}
      {user && user.role === "member" && <BNavBarMember />}
      {user && user.role === "mentor" && <BNavBarMentor />}

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedItem?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <div className="flex gap-2 mt-2">
                  <Badge className={getTypeColor(selectedItem.type)}>
                    {selectedItem.type}
                  </Badge>
                  <Badge className={getStatusColor(selectedItem.status)}>
                    {getStatusLabel(selectedItem.status)}
                  </Badge>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 mt-4">
            {/* Descripción */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Descripción
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {selectedItem.description}
              </p>
            </div>

            {/* Información de Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium">
                    {new Date(selectedItem.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {selectedItem.time && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <p className="font-medium">{selectedItem.time}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Información específica de eventos */}
            {isEventType(selectedItem.type) && (
              <>
                {selectedItem.location && (
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ubicación / Modalidad</p>
                      <p className="font-medium">{selectedItem.location}</p>
                    </div>
                  </div>
                )}
                {selectedItem.capacity && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Capacidad</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {selectedItem.enrolled || 0} / {selectedItem.capacity} participantes
                        </p>
                        {selectedItem.enrolled !== undefined && selectedItem.capacity && (
                          <div className="flex-1 bg-background rounded-full h-2 max-w-xs">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(selectedItem.enrolled / selectedItem.capacity) * 100}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Información específica de artículos */}
            {selectedItem.type === "articulo" && selectedItem.views !== undefined && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Eye className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Visualizaciones</p>
                  <p className="font-medium">{selectedItem.views} vistas</p>
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">ID</p>
                  <p className="font-medium">{selectedItem.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estado</p>
                  <Badge className={getStatusColor(selectedItem.status)}>
                    {getStatusLabel(selectedItem.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          )}

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Cerrar
            </Button>
            {selectedItem && isEventType(selectedItem.type) && (
              <Button onClick={() => {
                // TODO: Implementar inscripción al evento
                toast.info("Funcionalidad de inscripción próximamente");
              }}>
                Inscribirse
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              ¿Eliminar {itemToDelete?.type === 'articulo' ? 'artículo' : 'evento'}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente{" "}
              <strong>"{itemToDelete?.title}"</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false);
              setItemToDelete(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}