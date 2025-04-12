// src/components/ui/furniture-feature.tsx
// A component for displaying furniture features

import { LucideIcon } from "lucide-react";

interface FurnitureFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const FurnitureFeature: React.FC<FurnitureFeatureProps> = ({
  icon: Icon,
  title,
  description,
  className = "",
}) => {
  return (
    <div className={`group p-6 rounded-md transition-all duration-300 hover:bg-card hover:shadow-md ${className}`}>
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4 transition-all group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};