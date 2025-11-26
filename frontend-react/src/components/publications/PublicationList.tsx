import React from "react";
import PublicationCard from "./PublicationCard";
import { MasonryBox, MasonryContainer } from "../ui/mansory-layout";
import type { ContentItem } from "../../features/events/types";

interface PublicationListProps {
  publications: ContentItem[];
}

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
