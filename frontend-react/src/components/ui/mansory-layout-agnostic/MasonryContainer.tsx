/**
 * MasonryContainer.tsx (Refactored for Height-Agnostic Masonry)
 * * Fixes: TypeError: Cannot read properties of undefined (reading 'push')
 * The numCols calculation was incorrectly returning 0 on initial render,
 * leading to colContent being an empty array.
 */

import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";

// --- Types and Utility Functions ---

interface MasonryContainerProps {
  children: React.ReactNode;
  columnCount?: number; // Optional prop to override the default column count
  breakpoint?: number; // Optional prop to define the breakpoint for changing columns
}

// Function to get the current window width
const getWindowWidth = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth;
  }
  return 0; // Default for SSR
};

// --- MasonryContainer Component ---

const MasonryContainer: React.FC<MasonryContainerProps> = ({ children, columnCount, breakpoint = 760 }) => {
  const items = React.Children.toArray(children);

  // --- Refs and State for Height Measurement ---
  // A ref to hold the array of DOM elements for each column
  const columnRefs = useRef<HTMLDivElement[]>([]);
  // State to track the column heights. Initialize with 0s.
  const [columnHeights, setColumnHeights] = useState<number[]>([]);

  // --- Responsive Logic ---
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());
  
  const handleResize = useCallback(() => {
    setWindowWidth(getWindowWidth());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    // Initial call to set the width if not set by initial state
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // --- Column Count Calculation (Fix implemented here) ---
  const numCols = useMemo(() => {
    // 1. If columnCount is explicitly provided, use it directly.
    if (columnCount && columnCount > 0) {
      return columnCount;
    }
    
    // 2. Otherwise, use the responsive logic:
    //    3 columns if width is >= breakpoint, 1 column otherwise.
    //    Guarantees a value of at least 1 if columnCount is not set.
    return windowWidth >= breakpoint ? 3 : 1;
  }, [columnCount, windowWidth, breakpoint]);

  // --- Height Reset Effect (Moved out of useMemo) ---
  useEffect(() => {
    // This effect runs whenever the calculated numCols changes.
    // It resets the columnHeights state, which causes the Shortest Column logic to re-run
    // and the Measurement/Re-layout effect to measure the new layout.
    // Check if the state needs resetting to avoid unnecessary renders.
    if (columnHeights.length !== numCols) {
      setColumnHeights(Array(numCols).fill(0));
    }
  }, [numCols, columnHeights.length]);


  // --- Distribution Logic: Shortest Column Algorithm ---
  const columns = useMemo(() => {
    // colContent is now safely initialized with the guaranteed non-zero numCols
    const colContent: React.ReactNode[][] = Array.from({ length: numCols }, () => []);

    // Use the actual columnHeights from state for distribution, 
    // or a temporary array of 0s for the very first render/reset.
    const currentHeights = columnHeights.length === numCols
      ? columnHeights
      : Array(numCols).fill(0);

    items.forEach((item) => {
      // Find the index of the column with the minimum height
      const minHeight = Math.min(...currentHeights);
      const colIndex = currentHeights.indexOf(minHeight);

      // Place the item in the shortest column
      colContent[colIndex].push(item);
      
      // Update the temporary height for the next item's placement.
      // Since we don't know the item's true height, we just add a small placeholder value.
      // **The true re-layout is driven by the Measurement and Re-layout Effect below.**
      currentHeights[colIndex] += 1; // Placeholder estimate
    });

    return colContent;
  }, [items, numCols, columnHeights]);

  // --- Measurement and Re-layout Effect ---

  useEffect(() => {
    // We only proceed if we have column refs and the layout is rendered
    if (columnRefs.current.length === 0) return;

    const measureHeights = () => {
      // Read the actual DOM height of each column
      const newHeights = columnRefs.current.map((ref) => ref.offsetHeight);

      // This is the core: we check if the measured heights are different
      // from the heights stored in state.
      if (newHeights.some((h, i) => h !== columnHeights[i])) {
        // Update the state, which triggers a re-render using the Shortest Column logic.
        setColumnHeights(newHeights);
      }
    };

    const container = columnRefs.current[0].parentElement;
    if (container) {
      const images = container.querySelectorAll("img");
      let loadedCount = 0;
      
      const imageLoadHandler = () => {
        loadedCount++;
        // Check only when all images *we found initially* finish loading
        if (loadedCount === images.length) {
          measureHeights();
        }
      };

      // Measure immediately if there are no images to wait for
      if (images.length === 0) {
          measureHeights();
          return;
      }
      
      images.forEach((img) => {
        if (img.complete) {
          imageLoadHandler(); // Measure if already complete (from cache)
        } else {
          // Measure when the image finishes downloading
          img.addEventListener("load", imageLoadHandler, { once: true });
        }
      });
      
      // Clean up the listeners when the component unmounts or the effect re-runs
      return () => {
          images.forEach((img) => {
              img.removeEventListener("load", imageLoadHandler);
          });
      };
    }

    // A final measurement on mount/re-render to catch non-image content
    measureHeights();

  }, [items.length, numCols, columnHeights]); // Depend on items, columns, and columnHeights

  // --- Rendering (Modified to use Refs) ---
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    padding: "10px",
    width: "100%",
    // crucial: Align items to the top initially
    alignItems: "flex-start",
  };

  const columnStyle: React.CSSProperties = {
    flex: 1,
    margin: "0 10px",
  };

  return (
    <div className="boxes-con" style={containerStyle}>
      {/* Map over the columns array to render the column containers */}
      {columns.map((colItems, colIndex) => (
        <div
          key={colIndex}
          className={`sub box${colIndex + 1}`}
          style={columnStyle}
          // Attach the ref to the DOM element
          ref={(el) => {
            // Ensure columnRefs is correctly sized to prevent issues
            if (el) columnRefs.current[colIndex] = el;
          }}
        >
          {/* Render the items inside each column */}
          {colItems.map((item, itemIndex) => (
            // Use item.key if available, otherwise fallback to itemIndex
            <React.Fragment key={itemIndex}>{item}</React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryContainer;