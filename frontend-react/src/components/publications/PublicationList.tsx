import React from 'react';
import { PublicationItem } from './PublicationItem';

interface Props {
  publications: API.Publication[];
}

export const PublicationList: React.FC<Props> = ({ publications }) => {
  return (
    /**
     * Contenedor Masonry (Pinterest-like).
     * Usa CSS columns para crear el layout.
     * - `column-count-2`: 2 columnas en móvil/defecto
     * - `md:column-count-3`: 3 columnas en pantallas medianas
     * - `lg:column-count-4`: 4 columnas en pantallas grandes
     * - `gap-4`: Espacio entre columnas
     */
    <div className="md:column-count-3 lg:column-count-4 column-count-2 gap-4">
      {publications.map((pub) => (
        <PublicationItem key={pub.id} publication={pub} />
      ))}
    </div>
  );
};