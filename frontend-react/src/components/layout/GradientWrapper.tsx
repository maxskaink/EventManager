import React from "react";

type GradientWrapperProps = {
  children: React.ReactNode;
};

/**
 * A wrapper component that applies a gradient background using the theme's primary and secondary colors.
 * It also sets the text color to be readable against the gradient.
 * "bg-linear-to-br from-[#91b4d3] via-[#cde4ff] to-[#e6f1ff]"
 * repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.04) 0 6px, transparent 6px 12px);
 */
const GradientWrapper: React.FC<GradientWrapperProps> = ({ children }) => {
  return (
    
        children
    
    
  );
};

export default GradientWrapper;
