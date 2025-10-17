import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BNavBarCoordinator } from "../ui/b-navbar-coordinator"
import { useApp } from '../AppContext';
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
  LayoutDashboard,
  CalendarDays,
  User
} from 'lucide-react';

export function CoordinatorDashboard() {
  const { user, events, setCurrentView } = useApp();

  const totalEvents = events.length;
  const totalEnrolled = events.reduce((sum, event) => sum + event.enrolled, 0);
  const averageParticipation = Math.round((totalEnrolled / (events.reduce((sum, event) => sum + event.capacity, 0))) * 100);

  const upcomingEvents = events.filter(event => event.status === 'upcoming');

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
                  onClick={() => setCurrentView('create-event')}
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
                  onClick={() => setCurrentView('create-publication')}
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
                  onClick={() => setCurrentView('event-board')}
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
                  onClick={() => setCurrentView('reports')}
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
              onClick={() => setCurrentView('events')}
            >
              Gestionar todos
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingEvents.slice(0, 3).map(event => (
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
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          {event.enrolled}/{event.capacity} inscritos
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round((event.enrolled / event.capacity) * 100)}% ocupación
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  onClick={() => setCurrentView('admin')}
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