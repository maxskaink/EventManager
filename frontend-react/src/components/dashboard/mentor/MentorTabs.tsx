import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../ui/alert-dialog";
import {
  Settings,
  Calendar,
  Award,
  Edit3,
  CheckCircle,
  XCircle,
  BarChart3,
  Search,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

// Definición de tipos
type Submission = {
  id: string;
  type: string;
  title: string;
  submittedById: string | null;
  date: string;
  status: "pending" | "approved" | "rejected";
  description: string;
};

type MemberProgressData = API.User & {
  joinDate: string;
  progress: number;
  eventsAttended: number;
  certificatesEarned: number;
};

interface MentorTabsProps {
  users: API.User[];
  loadingUsers: boolean;
  submissions: Submission[];
  onApproveSubmission: (id: string) => void;
  onRejectSubmission: (id: string) => void;
  onCreateUser: (name: string, email: string, role: API.UserRole) => Promise<boolean>;
  onChangeRole: (userId: number, role: API.UserRole) => Promise<boolean>;
  onViewProfile: (member: MemberProgressData) => void;
  onGenerateReport: (member: MemberProgressData) => void;
}

export const MentorTabs: React.FC<MentorTabsProps> = ({
  users,
  loadingUsers,
  submissions,
  onApproveSubmission,
  onRejectSubmission,
  onCreateUser,
  onChangeRole,
  onViewProfile,
  onGenerateReport,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [newRole, setNewRole] = useState<string>("");

  // Estado para modales internos de esta pestaña
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isRoleChangeOpen, setIsRoleChangeOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "interested" as API.UserRole,
  });

  const handleCreateUserClick = async () => {
    if (!newUserData.name || !newUserData.email || !newUserData.role) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    const success = await onCreateUser(newUserData.name, newUserData.email, newUserData.role);
    if (success) {
      setIsAddUserOpen(false);
      setNewUserData({ name: "", email: "", role: "interested" });
    }
  };

  const handleRoleChangeClick = async (userId: number, role: string) => {
    const success = await onChangeRole(userId, role as API.UserRole);
    if (success) {
      setIsRoleChangeOpen(false);
      setNewRole("");
      setSelectedUserId(null);
    }
  };

  const handleEditSubmission = (submissionId: string) => {
    const submission = submissions.find(sub => sub.id === submissionId);
    if (submission) {
      toast.info(`📝 Editando: ${submission.title}`);
    }
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
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
        <TabsTrigger value="progress">Seguimiento de Progreso</TabsTrigger>
        <TabsTrigger value="submissions">Revisión de Contenido</TabsTrigger>
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-auto"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full sm:w-auto">
                    <SelectValue placeholder="Filtrar por rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    <SelectItem value="interested">Interesado</SelectItem>
                    <SelectItem value="member">Integrante</SelectItem>
                    <SelectItem value="coordinator">Coordinador</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
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
                        Crea un nuevo usuario manualmente.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Formulario de nuevo usuario */}
                      <div>
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" value={newUserData.name} onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={newUserData.email} onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })} />
                      </div>
                      <div>
                        <Label htmlFor="role">Rol</Label>
                        <Select value={newUserData.role} onValueChange={(value) => setNewUserData({ ...newUserData, role: value as API.UserRole })}>
                          <SelectTrigger id="role"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="interested">Interesado</SelectItem>
                            <SelectItem value="member">Integrante</SelectItem>
                            <SelectItem value="coordinator">Coordinador</SelectItem>
                            <SelectItem value="mentor">Mentor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancelar</Button>
                        <Button onClick={handleCreateUserClick}>Crear Usuario</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <p>Cargando usuarios...</p>
            ) : filteredUsers.length === 0 ? (
              <p>No se encontraron usuarios.</p>
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
                            <AvatarFallback>{user.name?.split(" ").map((n) => n[0]).join("") || "?"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name || "Sin nombre"}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant={user.role === "mentor" ? "default" : "outline"}>{user.role}</Badge></TableCell>
                      <TableCell>{user.email_verified_at ? "Verificado" : "Pendiente"}</TableCell>
                      <TableCell>{user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : "Nunca"}</TableCell>
                      <TableCell>
                        <Dialog
                          open={isRoleChangeOpen && selectedUserId === user.id}
                          onOpenChange={(open) => {
                            setIsRoleChangeOpen(open);
                            if (!open) setSelectedUserId(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => {
                              setSelectedUserId(user.id);
                              setIsRoleChangeOpen(true);
                              setNewRole(user.role);
                            }}>
                              <Settings className="h-4 w-4 mr-2" />
                              Cambiar Rol
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>Cambiar rol de: <strong>{user.name}</strong></p>
                              <div>
                                <Label htmlFor="new-role">Nuevo Rol</Label>
                                <Select value={newRole} onValueChange={setNewRole}>
                                  <SelectTrigger id="new-role"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="interested">Interesado</SelectItem>
                                    <SelectItem value="member">Integrante</SelectItem>
                                    <SelectItem value="coordinator">Coordinador</SelectItem>
                                    <SelectItem value="mentor">Mentor</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setIsRoleChangeOpen(false)}>Cancelar</Button>
                                <Button onClick={() => handleRoleChangeClick(user.id, newRole)} disabled={!newRole || newRole === user.role}>
                                  Confirmar
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
            <CardTitle>Seguimiento de Progreso de Integrantes</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <p>Cargando integrantes...</p>
            ) : users.filter((u) => u.role === "member").length === 0 ? (
              <p>No hay integrantes registrados.</p>
            ) : (
              <div className="space-y-6">
                {users.filter((user) => user.role === "member").map((user) => {
                  // Datos mock para métricas (como en el original)
                  const progress = Math.floor(Math.random() * 40) + 40;
                  const eventsAttended = Math.floor(Math.random() * 10) + 1;
                  const certificatesEarned = Math.floor(Math.random() * 5);
                  const memberData = {
                    ...user,
                    joinDate: user.email_verified_at ? new Date(user.email_verified_at).toLocaleDateString() : "N/A",
                    progress,
                    eventsAttended,
                    certificatesEarned,
                  } as MemberProgressData;

                  return (
                    <div key={user.id} className="border rounded-lg p-4">
                      {/* Info de integrante */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name?.split(" ").map((n) => n[0]).join("") || "?"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{user.name || "Sin nombre"}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{progress}% Completado</Badge>
                      </div>
                      {/* Métricas de integrante */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">Eventos Asistidos</p>
                          <p className="text-lg font-semibold">{eventsAttended}</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">Certificados</p>
                          <p className="text-lg font-semibold">{certificatesEarned}</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <BarChart3 className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">Progreso</p>
                          <div className="w-full bg-background rounded-full h-2 mt-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                      {/* Botones de acción */}
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onViewProfile(memberData)}>
                          Ver Perfil Completo
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onGenerateReport(memberData)}>
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
      <TabsContent value="submissions" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Revisión de Contenido Pendiente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.map((submission, index) => {
                const submittedByUser = users[index % users.length];
                const submittedByName = submittedByUser?.name || "Usuario desconocido";
                
                return (
                  <div key={submission.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      {/* Info de submission */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{submission.title}</h3>
                          <Badge variant="outline">{submission.type}</Badge>
                          <Badge variant={submission.status === "pending" ? "outline" : "default"}>{submission.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Enviado por: {submittedByName} • {submission.date}
                        </p>
                        <p className="text-sm">{submission.description}</p>
                      </div>
                    </div>
                    {/* Acciones de submission */}
                    {submission.status === "pending" && (
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" onClick={() => onApproveSubmission(submission.id)} className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-2" /> Aprobar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditSubmission(submission.id)}>
                          <Edit3 className="h-4 w-4 mr-2" /> Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <XCircle className="h-4 w-4 mr-2" /> Rechazar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Rechazar contenido?</AlertDialogTitle>
                              <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onRejectSubmission(submission.id)} className="bg-destructive hover:bg-destructive/90">
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
            {/* Estados vacíos/completados */}
            {submissions.length === 0 && <p>No hay contenido.</p>}
            {submissions.length > 0 && pendingSubmissions.length === 0 && <p>¡Todo al día!</p>}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};