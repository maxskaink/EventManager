import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Users, Share2 } from 'lucide-react';
import { PublicationAPI, EventAPI } from '../../services/api';
import { toast } from 'sonner';
import PublicationDetailSkeleton from '../../components/publications/PublicationDetailSkeleton';
import BottomNavbarWrapper from '../../components/nav/BottomNavbarWrapper';
import { useAuthStore } from '../../stores/auth.store';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { resolveImageUrl } from "../../features/api";
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

const PublicationDetailPage = () => {
  const { publicationId } = useParams<{ publicationId: string }>();
  const [publication, setPublication] = useState<API.Publication | null>(null);
  const [event, setEvent] = useState<API.Event | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [registering, setRegistering] = useState(false);

  const role = user?.role || 'guest';
  const [isImageOpen, setIsImageOpen] = useState(false);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (publicationId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const pub = await PublicationAPI.getPublicationById(Number(publicationId));
          setPublication(pub);

          if (pub.type === 'evento' && pub.event_id) {
            const eventData = await EventAPI.getEventById(pub.event_id);
            setEvent(eventData);

            // Check enrollment if user is logged in
            if (user) {
              try {
                const enrollments = await EventAPI.listEnrollmentsByUser(user.id);
                const enrolled = enrollments.some(e => e.event_id === pub.event_id && e.status === 'active');
                setIsEnrolled(enrolled);
              } catch (err) {
                console.error("Failed to fetch enrollments", err);
              }
            }
          }
        } catch (error) {
          console.error(error);
          toast.error('Error al cargar la publicación.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [publicationId, user]);

  const handleBack = () => {
    navigate('/publications');
  };

  const handleRegister = async () => {
    if (!event) return;

    try {
      setRegistering(true);
      await EventAPI.enroll(event.id);
      setIsEnrolled(true);
      toast.success("🎉 ¡Te has inscrito exitosamente al evento!", {
        description: `Ahora eres parte de: ${event.name}`,
        duration: 4000,
      });
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Error al inscribirse al evento.";
      toast.error(errorMessage);
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelEnrollment = async () => {
    if (!event) return;

    try {
      setCanceling(true);
      await EventAPI.cancelEnrollment(event.id);
      setIsEnrolled(false);
      toast.success("Inscripción cancelada exitosamente.");
    } catch (error: any) {
      console.error(error);
      toast.error("Error al cancelar la inscripción.");
    } finally {
      setCanceling(false);
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: publication.title,
          text: publication.summary || 'Mira esta publicación',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50/50">
      {/* Header */}
      <UnifiedHeader
        title={publication.title}
        onGoBack={handleBack}
        actions={
          <Button variant="ghost" size="icon" onClick={handleShare} className="text-white hover:bg-white/10">
            <Share2 className="h-5 w-5" />
          </Button>
        }
      />

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Image */}
        {imageSrc && (
          <div
            className="relative w-full h-[400px] md:h-[500px] bg-gray-900 rounded-3xl overflow-hidden group cursor-zoom-in shadow-xl mx-auto"
            onClick={() => setIsImageOpen(true)}
          >
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
                  today.setHours(0, 0, 0, 0);
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

        <div className="space-y-8">
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
                    today.setHours(0, 0, 0, 0);
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
                  {isEnrolled ? (
                    <Button
                      size="lg"
                      variant="destructive"
                      onClick={handleCancelEnrollment}
                      disabled={canceling}
                      className="w-full font-semibold text-lg h-12"
                    >
                      {canceling ? "Cancelando..." : "Cancelar inscripción"}
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={handleRegister}
                      disabled={isEventFull || registering}
                      className="w-full font-semibold text-lg h-12"
                    >
                      {registering ? "Inscribiendo..." : (isEventFull ? "Evento lleno" : "Inscribirme al evento")}
                    </Button>
                  )}

                  {isEventFull && !isEnrolled && (
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
              src={imageSrc ?? undefined}
              alt={publication.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
            <button
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors p-2"
              onClick={() => setIsImageOpen(false)}
            >
              <span className="sr-only">Cerrar</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationDetailPage;

