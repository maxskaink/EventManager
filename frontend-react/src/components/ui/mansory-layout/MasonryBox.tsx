// MasonryBox.tsx

import React from 'react';

// Defines the props for the MasonryBox component
interface MasonryBoxProps {
  children: React.ReactNode;
  style?: React.CSSProperties; // Optional style prop for customization
}

/**
 * A presentational component for an individual item in the Masonry layout.
 */
const MasonryBox: React.FC<MasonryBoxProps> = ({ children, style }) => {
  // Styles mirroring your original .boxes CSS
  const boxStyle: React.CSSProperties = {
    width: '100%',
    // Removed fixed height, as in a real masonry layout,
    // the height should be determined by the content.
    // height: '10rem',
    ...style, // Apply any custom styles passed in props
  };

  return <div style={boxStyle}>{children}</div>;
};

export default MasonryBox;