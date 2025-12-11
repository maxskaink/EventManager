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

    const renderContent = () => {
        if (isLoading) return <>
            <Card className="animate-pulse h-24 bg-slate-200" />
            <Card className="animate-pulse h-24 bg-slate-200" />
            <Card className="animate-pulse h-24 bg-slate-200" />
        </>
        if (!isLoading && publicationsToShow.length === 0 && !error) return <>
            <div className="col-span-full text-center py-12">
                <p className="text-slate-500">No hay publicaciones recientes</p>
            </div>
        </>

        return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publicationsToShow.map((publication) => (
                <Card
                    key={publication.id}
                    className="flex flex-col p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-105"
                    onClick={() => navigate(`/publications/${publication.id}`)}
                >
                    {/* Imagen/Placeholder */}
                    {publication.image_url && (
                        <div className="w-full h-40 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                            <ImageWithFallback
                                src={publication.image_url}
                                alt={publication.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Contenido */}
                    <div className="flex-1 flex flex-col">
                        <h3 className="text-base font-bold text-slate-900 line-clamp-2 mb-3">{publication.title}</h3>
                        <div className="flex flex-row items-center gap-2 text-xs text-slate-600">
                            <Badge className="bg-blue-100 text-blue-700 px-2 py-1 text-xs font-semibold">
                                {publication.type}
                            </Badge>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {new Date(publication.created_at).toLocaleDateString("es-ES")}
                                </span>
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
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Publicaciones Recientes</h2>
                    <p className="text-slate-500 text-sm mt-1">Mantente informado con las últimas novedades</p>
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate("/publications")}
                >
                    Ver todas
                </Button>
            </div>
            {renderContent()}
        </section >
    );
}


