
type UserRole =
  | "guest"
  | "member"
  | "coordinator"
  | "mentor";

interface User {
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
interface Content {
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

interface Certificate {
  id: string;
  title: string;
  topic: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadDate: string;
  userId: string;
}

interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  eventId?: string;
}

interface Article {
  id: string;
  title: string;
  description: string;
  publicationDate: string;
  authors: string;
  publicationUrl: string;
  userId: string;
}

interface UserEventParticipation {
  id: string;
  userId: string;
  eventId: string;
  registrationDate: string;
}

interface AppContextType {
  user: User | null;
  content: Content[]; // Unified content array (replaces events and publications)
  events: Content[]; // Alias for backward compatibility - filters content for event types
  publications: Content[]; // Alias for backward compatibility - filters content for publication types
  certificates: Certificate[];
  notifications: AppNotification[];
  articles: Article[];
  userEventParticipations: UserEventParticipation[];
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  setNavigate: (a: (to: string) => void) => void;
  logout: () => void;
  registerEvent: (eventId: string) => void;
  addCertificate: (certificate: Omit<Certificate, 'id' | 'uploadDate' | 'userId'>) => void;
  deleteCertificate: (certificateId: string) => void;
  addArticle: (article: Omit<Article, 'id' | 'userId'>) => void;
  deleteArticle: (articleId: string) => void;
  addUserEventParticipation: (eventId: string) => void;
  removeUserEventParticipation: (participationId: string) => void;
}