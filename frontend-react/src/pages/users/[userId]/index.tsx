import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { UnifiedHeader } from "../../../components/layout/UnifiedHeader";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { User, Award, CalendarDays, FileText, ExternalLink } from "lucide-react";
import userAPI from "../../../services/api/endpoints/user";
import certificateAPI from "../../../services/api/endpoints/certificate";
import externalEventAPI from "../../../services/api/endpoints/external-events";
import eventAPI from "../../../services/api/endpoints/event";
import articleAPI from "../../../services/api/endpoints/article";

export const UserDetailScreen = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const id = Number(userId);

  // 1. Fetch User Details (using listUsersByFilters)
  const { data: usersResponse, isLoading: isLoadingUser } = useQuery({
    queryKey: ['activeUsers'],
    queryFn: async () => {
      const response = await userAPI.listUsersByFilters({ 
        status: 'active',
        per_page: 1000 // Get all active users
      });
      return response.data;
    },
  });

  const user = usersResponse?.find((u: API.User) => u.id === id);

  // 2. Fetch Certificates
  const { data: certificatesResponse } = useQuery({
    queryKey: ['certificates', id],
    queryFn: () => certificateAPI.listCertificatesByUser(id),
    enabled: !!id,
  });
  const certificates = certificatesResponse?.certificates || [];

  // 3. Fetch External Events
  const { data: externalEventsResponse } = useQuery({
    queryKey: ['externalEvents', id],
    queryFn: () => externalEventAPI.listUserExternalEvents(id),
    enabled: !!id,
  });
  const externalEvents = externalEventsResponse?.external_events || [];

  // 4. Fetch Participations
  const { data: participations } = useQuery({
    queryKey: ['participations', id],
    queryFn: () => eventAPI.listEnrollmentsByUser(id),
    enabled: !!id,
  });

  // 5. Fetch Articles
  const { data: articles } = useQuery({
    queryKey: ['articles', id],
    queryFn: () => articleAPI.listArticlesByUser(id),
    enabled: !!id,
  });

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <UnifiedHeader title="Usuario no encontrado" onGoBack={() => navigate(-1)} />
        <div className="p-4 text-center text-muted-foreground">
          El usuario que buscas no existe o no está activo.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <UnifiedHeader title="Detalle de Usuario" onGoBack={() => navigate(-1)} />
      
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 py-6">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage src={user.avatar || undefined} alt={user.name} />
            <AvatarFallback className="text-2xl"><User /></AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-2">{user.role}</Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="certificates" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2">
            <TabsTrigger value="certificates" className="text-xs md:text-sm">Certificados</TabsTrigger>
            <TabsTrigger value="external" className="text-xs md:text-sm">Eventos Ext.</TabsTrigger>
            <TabsTrigger value="participations" className="text-xs md:text-sm">Participaciones</TabsTrigger>
            <TabsTrigger value="articles" className="text-xs md:text-sm">Artículos</TabsTrigger>
          </TabsList>

          <TabsContent value="certificates" className="mt-6 sm:mt-4 space-y-4">
            {certificates.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No hay certificados.</p>
            ) : (
              certificates.map((cert) => (
                <Card key={cert.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      {cert.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Emitido por: {cert.issuing_organization}</p>
                    <p className="text-xs text-muted-foreground mt-1">{cert.issue_date}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="external" className="mt-6 sm:mt-4 space-y-4">
            {externalEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No hay eventos externos.</p>
            ) : (
              externalEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-primary" />
                      {event.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.start_date}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="participations" className="mt-6 sm:mt-4 space-y-4">
            {(!participations || participations.length === 0) ? (
              <p className="text-center text-muted-foreground py-4">No hay participaciones.</p>
            ) : (
              participations.map((part) => (
                <Card key={part.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      {/* Note: EventParticipation entity usually has event_id, we might need to fetch event details or if it's included */}
                      Evento ID: {part.event_id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{part.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="articles" className="mt-6 sm:mt-4 space-y-4">
            {(!articles || articles.length === 0) ? (
              <p className="text-center text-muted-foreground py-4">No hay artículos.</p>
            ) : (
              articles.map((article) => (
                <Card key={article.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{article.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{article.publication_date}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDetailScreen;
