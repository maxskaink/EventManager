import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BNavBarMember } from "../ui/b-navbar-member"
import { useApp } from '../AppContext';
import { Calendar, Clock, Users, MapPin, Award, Bell, Home, CalendarDays, User } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function MemberDashboard() {
  const { user, events, certificates, notifications, setCurrentView } = useApp();

  const recommendedEvents = events
    .filter(event => event.status === 'upcoming')
    .filter(event => user?.interests?.some(interest => 
      event.title.toLowerCase().includes(interest.toLowerCase()) || 
      event.description.toLowerCase().includes(interest.toLowerCase())
    ))
    .slice(0, 2);

  const recentCertificates = certificates.slice(0, 2);
  const unreadNotifications = notifications.filter(n => !n.read).length;

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
            <h1>Hola, {user?.name}</h1>
            <p className="text-primary-foreground/80">Integrante del semillero</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCurrentView('notifications')}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Eventos según intereses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2>Eventos para ti</h2>
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('events')}
            >
              Ver todos
            </Button>
          </div>

          {recommendedEvents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {recommendedEvents.map(event => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2">
                      Recomendado
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <h3 className="line-clamp-2">{event.title}</h3>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString('es-ES')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.enrolled}/{event.capacity} inscritos</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => setCurrentView(`event-detail-${event.id}`)}
                    >
                      Inscribirme
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No hay eventos recomendados basados en tus intereses actuales.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setCurrentView('profile')}
                >
                  Actualizar intereses
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Mis Certificados */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2>Mis Certificados</h2>
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('certificates')}
            >
              Ver todos
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {recentCertificates.map(cert => (
              <Card key={cert.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4>{cert.eventName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(cert.date).toLocaleDateString('es-ES')} • {cert.hours}h
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Descargar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Próximos eventos */}
        <section>
          <h2 className="mb-4">Próximos Eventos</h2>
          <div className="space-y-3">
            {events.slice(0, 3).map(event => (
              <Card key={event.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="line-clamp-1">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('es-ES')} • {event.time}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Ver
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Navigation Bar */}
      <BNavBarMember />
      
    </div>
  );
}