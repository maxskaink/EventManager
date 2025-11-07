// Mock unified content data (replaces mockEvents and mockPublications)
export const mockContent: Content[] = [
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

export const mockCertificates: Certificate[] = [
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

export const mockNotifications: AppNotification[] = [
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



export const mockArticles: Article[] = [
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

export const mockUserEventParticipations: UserEventParticipation[] = [
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