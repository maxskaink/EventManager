import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Send,
  FileText,
  MessageSquare,
  Users,
  Settings,
  Calendar,
  Tag,
  Image,
  Link,
  Bold,
  Italic,
  List
} from 'lucide-react';
import { useNavigate } from 'react-router';

export function CreatePublicationScreen() {
  const navigate = useNavigate()
  const { user } = useApp();
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'comunicado',
    content: '',
    excerpt: '',
    visibility: 'all',
    tags: '',
    allowComments: true,
    notifyUsers: true,
    publishNow: true,
    scheduledDate: ''
  });

  const [preview, setPreview] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (status: 'draft' | 'published') => {
    console.log('Saving publication:', { ...formData, status });
    // Here would be the actual save logic
    navigate('/publications');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comunicado': return <MessageSquare className="h-4 w-4" />;
      case 'articulo': return <FileText className="h-4 w-4" />;
      case 'anuncio': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getVisibilityDescription = (visibility: string) => {
    switch (visibility) {
      case 'all': return 'Visible para todos los usuarios de la plataforma';
      case 'members': return 'Solo visible para integrantes del semillero';
      case 'mentors': return 'Solo visible para mentores y coordinadores';
      case 'coordinators': return 'Solo visible para coordinadores';
      default: return '';
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
            <h1>Vista Previa</h1>
            <div className="ml-auto flex gap-2">
              <Button variant="secondary" onClick={() => handleSave('draft')}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Borrador
              </Button>
              <Button variant="secondary" onClick={() => handleSave('published')}>
                <Send className="h-4 w-4 mr-2" />
                Publicar
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getTypeIcon(formData.type)}
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {formData.type}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {formData.visibility === 'all' ? 'Público' : 
                   formData.visibility === 'members' ? 'Integrantes' :
                   formData.visibility === 'mentors' ? 'Mentores' : 'Coordinadores'}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold mb-4">{formData.title || 'Título de la publicación'}</h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span>Por {user?.name}</span>
                <span>{new Date().toLocaleDateString('es-ES')}</span>
              </div>

              {formData.excerpt && (
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <p className="italic">{formData.excerpt}</p>
                </div>
              )}

              <div className="prose max-w-none">
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {formData.content || 'El contenido de tu publicación aparecerá aquí...'}
                </div>
              </div>

              {formData.tags && (
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                  {formData.tags.split(',').map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      #{tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
            onClick={() => navigate('/publications')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1>Nueva Publicación</h1>
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" onClick={() => setPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Vista Previa
            </Button>
            <Button variant="secondary" onClick={() => handleSave('draft')}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Información básica */}
        <section>
          <Card>
            <CardHeader>
              <h3>Información Básica</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ej: Convocatoria taller de Machine Learning"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tipo de publicación *</label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comunicado">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Comunicado
                      </div>
                    </SelectItem>
                    <SelectItem value="articulo">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Artículo
                      </div>
                    </SelectItem>
                    <SelectItem value="anuncio">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Anuncio
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Resumen (opcional)</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Breve descripción que aparecerá en las previsualizaciones..."
                  rows={2}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Máximo 200 caracteres. Si no lo especificas, se usará el inicio del contenido.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Editor de contenido */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3>Contenido</h3>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Image className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Escribe aquí el contenido de tu publicación..."
                rows={12}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Soporta texto enriquecido, enlaces e imágenes. Usa Markdown para dar formato.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Configuración de visibilidad */}
        <section>
          <Card>
            <CardHeader>
              <h3>Configuración de Visibilidad</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">¿Quién puede ver esta publicación? *</label>
                <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los usuarios</SelectItem>
                    <SelectItem value="members">Solo integrantes</SelectItem>
                    <SelectItem value="mentors">Solo mentores y coordinadores</SelectItem>
                    <SelectItem value="coordinators">Solo coordinadores</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {getVisibilityDescription(formData.visibility)}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="allowComments"
                  checked={formData.allowComments}
                  onCheckedChange={(checked) => handleInputChange('allowComments', checked)}
                />
                <label htmlFor="allowComments" className="text-sm">
                  Permitir comentarios
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notifyUsers"
                  checked={formData.notifyUsers}
                  onCheckedChange={(checked) => handleInputChange('notifyUsers', checked)}
                />
                <label htmlFor="notifyUsers" className="text-sm">
                  Notificar a los usuarios cuando se publique
                </label>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Configuración adicional */}
        <section>
          <Card>
            <CardHeader>
              <h3>Configuración Adicional</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Etiquetas (opcional)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="machine-learning, react, python"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separa las etiquetas con comas. Estas ayudan a categorizar y encontrar el contenido.
                </p>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox 
                    id="publishNow"
                    checked={formData.publishNow}
                    onCheckedChange={(checked) => handleInputChange('publishNow', checked)}
                  />
                  <label htmlFor="publishNow" className="text-sm">
                    Publicar inmediatamente
                  </label>
                </div>

                {!formData.publishNow && (
                  <div>
                    <label className="text-sm font-medium">Programar publicación</label>
                    <Input
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Acciones */}
        <section>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/publications')}>
                  Cancelar
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleSave('draft')}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Borrador
                  </Button>
                  <Button onClick={() => handleSave('published')}>
                    <Send className="h-4 w-4 mr-2" />
                    {formData.publishNow ? 'Publicar Ahora' : 'Programar Publicación'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="max-w-4xl mx-auto flex justify-around">
          <Button variant="ghost" onClick={() => navigate('/dashboard-coordinator')}>
            Dashboard
          </Button>
          <Button variant="ghost" onClick={() => navigate('/events')}>
            Eventos
          </Button>
          <Button variant="ghost" onClick={() => navigate('/publications')}>
            Publicaciones
          </Button>
          <Button variant="ghost" onClick={() => navigate('/reports')}>
            Reportes
          </Button>
          <Button variant="ghost" onClick={() => navigate('/profile')}>
            Perfil
          </Button>
        </div>
      </div>
    </div>
  );
}