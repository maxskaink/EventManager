import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type UserRole =
  | "guest"
  | "member"
  | "coordinator"
  | "mentor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  interests?: string[];
  phone?: string;
  address?: string;
  city?: string;
  university?: string;
  program?: string;
}

// Unified Content interface (replaces Event and Publication)
export interface Content {
  id: string;
  title: string;
  description: string; // Main text content
  type: "charla" | "curso" | "convocatoria" | "comunicado" | "articulo" | "anuncio";
  date: string;
  author: string;
  authorId: string;
  status: "upcoming" | "ongoing" | "completed" | "draft" | "published" | "archived" | "cancelled";
  
  // Event-specific fields (only for charla, curso, convocatoria)
  time?: string;
  capacity?: number;
  enrolled?: number;
  modality?: "presencial" | "virtual" | "híbrida";
  location?: string;
  image?: string;
  
  // Publication-specific fields (only for comunicado, articulo, anuncio)
  excerpt?: string;
  visibility?: "all" | "mentors" | "members" | "coordinators";
  views?: number;
  comments?: number;
  tags?: string[];
}

export interface Certificate {
  id: string;
  title: string;
  topic: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadDate: string;
  userId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  eventId?: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  publicationDate: string;
  authors: string;
  publicationUrl: string;
  userId: string;
}

export interface UserEventParticipation {
  id: string;
  userId: string;
  eventId: string;
  registrationDate: string;
}

interface AppContextType {
  user: User | null;
  currentView: string;
  content: Content[]; // Unified content array (replaces events and publications)
  events: Content[]; // Alias for backward compatibility - filters content for event types
  publications: Content[]; // Alias for backward compatibility - filters content for publication types
  certificates: Certificate[];
  notifications: Notification[];
  articles: Article[];
  userEventParticipations: UserEventParticipation[];
  setUser: (user: User | null) => void;
  setCurrentView: (view: string) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  registerEvent: (eventId: string) => void;
  addCertificate: (certificate: Omit<Certificate, 'id' | 'uploadDate' | 'userId'>) => void;
  deleteCertificate: (certificateId: string) => void;
  addArticle: (article: Omit<Article, 'id' | 'userId'>) => void;
  deleteArticle: (articleId: string) => void;
  addUserEventParticipation: (eventId: string) => void;
  removeUserEventParticipation: (participationId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(
  undefined,
);

// Mock unified content data (replaces mockEvents and mockPublications)
const mockContent: Content[] = [
  // Event-type content
  {
    id: "1",
    title: "Introducción a Machine Learning",
    description: "Curso básico sobre los fundamentos del aprendizaje automático",
    type: "curso",
    date: "2025-01-12",
    time: "14:00",
    author: "Sistema",
    authorId: "system",
    modality: "virtual",
    capacity: 50,
    enrolled: 32,
    location: "Sala Virtual A",
    image: "https://images.unsplash.com/photo-1582192904915-d89c7250b235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcHJlc2VudGF0aW9uJTIwdGVjaHxlbnwxfHx8fDE3NTYwMTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "upcoming",
  },
  {
    id: "2",
    title: "Workshop de React Avanzado",
    description: "Taller práctico sobre patrones avanzados en React",
    type: "charla",
    date: "2025-09-20",
    time: "10:00",
    author: "Sistema",
    authorId: "system",
    modality: "presencial",
    capacity: 30,
    enrolled: 28,
    location: "Auditorio Principal",
    image: "https://images.unsplash.com/photo-1623121608226-ca93dec4d94e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMHRyYWluaW5nJTIwbWVldGluZ3xlbnwxfHx8fDE3NTYwNTU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "upcoming",
  },
  {
    id: "3",
    title: "Convocatoria Investigación 2025",
    description: "Convocatoria abierta para proyectos de investigación estudiantil",
    type: "convocatoria",
    date: "2025-10-01",
    time: "16:00",
    author: "Sistema",
    authorId: "system",
    modality: "híbrida",
    capacity: 100,
    enrolled: 45,
    location: "Mixto",
    image: "https://images.unsplash.com/photo-1650784853619-0845742430b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHJlc2VhcmNoJTIwdGVhbXxlbnwxfHx8fDE3NTYwNTU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "upcoming",
  },
  // Publication-type content
  {
    id: "4",
    title: "Convocatoria: Taller de Machine Learning",
    description: "Se abre convocatoria para el taller de Machine Learning que se realizará el próximo mes. Este taller está dirigido a estudiantes con conocimientos básicos de programación.",
    type: "comunicado",
    excerpt: "Se abre convocatoria para el taller de Machine Learning...",
    author: "Dr. María González",
    authorId: "coordinator1",
    date: "2024-01-20",
    status: "published",
    visibility: "all",
    views: 234,
    comments: 12,
    tags: ["machine-learning", "taller", "convocatoria"],
  },
  {
    id: "5",
    title: "Resultados del Hackathon 2024",
    description: "El pasado fin de semana se llevó a cabo nuestro hackathon anual con excelentes resultados. Los equipos participantes desarrollaron soluciones innovadoras.",
    type: "articulo",
    excerpt: "Resumen de los resultados del hackathon anual...",
    author: "Carlos López",
    authorId: "coordinator2",
    date: "2024-01-18",
    status: "published",
    visibility: "members",
    views: 156,
    comments: 8,
    tags: ["hackathon", "resultados", "innovación"],
  },
];

const mockCertificates: Certificate[] = [
  {
    id: "1",
    title: "Introducción a Python",
    topic: "Programación",
    fileName: "certificado_python.pdf",
    fileUrl: "#",
    fileSize: 245000,
    uploadDate: "2025-08-15",
    userId: "1",
  },
  {
    id: "2",
    title: "Workshop de Git",
    topic: "Control de versiones",
    fileName: "certificado_git.pdf",
    fileUrl: "#",
    fileSize: 189000,
    uploadDate: "2025-07-20",
    userId: "1",
  },
];

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nuevo evento disponible",
    message:
      "Se ha publicado un nuevo curso sobre Machine Learning",
    date: "2025-08-20",
    read: false,
    eventId: "1",
  },
  {
    id: "2",
    title: "Recordatorio de evento",
    message: "El workshop de React comienza mañana",
    date: "2025-08-19",
    read: true,
    eventId: "2",
  },
];



