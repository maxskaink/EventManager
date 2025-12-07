import React, { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { MoreHorizontal, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "./utils";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

interface ResponsiveBottomNavProps {
  items: NavItem[];
  className?: string;
}

export const ResponsiveBottomNav: React.FC<ResponsiveBottomNavProps> = ({
  items,
  className,
}) => {
  const [visibleCount, setVisibleCount] = useState(items.length);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      
      // Responsive breakpoints
      if (width < 640) {
        // Small screens: max 3 items
        setVisibleCount(Math.min(3, items.length));
      } else if (width < 1024) {
        // Medium screens: max 4 items
        setVisibleCount(Math.min(4, items.length));
      } else {
        // Large screens: max 6 items
        setVisibleCount(Math.min(6, items.length));
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [items.length]);

  const visibleItems = items.slice(0, visibleCount);
  const overflowItems = items.slice(visibleCount);
  const hasOverflow = overflowItems.length > 0;

  // If we have overflow, reserve space for the "More" button
  const displayItems = hasOverflow ? visibleItems.slice(0, -1) : visibleItems;
  const moreButtonItems = hasOverflow
    ? [...visibleItems.slice(-1), ...overflowItems]
    : [];

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-40",
        "p-2 sm:p-3",
        className
      )}
    >
      <div className="mx-auto flex max-w-4xl justify-around items-center gap-1">
        {/* Visible items */}
        {displayItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              onClick={item.onClick}
              className={cn(
                "flex h-auto flex-col items-center gap-1 py-2 px-2 sm:px-3 flex-1 min-w-0",
                "hover:bg-accent/50 transition-all duration-200",
                item.isActive && "bg-accent text-accent-foreground font-semibold"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-xs truncate w-full text-center">
                {item.label}
              </span>
            </Button>
          );
        })}

        {/* More button with dropdown */}
        {hasOverflow && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex h-auto flex-col items-center gap-1 py-2 px-2 sm:px-3 flex-1 min-w-0",
                  "hover:bg-accent/50 transition-all duration-200"
                )}
              >
                <MoreHorizontal className="h-5 w-5 shrink-0" />
                <span className="text-xs truncate w-full text-center">Más</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 mb-2">
              {moreButtonItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={item.onClick}
                    className={cn(
                      "cursor-pointer",
                      item.isActive && "bg-accent font-semibold"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};
