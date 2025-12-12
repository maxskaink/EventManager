import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Search, User, X, Trash2 } from "lucide-react";
import { PublicationAPI, UserAPI } from "@/services/api";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface SharePublicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publication: API.Publication | null;
}

export function SharePublicationDialog({ open, onOpenChange, publication }: SharePublicationDialogProps) {
  const [activeTab, setActiveTab] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  // Grant Access State
  const [selectedUsers, setSelectedUsers] = useState<API.User[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<API.PublicationVisibility>("public");

  // Sync visibility with prop when it opens/changes
  useEffect(() => {
    if (publication) {
      setVisibility(publication.visibility);
    }
  }, [publication]);

  
  // --- QUERIES ---

  // Search Users (Real API)
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['users', 'search', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const response = await UserAPI.listUsersByFilters({ search: debouncedSearch, per_page: 5 });
      return response.data;
    },
    enabled: !!debouncedSearch && activeTab === 'add',
  });

  // Get Current Accesses
  const { data: currentAccess, isLoading: isLoadingAccess, refetch: refetchAccess } = useQuery({
    queryKey: ['publication', 'access', publication?.id],
    queryFn: async () => {
      if (!publication?.id) return { users: [], roles: [] };
      return PublicationAPI.getPublicationAccessUsers(publication.id);
    },
    enabled: !!publication?.id && open,
  });

  // --- MUTATIONS ---

  const grantAccessMutation = useMutation({
    mutationFn: async () => {
      if (!publication) return;

      // 1. Update visibility if changed
      if (publication.visibility !== visibility) {
        await PublicationAPI.updatePublication(publication.id, { visibility })
      }

      // 2. Grant access if visibility is private
      if (visibility === 'private' && (selectedUsers.length > 0 || selectedRoles.length > 0)) {
        const userIds = selectedUsers.map(u => u.id);
        const usersPayload = userIds.length > 0 ? userIds : undefined;
        const rolesPayload = selectedRoles.length > 0 ? selectedRoles : undefined;
        await PublicationAPI.grantPublicationAccess(publication.id, usersPayload, rolesPayload)
      }
    },
    onSuccess: () => {
      toast.success("Publicación actualizada exitosamente");
      setSelectedUsers([]);
      setSelectedRoles([]);
      setSearchTerm("");
      refetchAccess();
      setActiveTab("list");
      // Close only if successful? Or maybe keep open to see changes. Let's keep it open.
    },
    onError: () => toast.error("Error al actualizar la publicación")
  });

  const revokeAccessMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId?: number, role?: string }) => {
      if (!publication) return;
      const userIds = userId ? [userId] : undefined;
      const roles = role ? [role] : undefined;
      
      await PublicationAPI.revokePublicationAccess(publication.id, userIds, roles);
    },
    onSuccess: () => {
      toast.success("Acceso revocado");
      refetchAccess();
    },
    onError: () => toast.error("Error al revocar acceso")
  });

  // --- HANDLERS ---

  const handleSelectUser = (user: API.User) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchTerm(""); // Clear search after selection
  };

  const handleRemoveSelectedUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
  };

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const roles = [
    { id: 'active-member', label: 'Miembros Activos' },
    { id: 'interested', label: 'Interesados' },
    { id: 'seed', label: 'Semillas' },
  ];

  if (!publication) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Actualizar Privacidad y Acceso</DialogTitle>
          <DialogDescription>
             Define quién puede ver "{publication.title}".
          </DialogDescription>
        </DialogHeader>

        {/* VISIBILITY SELECTOR */}
        <div className="px-4 pb-2">
            <Label className="mb-2 block">Visibilidad</Label>
            <div className="flex items-center gap-4">
               <Select value={visibility} onValueChange={(v: API.PublicationVisibility) => setVisibility(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona visibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Pública (Todos)</SelectItem>
                  <SelectItem value="private">Privada / Restringida (Solo usuarios seleccionados)</SelectItem>

                </SelectContent>
              </Select>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {visibility === 'private' ? (<>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Agregar Acceso</TabsTrigger>
            <TabsTrigger value="list">Gestionar Accesos</TabsTrigger>
          </TabsList>

          {/* TAB: ADD ACCESS */}
          <TabsContent value="add" className="space-y-4 py-4">
            
            
              <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Agregar Personas</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Selected Users Chips */}
                  {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedUsers.map(user => (
                        <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                          {user.name}
                          <button onClick={() => handleRemoveSelectedUser(user.id)} className="ml-1 hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Search Results Dropdown */}
                  {debouncedSearch && (
                    <div className="border rounded-md mt-2 max-h-40 overflow-y-auto bg-white shadow-sm absolute w-[calc(100%-3rem)] z-10">
                      {isSearching ? (
                        <div className="p-4 flex justify-center"><Loader2 className="animate-spin h-5 w-5" /></div>
                      ) : searchResults && searchResults.length > 0 ? (
                        searchResults.map((user: API.User) => (
                          <div 
                            key={user.id} 
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectUser(user)}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || undefined} />
                              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-center text-sm text-muted-foreground">No se encontraron usuarios</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Agregar por Rol</label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map(role => (
                      <div key={role.id} className="flex items-center space-x-2 border p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => toggleRole(role.id)}>
                        <Checkbox id={`role-${role.id}`} checked={selectedRoles.includes(role.id)} onCheckedChange={() => toggleRole(role.id)} />
                        <label htmlFor={`role-${role.id}`} className="text-sm cursor-pointer">{role.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            
            
            
          </TabsContent>

          <TabsContent value="list" className="py-4">
            <ScrollArea className="max-h-[70wh] pr-4">
              {isLoadingAccess ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
              ) : (
                <div className="space-y-6">
                  {/* Roles list */}
                  {/*currentAccess?.roles && currentAccess.roles.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Roles con acceso
                      </h4>
                      <div className="space-y-2">
                        {currentAccess.roles.map((role: string) => (
                          <div key={role} className="flex items-center justify-between p-2 bg-secondary/20 rounded-md">
                            <span className="capitalize">{role}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => revokeAccessMutation.mutate({ role })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )*/}

                  {/* Users list */}
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" /> Usuarios con acceso específico
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2 ">Los mentores y coordinadores pueden accedes a todos los anuncios</p>
                    {currentAccess?.users && currentAccess.users.length > 0 ? (
                      <div className="space-y-2">
                        {currentAccess.users.map((u) => (
                          <div key={u.id} className="flex items-center justify-between p-2 border rounded-md">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={u.avatar ?? ""} />
                                <AvatarFallback>{u.name.substring(0,2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{u.name}</p>
                                <p className="text-xs text-muted-foreground">{u.email}</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => revokeAccessMutation.mutate({ userId: u.id })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No hay usuarios individuales asignados.</p>
                    )}
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          </>) : (
               <div className="py-8">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      La publicación es <strong>Pública</strong>. Todos los usuarios pueden verla. <br/>
                      Para restringir el acceso a usuarios específicos, cambia la visibilidad a <strong>Privada</strong>.
                    </AlertDescription>
                  </Alert>
               </div>
            )}
        </Tabs>
        <DialogFooter>
              <Button onClick={() => grantAccessMutation.mutate()} disabled={grantAccessMutation.isPending}>
                {grantAccessMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Actualizar
              </Button>
            </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
