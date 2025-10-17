import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
  Users,
  Calendar,
  MapPin,
  Clock,
  Settings,
  MoreVertical,
  Pin,
  Share,
} from "lucide-react";
import { useNavigate } from "react-router";

export function EventBoardScreen() {
  const { content, user } = useApp();
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    "grid",
  );

  // Mock pinned content
  const [pinnedContent] = useState(["1", "3"]);

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
              navigate("/dashboard-coordinator")
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
              <h3 className="text-2xl">{content.length}</h3>
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
                {content.reduce(
                  (sum, item) => sum + (item.enrolled || 0),
                  0,
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                Total Inscritos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
                <Pin className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl">
                {pinnedContent.length}
              </h3>
              <p className="text-sm text-muted-foreground">
                Destacados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-orange-100 rounded-lg w-fit mx-auto mb-2">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl">
                {content.reduce(
                  (sum, item) => sum + (item.views || 0),
                  0,
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                Visualizaciones
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Lista/Grid de contenido */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2>Contenido ({sortedContent.length})</h2>
          </div>

          {viewMode === "grid" ? (
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
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
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
          ) : (
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
                          <Button size="sm" variant="ghost">
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
          )}

          {sortedContent.length === 0 && (
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
    </div>
  );
}