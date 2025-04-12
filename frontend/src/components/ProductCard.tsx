// src/components/ProductCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import ProductQuickActions from "./ProductQuickActions";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Format price with commas
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(product.price);
  
  // Verify the imageUrl to ensure it's a furniture image
  const isFurnitureImage = (url: string): boolean => {
    // Keywords that might indicate non-furniture images
    const nonFurnitureKeywords = ['supermarket', 'grocery', 'store', 'shelf', 'aisle'];
    const lowerUrl = url.toLowerCase();
    
    // Return false if any keyword is found in the URL
    return !nonFurnitureKeywords.some(keyword => lowerUrl.includes(keyword));
  };
  
  // Use a fallback image if necessary
  const imageUrl = product.imageUrl && isFurnitureImage(product.imageUrl) 
    ? product.imageUrl 
    : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1170&q=80"; // Fallback image

  return (
    <div className="group h-full">
      <Card className="overflow-hidden h-full flex flex-col border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
        <Link href={`/products/${product._id}`} className="block relative">
          {/* Product Image - Using 4:5 aspect ratio for consistency */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/10">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            
            {/* Category Badge */}
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2 bg-background/70 backdrop-blur-sm text-xs px-2 py-0.5"
            >
              {product.category}
            </Badge>
            
            {/* Stock Badge */}
            {product.stock <= 5 && (
              <Badge 
                variant={product.stock === 0 ? "destructive" : "outline"}
                className="absolute top-2 right-2 text-xs px-2 py-0.5"
              >
                {product.stock === 0 ? 'Sold Out' : 'Low Stock'}
              </Badge>
            )}
            
            {/* Quick action overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
              <ProductQuickActions productId={product._id} />
            </div>
          </div>
        </Link>
        
        {/* Product Info */}
        <CardContent className="p-3 pt-2 flex-grow">
          <Link href={`/products/${product._id}`} className="block">
            <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {/* Product material */}
          {product.material && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {product.material}
            </p>
          )}
        </CardContent>
        
        {/* Price and Rating */}
        <CardFooter className="p-3 pt-0 flex justify-between items-center">
          <p className="text-base font-semibold">
            {formattedPrice}
          </p>
          
          {/* Simple rating display */}
          {product.rating > 0 && (
            <div className="flex items-center">
              <Star 
                size={14} 
                className="text-primary fill-primary" 
              />
              <span className="text-xs ml-1">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductCard;