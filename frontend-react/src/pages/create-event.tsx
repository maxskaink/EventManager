import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  ArrowLeft,
  Save,
  Send,
  Calendar,
  MapPin,
  Users,
  Clock,
  Info,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import BottomNavbarWrapper from '../components/nav/BottomNavbarWrapper';
import { EventAPI } from '../services/api';
import { toast } from 'sonner';
import { getDashboardRouteFromRole } from '../services/navigation/redirects';
import { useAuthStore } from '../stores/auth.store';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    event_type: 'charla',
    modality: 'presencial' as API.EventModality,
    location: '',
    capacity: '',
    status: 'activo' as API.EventStatus,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDateTime = (date: string, time: string): string => {
    if (!date) return '';
    // Formatear como ISO 8601 para Laravel: YYYY-MM-DDTHH:mm:ss
    const dateTime = time ? `${date}T${time}:00` : `${date}T00:00:00`;
    return dateTime;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    // Validaciones
    if (!formData.name.trim()) {
      toast.error('El nombre del evento es obligatorio');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('La descripción del evento es obligatoria');
      return;
    }
    if (!formData.start_date) {
      toast.error('La fecha de inicio es obligatoria');
      return;
    }
    if (!formData.end_date) {
      toast.error('La fecha de finalización es obligatoria');
      return;
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    const startDateTime = new Date(formatDateTime(formData.start_date, formData.start_time));
    const endDateTime = new Date(formatDateTime(formData.end_date, formData.end_time));
    
    if (endDateTime <= startDateTime) {
      toast.error('La fecha de finalización debe ser posterior a la fecha de inicio');
      return;
    }

    try {
      setLoading(true);

      const eventData: Payloads.AddEvent = {
        name: formData.name,
        description: formData.description,
        start_date: formatDateTime(formData.start_date, formData.start_time),
        end_date: formatDateTime(formData.end_date, formData.end_time),
        event_type: formData.event_type,
        modality: formData.modality,
        location: formData.location || null,
        status: isDraft ? 'pendiente' : formData.status,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
      };

      await EventAPI.addEvent(eventData);
      
      toast.success(isDraft ? '✅ Evento guardado como borrador' : '🎉 Evento creado exitosamente');
      
      // Navegar de vuelta al tablero de contenido
      navigate('/event-board');
    } catch (error: any) {
      console.error('Error creating event:', error);
      const message = error.response?.data?.message || 'Error al crear el evento';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (preview) {
    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreview(false)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1>Vista Previa del Evento</h1>
            <div className="ml-auto flex gap-2">
              <Button variant="secondary" onClick={() => handleSubmit(true)} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Borrador
              </Button>
              <Button variant="secondary" onClick={() => handleSubmit(false)} disabled={loading}>
                <Send className="h-4 w-4 mr-2" />
                Publicar Evento
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium px-3 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full">
                  {formData.event_type}
                </span>
                <span className="text-sm font-medium px-3 py-1 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-full capitalize">
                  {formData.modality}
                </span>
              </div>

              <h1 className="text-3xl font-bold mb-4">{formData.name || 'Nombre del Evento'}</h1>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span>
                    Inicio: {formData.start_date ? new Date(formData.start_date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Por definir'}
                    {formData.start_time && ` a las ${formData.start_time}`}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>
                    Fin: {formData.end_date ? new Date(formData.end_date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Por definir'}
                    {formData.end_time && ` a las ${formData.end_time}`}
                  </span>
                </div>
                {formData.location && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>{formData.location}</span>
                  </div>
                )}
                {formData.capacity && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Users className="h-5 w-5" />
                    <span>Capacidad: {formData.capacity} personas</span>
                  </div>
                )}
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-2">Descripción</h2>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {formData.description || 'La descripción del evento aparecerá aquí...'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <BottomNavbarWrapper />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(getDashboardRouteFromRole(user?.role || ''))}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1>Crear Nuevo Evento</h1>
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" onClick={() => setPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Vista Previa
            </Button>
            <Button variant="secondary" onClick={() => handleSubmit(true)} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Evento *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Workshop de Machine Learning"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="event_type">Tipo de Evento *</Label>
              <Select value={formData.event_type} onValueChange={(value) => handleInputChange('event_type', value)}>
                <SelectTrigger id="event_type" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="charla">Charla</SelectItem>
                  <SelectItem value="curso">Curso</SelectItem>
                  <SelectItem value="convocatoria">Convocatoria</SelectItem>
                  <SelectItem value="taller">Taller</SelectItem>
                  <SelectItem value="conferencia">Conferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe el evento, objetivos, temas a tratar, etc..."
                rows={6}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Fecha y hora */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fecha y Hora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Fecha de Inicio *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="start_time">Hora de Inicio</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => handleInputChange('start_time', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="end_date">Fecha de Finalización *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="end_time">Hora de Finalización</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => handleInputChange('end_time', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modalidad y ubicación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Modalidad y Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="modality">Modalidad *</Label>
              <Select value={formData.modality} onValueChange={(value: API.EventModality) => handleInputChange('modality', value)}>
                <SelectTrigger id="modality" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="mixta">Mixta (Híbrida)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder={
                  formData.modality === 'virtual' 
                    ? "Ej: Enlace de Zoom o Teams" 
                    : formData.modality === 'mixta'
                      ? "Ej: Salón 201 + Enlace virtual"
                      : "Ej: Auditorio Principal, Edificio de Ingeniería"
                }
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.modality === 'virtual' && 'Proporciona el enlace de la reunión virtual'}
                {formData.modality === 'presencial' && 'Indica el lugar físico donde se realizará el evento'}
                {formData.modality === 'mixta' && 'Indica tanto el lugar físico como el enlace virtual'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Capacidad y estado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Capacidad y Estado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="capacity">Capacidad Máxima (opcional)</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="Ej: 50"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Deja en blanco si no hay límite de asistentes
              </p>
            </div>

            <div>
              <Label htmlFor="status">Estado del Evento</Label>
              <Select value={formData.status} onValueChange={(value: API.EventStatus) => handleInputChange('status', value)}>
                <SelectTrigger id="status" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo (Visible y abierto a inscripciones)</SelectItem>
                  <SelectItem value="pendiente">Pendiente (Borrador, no visible)</SelectItem>
                  <SelectItem value="inactivo">Inactivo (Visible pero cerrado a inscripciones)</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate(getDashboardRouteFromRole(user?.role || ''))}
          >
            Cancelar
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSubmit(true)}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar como Borrador
          </Button>
          <Button 
            onClick={() => handleSubmit(false)}
            disabled={loading}
          >
            <Send className="h-4 w-4 mr-2" />
            Publicar Evento
          </Button>
        </div>
      </div>

      <BottomNavbarWrapper role={user?.role ?? ""} />
    </div>
  );
}
