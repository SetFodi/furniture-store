// src/components/ui/section-heading.tsx
// A premium section heading with gold accent

import React from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  accent?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  align = "center",
  className = "",
  accent = true,
}) => {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  return (
    <div className={`mb-12 ${alignmentClasses[align]} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl mb-6 mx-auto">{subtitle}</p>
      )}
      {accent && (
        <div className={`h-1 bg-primary ${
          align === "center" ? "w-20 mx-auto" : 
          align === "right" ? "w-20 ml-auto" : "w-20"
        }`} />
      )}
    </div>
  );
};