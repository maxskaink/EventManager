// MasonryContainer.tsx

import React, { useMemo, useState, useEffect, useCallback } from 'react';

// Defines the props for the MasonryContainer component
interface MasonryContainerProps {
  children: React.ReactNode;
  columnCount?: number; // Optional prop to override the default column count
  breakpoint?: number; // Optional prop to define the breakpoint for changing columns
}

// Function to get the current window width
const getWindowWidth = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth;
  }
  return 0; // Default for SSR
};

/**
 * The main component that renders the Masonry layout.
 * It manages column creation and children distribution.
 */
const MasonryContainer: React.FC<MasonryContainerProps> = ({
  children,
  columnCount,
  breakpoint = 760, // Default breakpoint from your original comment
}) => {
  // Convert children to an array of React elements
  const items = React.Children.toArray(children);

  // --- Responsive Logic ---
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());

  const handleResize = useCallback(() => {
    setWindowWidth(getWindowWidth());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // Initial call to set the width if not set by initial state
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Determine the number of columns based on window width and props
  const numCols = useMemo(() => {
    // If columnCount prop is provided, use it
    if (columnCount !== undefined) {
      return columnCount;
    }

    // Default responsive logic (mirroring your commented-out JS logic)
    if (windowWidth > breakpoint) {
      return 3; // 3 columns for desktop/wide view
    } else if (windowWidth > 480) {
      return 2; // 2 columns for tablet/mid-view
    } else {
      return 1; // 1 column for mobile/narrow view
    }
  }, [columnCount, windowWidth, breakpoint]);

  // --- Masonry Distribution Logic ---

  // Use Memoization for the core distribution to avoid unnecessary re-renders
  const columns = useMemo(() => {
    // 1. Initialize an array of arrays to hold the children for each column
    const columnContent: React.ReactNode[][] = Array.from({ length: numCols }, () => []);

    // 2. Distribute the items cyclically (round-robin)
    // This is the implementation of your for (var b = 0; b < themainarray.length; b++) loop.
    items.forEach((item, index) => {
      // The index of the column to place the current item in
      // index % numCols mimics the cyclical distribution of your themainarray
      const colIndex = index % numCols;
      columnContent[colIndex].push(item);
    });

    return columnContent;
  }, [items, numCols]);

  // Styles mirroring your original .boxes-con CSS
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    padding: '10px',
    width: '100%',
    alignItems: 'flex-start', // Ensures columns start from the top
  };

  const columnStyle: React.CSSProperties = {
    flex: 1, // Ensures all columns take up equal width (your original .sub was implicit)
    margin: '0 10px', // Add some horizontal spacing between columns
  };

  return (
    <div className="boxes-con" style={containerStyle}>
      {/* Map over the columns array to render the column containers */}
      {columns.map((colItems, colIndex) => (
        <div
          key={colIndex}
          className={`sub box${colIndex + 1}`} // Replicating your original class names
          style={columnStyle}
        >
          {/* Render the items inside each column */}
          {colItems.map((item, itemIndex) => (
            <React.Fragment key={itemIndex}>{item}</React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryContainer;