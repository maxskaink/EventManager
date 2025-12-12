import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { translatePublicationType } from "../../features/events"; // Asumiendo que tienes un traductor
import { resolveImageUrl } from "../../features/api";

interface Props {
  publication: API.Publication;
}

export const PublicationItem: React.FC<Props> = ({ publication }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/publications/${publication.id}`);
  };

  console.log(publication)
  console.log(resolveImageUrl(publication.image_url!))

  return (
    <Card onClick={handleClick} className="mb-4 break-inside-avoid cursor-pointer transition-all hover:shadow-lg">
      {/* Contenedor de la Imagen */}
      <div className="relative overflow-hidden rounded-t-lg">
        {publication.image_url && (
          <ImageWithFallback
            src={resolveImageUrl(publication.image_url)}
            alt={publication.title}
            className="w-full h-auto object-cover" // La magia del Masonry: la altura es automática
          />
        )}

        {/* Chip flotante para el tipo */}
        <Badge variant="secondary" className="absolute top-2 right-2 text-xs shadow-md">
          {translatePublicationType(publication.type)}
        </Badge>
      </div>

      {/* Contenido de la tarjeta */}
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2">{publication.title}</h3>
        {publication.summary && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{publication.summary}</p>
        )}
      </CardContent>
    </Card>
  );
};
