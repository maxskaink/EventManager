import React from 'react';
import { resolveImageUrl } from '../../features/api';

interface PublicationCardProps {
  publication: API.Publication;
}

const chipColorMap: Record<API.PublicationType, string> = {
  articulo: 'bg-green-500',
  aviso: 'bg-yellow-500',
  comunicado: 'bg-blue-500',
  material: 'bg-purple-500',
  evento: 'bg-red-500',
};


const PublicationCard: React.FC<PublicationCardProps> = ({ publication }) => {

/*  const getPublicationImageUrl = (imageUrl: string, width: number, height: number) => {
    if(!imageUrl) return '';
    const lastDotIndex = imageUrl.lastIndexOf('.');
    if (lastDotIndex === -1) return imageUrl;
    const imageName = imageUrl.substring(0, lastDotIndex);
    const extension = imageUrl.substring(lastDotIndex);
    return `${imageName}-${width}-${height}${extension}`;
  }
  */
  const chipBgColor = chipColorMap[publication.type] || 'bg-gray-400';


  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-200 ease-in-out cursor-pointer flex flex-col h-full hover:-translate-y-1">
      {publication.image_url && (
        <img
          className="w-full h-auto object-cover"
          src={resolveImageUrl(publication.image_url)}
          alt={publication.title}
        />
      )}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex gap-2 mb-3">
          <div className={`${chipBgColor} text-white py-1 px-2 rounded-full text-xs font-medium capitalize`}>
            {publication.type}
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{publication.title}</h3>
        {publication.summary && <p className="text-sm text-gray-600 leading-normal flex-grow">{publication.summary}</p>}
      </div>
    </div>
  );
};

export default PublicationCard;
