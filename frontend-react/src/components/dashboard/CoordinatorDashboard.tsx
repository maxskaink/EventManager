import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BNavBarCoordinator } from "../ui/b-navbar-coordinator"
import { useApp } from '../context/AppContext';
import {
  Users,
  Calendar,
  TrendingUp,
  Plus,
  BarChart,
  FileText,
  ClipboardList,
  Edit3,
  Eye,
  Settings,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { EventAPI, PublicationAPI, ArticleAPI } from '../../services/api';
import { toast } from 'sonner';

export function CoordinatorDashboard() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [events, setEvents] = useState<API.Event[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [articles, setArticles] = useState<API.Article[]>([]);

  // Cargar eventos y artículos desde la API
  useEffect(() => {
    loadEvents();
    loadArticles();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await EventAPI.listUpcomingEvents();
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Error al cargar eventos');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadArticles = async () => {
    try {
      setLoadingArticles(true);
      
      // Cargar tanto Publications como Articles
      // El formulario crea Articles, así que necesitamos cargar ambos
      const [publicationsData, articlesData] = await Promise.all([
        PublicationAPI.listAllPublications().catch(() => []),
        ArticleAPI.listMyArticles().catch(() => []),
      ]);
      
      const publicationsArray = Array.isArray(publicationsData) ? publicationsData : [];
      const articlesArray = Array.isArray(articlesData) ? articlesData : [];
      
      console.log('Publications data received:', publicationsArray);
      console.log('Articles data received:', articlesArray);
      
      setPublications(publicationsArray);
      setArticles(articlesArray);
    } catch (error: any) {
      console.error('Error loading publications/articles:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 403) {
        toast.error('No tienes permisos para ver publicaciones');
      } else {
        toast.error('Error al cargar publicaciones');
      }
      setPublications([]);
      setArticles([]);
    } finally {
      setLoadingArticles(false);
    }
  };

  // Transformar eventos de la API al formato esperado
  const transformedEvents = events.map(event => ({
    id: event.id.toString(),
    title: event.name,
    category: event.event_type,
    date: event.start_date.split('T')[0],
    time: event.start_date.split('T')[1]?.substring(0, 5) || '',
    status: event.status === 'activo' ? 'upcoming' : 
            event.status === 'inactivo' ? 'completed' : 
            event.status === 'cancelado' ? 'cancelled' : 'upcoming',
    enrolled: 0, // TODO: implementar conteo de inscritos
    capacity: event.capacity || 0,
  }));

  const totalEvents = transformedEvents.length;
  const totalEnrolled = transformedEvents.reduce((sum, event) => sum + (event.enrolled || 0), 0);
  const totalCapacity = transformedEvents.reduce((sum, event) => sum + (event.capacity || 0), 0);
  const averageParticipation = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  const upcomingEvents = transformedEvents.filter(event => event.status === 'upcoming');

  // Combinar Publications y Articles, y ordenar por fecha (más recientes primero)
  const allPublications = [
    // Publications
    ...publications.map(pub => ({
      id: `pub-${pub.id}`,
      title: pub.title,
      summary: pub.summary || pub.content,
      published_at: pub.published_at,
      author: pub.author,
      type: pub.type || 'publicacion',
    })),
    // Articles (creados desde el formulario)
    ...articles.map(article => ({
      id: `article-${article.id}`,
      title: article.title,
      summary: article.description,
      published_at: article.publication_date,
      author: { name: article.authors },
      type: 'articulo',
    })),
  ].sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1>Panel de Coordinación</h1>
            <p className="text-primary-foreground/80">Bienvenido, {user?.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Métricas principales */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl">{totalEvents}</h3>
              <p className="text-sm text-muted-foreground">Eventos Totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl">{totalEnrolled}</h3>
              <p className="text-sm text-muted-foreground">Total Inscritos</p>
            </CardContent>
          </Card>

          <Card className="col-span-2 md:col-span-1">
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl">{averageParticipation}%</h3>
              <p className="text-sm text-muted-foreground">Participación Promedio</p>
            </CardContent>
          </Card>
        </section>

        {/* Acciones principales */}
        <section>
          <h2 className="mb-4">Acciones Principales</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Crear evento */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-dashed">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-primary rounded-lg w-fit mx-auto mb-3">
                  <Plus className="h-5 w-5 text-primary-foreground" />
                </div>
                <h4>Crear Evento</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Organiza charlas, cursos y convocatorias
                </p>
                <Button
                  className="w-full"
                  onClick={() => navigate('/create-event')}
                >
                  Crear Evento
                </Button>
              </CardContent>
            </Card>

            {/* Crear publicación */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-dashed">
              <CardContent className="p-4 text-center">
                <div className="p-2 bg-green-600 rounded-lg w-fit mx-auto mb-3">
                  <Edit3 className="h-5 w-5 text-white" />
                </div>
                <h4>Nueva Publicación</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Redacta comunicados y artículos
                </p>
                <Button
                  className="w-full"
                  onClick={() => navigate('/create-publication')}
                >
                  Crear Publicación
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Gestión de contenido */}
        <section>
          <h2 className="mb-4">Gestión de Contenido</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4>Contenido del Semillero</h4>
                  <p className="text-sm text-muted-foreground">
                    Gestionar eventos y publicaciones
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/event-board')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ClipboardList className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4>Reportes</h4>
                  <p className="text-sm text-muted-foreground">
                    Participación y logros
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/reports')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Eventos próximos */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2>Próximos Eventos</h2>
            <Button
              variant="outline"
              onClick={() => navigate('/event-board')}
            >
              Gestionar todos
            </Button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Cargando eventos...</p>
                </CardContent>
              </Card>
            ) : upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No hay eventos próximos</p>
                </CardContent>
              </Card>
            ) : (
              upcomingEvents.slice(0, 3).map(event => {
                const occupancy = event.capacity > 0 
                  ? Math.round((event.enrolled / event.capacity) * 100) 
                  : 0;
                
                return (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="line-clamp-1">{event.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {event.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('es-ES')} • {event.time}
                          </p>
                          {event.capacity > 0 && (
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-muted-foreground">
                                {event.enrolled}/{event.capacity} inscritos
                              </span>
                              <span className="text-muted-foreground">
                                {occupancy}% ocupación
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate('/event-board')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </section>

        {/* Publicaciones recientes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2>Publicaciones Recientes</h2>
            <Button
              variant="outline"
              onClick={() => navigate('/event-board')}
            >
              Gestionar todas
            </Button>
          </div>

          <div className="space-y-3">
            {loadingArticles ? (
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Cargando publicaciones...</p>
                </CardContent>
              </Card>
            ) : allPublications.length === 0 ? (
              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No hay publicaciones</p>
                </CardContent>
              </Card>
            ) : (
              allPublications.map(publication => (
                <Card key={publication.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="line-clamp-1">{publication.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {publication.type || 'Publicación'}
                          </Badge>
                        </div>
                        {publication.summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {publication.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          {publication.published_at && (
                            <span className="text-muted-foreground">
                              {new Date(publication.published_at).toLocaleDateString('es-ES')}
                            </span>
                          )}
                          {publication.author && (
                            <span className="text-muted-foreground">
                              Por: {publication.author.name || publication.author.email || publication.author}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate('/event-board')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Panel de administración */}
        <section>
          <h2 className="mb-4">Administración</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4>Panel de Administración</h4>
                  <p className="text-sm text-muted-foreground">
                    Ver estadísticas detalladas y gestión
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                >
                  Abrir
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4>Exportar Datos</h4>
                  <p className="text-sm text-muted-foreground">
                    Generar reportes en Excel o PDF
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Generar
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Navigation Bar */}
      <BNavBarCoordinator />
    </div>
  );
}
