import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { BNavBarMentor } from "../ui/b-navbar-mentor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import brainImage from "../../assets/brain.png";
import { useApp } from "../context/AppContext";
import { UserAPI } from "../../services/api";
import { toast } from "sonner";
import {
  Users,
  Settings,
  TrendingUp,
  Calendar,
  Award,
  FileText,
  Edit3,
  CheckCircle,
  CheckCircle2,
  XCircle,
  BarChart3,
  Search,
  Bell,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router";

// Mock data for mentor functionalities
const mockUsers = [
  {
    id: "1",
    name: "Ana García",
    email: "ana.garcia@universidad.edu",
    role: "member" as const,
    joinDate: "2025-01-15",
    progress: 75,
    eventsAttended: 8,
    certificatesEarned: 3,
  },
  {
    id: "2",
    name: "Carlos López",
    email: "carlos.lopez@universidad.edu",
    role: "coordinator" as const,
    joinDate: "2024-09-10",
    progress: 90,
    eventsAttended: 12,
    certificatesEarned: 5,
  },
  {
    id: "3",
    name: "María Rodríguez",
    email: "maria.rodriguez@universidad.edu",
    role: "member" as const,
    joinDate: "2025-02-20",
    progress: 60,
    eventsAttended: 5,
    certificatesEarned: 2,
  },
];

const mockSubmissions = [
  {
    id: "1",
    type: "event",
    title: "Workshop de IA Generativa",
    submittedById: null, // Se asignará al primer usuario disponible
    date: "2025-09-25",
    status: "pending",
    description:
      "Taller sobre herramientas de IA generativa para estudiantes",
  },
  {
    id: "2",
    type: "certificate",
    title: "Certificado React Avanzado",
    submittedById: null, // Se asignará al segundo usuario disponible
    date: "2025-09-20",
    status: "pending",
    description:
      "Certificado por completar el curso de React avanzado",
  },
  {
    id: "3",
    type: "article",
    title: "Artículo sobre Machine Learning",
    submittedById: null, // Se asignará al tercer usuario disponible
    date: "2025-09-18",
    status: "approved",
    description:
      "Artículo de investigación sobre algoritmos de ML",
  },
];

export function MentorDashboard() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [newRole, setNewRole] = useState<string>("");
  const [users, setUsers] = useState<API.User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for new user dialog
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isRoleChangeOpen, setIsRoleChangeOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "interested" as API.UserRole,
  });

  // State for submissions
  const [submissions, setSubmissions] = useState(mockSubmissions);

  // State for profile and report modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<typeof mockUsers[0] | null>(null);
  const [isGeneralReportOpen, setIsGeneralReportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Load users from API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await UserAPI.listActiveUsers();
      setUsers(response);
    } catch (error) {
      toast.error("Error al cargar usuarios");
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserData.name || !newUserData.email || !newUserData.role) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    try {
      await UserAPI.createUser(newUserData.name, newUserData.email, newUserData.role);
      toast.success("Usuario creado exitosamente");
      setIsAddUserOpen(false);
      setNewUserData({ name: "", email: "", role: "interested" });
      loadUsers(); // Reload users list
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al crear usuario";
      toast.error(message);
      console.error("Error creating user:", error);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await UserAPI.toggleUserRole(userId, newRole as API.UserRole);
      toast.success("Rol cambiado exitosamente");
      setIsRoleChangeOpen(false);
      setNewRole("");
      setSelectedUserId(null);
      loadUsers(); // Reload users list
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al cambiar rol";
      toast.error(message);
      console.error("Error changing role:", error);
    }
  };

  const handleApproveSubmission = (submissionId: string) => {
    setSubmissions(submissions.map(sub => 
      sub.id === submissionId 
        ? { ...sub, status: "approved" as const }
        : sub
    ));
    toast.success("✅ Contenido aprobado exitosamente");
  };

  const handleRejectSubmission = (submissionId: string) => {
    setSubmissions(submissions.map(sub => 
      sub.id === submissionId 
        ? { ...sub, status: "rejected" as const }
        : sub
    ));
    toast.error("❌ Contenido rechazado");
  };

  const handleEditSubmission = (submissionId: string) => {
    const submission = submissions.find(sub => sub.id === submissionId);
    if (submission) {
      toast.info(`📝 Editando: ${submission.title}`);
      // Aquí podrías abrir un modal de edición
      console.log("Editar submission:", submission);
    }
  };

  const handleViewProfile = (member: typeof mockUsers[0]) => {
    setSelectedMember(member);
    setIsProfileModalOpen(true);
  };

  const handleGenerateReport = (member: typeof mockUsers[0]) => {
    setSelectedMember(member);
    setIsReportModalOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const pendingSubmissions = submissions.filter(
    (sub) => sub.status === "pending",
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={brainImage}
                alt="Logo del Semillero"
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1>Panel de Mentor</h1>
                <p className="text-muted-foreground">
                  Gestión avanzada del semillero
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotificationsOpen(true)}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                  3
                </Badge>
              </Button>

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">
                  {user?.name}
                </span>
                <Badge variant="secondary">Mentor</Badge>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Usuarios
                  </p>
                  <p className="text-2xl font-semibold">
                    {loading ? "..." : users.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Mentores
                  </p>
                  <p className="text-2xl font-semibold">
                    {loading ? "..." : users.filter(u => u.role === "mentor").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Integrantes
                  </p>
                  <p className="text-2xl font-semibold">
                    {loading ? "..." : users.filter(u => u.role === "member").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Settings className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Coordinadores
                  </p>
                  <p className="text-2xl font-semibold">
                    {loading ? "..." : users.filter(u => u.role === "coordinator").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">
              Gestión de Usuarios
            </TabsTrigger>
            <TabsTrigger value="progress">
              Seguimiento de Progreso
            </TabsTrigger>
            <TabsTrigger value="submissions">
              Revisión de Contenido
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) =>
                          setSearchTerm(e.target.value)
                        }
                        className="pl-10 w-full sm:w-auto"
                      />
                    </div>
                    <Select
                      value={selectedRole}
                      onValueChange={setSelectedRole}
                    >
                      <SelectTrigger className="w-full sm:w-auto">
                        <SelectValue placeholder="Filtrar por rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todos los roles
                        </SelectItem>
                        <SelectItem value="interested">
                          Interesado
                        </SelectItem>
                        <SelectItem value="member">
                          Integrante
                        </SelectItem>
                        <SelectItem value="coordinator">
                          Coordinador
                        </SelectItem>
                        <SelectItem value="mentor">
                          Mentor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                      <DialogTrigger asChild>
                        <Button variant="default" className="gap-2">
                          <UserPlus className="h-4 w-4" />
                          Agregar Usuario
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                          <DialogDescription>
                            Crea un nuevo usuario manualmente. Podrá iniciar sesión con Google usando el email proporcionado.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input
                              id="name"
                              value={newUserData.name}
                              onChange={(e) =>
                                setNewUserData({ ...newUserData, name: e.target.value })
                              }
                              placeholder="Juan Pérez"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newUserData.email}
                              onChange={(e) =>
                                setNewUserData({ ...newUserData, email: e.target.value })
                              }
                              placeholder="juan.perez@unicauca.edu.co"
                            />
                          </div>
                          <div>
                            <Label htmlFor="role">Rol</Label>
                            <Select
                              value={newUserData.role}
                              onValueChange={(value) =>
                                setNewUserData({ ...newUserData, role: value as API.UserRole })
                              }
                            >
                              <SelectTrigger id="role">
                                <SelectValue placeholder="Seleccionar rol" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="interested">Interesado</SelectItem>
                                <SelectItem value="member">Integrante</SelectItem>
                                <SelectItem value="coordinator">Coordinador</SelectItem>
                                <SelectItem value="mentor">Mentor</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsAddUserOpen(false);
                                setNewUserData({ name: "", email: "", role: "interested" });
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button onClick={handleCreateUser}>
                              Crear Usuario
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Cargando usuarios...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">
                      No se encontraron usuarios
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm || selectedRole !== "all" 
                        ? "Intenta cambiar los filtros de búsqueda"
                        : "Comienza agregando un nuevo usuario"}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Rol Actual</TableHead>
                        <TableHead>Email Verificado</TableHead>
                        <TableHead>Último Acceso</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                  {user.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("") || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {user.name || "Sin nombre"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "coordinator"
                                  ? "default"
                                  : user.role === "mentor"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {user.role === "interested"
                                ? "Interesado"
                                : user.role === "member"
                                  ? "Integrante"
                                  : user.role === "coordinator"
                                    ? "Coordinador"
                                    : "Mentor"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.email_verified_at ? (
                              <Badge variant="outline" className="bg-green-50">
                                ✓ Verificado
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-50">
                                Pendiente
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {user.last_login_at 
                              ? new Date(user.last_login_at).toLocaleDateString()
                              : "Nunca"}
                          </TableCell>
                          <TableCell>
                            <Dialog 
                              open={isRoleChangeOpen && selectedUserId === user.id}
                              onOpenChange={(open) => {
                                setIsRoleChangeOpen(open);
                                if (!open) {
                                  setSelectedUserId(null);
                                  setNewRole("");
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUserId(user.id);
                                    setIsRoleChangeOpen(true);
                                    setNewRole(user.role);
                                  }}
                                >
                                  <Settings className="h-4 w-4 mr-2" />
                                  Cambiar Rol
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Cambiar Rol de Usuario
                                  </DialogTitle>
                                  <DialogDescription>
                                    Selecciona el nuevo rol que deseas asignar a este usuario.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p>
                                    Cambiar rol de: <strong>{user.name}</strong>
                                  </p>
                                  <div>
                                    <Label htmlFor="new-role">Nuevo Rol</Label>
                                    <Select
                                      value={newRole}
                                      onValueChange={setNewRole}
                                    >
                                      <SelectTrigger id="new-role">
                                        <SelectValue placeholder="Seleccionar nuevo rol" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="interested">
                                          Interesado
                                        </SelectItem>
                                        <SelectItem value="member">
                                          Integrante
                                        </SelectItem>
                                        <SelectItem value="coordinator">
                                          Coordinador
                                        </SelectItem>
                                        <SelectItem value="mentor">
                                          Mentor
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setIsRoleChangeOpen(false);
                                        setNewRole("");
                                        setSelectedUserId(null);
                                      }}
                                    >
                                      Cancelar
                                    </Button>
                                    <Button
                                      onClick={() => handleRoleChange(user.id, newRole)}
                                      disabled={!newRole || newRole === user.role}
                                    >
                                      Confirmar Cambio
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tracking Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Seguimiento de Progreso de Integrantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Cargando integrantes...</p>
                  </div>
                ) : users.filter((u) => u.role === "member").length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">
                      No hay integrantes registrados
                    </h3>
                    <p className="text-muted-foreground">
                      Los usuarios con rol "Integrante" aparecerán aquí.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {users
                      .filter((user) => user.role === "member")
                      .map((user) => {
                        // Datos temporales para métricas (hasta implementar en backend)
                        const progress = Math.floor(Math.random() * 40) + 40; // 40-80%
                        const eventsAttended = Math.floor(Math.random() * 10) + 1;
                        const certificatesEarned = Math.floor(Math.random() * 5);
                        
                        return (
                          <div
                            key={user.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>
                                    {user.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("") || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">
                                    {user.name || "Sin nombre"}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline">
                                {progress}% Completado
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-muted rounded-lg">
                                <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                  Eventos Asistidos
                                </p>
                                <p className="text-lg font-semibold">
                                  {eventsAttended}
                                </p>
                              </div>
                              <div className="text-center p-3 bg-muted rounded-lg">
                                <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                  Certificados
                                </p>
                                <p className="text-lg font-semibold">
                                  {certificatesEarned}
                                </p>
                              </div>
                              <div className="text-center p-3 bg-muted rounded-lg">
                                <BarChart3 className="h-6 w-6 mx-auto mb-2 text-primary" />
                                <p className="text-sm text-muted-foreground">
                                  Progreso
                                </p>
                                <div className="w-full bg-background rounded-full h-2 mt-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{
                                      width: `${progress}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewProfile({
                                  ...user,
                                  joinDate: user.email_verified_at 
                                    ? new Date(user.email_verified_at).toLocaleDateString()
                                    : "N/A",
                                  progress,
                                  eventsAttended,
                                  certificatesEarned
                                } as any)}
                              >
                                Ver Perfil Completo
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateReport({
                                  ...user,
                                  joinDate: user.email_verified_at 
                                    ? new Date(user.email_verified_at).toLocaleDateString()
                                    : "N/A",
                                  progress,
                                  eventsAttended,
                                  certificatesEarned
                                } as any)}
                              >
                                Generar Reporte
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Review Tab */}
          <TabsContent
            value="submissions"
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  Revisión de Contenido Pendiente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.map((submission, index) => {
                    // Asignar usuario real basado en el índice
                    const submittedByUser = users[index % users.length];
                    const submittedByName = submittedByUser?.name || "Usuario desconocido";
                    
                    return (
                      <div
                        key={submission.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">
                                {submission.title}
                              </h3>
                              <Badge
                                variant={
                                  submission.type === "event"
                                    ? "default"
                                    : submission.type ===
                                        "certificate"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {submission.type === "event"
                                  ? "Evento"
                                  : submission.type ===
                                      "certificate"
                                    ? "Certificado"
                                    : "Artículo"}
                              </Badge>
                              <Badge
                                variant={
                                  submission.status === "pending"
                                    ? "outline"
                                    : submission.status ===
                                        "approved"
                                      ? "default"
                                      : "destructive"
                                }
                              >
                                {submission.status === "pending"
                                  ? "Pendiente"
                                  : submission.status ===
                                      "approved"
                                    ? "Aprobado"
                                    : "Rechazado"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Enviado por:{" "}
                              {submittedByName} •{" "}
                              {submission.date}
                            </p>
                            <p className="text-sm">
                              {submission.description}
                            </p>
                          </div>
                        </div>

                      {submission.status === "pending" && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleApproveSubmission(
                                submission.id,
                              )
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprobar
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleEditSubmission(submission.id)
                            }
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Editar
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Rechazar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Rechazar contenido?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede
                                  deshacer. El contenido será
                                  rechazado y se notificará al
                                  usuario.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleRejectSubmission(
                                      submission.id,
                                    )
                                  }
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Rechazar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                      </div>
                    );
                  })}
                </div>

                {submissions.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">
                      No hay contenido
                    </h3>
                    <p className="text-muted-foreground">
                      No hay submisiones registradas.
                    </p>
                  </div>
                )}

                {submissions.length > 0 && pendingSubmissions.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <h3 className="font-medium mb-2">
                      ¡Todo al día!
                    </h3>
                    <p className="text-muted-foreground">
                      Todas las submisiones han sido revisadas.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => navigate("/event-board")}
                >
                  <Calendar className="h-6 w-6" />
                  <span>Contenido del Semillero</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setIsGeneralReportOpen(true)}
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Generar Reporte General</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="h-6 w-6" />
                  <span>Configuración del Panel</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Bar */}
      <BNavBarMentor />

      {/* Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Perfil Completo - {selectedMember?.name}</DialogTitle>
            <DialogDescription>
              Información detallada del integrante
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">
                    {selectedMember.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedMember.name}</h3>
                  <p className="text-muted-foreground">{selectedMember.email}</p>
                  <Badge variant="outline" className="mt-2">
                    {selectedMember.role === "member" ? "Integrante" : selectedMember.role}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Fecha de Ingreso</p>
                  <p className="text-lg font-semibold">{selectedMember.joinDate}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Progreso</p>
                  <p className="text-lg font-semibold">{selectedMember.progress}%</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Eventos Asistidos</p>
                  <p className="text-lg font-semibold">{selectedMember.eventsAttended}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Certificados Obtenidos</p>
                  <p className="text-lg font-semibold">{selectedMember.certificatesEarned}</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsProfileModalOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={() => {
                  setIsProfileModalOpen(false);
                  toast.success("Perfil visualizado");
                }}>
                  Entendido
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reporte de Progreso - {selectedMember?.name}</DialogTitle>
            <DialogDescription>
              Informe detallado de actividades y desempeño
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-6">
              {/* Información General */}
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Información General
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nombre:</p>
                    <p className="font-medium">{selectedMember.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email:</p>
                    <p className="font-medium">{selectedMember.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rol:</p>
                    <p className="font-medium">
                      {selectedMember.role === "member" ? "Integrante" : selectedMember.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fecha de Ingreso:</p>
                    <p className="font-medium">{selectedMember.joinDate}</p>
                  </div>
                </div>
              </div>

              {/* Métricas de Desempeño */}
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Métricas de Desempeño
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Progreso General</span>
                      <span className="text-sm font-semibold">{selectedMember.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{ width: `${selectedMember.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <Calendar className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                      <p className="text-2xl font-bold text-blue-600">{selectedMember.eventsAttended}</p>
                      <p className="text-xs text-muted-foreground">Eventos</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <Award className="h-6 w-6 mx-auto mb-1 text-green-600" />
                      <p className="text-2xl font-bold text-green-600">{selectedMember.certificatesEarned}</p>
                      <p className="text-xs text-muted-foreground">Certificados</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <TrendingUp className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                      <p className="text-2xl font-bold text-purple-600">{selectedMember.progress}%</p>
                      <p className="text-xs text-muted-foreground">Completado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📊 Resumen</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedMember.name} ha completado el {selectedMember.progress}% de sus actividades, 
                  asistiendo a {selectedMember.eventsAttended} eventos y obteniendo {selectedMember.certificatesEarned} certificados. 
                  {selectedMember.progress >= 75 ? " ¡Excelente desempeño!" : " Progreso satisfactorio."}
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={() => {
                  toast.success("📄 Reporte generado correctamente");
                  setIsReportModalOpen(false);
                }}>
                  Descargar PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* General Report Modal */}
      <Dialog open={isGeneralReportOpen} onOpenChange={setIsGeneralReportOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>📊 Reporte General del Semillero</DialogTitle>
            <DialogDescription>
              Informe completo de actividades, usuarios y progreso general
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 overflow-y-auto flex-1 pr-2">
            {/* Resumen Ejecutivo */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">📈 Resumen Ejecutivo</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{users.length}</div>
                  <p className="text-sm text-muted-foreground">Total Usuarios</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {users.filter(u => u.role === "member").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Integrantes</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {users.filter(u => u.role === "coordinator").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Coordinadores</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {pendingSubmissions.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </div>

            {/* Distribución por Roles */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Distribución de Usuarios por Rol
              </h4>
              <div className="space-y-3">
                {[
                  { role: "interested", label: "Interesados", color: "bg-gray-500" },
                  { role: "member", label: "Integrantes", color: "bg-blue-500" },
                  { role: "coordinator", label: "Coordinadores", color: "bg-green-500" },
                  { role: "mentor", label: "Mentores", color: "bg-purple-500" }
                ].map(({ role, label, color }) => {
                  const count = users.filter(u => u.role === role).length;
                  const percentage = users.length > 0 ? (count / users.length * 100).toFixed(1) : 0;
                  return (
                    <div key={role}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{label}</span>
                        <span className="font-semibold">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`${color} h-2 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estado de Submissions */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Estado de Contenido Enviado
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border">
                  <div className="text-2xl font-bold text-yellow-600">
                    {submissions.filter(s => s.status === "pending").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">
                    {submissions.filter(s => s.status === "approved").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Aprobados</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg border">
                  <div className="text-2xl font-bold text-red-600">
                    {submissions.filter(s => s.status === "rejected").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Rechazados</p>
                </div>
              </div>
            </div>

            {/* Top Usuarios */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Usuarios Registrados (Últimos 5)
              </h4>
              <div className="space-y-2">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name?.split(" ").map(n => n[0]).join("") || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name || "Sin nombre"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {user.role === "interested" ? "Interesado" :
                       user.role === "member" ? "Integrante" :
                       user.role === "coordinator" ? "Coordinador" : "Mentor"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Fecha de Generación */}
            <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground text-center">
              Reporte generado el {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div className="flex gap-2 justify-end flex-shrink-0 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsGeneralReportOpen(false)}>
              Cerrar
            </Button>
            <Button onClick={() => {
              toast.success("📄 Reporte general generado correctamente");
              setIsGeneralReportOpen(false);
            }}>
              Descargar PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>⚙️ Configuración del Panel de Mentor</DialogTitle>
            <DialogDescription>
              Gestiona las preferencias y configuraciones del dashboard
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Información del Mentor */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Tu Información
              </h4>
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    {user?.name?.split(" ").map(n => n[0]).join("") || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{user?.name || "Sin nombre"}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Badge variant="secondary" className="mt-2">Mentor</Badge>
                </div>
              </div>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="border-b pb-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Estadísticas de tu Gestión
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-muted-foreground">Usuarios Gestionados</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-yellow-600" />
                    <p className="text-sm text-muted-foreground">Pendientes de Revisión</p>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{pendingSubmissions.length}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <p className="text-sm text-muted-foreground">Integrantes Activos</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.role === "member").length}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <p className="text-sm text-muted-foreground">Total Aprobados</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {submissions.filter(s => s.status === "approved").length}
                  </p>
                </div>
              </div>
            </div>

            {/* Accesos Rápidos */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Accesos Rápidos
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    navigate("/event-board");
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Contenido
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    navigate("/profile");
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Mi Perfil
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsNotificationsOpen(true);
                  }}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notificaciones
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsGeneralReportOpen(true);
                  }}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reportes
                </Button>
              </div>
            </div>

            {/* Información del Sistema */}
            <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
              <p className="text-center">
                Sistema de Gestión de Semillero • Versión 1.0.0
              </p>
              <p className="text-center text-xs mt-1">
                © 2025 Universidad del Cauca
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t">
              <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                Cerrar
              </Button>
              <Button onClick={() => {
                toast.success("⚙️ Configuración guardada");
                setIsSettingsOpen(false);
              }}>
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </DialogTitle>
            <DialogDescription>
              Mantente al día con las últimas actualizaciones del semillero
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {/* Notificación 1 - Nueva */}
            <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">Nuevo usuario registrado</p>
                    <Badge variant="default" className="text-xs">Nueva</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Juan Pérez se ha registrado en el semillero y está pendiente de aprobación
                  </p>
                  <p className="text-xs text-muted-foreground">Hace 5 minutos</p>
                </div>
              </div>
            </div>

            {/* Notificación 2 - Nueva */}
            <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">Evento aprobado</p>
                    <Badge variant="default" className="text-xs">Nueva</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    El evento "Workshop de IA Generativa" ha sido aprobado y publicado
                  </p>
                  <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                </div>
              </div>
            </div>

            {/* Notificación 3 - Nueva */}
            <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <FileText className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">Certificado pendiente de revisión</p>
                    <Badge variant="default" className="text-xs">Nueva</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Carlos López ha subido un certificado que requiere tu revisión
                  </p>
                  <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                </div>
              </div>
            </div>

            {/* Notificación 4 - Leída */}
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-full">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">Evento próximo</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    "Machine Learning Básico" comienza mañana a las 14:00
                  </p>
                  <p className="text-xs text-muted-foreground">Ayer</p>
                </div>
              </div>
            </div>

            {/* Notificación 5 - Leída */}
            <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-full">
                  <Award className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">Logro desbloqueado</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    ¡Has alcanzado 50 usuarios activos en el semillero!
                  </p>
                  <p className="text-xs text-muted-foreground">Hace 2 días</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end flex-shrink-0 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                toast.success("Todas las notificaciones marcadas como leídas");
                setIsNotificationsOpen(false);
              }}
            >
              Marcar todas como leídas
            </Button>
            <Button onClick={() => setIsNotificationsOpen(false)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
