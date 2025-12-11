import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Alert, AlertDescription } from "../../ui/alert";

const eventSchema = z.object({
  name: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  description: z.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(5000, "La descripción no puede exceder 5000 caracteres"),
  event_type: z.enum(["charla", "taller", "conferencia", "semillero"], {
    message: "Selecciona un tipo de evento",
  }),
  modality: z.enum(["presencial", "virtual", "mixta"], {
    message: "Selecciona una modalidad",
  }),
  location: z.string().optional(),
  virtual_url: z.string().url("URL inválida").optional().or(z.literal("")),
  start_date: z.string().min(1, "La fecha de inicio es requerida"),
  start_time: z.string().min(1, "La hora de inicio es requerida"),
  end_date: z.string().min(1, "La fecha de fin es requerida"),
  end_time: z.string().min(1, "La hora de fin es requerida"),
  capacity: z.number().min(1, "La capacidad debe ser al menos 1").optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

type OnUpdateData = Omit<EventFormData, "start_time" | "end_time">;

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // We use any or a partial type here because we reconstruct the object before sending
  onUpdateEvent: (data: OnUpdateData) => void; 
  isPending?: boolean;
  event: API.Event | null;
  hasPublication: boolean;
}

export const EditEventDialog = ({
  open,
  onOpenChange,
  onUpdateEvent,
  isPending = false,
  event,
  hasPublication,
}: EditEventDialogProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  // Reset form when dialog opens with event data
  useEffect(() => {
    if (open && event) {
      // Extract date and time from ISO strings
      // Assuming ISO format YYYY-MM-DDTHH:mm:ss...
      const startParts = event.start_date.split('T');
      const endParts = event.end_date.split('T');
      
      const startDate = startParts[0];
      const startTime = startParts[1] ? startParts[1].substring(0, 5) : "00:00"; // Take HH:mm

      const endDate = endParts[0];
      const endTime = endParts[1] ? endParts[1].substring(0, 5) : "00:00";

      reset({
        name: event.name,
        description: event.description,
        event_type: event.event_type as "charla" | "taller" | "conferencia" | "semillero",
        modality: event.modality,
        location: event.location || "",
        virtual_url: event.virtual_url || "",
        start_date: startDate,
        start_time: startTime,
        end_date: endDate,
        end_time: endTime,
        capacity: event.capacity || undefined,
      });
    }
  }, [open, event, reset]);

  const onSubmit = (data: EventFormData) => {
    // Combine date and time back to ISO string
    // Format: YYYY-MM-DDTHH:mm:00
    const formattedData = {
      ...data,
      start_date: `${data.start_date}T${data.start_time}:00`,
      end_date: `${data.end_date}T${data.end_time}:00`,
    };
    
    // Remove the temporary time fields to match API expectation (mostly)
    // Although simply passing extra fields usually doesn't hurt if we cast or pick
    // But let's be clean.
    // However, TypeScript might complain if we try to delete properties from a typed object.
    // So we create a new object.
    
    const finalData: OnUpdateData= {
      name: formattedData.name,
      description: formattedData.description,
      event_type: formattedData.event_type,
      modality: formattedData.modality,
      location: formattedData.location,
      virtual_url: formattedData.virtual_url,
      start_date: formattedData.start_date,
      end_date: formattedData.end_date,
      capacity: formattedData.capacity,
    };

    onUpdateEvent(finalData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
          <DialogDescription>
            Actualiza la información del evento.
          </DialogDescription>
        </DialogHeader>

        {hasPublication && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Este evento tiene una anuncio asociada. Los cambios aquí no afectarán la anuncio.
            </AlertDescription>
          </Alert>
        )}

        {!hasPublication && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Este evento aún no ha sido publicado.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 overflow-x-hidden">
          <div className="w-full">
            <Label htmlFor="event-name">Nombre del evento *</Label>
            <Input
              id="event-name"
              {...register("name")}
              disabled={isPending}
              className={errors.name ? "border-destructive" : ""}
              placeholder="Nombre del evento"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="w-full">
            <Label htmlFor="event-description">Descripción *</Label>
            <Textarea
              id="event-description"
              {...register("description")}
              disabled={isPending}
              className={errors.description ? "border-destructive" : ""}
              placeholder="Descripción del evento"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            <div className="w-full min-w-0">
              <Label htmlFor="event-type">Tipo de evento *</Label>
              <Controller
                name="event_type"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <SelectTrigger className={errors.event_type ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="charla">Charla</SelectItem>
                      <SelectItem value="taller">Taller</SelectItem>
                      <SelectItem value="conferencia">Conferencia</SelectItem>
                      <SelectItem value="semillero">Semillero</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.event_type && (
                <p className="text-sm text-destructive mt-1">{errors.event_type.message}</p>
              )}
            </div>

            <div className="w-full min-w-0">
              <Label htmlFor="event-modality">Modalidad *</Label>
              <Controller
                name="modality"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <SelectTrigger className={errors.modality ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecciona la modalidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="mixta">Mixta</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.modality && (
                <p className="text-sm text-destructive mt-1">{errors.modality.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            <div className="w-full min-w-0">
              <Label htmlFor="event-location">Ubicación</Label>
              <Input
                id="event-location"
                {...register("location")}
                disabled={isPending}
                placeholder="Ubicación del evento"
              />
            </div>

            <div className="w-full min-w-0">
              <Label htmlFor="event-virtual-url">URL Virtual</Label>
              <Input
                id="event-virtual-url"
                {...register("virtual_url")}
                disabled={isPending}
                className={errors.virtual_url ? "border-destructive" : ""}
                placeholder="https://..."
              />
              {errors.virtual_url && (
                <p className="text-sm text-destructive mt-1">{errors.virtual_url.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            <div className="w-full min-w-0 space-y-2">
              <Label>Fecha de inicio *</Label>
              <div className="flex gap-2">
                <div className="flex-grow">
                  <Input
                    type="date"
                    {...register("start_date")}
                    disabled={isPending}
                    className={errors.start_date ? "border-destructive" : ""}
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="time"
                    {...register("start_time")}
                    disabled={isPending}
                    className={errors.start_time ? "border-destructive" : ""}
                  />
                </div>
              </div>
              {(errors.start_date || errors.start_time) && (
                <p className="text-sm text-destructive">
                  {errors.start_date?.message || errors.start_time?.message}
                </p>
              )}
            </div>

            <div className="w-full min-w-0 space-y-2">
              <Label>Fecha de fin *</Label>
              <div className="flex gap-2">
                <div className="flex-grow">
                  <Input
                    type="date"
                    {...register("end_date")}
                    disabled={isPending}
                    className={errors.end_date ? "border-destructive" : ""}
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="time"
                    {...register("end_time")}
                    disabled={isPending}
                    className={errors.end_time ? "border-destructive" : ""}
                  />
                </div>
              </div>
              {(errors.end_date || errors.end_time) && (
                <p className="text-sm text-destructive">
                  {errors.end_date?.message || errors.end_time?.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full">
            <Label htmlFor="event-capacity">Capacidad</Label>
            <Input
              id="event-capacity"
              type="number"
              {...register("capacity", { valueAsNumber: true })}
              disabled={isPending}
              className={errors.capacity ? "border-destructive" : ""}
              placeholder="Número de participantes"
            />
            {errors.capacity && (
              <p className="text-sm text-destructive mt-1">{errors.capacity.message}</p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Actualizar Evento
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
