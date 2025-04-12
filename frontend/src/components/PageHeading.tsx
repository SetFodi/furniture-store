// src/components/PageHeading.tsx
import React from "react";

interface PageHeadingProps {
  title: string;
  subtitle?: string;
}

const PageHeading: React.FC<PageHeadingProps> = ({ title, subtitle }) => {
  return (
    <div className="mt-24 mb-8"> {/* Add mt-24 to account for fixed header */}
      <h1 className="text-3xl md:text-4xl font-bold font-playfair">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      )}
      <div className="h-1 w-20 bg-primary mt-4"></div>
    </div>
  );
};

export default PageHeading;