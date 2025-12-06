import React, { useState, useEffect } from "react";
import { cn } from "../ui/utils";

interface HideOnScrollWrapperProps {
    children: React.ReactNode;
    className?: string;
    threshold?: number;
}

export const HideOnScrollWrapper: React.FC<HideOnScrollWrapperProps> = ({
    children,
    className,
    threshold = 100,
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > threshold) {
                // Scrolling down and passed threshold
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", controlNavbar);

        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY, threshold]);

    return (
        <div
            className={cn(
                "sticky top-0 z-50 transition-transform duration-300",
                isVisible ? "translate-y-0" : "-translate-y-full",
                className
            )}
        >
            {children}
        </div>
    );
};
