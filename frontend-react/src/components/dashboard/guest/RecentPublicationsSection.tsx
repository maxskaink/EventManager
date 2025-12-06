import { useNavigate } from "react-router-dom";
import { Card, /*CardContent*/ } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

// Definiciones de tipo basadas en las proporcionadas por el usuario
interface RecentPublicationsSectionProps {
    publications: API.Publication[];
    isLoading: boolean;
    error: unknown;
}

export function RecentPublicationsSection({
    publications,
    isLoading,
    error,
}: RecentPublicationsSectionProps) {
    const navigate = useNavigate();

    const publicationsToShow = publications;

    const sectionTitle = "Publicationes Recientes"

    const renderContent = () => {
        if (isLoading) return <>
            <Card className="animate-pulse h-24" />
            <Card className="animate-pulse h-24" />
            <Card className="animate-pulse h-24" />
        </>
        if (!isLoading && publicationsToShow.length === 0 && !error) return <>
            <div className="col-span-full text-muted-foreground">
                No hay publicaciones recientes por ahora.
            </div>
        </>

        return <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {publicationsToShow.map((publication) => (
                <Card
                    key={publication.id}
                    className="flex p-3 transition-shadow hover:shadow-md cursor-pointer"
                    onClick={() => navigate(`/publications/${publication.id}`)}
                >
                    {/* Imagen/Placeholder */}
                    <div className="flex flex-row gap-2">

                        {publication.image_url && (
                            <div className="w-16 h-16 mr-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                <ImageWithFallback
                                    src={publication.image_url}
                                    alt={publication.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}


                        {/* Contenido (Título y Resumen/Fecha) */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-medium line-clamp-1">{publication.title}</h3>
                            <div className="flex flex-row items-center gap-3 text-xs text-muted-foreground mt-1">
                                <Badge variant="secondary" className="px-2 py-0.5 text-xs font-medium w-fit">
                                    {publication.type}
                                </Badge>
                                <div className="flex flex-row items-center gap-1">

                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                            {new Date(publication.created_at).toLocaleDateString("es-ES")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{sectionTitle}</h2>
                <Button
                    variant="outline"
                    onClick={() => navigate("/publications")}
                    className="rounded-md h-9 px-4 py-2 text-sm font-medium"
                >
                    Ver todas
                </Button>
            </div>
            {renderContent()}
        </section >
    );
}


