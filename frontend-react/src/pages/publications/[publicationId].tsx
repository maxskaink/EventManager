import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PublicationAPI, EventAPI } from '../../services/api';
import { toast } from 'sonner';
import PublicationDetailSkeleton from '../../components/publications/PublicationDetailSkeleton';
import BottomNavbarWrapper from '../../components/nav/BottomNavbarWrapper';
import { useAuthStore } from '../../stores/auth.store';

const PublicationDetailPage = () => {
  const { publicationId } = useParams<{ publicationId: string }>();
  const [publication, setPublication] = useState<API.Publication | null>(null);
  const [event, setEvent] = useState<API.Event | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role || 'guest';

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
          toast.error('Error al cargar la publicación.');
        } finally {
          setLoading(false);
        }
      };

      fetchPublication();
    }
  }, [publicationId]);

  const handleBack = () => {
    navigate('/see-publication');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md w-full p-4 flex items-center">
        <button onClick={handleBack} className="mr-4">
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-semibold truncate">
          {loading ? 'Cargando...' : publication?.title || 'Detalle de Publicación'}
        </h1>
      </header>

      <main className="flex-grow overflow-y-auto p-4">
        {loading ? (
          <PublicationDetailSkeleton />
        ) : !publication ? (
          <div>No se encontró la publicación.</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold mb-4">{publication.title}</h1>
            <p className="text-gray-600 mb-4">{publication.summary}</p>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: publication.content }}
            />
            {event && (
              <div className="mt-6 pt-6 border-t">
                <h2 className="text-2xl font-bold mb-4">Evento Asociado</h2>
                <p>
                  <strong>Nombre:</strong> {event.name}
                </p>
                <p>
                  <strong>Descripción:</strong> {event.description}
                </p>
                <p>
                  <strong>Fecha de inicio:</strong>{' '}
                  {new Date(event.start_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Fecha de fin:</strong>{' '}
                  {new Date(event.end_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Ubicación:</strong> {event.location}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNavbarWrapper role={role} />
    </div>
  );
};

export default PublicationDetailPage;
