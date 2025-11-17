import React, { useState } from "react";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";
import { Settings, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { USER_ROLES } from "./types";
import { translateUserRole } from "../../../../features/users/users.helpers";

interface UserManagementTabProps {
  users: API.User[];
  loadingUsers: boolean;
  onCreateUser: (
    name: string,
    email: string,
    role: API.UserRole,
  ) => Promise<boolean>;
  onChangeRole: (userId: number, role: API.UserRole) => Promise<boolean>;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({
  users,
  loadingUsers,
  onCreateUser,
  onChangeRole,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [newRole, setNewRole] = useState<string>("");
  console.log(users)

  // Estado para modales internos
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
    const success = await onCreateUser(
      newUserData.name,
      newUserData.email,
      newUserData.role,
    );
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
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
                {USER_ROLES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {translateUserRole(type)}
                  </SelectItem>
                ))}
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
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={newUserData.name}
                      onChange={(e) =>
                        setNewUserData({ ...newUserData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserData.email}
                      onChange={(e) =>
                        setNewUserData({
                          ...newUserData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rol</Label>
                    <Select
                      value={newUserData.role}
                      onValueChange={(value: string) =>
                        setNewUserData({
                          ...newUserData,
                          role: value as API.UserRole,
                        })
                      }
                    >
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_ROLES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {translateUserRole(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddUserOpen(false)}
                    >
                      Cancelar
                    </Button>
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
                        <AvatarFallback>
                          {user.name?.split(" ").map((n) => n[0]).join("") ||
                            "?"}
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
                    <Badge variant={user.role === "mentor" ? "default" : "outline"}>
                      {translateUserRole(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.email_verified_at ? "Verificado" : "Pendiente"}
                  </TableCell>
                  <TableCell>
                    {user.last_login_at
                      ? new Date(user.last_login_at).toLocaleDateString()
                      : "Nunca"}
                  </TableCell>
                  <TableCell>
                    <Dialog
                      open={isRoleChangeOpen && selectedUserId === user.id}
                      onOpenChange={(open: boolean) => {
                        setIsRoleChangeOpen(open);
                        if (!open) setSelectedUserId(null);
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
                          <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>
                            Cambiar rol de: <strong>{user.name}</strong>
                          </p>
                          <div>
                            <Label htmlFor="new-role">Nuevo Rol</Label>
                            <Select value={newRole} onValueChange={setNewRole}>
                              <SelectTrigger id="new-role">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {USER_ROLES.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {translateUserRole(type)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              onClick={() => setIsRoleChangeOpen(false)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={() =>
                                handleRoleChangeClick(user.id, newRole)
                              }
                              disabled={!newRole || newRole === user.role}
                            >
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
  );
};