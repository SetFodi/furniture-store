// src/components/ui/product-dimensions.tsx
// A component to display furniture dimensions

import { Ruler } from "lucide-react";

interface ProductDimensionsProps {
  width?: number;
  height?: number;
  depth?: number;
  unit?: string;
  className?: string;
}

export const ProductDimensions: React.FC<ProductDimensionsProps> = ({
  width,
  height,
  depth,
  unit = "cm",
  className = "",
}) => {
  if (!width && !height && !depth) return null;
  
  return (
    <div className={`flex items-center text-sm text-muted-foreground ${className}`}>
      <Ruler size={14} className="mr-1.5" />
      <span>
        {width && `W: ${width}${unit}`}
        {width && height && " × "}
        {height && `H: ${height}${unit}`}
        {(width || height) && depth && " × "}
        {depth && `D: ${depth}${unit}`}
      </span>
    </div>
  );
};