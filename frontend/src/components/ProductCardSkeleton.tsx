// src/components/ProductCardSkeleton.tsx
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const ProductCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden h-full flex flex-col border-border/40 shadow-sm">
      <CardHeader className="p-0 relative">
        {/* Image Placeholder - using aspect ratio closer to real products */}
        <Skeleton className="aspect-[4/5] w-full bg-muted/30" /> 
        
        {/* Badge placeholders */}
        <div className="absolute top-2 left-2">
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
      </CardHeader>
      
      <CardContent className="p-3 flex-grow">
        {/* Title and Material Placeholders */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-1" />
        <Skeleton className="h-3 w-1/2 mt-1" />
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex items-center justify-between">
        {/* Price Placeholder */}
        <Skeleton className="h-5 w-16" />
        
        {/* Rating Placeholder */}
        <Skeleton className="h-4 w-10" />
      </CardFooter>
    </Card>
  );
};

export default ProductCardSkeleton;