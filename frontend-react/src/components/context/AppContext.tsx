import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  mockArticles,
  mockCertificates,
  mockContent,
  mockNotifications,
  mockUserEventParticipations,
} from "./mock-data";
import { useAuthStore } from "../../stores/auth.store";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Sincronizar con el auth store de Zustand
  const authUser = useAuthStore((state) => state.user);
  const authLogout = useAuthStore((state) => state.logout);
  
  const [user, setUser] = useState<User | null>(authUser);
  const [navigate, setNavigate] = useState<(to: string) => void>();
  
  // Sincronizar el usuario cuando cambie en el auth store
  useEffect(() => {
    setUser(authUser);
  }, [authUser]);
  const [content] = useState<Content[]>(mockContent);
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [notifications] = useState<AppNotification[]>(mockNotifications);
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [userEventParticipations, setUserEventParticipations] =
    useState<UserEventParticipation[]>(mockUserEventParticipations);

  // Computed properties for backward compatibility
  const events = content.filter((c) => c.type === "charla" || c.type === "curso" || c.type === "convocatoria");
  const publications = content.filter((c) => c.type === "comunicado" || c.type === "articulo" || c.type === "anuncio");

  const login = async (email: string, password: string): Promise<boolean> => {
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
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        interests: ["Machine Learning", "React", "Python"],
      };

      setUser(mockUser);
      
      return true;
    }
    return false;
  };

  const logout = () => {
    authLogout(); // Usar el logout del auth store
    setUser(null);
    // Redirigir al login
    if (navigate) {
      navigate("/login");
    } else {
      window.location.href = "/login";
    }
  };

  const registerEvent = (eventId: string) => {
    // Mock event registration
    console.log("Registering for event:", eventId);
  };

  const addCertificate = (certificate: Omit<Certificate, "id" | "uploadDate" | "userId">) => {
    if (!user) return;

    const newCertificate: Certificate = {
      ...certificate,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split("T")[0],
      userId: user.id,
    };

    setCertificates([...certificates, newCertificate]);
  };

  const deleteCertificate = (certificateId: string) => {
    setCertificates(certificates.filter((cert) => cert.id !== certificateId));
  };

  const addArticle = (article: Omit<Article, "id" | "userId">) => {
    if (!user) return;

    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      userId: user.id,
    };

    setArticles([...articles, newArticle]);
  };

  const deleteArticle = (articleId: string) => {
    setArticles(articles.filter((article) => article.id !== articleId));
  };

  const addUserEventParticipation = (eventId: string) => {
    if (!user) return;

    // Check if already participating
    const alreadyParticipating = userEventParticipations.some((p) => p.userId === user.id && p.eventId === eventId);

    if (alreadyParticipating) return;

    const newParticipation: UserEventParticipation = {
      id: Date.now().toString(),
      userId: user.id,
      eventId: eventId,
      registrationDate: new Date().toISOString().split("T")[0],
    };

    setUserEventParticipations([...userEventParticipations, newParticipation]);
  };

  const removeUserEventParticipation = (participationId: string) => {
    setUserEventParticipations(userEventParticipations.filter((p) => p.id !== participationId));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        content,
        events,
        publications,
        certificates,
        notifications,
        articles,
        userEventParticipations,
        setUser,
        setNavigate,
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
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
