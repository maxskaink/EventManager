import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Eye,
  Send,
  FileText,
  Link as LinkIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import BottomNavbarWrapper from '../nav/BottomNavbarWrapper';
import { useAuthStore } from '../../stores/auth.store';
import { ArticleAPI } from '../../services/api';
import { toast } from 'sonner';
import { getDashboardRouteFromRole } from '../../services/navigation/redirects';

export function CreateArticleScreen() {
  const navigate = useNavigate()
  const { user } = useApp();
  const authUser = useAuthStore(s => s.user);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    description: '',
    publication_url: '',
    publication_date: new Date().toISOString().split('T')[0],
  });

  const [preview, setPreview] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validaciones
    if (!formData.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }
    if (!formData.authors.trim()) {
      toast.error('Debe especificar al menos un autor');
      return;
    }
    if (!formData.publication_date) {
      toast.error('La fecha de articulo es obligatoria');
      return;
    }

    if (!authUser?.id) {
      toast.error('Debe estar autenticado para crear un articulo');
      return;
    }

    try {
      setLoading(true);

      const articleData: APIPayloads.AddArticle = {
        user_id: authUser.id,
        title: formData.title,
        description: formData.description || null,
        publication_date: formData.publication_date,
        authors: formData.authors,
        publication_url: formData.publication_url || null,
      };

      await ArticleAPI.addArticle(articleData);
      
      toast.success('🎉 Artículo creado exitosamente');
      
      // Navegar de vuelta
      navigate(getDashboardRouteFromRole(authUser?.role || ''));
    } catch (error: any) {
      console.error('Error creating art0icle:', error);
      const message = error.response?.data?.message || 'Error al crear el artículo';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  if (preview) {
    return (
      <div className="min-h-screen pb-20">
        {/* Header */}
        <div className="bg-[#0a2740] p-4 shadow-sm text-white">
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
              <Button variant="secondary" onClick={() => handleSave()} disabled={loading}>
                <Send className="h-4 w-4 mr-2" />
                Crear Artículo
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <Badge variant="outline" className="text-xs">Artículo</Badge>
              </div>

              <h1 className="text-3xl font-bold mb-4">{formData.title || 'Título del Artículo'}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span>Por {formData.authors || 'Autor(es)'}</span>
                <span>{formData.publication_date ? new Date(formData.publication_date).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES')}</span>
              </div>

              {formData.description && (
                <div className="prose max-w-none mb-6">
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {formData.description}
                  </div>
                </div>
              )}

              {formData.publication_url && (
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg mt-6">
                  <LinkIcon className="h-5 w-5 text-blue-600" />
                  <a 
                    href={formData.publication_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {formData.publication_url}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-[#0a2740] p-4 shadow-sm text-white">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(getDashboardRouteFromRole(authUser?.role || ''))}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1>Nuevo Artículo</h1>
            <div className="ml-auto flex gap-2">
              <Button variant="secondary" onClick={() => setPreview(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </Button>
            </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Información Básica</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título del Artículo *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ej: Avances en Machine Learning aplicado a la medicina"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="authors">Autor(es) *</Label>
              <Input
                id="authors"
                value={formData.authors}
                onChange={(e) => handleInputChange('authors', e.target.value)}
                placeholder="Ej: Juan Pérez, María García"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separa múltiples autores con comas
              </p>
            </div>

            <div>
              <Label htmlFor="publication_date">Fecha de Publicación *</Label>
              <Input
                id="publication_date"
                type="date"
                value={formData.publication_date}
                onChange={(e) => handleInputChange('publication_date', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción / Resumen</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Breve resumen del artículo, abstract o contenido principal..."
                rows={6}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Proporciona un resumen del artículo, contexto o abstract
              </p>
            </div>

            <div>
              <Label htmlFor="publication_url">URL del Articulo (opcional)</Label>
              <Input
                id="publication_url"
                type="url"
                value={formData.publication_url}
                onChange={(e) => handleInputChange('publication_url', e.target.value)}
                placeholder="https://ejemplo.com/mi-articulo"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enlace al artículo completo, PDF, DOI, etc.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-3 justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate(getDashboardRouteFromRole(authUser?.role || ''))}
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => handleSave()}
            disabled={loading}
          >
            <Send className="h-4 w-4 mr-2" />
            Crear Artículo
          </Button>
        </div>
      </div>
      
      {/* Navigation bar */}
      <BottomNavbarWrapper role={authUser?.role ?? ""} />

    </div>
  );
}
