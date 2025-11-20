
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PublicationAPI, EventAPI } from '../../services/api';
import { toast } from 'sonner';
import PublicationDetailSkeleton from '../../components/publications/PublicationDetailSkeleton';

const PublicationDetailPage = () => {
  const { publicationId } = useParams<{ publicationId: string }>();
  const [publication, setPublication] = useState<API.Publication | null>(null);
  const [event, setEvent] = useState<API.Event | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <PublicationDetailSkeleton />;
  }

  if (!publication) {
    return <div>No se encontró la publicación.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{publication.title}</h1>
        <p className="text-gray-600 mb-4">{publication.summary}</p>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: publication.content }} />
        
        {event && (
          <div className="mt-6 pt-6 border-t">
            <h2 className="text-2xl font-bold mb-4">Evento Asociado</h2>
            <p><strong>Nombre:</strong> {event.name}</p>
            <p><strong>Descripción:</strong> {event.description}</p>
            <p><strong>Fecha de inicio:</strong> {new Date(event.start_date).toLocaleDateString()}</p>
            <p><strong>Fecha de fin:</strong> {new Date(event.end_date).toLocaleDateString()}</p>
            <p><strong>Ubicación:</strong> {event.location}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationDetailPage;
