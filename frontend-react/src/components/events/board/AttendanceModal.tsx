import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { ScrollArea } from "../../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventAPI } from "../../../services/api";
import { toast } from "sonner";
import { getErrorMessageForToast } from "../../../features/errors/error.helpers";

interface AttendanceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: number | null;
  eventTitle: string;
}

export function AttendanceModal({ isOpen, onOpenChange, eventId, eventTitle }: AttendanceModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const queryClient = useQueryClient();

  // Fetch enrolled users
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['eventEnrollments', eventId],
    queryFn: () => eventId ? EventAPI.listEnrollmentsByEvent(eventId) : Promise.resolve([]),
    enabled: !!eventId && isOpen,
  });

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Asistencia - {eventTitle}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="select-all" 
                checked={enrollments.length > 0 && selectedUsers.length === enrollments.length}
                onCheckedChange={toggleAll}
                disabled={isLoading || enrollments.length === 0}
              />
              <label htmlFor="select-all" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Seleccionar todos
              </label>
            </div>
            <span className="text-sm text-muted-foreground">
              {selectedUsers.length} seleccionados
            </span>
          </div>

          <ScrollArea className="h-[300px] border rounded-md p-4">
            {isLoading ? (
              <div className="text-center py-8">Cargando participantes...</div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No hay participantes inscritos.</div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center space-x-4">
                    <Checkbox 
                      id={`user-${enrollment.user_id}`} 
                      checked={selectedUsers.includes(enrollment.user_id)}
                      onCheckedChange={() => toggleUser(enrollment.user_id)}
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={/*enrollment.user?.avatar ||*/ undefined} />
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="grid gap-0.5">
                        <label 
                          htmlFor={`user-${enrollment.user_id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {/*enrollment.user?.name ||*/ `Usuario ${enrollment.user_id}`}
                        </label>
                        <p className="text-xs text-muted-foreground">{/*enrollment.user?.email*/}</p>
                      </div>
                      <div className="ml-auto">
                         {/* We could show current status if available in enrollment object */}
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
            className="w-full sm:w-auto"
          >
            {markAbsenceMutation.isPending ? "Marcando..." : "Marcar Inasistencia"}
          </Button>
          <Button 
            onClick={handleMarkAttendance}
            disabled={markAttendanceMutation.isPending || isLoading || enrollments.length === 0}
            className="w-full sm:w-auto"
          >
            {markAttendanceMutation.isPending ? "Marcando..." : "Marcar Asistencia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
