
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
import { useApp } from "../context/AppContext";
import {
  ArrowLeft,
  Edit,
  Award,
  Calendar,
  BookOpen,
  Phone,
  MapPin,
  User,
  Mail,
  Save,
  X,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  MapPinIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../stores/auth.store";
import BottomNavbarWrapper from "../nav/BottomNavbarWrapper";
import { useState } from "react";

interface ContactInfo {
  phone: string;
  address: string;
  city: string;
  university: string;
  program: string;
}

export function ProfileScreen() {
  const {
    user,
    certificates,
    events,
    articles,
    userEventParticipations,
    addArticle,
    deleteArticle,
    addUserEventParticipation,
    removeUserEventParticipation,
    logout
  } = useApp();
  const role = useAuthStore(s => s.user?.role ?? "")
  const someUser = useAuthStore(s => s.user)
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [interests, setInterests] = useState(user?.interests?.join(", ") || "");
  const navigate = useNavigate()

  // Estados para artículos
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    description: "",
    publicationDate: "",
    authors: "",
    publicationUrl: "",
  });
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

  // Estados para eventos
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [participationToDelete, setParticipationToDelete] = useState<string | null>(null);

  // Mock contact data - in a real app this would come from the user context
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: "+57 300 123 4567",
    address: "Calle 45 #12-34",
    city: "Bogotá, Colombia",
    university: "Universidad Nacional de Colombia",
    program: "Ingeniería de Sistemas",
  });

  const [editingContactInfo, setEditingContactInfo] =
    useState<ContactInfo>(contactInfo);

  if (!user) {
    return null;
  }

  console.log("role", role, someUser)

  const getBackView = () => {
    if (role === "guest") return "dashboard-guest";
    if (role === "coordinator")
      return "dashboard-coordinator";
    if (role === "mentor") return "dashboard-mentor";
    return "dashboard-member";
  };

  const handleSaveInterests = () => {
    // Mock save interests
    console.log("Saving interests:", interests);
    setIsEditing(false);
  };

  const handleSaveContact = () => {
    setContactInfo(editingContactInfo);
    setIsEditingContact(false);
    console.log("Saving contact info:", editingContactInfo);
  };

  const handleCancelContactEdit = () => {
    setEditingContactInfo(contactInfo);
    setIsEditingContact(false);
  };

  const userCertificates = certificates.filter(cert => cert.userId === user?.id).length;
  const userArticles = articles.filter(article => article.userId === user?.id);
  const userParticipations = userEventParticipations.filter(p => p.userId === user?.id);

  const participatedEvents = events.filter(event =>
    userParticipations.some(p => p.eventId === event.id)
  );

  const availableEvents = events.filter(event =>
    !userParticipations.some(p => p.eventId === event.id)
  );

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "guest":
        return "Invitado";
      case "interested":
        return "Interesado"
      case "coordinator":
        return "Coordinador";
      case "mentor":
        return "Mentor";
      default:
        return "Integrante";
    }
  };

  // Handlers para artículos
  const handleAddArticle = () => {
    if (!newArticle.title || !newArticle.description || !newArticle.publicationDate || !newArticle.authors || !newArticle.publicationUrl) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    addArticle(newArticle);
    setNewArticle({
      title: "",
      description: "",
      publicationDate: "",
      authors: "",
      publicationUrl: "",
    });
    setShowAddArticle(false);
    toast.success("Artículo agregado exitosamente");
  };

  const handleDeleteArticle = () => {
    if (articleToDelete) {
      deleteArticle(articleToDelete);
      toast.success("Artículo eliminado");
      setArticleToDelete(null);
    }
  };

  // Handlers para eventos
  const handleAddEventParticipation = () => {
    if (!selectedEventId) {
      toast.error("Por favor selecciona un evento");
      return;
    }

    addUserEventParticipation(selectedEventId);
    setSelectedEventId("");
    setShowAddEvent(false);
    toast.success("Participación registrada exitosamente");
  };

  const handleRemoveParticipation = () => {
    if (participationToDelete) {
      removeUserEventParticipation(participationToDelete);
      toast.success("Participación eliminada");
      setParticipationToDelete(null);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/" + getBackView())}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1>Mi Perfil</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Información personal */}
        <section>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2>{user.name}</h2>
                  <p className="text-muted-foreground">
                    {user.email}
                  </p>
                  <Badge className="mt-2">
                    {getRoleLabel(role)}
                  </Badge>
                </div>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              {/* Intereses */}
              {role !== "guest" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label>Mis Intereses</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancelar" : "Editar"}
                    </Button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <Textarea
                        value={interests}
                        onChange={(e) =>
                          setInterests(e.target.value)
                        }
                        placeholder="Machine Learning, React, Python..."
                        rows={3}
                      />
                      <Button onClick={handleSaveInterests}>
                        Guardar cambios
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      {user.interests?.join(", ") ||
                        "No has definido intereses aún"}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Información de contacto */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3>Información de Contacto</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingContact(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Teléfono
                    </p>
                    <p>{contactInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mail className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Email
                    </p>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Dirección
                    </p>
                    <p>{contactInfo.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {contactInfo.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Universidad
                    </p>
                    <p>{contactInfo.university}</p>
                    <p className="text-sm text-muted-foreground">
                      {contactInfo.program}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Dialog para editar información de contacto */}
        <Dialog
          open={isEditingContact}
          onOpenChange={setIsEditingContact}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Editar Información de Contacto
              </DialogTitle>
              <DialogDescription>
                Actualiza tu información de contacto personal.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Teléfono</label>
                <Input
                  value={editingContactInfo.phone}
                  onChange={(e) =>
                    setEditingContactInfo({
                      ...editingContactInfo,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div>
                <label className="text-sm">Dirección</label>
                <Input
                  value={editingContactInfo.address}
                  onChange={(e) =>
                    setEditingContactInfo({
                      ...editingContactInfo,
                      address: e.target.value,
                    })
                  }
                  placeholder="Calle 45 #12-34"
                />
              </div>

              <div>
                <label className="text-sm">Ciudad</label>
                <Input
                  value={editingContactInfo.city}
                  onChange={(e) =>
                    setEditingContactInfo({
                      ...editingContactInfo,
                      city: e.target.value,
                    })
                  }
                  placeholder="Bogotá, Colombia"
                />
              </div>

              <div>
                <label className="text-sm">Universidad</label>
                <Input
                  value={editingContactInfo.university}
                  onChange={(e) =>
                    setEditingContactInfo({
                      ...editingContactInfo,
                      university: e.target.value,
                    })
                  }
                  placeholder="Universidad Nacional de Colombia"
                />
              </div>

              <div>
                <label className="text-sm">
                  Programa Académico
                </label>
                <Input
                  value={editingContactInfo.program}
                  onChange={(e) =>
                    setEditingContactInfo({
                      ...editingContactInfo,
                      program: e.target.value,
                    })
                  }
                  placeholder="Ingeniería de Sistemas"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={handleCancelContactEdit}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSaveContact}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Estadísticas de participación */}
        {role !== "guest" && (
          <section>
            <h2 className="mb-4">Mi Participación</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl">{participatedEvents.length}</h3>
                  <p className="text-sm text-muted-foreground">
                    Eventos Registrados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl">
                    {userCertificates}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Certificados
                  </p>
                </CardContent>
              </Card>

              <Card className="col-span-2 md:col-span-1">
                <CardContent className="p-4 text-center">
                  <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-2xl">{userArticles.length}</h3>
                  <p className="text-sm text-muted-foreground">
                    Artículos Escritos
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Mis Eventos */}
        {role !== "guest" && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2>Mis Eventos</h2>
              <Button onClick={() => setShowAddEvent(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Evento
              </Button>
            </div>

            {participatedEvents.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No has registrado participación en ningún evento aún
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {participatedEvents.map((event) => {
                  const participation = userParticipations.find(p => p.eventId === event.id);
                  return (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="line-clamp-1 mb-1">{event.title}</h4>
                            <Badge variant="secondary" className="mb-2">
                              {event.category}
                            </Badge>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPinIcon className="h-3 w-3" />
                                <span className="capitalize">{event.modality}</span>
                              </div>
                              {participation && (
                                <div className="flex items-center gap-2 text-green-600">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span className="text-xs">
                                    Registrado el {formatDate(participation.registrationDate)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setParticipationToDelete(participation?.id || null)}
                            className="text-destructive hover:text-destructive shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Mis Artículos */}
        {role !== "guest" && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2>Mis Artículos</h2>
              <Button onClick={() => setShowAddArticle(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Artículo
              </Button>
            </div>

            {userArticles.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No has agregado ningún artículo aún
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {userArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="line-clamp-2 mb-2">{article.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {article.description}
                          </p>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                            <span>
                              <strong>Autores:</strong> {article.authors}
                            </span>
                            <span>•</span>
                            <span>{formatDate(article.publicationDate)}</span>
                          </div>
                          <a
                            href={article.publicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            Ver publicación
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setArticleToDelete(article.id)}
                          className="text-destructive hover:text-destructive shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Certificados recientes */}
        {role !== "guest" && userCertificates > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2>Certificados Recientes</h2>
              <Button
                variant="outline"
                onClick={() => navigate("/certificates")}
              >
                Ver todos
              </Button>
            </div>

            <div className="space-y-3">
              {certificates
                .filter(cert => cert.userId === user.id)
                .slice(0, 3)
                .map((cert) => (
                  <Card key={cert.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4>{cert.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cert.topic} • {formatDate(cert.uploadDate)}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Descargar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        )}

        {/* Configuración */}
        <section>
          <Card>
            <CardHeader>
              <h3>Configuración</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                Cambiar contraseña
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                Notificaciones
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                Privacidad
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={logout}
              >
                Cerrar sesión
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Dialog para agregar artículo */}
      <Dialog open={showAddArticle} onOpenChange={setShowAddArticle}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Artículo</DialogTitle>
            <DialogDescription>
              Registra un artículo científico o publicación en la que hayas participado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="article-title">Título del artículo *</Label>
              <Input
                id="article-title"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                placeholder="Ej: Aplicación de Deep Learning en..."
              />
            </div>

            <div>
              <Label htmlFor="article-description">Descripción *</Label>
              <Textarea
                id="article-description"
                value={newArticle.description}
                onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                placeholder="Breve descripción del artículo"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="article-authors">Autores *</Label>
              <Input
                id="article-authors"
                value={newArticle.authors}
                onChange={(e) => setNewArticle({ ...newArticle, authors: e.target.value })}
                placeholder="Juan Pérez, María González"
              />
            </div>

            <div>
              <Label htmlFor="article-date">Fecha de publicación *</Label>
              <Input
                id="article-date"
                type="date"
                value={newArticle.publicationDate}
                onChange={(e) => setNewArticle({ ...newArticle, publicationDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="article-url">URL de publicación *</Label>
              <Input
                id="article-url"
                type="url"
                value={newArticle.publicationUrl}
                onChange={(e) => setNewArticle({ ...newArticle, publicationUrl: e.target.value })}
                placeholder="https://ejemplo.com/articulo"
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowAddArticle(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddArticle}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Agregar Artículo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para agregar evento */}
      <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Participación en Evento</DialogTitle>
            <DialogDescription>
              Selecciona un evento en el que participaste o participarás.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="event-select">Seleccionar evento *</Label>
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger id="event-select">
                  <SelectValue placeholder="Selecciona un evento" />
                </SelectTrigger>
                <SelectContent>
                  {availableEvents.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No hay eventos disponibles
                    </div>
                  ) : (
                    availableEvents.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedEventId && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  {(() => {
                    const event = events.find(e => e.id === selectedEventId);
                    return event ? (
                      <div className="space-y-2 text-sm">
                        <p><strong>Categoría:</strong> {event.category}</p>
                        <p><strong>Fecha:</strong> {formatDate(event.date)}</p>
                        <p><strong>Modalidad:</strong> {event.modality}</p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowAddEvent(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddEventParticipation} disabled={!selectedEventId}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Registrar Participación
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AlertDialog para eliminar artículo */}
      <AlertDialog open={!!articleToDelete} onOpenChange={() => setArticleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar artículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El artículo será eliminado permanentemente de tu perfil.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteArticle}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog para eliminar participación */}
      <AlertDialog open={!!participationToDelete} onOpenChange={() => setParticipationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar participación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará tu registro de participación en este evento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveParticipation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Navigation Bar */}
      <BottomNavbarWrapper role={role}/>
    </div>
  );
}
