import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UnifiedHeader } from "../../../components/layout/UnifiedHeader";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import { User, Award, CalendarDays, FileText, ExternalLink, Trash2 } from "lucide-react";
import userAPI from "../../../services/api/endpoints/user";
import certificateAPI from "../../../services/api/endpoints/certificate";
import externalEventAPI from "../../../services/api/endpoints/external-events";
import eventAPI from "../../../services/api/endpoints/event";
import articleAPI from "../../../services/api/endpoints/article";
import { useAuthStore } from "../../../stores/auth.store";
import { toast } from "sonner"; // Assuming sonner is used for toasts based on typical stack, or standard alert

export const UserDetailScreen = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const id = Number(userId);
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const isMentor = currentUser?.role === "mentor";

  // 1. Fetch User Details (using listUsersByFilters)
  const { data: usersResponse, isLoading: isLoadingUser } = useQuery({
    queryKey: ["activeUsers"],
    queryFn: async () => {
      const response = await userAPI.listUsersByFilters({
        status: "active",
        per_page: 1000, // Get all active users
      });
      return response.data;
    },
  });

  const user = usersResponse?.find((u: API.User) => u.id === id);

  // 2. Fetch Certificates
  const { data: certificatesResponse } = useQuery({
    queryKey: ["certificates", id],
    queryFn: () => certificateAPI.listCertificatesByUser(id),
    enabled: !!id,
  });
  const certificates = certificatesResponse?.certificates || [];

  // 3. Fetch External Events
  const { data: externalEventsResponse } = useQuery({
    queryKey: ["externalEvents", id],
    queryFn: () => externalEventAPI.listUserExternalEvents(id),
    enabled: !!id,
  });
  const externalEvents = externalEventsResponse?.external_events || [];

  // 4. Fetch Participations
  const { data: participations } = useQuery({
    queryKey: ["participations", id],
    queryFn: () => eventAPI.listEnrollmentsByUser(id),
    enabled: !!id,
  });

  // 5. Fetch Articles
  const { data: articles } = useQuery({
    queryKey: ["articles", id],
    queryFn: () => articleAPI.listArticlesByUser(id),
    enabled: !!id,
  });

  // Mutations
  const deleteCertificateMutation = useMutation({
    mutationFn: certificateAPI.deleteCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates", id] });
      toast.success("Certificado eliminado correctamente");
    },
  });

  const deleteExternalEventMutation = useMutation({
    mutationFn: externalEventAPI.deleteExternalEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["externalEvents", id] });
      toast.success("Evento externo eliminado correctamente");
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: articleAPI.deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles", id] });
      toast.success("Artículo eliminado correctamente");
    },
  });

  if (isLoadingUser) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center pb-20">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <UnifiedHeader title="Usuario no encontrado" onGoBack={() => navigate(-1)} />
        <div className="text-muted-foreground p-4 text-center">El usuario que buscas no existe o no está activo.</div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      <UnifiedHeader title="Detalle de Usuario" onGoBack={() => navigate(-1)} />

      <div className="mx-auto max-w-4xl space-y-6 p-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 py-6">
          <Avatar className="border-background h-24 w-24 border-4 shadow-lg">
            <AvatarImage src={user.avatar || undefined} alt={user.name} />
            <AvatarFallback className="text-2xl">
              <User />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-2">
              {user.role}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="certificates" className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2 h-auto sm:grid-cols-4">
            <TabsTrigger value="certificates" className="text-xs md:text-sm">
              Certificados
            </TabsTrigger>
            <TabsTrigger value="external" className="text-xs md:text-sm">
              Eventos Ext.
            </TabsTrigger>
            <TabsTrigger value="participations" className="text-xs md:text-sm">
              Participaciones
            </TabsTrigger>
            <TabsTrigger value="articles" className="text-xs md:text-sm">
              Artículos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="certificates" className="mt-6 space-y-4 sm:mt-4">
            {certificates.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No hay certificados.</p>
            ) : (
              certificates.map((cert) => (
                <CertificateCard
                  key={cert.id}
                  certificate={cert}
                  isMentor={isMentor}
                  onDelete={() => deleteCertificateMutation.mutate(cert.id)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="external" className="mt-6 space-y-4 sm:mt-4">
            {externalEvents.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No hay eventos externos.</p>
            ) : (
              externalEvents.map((event) => (
                <ExternalEventCard
                  key={event.id}
                  event={event}
                  isMentor={isMentor}
                  onDelete={() => deleteExternalEventMutation.mutate(event.id)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="participations" className="mt-6 space-y-4 sm:mt-4">
            {!participations || participations.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No hay participaciones.</p>
            ) : (
              participations.map((part) => <ParticipationCard key={part.id} part={part} />)
            )}
          </TabsContent>

          <TabsContent value="articles" className="mt-6 space-y-4 sm:mt-4">
            {!articles || articles.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No hay artículos.</p>
            ) : (
              articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isMentor={isMentor}
                  onDelete={() => deleteArticleMutation.mutate(article.id)}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface DeleteProps {
  isMentor: boolean;
  onDelete: () => void;
  itemName: string;
}

const DeleteButton = ({ isMentor, onDelete, itemName }: DeleteProps) => {
  if (!isMentor) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar {itemName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente de la lista del usuario.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const CertificateCard = ({
  certificate,
  isMentor,
  onDelete,
}: {
  certificate: API.Certificate;
  isMentor: boolean;
  onDelete: () => void;
}) => (
  <Card key={certificate.id}>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Award className="text-primary h-4 w-4" />
          {certificate.name}
        </CardTitle>
        <DeleteButton isMentor={isMentor} onDelete={onDelete} itemName="certificado" />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm">Emitido por: {certificate.issuing_organization}</p>
      <p className="text-muted-foreground mt-1 text-xs">{certificate.issue_date}</p>
    </CardContent>
  </Card>
);

const ParticipationCard = ({ part }: { part: API.EventParticipation }) => (
  <Card key={part.id}>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-base">
        <CalendarDays className="text-primary h-4 w-4" />
        {part.event ? part.event.name : `Evento ID: ${part.event_id}`}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {part.event ? (
        <>
          <p className="text-muted-foreground text-sm">
            {part.event.modality === "virtual" ? "Virtual" : part.event.location || "Ubicación no disponible"}
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-muted-foreground text-xs">{new Date(part.event.start_date).toLocaleDateString()}</p>
            <Badge variant="outline" className="capitalize">
              {part.status}
            </Badge>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between">
          <Badge variant="outline">{part.status}</Badge>
        </div>
      )}
    </CardContent>
  </Card>
);

const ExternalEventCard = ({
  event,
  isMentor,
  onDelete,
}: {
  event: API.ExternalEvent;
  isMentor: boolean;
  onDelete: () => void;
}) => (
  <Card key={event.id}>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <ExternalLink className="text-primary h-4 w-4" />
          {event.name}
        </CardTitle>
        <DeleteButton isMentor={isMentor} onDelete={onDelete} itemName="evento externo" />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm">{event.location}</p>
      <p className="text-muted-foreground mt-1 text-xs">{event.start_date}</p>
    </CardContent>
  </Card>
);

const ArticleCard = ({
  article,
  isMentor,
  onDelete,
}: {
  article: API.Article;
  isMentor: boolean;
  onDelete: () => void;
}) => (
  <Card key={article.id}>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="text-primary h-4 w-4" />
          {article.title}
        </CardTitle>
        <DeleteButton isMentor={isMentor} onDelete={onDelete} itemName="artículo" />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm">{article.description}</p>
      <p className="text-muted-foreground mt-1 text-xs">{article.publication_date}</p>
    </CardContent>
  </Card>
);

export default UserDetailScreen;
