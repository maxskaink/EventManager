import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useApp } from "../context/AppContext";
import {
  Users,
  Settings,
  TrendingUp,
  Calendar,
  Award,
  FileText,
  Edit3,
  CheckCircle,
  XCircle,
  BarChart3,
  Search,
  Bell,
  LogOut,
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
    submittedBy: "Ana García",
    date: "2025-09-25",
    status: "pending",
    description:
      "Taller sobre herramientas de IA generativa para estudiantes",
  },
  {
    id: "2",
    type: "certificate",
    title: "Certificado React Avanzado",
    submittedBy: "Carlos López",
    date: "2025-09-20",
    status: "pending",
    description:
      "Certificado por completar el curso de React avanzado",
  },
  {
    id: "3",
    type: "article",
    title: "Artículo sobre Machine Learning",
    submittedBy: "María Rodríguez",
    date: "2025-09-18",
    status: "approved",
    description:
      "Artículo de investigación sobre algoritmos de ML",
  },
];

export function MentorDashboard() {
  const { user,  logout } = useApp();
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] =
    useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("");

  const handleRoleChange = (
    userId: string,
    newRole: string,
  ) => {
    console.log(
      `Changing role for user ${userId} to ${newRole}`,
    );
    // Here you would implement the actual role change logic
  };

  const handleApproveSubmission = (submissionId: string) => {
    console.log(`Approving submission ${submissionId}`);
    // Here you would implement the approval logic
  };

  const handleRejectSubmission = (submissionId: string) => {
    console.log(`Rejecting submission ${submissionId}`);
    // Here you would implement the rejection logic
  };

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const pendingSubmissions = mockSubmissions.filter(
    (sub) => sub.status === "pending",
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1695556575317-9d49e3dccf75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbG9nbyUyMGFjYWRlbWljfGVufDF8fHx8MTc1NjA1NTkwMnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Logo del Semillero"
                className="h-10 w-10 rounded-full object-cover"
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
                onClick={() => navigate("/notifications")}
              >
                <Bell className="h-5 w-5" />
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
                    {mockUsers.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pendientes
                  </p>
                  <p className="text-2xl font-semibold">
                    {pendingSubmissions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Progreso Promedio
                  </p>
                  <p className="text-2xl font-semibold">
                    {Math.round(
                      mockUsers.reduce(
                        (acc, user) => acc + user.progress,
                        0,
                      ) / mockUsers.length,
                    )}
                    %
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
                    Certificados
                  </p>
                  <p className="text-2xl font-semibold">
                    {mockUsers.reduce(
                      (acc, user) =>
                        acc + user.certificatesEarned,
                      0,
                    )}
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
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Rol Actual</TableHead>
                      <TableHead>Fecha de Ingreso</TableHead>
                      <TableHead>Eventos</TableHead>
                      <TableHead>Certificados</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user.name}
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
                            {user.role === "member"
                              ? "Integrante"
                              : user.role === "coordinator"
                                ? "Coordinador"
                                : "Mentor"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          {user.eventsAttended}
                        </TableCell>
                        <TableCell>
                          {user.certificatesEarned}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedUser(user.id)
                                }
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
                                  Selecciona el nuevo rol que
                                  deseas asignar a este usuario.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p>
                                  Cambiar rol de:{" "}
                                  <strong>{user.name}</strong>
                                </p>
                                <Select
                                  value={newRole}
                                  onValueChange={setNewRole}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar nuevo rol" />
                                  </SelectTrigger>
                                  <SelectContent>
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
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      setNewRole("")
                                    }
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleRoleChange(
                                        user.id,
                                        newRole,
                                      );
                                      setNewRole("");
                                    }}
                                    disabled={!newRole}
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
                <div className="space-y-6">
                  {mockUsers
                    .filter((user) => user.role === "member")
                    .map((user) => (
                      <div
                        key={user.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">
                                {user.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {user.progress}% Completado
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                            <p className="text-sm text-muted-foreground">
                              Eventos Asistidos
                            </p>
                            <p className="text-lg font-semibold">
                              {user.eventsAttended}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                            <p className="text-sm text-muted-foreground">
                              Certificados
                            </p>
                            <p className="text-lg font-semibold">
                              {user.certificatesEarned}
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
                                  width: `${user.progress}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate("/profile")
                            }
                          >
                            Ver Perfil Completo
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              console.log(
                                "Generar reporte de progreso",
                              )
                            }
                          >
                            Generar Reporte
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
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
                  {mockSubmissions.map((submission) => (
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
                            {submission.submittedBy} •{" "}
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
                              console.log("Editar submission")
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
                  ))}
                </div>

                {mockSubmissions.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">
                      No hay contenido pendiente
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
                  onClick={() =>
                    console.log("Generar reporte general")
                  }
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Generar Reporte General</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => navigate("/admin")}
                >
                  <Settings className="h-6 w-6" />
                  <span>Configuración Avanzada</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Bar */}
      <BNavBarMentor />
    </div>
  );
}
