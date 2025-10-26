import React, { useState } from "react";
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
  MessageSquare,
  FileText,
  Settings,
  Share,
} from "lucide-react";
import { useNavigate } from "react-router";
import BottomNavbarWrapper from "../nav/BottomNavbarWrapper";
import useUser from "../../hooks/useUser";

interface Publication {
  id: string;
  title: string;
  type: "comunicado" | "articulo" | "anuncio";
  content: string;
  excerpt: string;
  author: string;
  date: string;
  status: "draft" | "published" | "archived";
  visibility: "all" | "mentors" | "members" | "coordinators";
  views: number;
  comments: number;
}

export function PublicationsScreen() {

  const user = useUser();
  const role = user?.role ?? ""
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock publications data
  const [publications] = useState<Publication[]>([
    {
      id: "1",
      title: "Convocatoria: Taller de Machine Learning",
      type: "comunicado",
      content:
        "Se abre convocatoria para el taller de Machine Learning que se realizará el próximo mes...",
      excerpt:
        "Se abre convocatoria para el taller de Machine Learning...",
      author: "Dr. María González",
      date: "2024-01-20",
      status: "published",
      visibility: "all",
      views: 234,
      comments: 12,
    },
    {
      id: "2",
      title: "Resultados del Hackathon 2024",
      type: "articulo",
      content:
        "El pasado fin de semana se llevó a cabo nuestro hackathon anual con excelentes resultados...",
      excerpt:
        "Resumen de los resultados del hackathon anual...",
      author: "Carlos López",
      date: "2024-01-18",
      status: "published",
      visibility: "members",
      views: 156,
      comments: 8,
    },
    {
      id: "3",
      title: "Cambios en el horario de reuniones",
      type: "anuncio",
      content:
        "Informamos que a partir del próximo lunes habrá cambios en los horarios...",
      excerpt:
        "Cambios importantes en los horarios de reunión...",
      author: "Ana Rodríguez",
      date: "2024-01-15",
      status: "draft",
      visibility: "coordinators",
      views: 0,
      comments: 0,
    },
    {
      id: "4",
      title: "Nuevas oportunidades de investigación",
      type: "comunicado",
      content:
        "Estamos emocionados de anunciar nuevas oportunidades de investigación...",
      excerpt:
        "Nuevas oportunidades de investigación disponibles...",
      author: "Dr. Roberto Silva",
      date: "2024-01-10",
      status: "published",
      visibility: "mentors",
      views: 89,
      comments: 5,
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "comunicado":
        return <MessageSquare className="h-4 w-4" />;
      case "articulo":
        return <FileText className="h-4 w-4" />;
      case "anuncio":
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "comunicado":
        return "bg-blue-100 text-blue-700";
      case "articulo":
        return "bg-green-100 text-green-700";
      case "anuncio":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "archived":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Publicado";
      case "draft":
        return "Borrador";
      case "archived":
        return "Archivado";
      default:
        return status;
    }
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case "all":
        return "Todos";
      case "mentors":
        return "Mentores";
      case "members":
        return "Integrantes";
      case "coordinators":
        return "Coordinadores";
      default:
        return visibility;
    }
  };

  const filteredPublications = publications.filter((pub) => {
    const matchesSearch =
      pub.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      pub.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" || pub.type === filterType;
    const matchesStatus =
      filterStatus === "all" || pub.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
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
            <h1>Mis Publicaciones</h1>
            <p className="text-primary-foreground/80">
              Gestiona tus comunicados y artículos
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate("/create-publication")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Búsqueda y filtros */}
        <section>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar publicaciones..."
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
                    value={filterType}
                    onValueChange={setFilterType}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        Todos los tipos
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
                      <SelectItem value="published">
                        Publicados
                      </SelectItem>
                      <SelectItem value="draft">
                        Borradores
                      </SelectItem>
                      <SelectItem value="archived">
                        Archivados
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
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl">
                {publications.length}
              </h3>
              <p className="text-sm text-muted-foreground">
                Total Publicaciones
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl">
                {publications.reduce(
                  (sum, pub) => sum + pub.views,
                  0,
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                Total Visualizaciones
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl">
                {publications.reduce(
                  (sum, pub) => sum + pub.comments,
                  0,
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                Comentarios
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-orange-100 rounded-lg w-fit mx-auto mb-2">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl">
                {
                  publications.filter(
                    (pub) => pub.status === "published",
                  ).length
                }
              </h3>
              <p className="text-sm text-muted-foreground">
                Publicadas
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Lista de publicaciones */}
        <section>
          <div className="space-y-4">
            {filteredPublications.map((publication) => (
              <Card key={publication.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg ${getTypeColor(publication.type)}`}
                    >
                      {getTypeIcon(publication.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="line-clamp-1">
                            {publication.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {publication.excerpt}
                          </p>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Badge
                            className={`text-xs ${getStatusColor(publication.status)}`}
                          >
                            {getStatusLabel(publication.status)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {getVisibilityLabel(
                              publication.visibility,
                            )}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>Por {publication.author}</span>
                          <span>
                            {new Date(
                              publication.date,
                            ).toLocaleDateString("es-ES")}
                          </span>
                          {publication.status ===
                            "published" && (
                            <>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {publication.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {publication.comments}
                              </span>
                            </>
                          )}
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPublications.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3>No se encontraron publicaciones</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ||
                  filterType !== "all" ||
                  filterStatus !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Aún no tienes publicaciones. ¡Crea tu primera publicación!"}
                </p>
                <Button
                  onClick={() =>
                    navigate("/create-publication")
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Publicación
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      {/* Navigation Bar */}
      <BottomNavbarWrapper role={role} />
    </div>
  );
}
