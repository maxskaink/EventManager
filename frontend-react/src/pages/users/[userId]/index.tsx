import { useParams, useNavigate } from "react-router";
import { UnifiedHeader } from "../../../components/layout/UnifiedHeader";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { User, Award, CalendarDays, FileText, ExternalLink } from "lucide-react";

// Mock data for user details
const MOCK_USER_DETAILS = {
  1: { name: "Alice Johnson", email: "alice@example.com", role: "Member", avatar: "https://i.pravatar.cc/150?u=alice" },
  2: { name: "Bob Smith", email: "bob@example.com", role: "Coordinator", avatar: "https://i.pravatar.cc/150?u=bob" },
  3: { name: "Charlie Brown", email: "charlie@example.com", role: "Mentor", avatar: "https://i.pravatar.cc/150?u=charlie" },
  4: { name: "David Lee", email: "david@example.com", role: "Member", avatar: "https://i.pravatar.cc/150?u=david" },
  5: { name: "Eva Green", email: "eva@example.com", role: "Interested", avatar: "https://i.pravatar.cc/150?u=eva" },
};

// Mock data for tabs
const MOCK_CERTIFICATES = [
  { id: 1, title: "React Fundamentals", date: "2023-10-15", issuer: "Tech Academy" },
  { id: 2, title: "Advanced TypeScript", date: "2023-11-20", issuer: "Code Masters" },
];

const MOCK_EXTERNAL_EVENTS = [
  { id: 1, title: "Tech Conference 2023", date: "2023-09-10", location: "Convention Center" },
  { id: 2, title: "Local Hackathon", date: "2023-12-05", location: "University Hall" },
];

const MOCK_PARTICIPATIONS = [
  { id: 1, eventName: "Intro to AI", role: "Attendee", status: "Completed" },
  { id: 2, eventName: "Web Dev Workshop", role: "Volunteer", status: "Completed" },
];

const MOCK_ARTICLES = [
  { id: 1, title: "Understanding React Hooks", date: "2023-08-22", summary: "A deep dive into useEffect and useState." },
  { id: 2, title: "TypeScript Best Practices", date: "2023-09-15", summary: "How to write clean and type-safe code." },
];

export const UserDetailScreen = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = MOCK_USER_DETAILS[Number(userId) as keyof typeof MOCK_USER_DETAILS];

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <UnifiedHeader title="Usuario no encontrado" onGoBack={() => navigate(-1)} />
        <div className="p-4 text-center text-muted-foreground">
          El usuario que buscas no existe.
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
            <AvatarImage src={user.avatar} alt={user.name} />
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="certificates" className="text-xs md:text-sm">Certificados</TabsTrigger>
            <TabsTrigger value="external" className="text-xs md:text-sm">Eventos Ext.</TabsTrigger>
            <TabsTrigger value="participations" className="text-xs md:text-sm">Participaciones</TabsTrigger>
            <TabsTrigger value="articles" className="text-xs md:text-sm">Artículos</TabsTrigger>
          </TabsList>

          <TabsContent value="certificates" className="mt-4 space-y-4">
            {MOCK_CERTIFICATES.map((cert) => (
              <Card key={cert.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    {cert.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Emitido por: {cert.issuer}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cert.date}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="external" className="mt-4 space-y-4">
            {MOCK_EXTERNAL_EVENTS.map((event) => (
              <Card key={event.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-primary" />
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="participations" className="mt-4 space-y-4">
            {MOCK_PARTICIPATIONS.map((part) => (
              <Card key={part.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {part.eventName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">{part.role}</p>
                    <Badge variant="outline">{part.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="articles" className="mt-4 space-y-4">
            {MOCK_ARTICLES.map((article) => (
              <Card key={article.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{article.summary}</p>
                  <p className="text-xs text-muted-foreground mt-1">{article.date}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDetailScreen;
