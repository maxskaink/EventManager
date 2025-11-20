import React from 'react';

type GradientWrapperProps = {
  children: React.ReactNode;
};

/**
 * A wrapper component that applies a gradient background using the theme's primary and secondary colors.
 * It also sets the text color to be readable against the gradient.
 */
const GradientWrapper: React.FC<GradientWrapperProps> = ({ children }) => {
  return (
    <div className="bg-gradient-to-br from-primary to-secondary text-primary-foreground min-h-screen w-full">
      {children}
    </div>
  );
};

export default GradientWrapper;
