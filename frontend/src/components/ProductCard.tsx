// src/components/ProductCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import {
  Card,
  CardContent,
  CardFooter, // Optional: Use if adding actions like Add to Cart here
  CardHeader, // Optional: Can use for image or title
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Import Card components
import { Badge } from "@/components/ui/badge"; // Optional: For category/tags

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/${product._id}`} className="group outline-none" aria-label={`View details for ${product.name}`}>
      <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 h-full flex flex-col"> {/* Added focus-within, h-full, flex */}
        <CardHeader className="p-0 relative"> {/* Remove padding for image */}
          {/* Product Image */}
          <div className="aspect-square w-full overflow-hidden relative bg-muted"> {/* Fixed aspect ratio, overflow hidden */}
            <Image
              src={product.imageUrl || "https://placehold.co/600x600"} // Use a square placeholder if needed
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              className="transition-transform duration-500 ease-in-out group-hover:scale-105" // Smoother scale
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" // Adjusted sizes
              // Add placeholder if needed: placeholder="blur" blurDataURL="..."
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow"> {/* Add flex-grow to push footer down */}
          {/* Optional: Category Badge */}
          {/* <Badge variant="outline" className="mb-2">{product.category}</Badge> */}
          <CardTitle className="text-lg font-semibold leading-tight tracking-tight truncate group-hover:text-primary">
            {product.name}
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-muted-foreground">
             {/* Shorten description or show category */}
             {product.category}
             {/* Or: {product.description.substring(0, 50)}{product.description.length > 50 ? '...' : ''} */}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0"> {/* Remove top padding */}
          {/* Price */}
          <p className="text-xl font-bold text-foreground">
            ${product.price.toFixed(2)}
          </p>
          {/* Optional: Add rating or quick add button here */}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
