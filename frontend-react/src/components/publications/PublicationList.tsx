// PublicationList.tsx

import React from "react";
import { MasonryContainer, MasonryBox } from "../ui/mansory-layout";
//import { PublicationItem } from "./PublicationItem"; // Assuming you will eventually use this

interface Props {
  publications: API.Publication[];
}

// Interface for the dummy content structure
interface DummyContentItem {
  id: number;
  text: string;
  imageHeight: number; // Random factor for image height (e.g., 200 to 500)
  imageSeed: number; // Unique seed for the random image (to ensure variety)
}

/**
 * Generates dummy content including random image properties.
 * We'll use Lorem Picsum (https://picsum.photos/) for random placeholder images.
 */
const generateImageContent = (count: number): DummyContentItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    text: `Publication Item ${i + 1}`,
    // Random height factor (e.g., 200px to 500px).
    // The width will be fixed by the column (MasonryBox).
    imageHeight: Math.floor(Math.random() * (500 - 200 + 1)) + 200,
    // Use a unique number (like 600 + i) as a seed for Lorem Picsum
    // to ensure unique, non-repeating images.
    imageSeed: 600 + i,
  }));
};

export const PublicationList: React.FC<Props> = ({ publications }) => {
  const dummyContent = generateImageContent(publications.length);

  return (
    <MasonryContainer>
      {dummyContent.map((item) => (
        <MasonryBox key={item.id}>
          {/* You can now use your actual PublicationItem component, 
            or keep the image placeholder structure below for testing.
          */}
          {/* <PublicationItem publication={publications[item.id]} /> */}

          <div
          style={{
            border: "1px solid black",
          }}
          >
            {/* This is the image placeholder structure. The width is 100% of the box,
              and the height varies based on the random imageHeight factor.
            */}
            <img
              src={`https://picsum.photos/id/${item.imageSeed}/${item.imageHeight}/400`}
              alt={`Random image for ${item.text}`}
              style={{
                width: "100%",
                // Ensures the image fills the container and maintains its aspect ratio
                objectFit: "cover",
                // Setting a minimum height based on the random factor
                minHeight: `${item.imageHeight}px`,
                display: "block", // Removes potential bottom margin/gap
              }}
              // This is crucial for a real masonry effect: load the image before rendering
              loading="lazy"
            />
            <h3 style={{ marginTop: "10px" }}>{item.text}</h3>
            <p>Some random content...</p>
          </div>
        </MasonryBox>
      ))}
    </MasonryContainer>
  );
};
