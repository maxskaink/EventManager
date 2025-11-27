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
    margin: '10px auto',
    width: '100%',
    borderRadius: '5px',
    padding: '10px',
    // Removed fixed height, as in a real masonry layout,
    // the height should be determined by the content.
    // height: '10rem',
    background: 'goldenrod',
    boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
    ...style, // Apply any custom styles passed in props
  };

  return <div style={boxStyle}>{children}</div>;
};

export default MasonryBox;