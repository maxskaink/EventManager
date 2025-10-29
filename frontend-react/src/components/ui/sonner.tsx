"use client";

import { useTheme } from "next-themes@0.4.6";
import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          description: "!text-black dark:!text-white !font-medium",
          success: "bg-background border-border",
          error: "bg-background border-border",
          warning: "bg-background border-border",
          info: "bg-background border-border",
        },
        style: {
          color: '#000000',
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-text": "#000000",
          "--error-text": "#000000",
          "--warning-text": "#000000",
          "--info-text": "#000000",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
