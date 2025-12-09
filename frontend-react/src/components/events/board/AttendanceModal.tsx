import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { ScrollArea } from "../../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventAPI, UserAPI } from "../../../services/api";
import { toast } from "sonner";
import { getErrorMessageForToast } from "../../../features/errors/error.helpers";

interface AttendanceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: number | null;
}

export function AttendanceModal({ isOpen, onOpenChange, eventId }: AttendanceModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const queryClient = useQueryClient();

  // Fetch enrolled users
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['eventEnrollments', eventId],
    queryFn: () => eventId ? EventAPI.listEnrollmentsByEvent(eventId) : Promise.resolve([]),
    enabled: !!eventId && isOpen,
  });

  // Fetch active users to resolve names/emails by user_id
  // Resolve user by id on-demand to ensure we can display name/email even if not in active/inactive lists
  const { data: usersResolved } = useQuery({
    queryKey: ['eventEnrollmentsUsers', eventId],
    queryFn: async () => {
      if (!eventId) return new Map<number, API.User>();
      const enrolls = await EventAPI.listEnrollmentsByEvent(eventId);
      const ids = Array.from(new Set(enrolls.map(e => e.user_id)));
      const entries = await Promise.all(ids.map(async (id) => {
        try {
          const user = await UserAPI.getUserById(id);
          return [id, user] as const;
        } catch {
          return [id, undefined] as const;
        }
      }));
      return new Map<number, API.User | undefined>(entries);
    },
    enabled: !!eventId && isOpen,
  });
  const userById = usersResolved ?? new Map<number, API.User | undefined>();

  // Reset selection when modal opens/closes or event changes
  useEffect(() => {
    if (isOpen) {
      setSelectedUsers([]);
    }
  }, [isOpen, eventId]);

  const toggleUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAll = () => {
    if (selectedUsers.length === enrollments.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(enrollments.map(e => e.user_id));
    }
  };

  const markAttendanceMutation = useMutation({
    mutationFn: async () => {
      if (!eventId) return;
      await EventAPI.markAttendance(eventId, selectedUsers);
    },
    onSuccess: () => {
      toast.success("✅ Asistencia marcada exitosamente");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['eventEnrollments', eventId] });
    },
    onError: (error) => {
      toast.error(getErrorMessageForToast(error, "Error al marcar asistencia"));
    }
  });

  const markAbsenceMutation = useMutation({
    mutationFn: async () => {
      if (!eventId) return;
      await EventAPI.markAbscense(eventId, selectedUsers);
    },
    onSuccess: () => {
      toast.success("✅ Inasistencia marcada exitosamente");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['eventEnrollments', eventId] });
    },
    onError: (error) => {
      toast.error(getErrorMessageForToast(error, "Error al marcar inasistencia"));
    }
  });

  const handleMarkAttendance = () => {
    if (selectedUsers.length === 0) {
      toast.error("Selecciona al menos un usuario");
      return;
    }
    markAttendanceMutation.mutate();
  };

  const handleMarkAbsence = () => {
    if (selectedUsers.length === 0) {
      toast.error("Selecciona al menos un usuario");
      return;
    }
    markAbsenceMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[calc(100vw-2rem)] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Asistencia</DialogTitle>
        </DialogHeader>

        <div className="py-2 sm:py-4">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Checkbox 
                id="select-all" 
                checked={enrollments.length > 0 && selectedUsers.length === enrollments.length}
                onCheckedChange={toggleAll}
                disabled={isLoading || enrollments.length === 0}
                className="size-3 sm:size-4"
              />
              <label htmlFor="select-all" className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate">
                Seleccionar todos
              </label>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              {selectedUsers.length} sel.
            </span>
          </div>

          <ScrollArea className="h-[250px] sm:h-[300px] border rounded-md p-2 sm:p-4">
            {isLoading ? (
              <div className="text-center py-8 text-xs sm:text-sm">Cargando participantes...</div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-8 text-xs sm:text-sm text-muted-foreground">No hay participantes inscritos.</div>
            ) : (
              <div className="space-y-2 sm:space-y-4">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center gap-2 sm:gap-4">
                    <Checkbox 
                      id={`user-${enrollment.user_id}`} 
                      checked={selectedUsers.includes(enrollment.user_id)}
                      onCheckedChange={() => toggleUser(enrollment.user_id)}
                      className="size-3 sm:size-4 shrink-0"
                    />
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <Avatar className="h-6 sm:h-8 w-6 sm:w-8 shrink-0">
                        <AvatarImage src={userById.get(enrollment.user_id)?.avatar || undefined} />
                        <AvatarFallback><User className="h-3 sm:h-4 w-3 sm:w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5 min-w-0">
                        <label 
                          htmlFor={`user-${enrollment.user_id}`}
                          className="text-xs sm:text-sm font-medium leading-none cursor-pointer truncate"
                        >
                          {userById.get(enrollment.user_id)?.name 
                            || userById.get(enrollment.user_id)?.email 
                            || `ID ${enrollment.user_id}`}
                        </label>
                        {userById.get(enrollment.user_id)?.email && (
                          <p className="text-xs text-muted-foreground truncate">{userById.get(enrollment.user_id)!.email}</p>
                        )}
                      </div>
                      <div className="ml-auto shrink-0">
                         <span className="text-xs text-muted-foreground capitalize">{enrollment.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="destructive" 
            onClick={handleMarkAbsence}
            disabled={markAbsenceMutation.isPending || isLoading || enrollments.length === 0}
            className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-4"
          >
            {markAbsenceMutation.isPending ? "Marcando..." : "Marcar Inasistencia"}
          </Button>
          <Button 
            onClick={handleMarkAttendance}
            disabled={markAttendanceMutation.isPending || isLoading || enrollments.length === 0}
            className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-4"
          >
            {markAttendanceMutation.isPending ? "Marcando..." : "Marcar Asistencia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
