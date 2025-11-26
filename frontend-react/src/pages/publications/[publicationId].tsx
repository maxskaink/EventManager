import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Share2 } from 'lucide-react';
import { PublicationAPI, EventAPI } from '../../services/api';
import { toast } from 'sonner';
import PublicationDetailSkeleton from '../../components/publications/PublicationDetailSkeleton';
import BottomNavbarWrapper from '../../components/nav/BottomNavbarWrapper';
import { useAuthStore } from '../../stores/auth.store';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { resolveImageUrl } from "../../features/api";
import { useApp } from "../../components/context/AppContext";

const PublicationDetailPage = () => {
  const { publicationId } = useParams<{ publicationId: string }>();
  const [publication, setPublication] = useState<API.Publication | null>(null);
  const [event, setEvent] = useState<API.Event | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { registerEvent } = useApp();
  const role = user?.role || 'guest';

  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    if (publicationId) {
      const fetchPublication = async () => {
        try {
          setLoading(true);
          const pub = await PublicationAPI.getPublicationById(Number(publicationId));
          setPublication(pub);

          if (pub.type === 'evento' && pub.event_id) {
            const eventData = await EventAPI.getEventById(pub.event_id);
            setEvent(eventData);
          }
        } catch (error) {
          console.error(error);
          toast.error('Error al cargar la publicación.');
        } finally {
          setLoading(false);
        }
      };

      fetchPublication();
    }
  }, [publicationId]);

  const handleBack = () => {
    navigate('/publications');
  };

  const handleRegister = () => {
    if (event) {
        registerEvent(event.id.toString());
        toast.success("🎉 ¡Te has inscrito exitosamente al evento!", {
            description: `Ahora eres parte de: ${event.name}`,
            duration: 4000,
        });
    }
  };

  if (loading) {
    return <PublicationDetailSkeleton />;
  }

  if (!publication) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card>
                <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">Publicación no encontrada</p>
                    <Button onClick={handleBack}>Volver a publicaciones</Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  // Determine image source
  let imageSrc: string | null = null;
  if (publication.image_url) {
      imageSrc = resolveImageUrl(publication.image_url);
  }


  const isEventFull = event && event.capacity ? (event.capacity <= 0) : false; // Placeholder logic for full event

  return (
    <div className="min-h-screen pb-20 bg-gray-50/50">
      {/* Header */}
      <div className="bg-[#0a2740] p-4 shadow-sm text-white sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold truncate flex-1">
             {publication.title}
          </h1>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
         {/* Hero Image with Blurred Background */}
         {imageSrc && (
            <div 
                className="relative w-full h-[500px] bg-gray-900 overflow-hidden group cursor-zoom-in"
                onClick={() => setIsImageOpen(true)}
            >
              {/* Blurred Background Layer */}
              <div 
                className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110 transition-transform duration-700 group-hover:scale-125"
                style={{ backgroundImage: `url(${imageSrc})` }}
              />
              
              {/* Foreground Image Layer */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                 <img
                   src={imageSrc}
                   alt={publication.title}
                   className="max-w-full max-h-full object-contain shadow-2xl rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                   onError={(e) => {
                     e.currentTarget.style.display = 'none'; // Hide if fails
                   }}
                 />
              </div>

              <Badge
                className="absolute top-4 right-4 capitalize shadow-sm z-10"
                variant={publication.type === 'evento' ? 'default' : 'secondary'}
              >
                {publication.type}
              </Badge>
              
              {/* Status Badge (if event) */}
               {event && (
                 <div className="absolute top-4 left-4 z-10">
                    {(() => {
                       const eventDate = new Date(event.start_date);
                       const today = new Date();
                       today.setHours(0,0,0,0);
                       const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
                       const diffTime = eventDateOnly.getTime() - today.getTime();
                       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                       if (diffDays < 0) return <Badge className="bg-gray-500 shadow-sm">Finalizado</Badge>;
                       if (diffDays === 0) return <Badge className="bg-green-600 animate-pulse shadow-sm">En curso</Badge>;
                       if (diffDays <= 5) return <Badge className="bg-orange-500 shadow-sm">¡Pronto!</Badge>;
                       return <Badge className="bg-blue-500 shadow-sm">Próximo</Badge>;
                    })()}
                 </div>
               )}
            </div>
         )}

        <div className="p-4 space-y-6">
           {/* Title & Summary */}
           <section>
             <div className="flex flex-col gap-2 mb-4">
                {!imageSrc && (
                    <div className="flex gap-2 mb-2">
                        <Badge className="capitalize shadow-sm" variant={publication.type === 'evento' ? 'default' : 'secondary'}>
                            {publication.type}
                        </Badge>
                         {event && (() => {
                           const eventDate = new Date(event.start_date);
                           const today = new Date();
                           today.setHours(0,0,0,0);
                           const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
                           const diffTime = eventDateOnly.getTime() - today.getTime();
                           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                           if (diffDays < 0) return <Badge className="bg-gray-500 shadow-sm">Finalizado</Badge>;
                           if (diffDays === 0) return <Badge className="bg-green-600 animate-pulse shadow-sm">En curso</Badge>;
                           if (diffDays <= 5) return <Badge className="bg-orange-500 shadow-sm">¡Pronto!</Badge>;
                           return <Badge className="bg-blue-500 shadow-sm">Próximo</Badge>;
                        })()}
                    </div>
                )}
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{publication.title}</h1>
             </div>
             {publication.summary && (
                <p className="text-muted-foreground text-lg leading-relaxed">
                    {publication.summary}
                </p>
             )}
           </section>

           {/* Event Details Grid (Conditional) */}
           {event && (
             <section>
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-lg">Información del Evento</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha</p>
                          <p className="font-medium">
                            {new Date(event.start_date).toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {event.start_date.includes('T') && event.start_date.split('T')[1] !== '00:00:00' && (
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Clock className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Hora</p>
                              <p className="font-medium">
                                 {event.start_date.split('T')[1]?.substring(0, 5)}
                              </p>
                            </div>
                          </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <MapPin className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Modalidad</p>
                          <p className="capitalize font-medium">
                            {event.modality}
                            {event.location && event.modality === 'presencial' && (
                              <span className="text-xs ml-2 text-gray-500">• {event.location}</span>
                            )}
                          </p>
                          {event.virtual_url && (
                              <a href={event.virtual_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline block truncate max-w-[200px]">
                                  {event.virtual_url}
                              </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Users className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cupos</p>
                          <p className="font-medium">
                            {event.capacity ? `${event.capacity} cupos` : 'Ilimitado'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
             </section>
           )}

           {/* Action Buttons (Conditional for Events) */}
           {event && (
             <section>
                {!user ? (
                   <Card>
                     <CardContent className="p-6 text-center">
                       <p className="text-muted-foreground mb-4">Inicia sesión para inscribirte a este evento</p>
                       <Button onClick={() => navigate("/login")}>Iniciar Sesión</Button>
                     </CardContent>
                   </Card>
                ) : (
                   <div className="grid gap-4">
                     <Button 
                        size="lg" 
                        onClick={handleRegister} 
                        disabled={isEventFull}
                        className="w-full font-semibold text-lg h-12"
                     >
                        {isEventFull ? "Evento lleno" : "Inscribirme al evento"}
                     </Button>
                     {isEventFull && (
                        <p className="text-center text-sm text-muted-foreground">
                            Este evento ha alcanzado su capacidad máxima
                        </p>
                     )}
                   </div>
                )}
             </section>
           )}

           {/* Main Content */}
           <section>
             <Card>
               <CardContent className="p-6">
                 <div 
                    className="prose prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600"
                    dangerouslySetInnerHTML={{ __html: publication.content }}
                 />
               </CardContent>
             </Card>
           </section>
        </div>
      </div>

      <BottomNavbarWrapper role={role} />

      {/* Image Inspection Modal */}
      {isImageOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setIsImageOpen(false)}
        >
            <div className="relative max-w-full max-h-full">
                <img 
                    src={imageSrc} 
                    alt={publication.title} 
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
                />
                <button 
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors p-2"
                    onClick={() => setIsImageOpen(false)}
                >
                    <span className="sr-only">Cerrar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default PublicationDetailPage;

