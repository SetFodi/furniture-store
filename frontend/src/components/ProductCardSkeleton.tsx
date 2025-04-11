// src/components/ProductCardSkeleton.tsx
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const ProductCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="p-0 relative">
        <Skeleton className="aspect-square w-full bg-muted" /> {/* Image Placeholder */}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Skeleton className="h-5 w-3/4 mb-2 bg-muted" /> {/* Title Placeholder */}
        <Skeleton className="h-4 w-1/2 bg-muted" /> {/* Category Placeholder */}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-6 w-1/3 bg-muted" /> {/* Price Placeholder */}
      </CardFooter>
    </Card>
  );
};

export default ProductCardSkeleton;
