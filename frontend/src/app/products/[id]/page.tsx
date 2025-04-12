// src/app/products/[id]/page.tsx
import { Product } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string): Promise<Product | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL not defined.");
    return null;
  }
  try {
    const res = await fetch(`${apiUrl}/products/${id}`, { cache: "no-store" });
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      throw new Error(
        `Failed to fetch product ${id}: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || "API returned an error");
    }
    return data.data as Product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

// Function to fetch related products
async function getRelatedProducts(category: string, currentId: string): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  
  try {
    const res = await fetch(`${apiUrl}/products?category=${category}&limit=4`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch related products: ${res.status}`);
    
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "API error");
    
    // Filter out the current product
    return (data.data as Product[]).filter(product => product._id !== currentId);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

const ProductDetailPage: React.FC<ProductPageProps> = async ({ params }) => {
  const productId = params.id;
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }
  
  // Get related products
  const relatedProducts = await getRelatedProducts(product.category, productId);

  // Format price with comma
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(product.price);

  // Rating stars component
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < Math.floor(rating)
                ? "text-primary fill-primary"
                : i < rating
                ? "text-primary fill-primary opacity-50"
                : "text-muted-foreground"
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          ({product.numReviews} reviews)
        </span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground flex items-center mb-6 flex-wrap">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-primary">Products</Link>
        <span className="mx-2">/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Image Gallery - REDUCED SIZE */}
        <div className="space-y-3">
          {/* Main Image - Reduced from full width to max-w-md */}
          <div className="relative mx-auto max-w-md aspect-square rounded-md overflow-hidden border border-border/40">
            <Image
              src={product.imageUrl || "https://placehold.co/600x600"}
              alt={product.name}
              fill
              priority
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 px-1 max-w-md mx-auto">
              <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden border-2 border-primary">
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} main`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              {product.images.map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden border border-border/40 hover:border-primary transition-colors"
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-playfair text-foreground mb-2">
            {product.name}
          </h1>

          {/* Category Badge */}
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="mb-4">
              {renderRatingStars(product.rating)}
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            <p className="text-2xl font-bold text-primary">
              {formattedPrice}
            </p>
          </div>

          <Separator className="my-4" />

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Description</h2>
            <p className="text-muted-foreground text-sm">
              {product.description}
            </p>
          </div>

          {/* Key Details */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Details</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {product.material && (
                <li className="flex">
                  <span className="w-24 text-muted-foreground">Material:</span>
                  <span>{product.material}</span>
                </li>
              )}
              {product.dimensions && (
                <>
                  <li className="flex">
                    <span className="w-24 text-muted-foreground">Width:</span>
                    <span>{product.dimensions.width} cm</span>
                  </li>
                  <li className="flex">
                    <span className="w-24 text-muted-foreground">Height:</span>
                    <span>{product.dimensions.height} cm</span>
                  </li>
                  <li className="flex">
                    <span className="w-24 text-muted-foreground">Depth:</span>
                    <span>{product.dimensions.depth} cm</span>
                  </li>
                </>
              )}
              <li className="flex col-span-2">
                <span className="w-24 text-muted-foreground">Availability:</span>
                {product.stock > 0 ? (
                  <span className="text-green-600">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600">
                    Out of Stock
                  </span>
                )}
              </li>
            </ul>
          </div>

          <Separator className="my-4" />

          {/* Add to Cart */}
          <div className="mt-4">
            <AddToCartButton product={product} />
            <p className="text-xs text-muted-foreground mt-2">
              Free shipping on orders over $499
            </p>
          </div>
        </div>
      </div>

      {/* Related Products - REDUCED SIZE */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 mb-8">
          <h2 className="text-xl font-bold font-playfair mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map(product => (
              <Link 
                key={product._id} 
                href={`/products/${product._id}`} 
                className="group block"
              >
                {/* Reduced image size with fixed height */}
                <div className="relative aspect-[4/5] bg-background/40 rounded-md overflow-hidden border border-border/40">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <h3 className="mt-2 text-sm font-medium truncate">{product.name}</h3>
                <p className="text-sm text-primary font-medium">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;