const mockArticles: Article[] = [
  {
    id: "1",
    title: "Aplicación de Deep Learning en Diagnóstico Médico",
    description: "Este artículo presenta un estudio sobre el uso de redes neuronales profundas para el diagnóstico de enfermedades a partir de imágenes médicas.",
    publicationDate: "2024-12-10",
    authors: "Juan Pérez, María González",
    publicationUrl: "https://ejemplo.com/articulo1",
    userId: "1",
  },
];

const mockUserEventParticipations: UserEventParticipation[] = [
  {
    id: "1",
    userId: "1",
    eventId: "1",
    registrationDate: "2025-01-10",
  },
  {
    id: "2",
    userId: "1",
    eventId: "2",
    registrationDate: "2025-01-08",
  },
];

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>({
    id: "0",
    name: "guest",
    role: "guest",
    email: "guest@guest.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    interests: ["Machone Learning", "React", "Python"],
  });
  const [currentView, setCurrentView] = useState(
    "dashboard-guest",
  );
  const [content] = useState<Content[]>(mockContent);
  const [certificates, setCertificates] =
    useState<Certificate[]>(mockCertificates);
  const [notifications] = useState<Notification[]>(
    mockNotifications,
  );
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [userEventParticipations, setUserEventParticipations] = 
    useState<UserEventParticipation[]>(mockUserEventParticipations);

  // Computed properties for backward compatibility
  const events = content.filter(c => 
    c.type === "charla" || c.type === "curso" || c.type === "convocatoria"
  );
  const publications = content.filter(c => 
    c.type === "comunicado" || c.type === "articulo" || c.type === "anuncio"
  );

  const login = (email: string, password: string): boolean => {
    // Mock login logic
    if (email && password) {
      let role: UserRole = "member";
      if (email.includes("coordinator")) role = "coordinator";
      if (email.includes("mentor")) role = "mentor";
      if (email.includes("guest")) role = "guest";

      const mockUser: User = {
        id: "1",
        name: email.split("@")[0],
        email,
        role,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        interests: ["Machine Learning", "React", "Python"],
      };

      setUser(mockUser);
      setCurrentView(
        role === "guest"
          ? "dashboard-guest"
          : role === "coordinator"
            ? "dashboard-coordinator"
            : role === "mentor"
              ? "dashboard-mentor"
              : "dashboard-member",
      );
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentView("login");
  };

  const registerEvent = (eventId: string) => {
    // Mock event registration
    console.log("Registering for event:", eventId);
  };

  const addCertificate = (certificate: Omit<Certificate, 'id' | 'uploadDate' | 'userId'>) => {
    if (!user) return;
    
    const newCertificate: Certificate = {
      ...certificate,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0],
      userId: user.id,
    };
    
    setCertificates([...certificates, newCertificate]);
  };

  const deleteCertificate = (certificateId: string) => {
    setCertificates(certificates.filter(cert => cert.id !== certificateId));
  };

  const addArticle = (article: Omit<Article, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      userId: user.id,
    };
    
    setArticles([...articles, newArticle]);
  };

  const deleteArticle = (articleId: string) => {
    setArticles(articles.filter(article => article.id !== articleId));
  };

  const addUserEventParticipation = (eventId: string) => {
    if (!user) return;
    
    // Check if already participating
    const alreadyParticipating = userEventParticipations.some(
      p => p.userId === user.id && p.eventId === eventId
    );
    
    if (alreadyParticipating) return;
    
    const newParticipation: UserEventParticipation = {
      id: Date.now().toString(),
      userId: user.id,
      eventId: eventId,
      registrationDate: new Date().toISOString().split('T')[0],
    };
    
    setUserEventParticipations([...userEventParticipations, newParticipation]);
  };

  const removeUserEventParticipation = (participationId: string) => {
    setUserEventParticipations(
      userEventParticipations.filter(p => p.id !== participationId)
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentView,
        content,
        events,
        publications,
        certificates,
        notifications,
        articles,
        userEventParticipations,
        setUser,
        setCurrentView,
        login,
        logout,
        registerEvent,
        addCertificate,
        deleteCertificate,
        addArticle,
        deleteArticle,
        addUserEventParticipation,
        removeUserEventParticipation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error(
      "useApp must be used within an AppProvider",
    );
  }
  return context;
}