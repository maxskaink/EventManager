import React from "react";
import PublicationCard from "./PublicationCard";
import { MasonryBox, MasonryContainer } from "../ui/mansory-layout";
import type { ContentItem } from "../../features/events/types";

interface PublicationListProps {
  publications: ContentItem[];
}

/*
const ESTIMATED_CARD_WIDTH = 300;
const EVENT_BASE_HEIGHT = 200;
const PUBLICATION_BASE_HEIGHT = 200;
const NO_IMAGE_EXTRA_HEIGHT = 50;


const resolveCardHeight = (publication: ContentItem) => {
   const isEvent = publication.kind === 'event' || publication.type === 'evento';
   const hasImage = !!publication.original?.image_url;

   if (!hasImage) {
       const baseHeight = isEvent ? EVENT_BASE_HEIGHT : PUBLICATION_BASE_HEIGHT;
       return baseHeight + NO_IMAGE_EXTRA_HEIGHT;
   }

   let imageHeight = ESTIMATED_CARD_WIDTH; // Default to square if parsing fails

   try {
       const imageUrl = publication.original.image_url;
       // Extract filename from URL (assuming it might be a full URL or relative path)
       const filename = imageUrl.split('/').pop() || "";
       
       // Remove extension
       const nameWithoutExt = filename.split('.').slice(0, -1).join('.');
       
       // Split by underscore to find dimensions at the end
       const parts = nameWithoutExt.split('_');
       
       if (parts.length >= 2) {
           const widthStr = parts[parts.length - 2];
           const heightStr = parts[parts.length - 1];
           
           const width = parseInt(widthStr, 10);
           const height = parseInt(heightStr, 10);

           if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
               const aspectRatio = width / height;
               imageHeight = ESTIMATED_CARD_WIDTH / aspectRatio;
           }
       }
   } catch (e) {
       console.warn("Failed to parse image dimensions for publication:", publication.id, e);
   }

   const baseHeight = isEvent ? EVENT_BASE_HEIGHT : PUBLICATION_BASE_HEIGHT;
   return baseHeight + imageHeight;
}
*/

export const PublicationList: React.FC<PublicationListProps> = ({ publications }) => {
  return (
    <MasonryContainer>
      {publications.map((publication) => (
        <MasonryBox key={publication.id}>
          <PublicationCard publication={publication} />
        </MasonryBox>
      ))}
    </MasonryContainer>
  );
};
