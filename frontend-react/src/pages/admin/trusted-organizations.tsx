
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  Calendar,
  FileText,
  BadgeCheck,
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Filter,
  type LucideIcon
} from "lucide-react";
import { TrustedOrgsAPI } from "../../services/api";
import { UnifiedHeader } from "../../components/layout/UnifiedHeader";
import { HideOnScrollWrapper } from "@/components/layout/HideOnScrollWrapper";

// Schema for Create/Edit
const trustedOrgSchema = z.object({
  org: z.string().min(1, "El nombre es requerido"),
  trusted_for_article: z.boolean(),
  trusted_for_event: z.boolean(),
  trusted_for_certificate: z.boolean(),
}).refine((data) => data.trusted_for_article || data.trusted_for_event || data.trusted_for_certificate, {
  message: "Debe seleccionar al menos un tipo de confianza",
  path: ["org"], // Show error on top or generic
});

type TrustedOrgFormData = z.infer<typeof trustedOrgSchema>;

export default function TrustedOrganizationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | API.TrustedOrgType>("all");
  
  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [editingOrg, setEditingOrg] = useState<API.TrustedOrg | null>(null);
  const [deletingOrg, setDeletingOrg] = useState<API.TrustedOrg | null>(null);

  // Queries
  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ["trusted-orgs"],
    queryFn: TrustedOrgsAPI.listAllTrustedOrganizations,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: TrustedOrgFormData) => 
      TrustedOrgsAPI.addTrustedOrganization({
        org: data.org,
        trusted_for_article: data.trusted_for_article,
        trusted_for_event: data.trusted_for_event,
        trusted_for_certificate: data.trusted_for_certificate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trusted-orgs"] });
      toast.success("Organización creada exitosamente");
      setIsCreateOpen(false);
    },
    onError: () => toast.error("Error al crear organización"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TrustedOrgFormData }) =>
      TrustedOrgsAPI.updateTrustedOrganization(id, {
        org: data.org,
        trusted_for_article: data.trusted_for_article,
        trusted_for_event: data.trusted_for_event,
        trusted_for_certificate: data.trusted_for_certificate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trusted-orgs"] });
      toast.success("Organización actualizada exitosamente");
      setEditingOrg(null);
    },
    onError: () => toast.error("Error al actualizar organización"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => TrustedOrgsAPI.deleteTrustedOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trusted-orgs"] });
      toast.success("Organización eliminada exitosamente");
      setDeletingOrg(null);
    },
    onError: () => toast.error("Error al eliminar organización"),
  });

  // Filter Logic
  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch = org.org.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "article" && org.trusted_for_article) ||
      (filterType === "event" && org.trusted_for_event) ||
      (filterType === "certificate" && org.trusted_for_certificate);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <HideOnScrollWrapper>
        <UnifiedHeader
          title="Organizaciones de Confianza"
          subtitle="Gestiona las entidades autorizadas para eventos, artículos y certificados"
          onGoBack={() => navigate("/dashboard-mentor")}
        />
      </HideOnScrollWrapper>

      <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl space-y-6">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <div className="flex flex-1 w-full gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar organización..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select 
            value={filterType} 
            onValueChange={(val) => setFilterType(val as API.TrustedOrgType | "all")}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="event">Eventos</SelectItem>
                <SelectItem value="article">Artículos</SelectItem>
                <SelectItem value="certificate">Certificados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Organización
          </Button>
        </div>

        {/* Legend */}
        <div className="flex gap-6 text-sm text-gray-500 bg-white/50 p-3 rounded-lg border border-dashed">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" /> Eventos
          </span>
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-500" /> Artículos
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-green-500" /> Certificados
          </span>
        </div>

        {/* Table */}
        <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-[40%]">Organización</TableHead>
                <TableHead>Permisos de Confianza</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                  </TableCell>
                </TableRow>
              ) : filteredOrgs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                    No se encontraron organizaciones.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.org}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <TrustIcon 
                          active={org.trusted_for_event} 
                          icon={Calendar} 
                          color="text-blue-500" 
                          label="Eventos Externos"
                        />
                        <TrustIcon 
                          active={org.trusted_for_article} 
                          icon={FileText} 
                          color="text-orange-500" 
                          label="Artículos y Papers"
                        />
                        <TrustIcon 
                          active={org.trusted_for_certificate} 
                          icon={BadgeCheck} 
                          color="text-green-500" 
                          label="Certificados"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingOrg(org)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => setDeletingOrg(org)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Dialog */}
      <OrgFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Nueva Organización"
        onSubmit={(data) => createMutation.mutate(data)}
        isPending={createMutation.isPending}
      />

      {/* Edit Dialog */}
      <OrgFormDialog
        open={!!editingOrg}
        onOpenChange={(open) => !open && setEditingOrg(null)}
        title="Editar Organización"
        initialData={editingOrg ? {
            org: editingOrg.org,
            trusted_for_article: editingOrg.trusted_for_article,
            trusted_for_event: editingOrg.trusted_for_event,
            trusted_for_certificate: editingOrg.trusted_for_certificate,
        } : undefined}
        onSubmit={(data) => editingOrg && updateMutation.mutate({ id: editingOrg.id, data })}
        isPending={updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deletingOrg} onOpenChange={(open) => !open && setDeletingOrg(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Organización</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar a <strong>{deletingOrg?.org}</strong>? 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingOrg(null)}>Cancelar</Button>
            <Button 
              variant="destructive" 
              onClick={() => deletingOrg && deleteMutation.mutate(deletingOrg.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Helpers

const TrustIcon = ({ active, icon: Icon, color, label }: { active: boolean; icon: LucideIcon; color: string; label: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`p-2 rounded-full transition-colors ${active ? `bg-gray-100 ${color}` : "text-gray-300"}`}>
            <Icon className="w-5 h-5" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{active ? `Habilitado para ${label}` : `No habilitado para ${label}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface OrgFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    initialData?: TrustedOrgFormData;
    onSubmit: (data: TrustedOrgFormData) => void;
    isPending: boolean;
}

const OrgFormDialog = ({ open, onOpenChange, title, initialData, onSubmit, isPending }: OrgFormProps) => {
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<TrustedOrgFormData>({
        resolver: zodResolver(trustedOrgSchema),
        defaultValues: {
            org: "",
            trusted_for_article: false,
            trusted_for_event: false,
            trusted_for_certificate: false,
            ...initialData
        }
    });

    // Reset when opening with new data
    useState(() => {
        if(open && initialData) reset(initialData);
        if(open && !initialData) reset({ org: "", trusted_for_article: false, trusted_for_event: false, trusted_for_certificate: false });
    }); // This is a bit hacky for reset but simpler than useEffect for now

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="org">Nombre de la Organización</Label>
                        <Input id="org" placeholder="Ej: Universidad Nacional" {...register("org")} />
                        {errors.org && <p className="text-sm text-destructive">{errors.org.message}</p>}
                    </div>

                    <div className="space-y-4">
                        <Label>Permisos de Confianza</Label>
                        <div className="grid grid-cols-1 gap-4">
                            <FormCheckbox 
                                id="trusted_for_event" 
                                label="Eventos Externos" 
                                description="Permite asociar esta org a eventos"
                                checked={watch("trusted_for_event")}
                                onCheckedChange={(c) => setValue("trusted_for_event", c as boolean)}
                            />
                             <FormCheckbox 
                                id="trusted_for_article" 
                                label="Artículos y Papers" 
                                description="Permite asociar esta org a publicaciones científicas"
                                checked={watch("trusted_for_article")}
                                onCheckedChange={(c) => setValue("trusted_for_article", c as boolean)}
                            />
                             <FormCheckbox 
                                id="trusted_for_certificate" 
                                label="Certificados" 
                                description="Entidad válida para emisión de certificados"
                                checked={watch("trusted_for_certificate")}
                                onCheckedChange={(c) => setValue("trusted_for_certificate", c as boolean)}
                            />
                        </div>
                         {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            Guardar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const FormCheckbox = ({ id, label, description, checked, onCheckedChange }: { id: string; label: string; description: string; checked: boolean; onCheckedChange: (c: boolean | string) => void }) => (
    <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
        <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
        <div className="space-y-1 leading-none">
            <Label htmlFor={id} className="cursor-pointer font-medium">
                {label}
            </Label>
            <p className="text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    </div>
)
