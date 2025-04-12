// src/app/products/page.tsx
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import ProductFilters from "@/components/ProductFilters";
import { Product } from "@/types";
import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Fetch Function - Keep your existing function
async function getProducts(params: {
   category?: string;
   sort?: string;
   minPrice?: string;
   maxPrice?: string;
}): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) { throw new Error("API URL not defined."); }

  // Build query string
  const query = new URLSearchParams();
  if (params.category && params.category !== 'all') query.append('category', params.category);
  if (params.sort && params.sort !== 'newest') query.append('sort', params.sort);
  if (params.minPrice) query.append('minPrice', params.minPrice);
  if (params.maxPrice) query.append('maxPrice', params.maxPrice);

  const queryString = query.toString();
  const url = `${apiUrl}/products${queryString ? `?${queryString}` : ''}`;

  console.log("Fetching products from:", url);

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) { throw new Error(`Failed to fetch products: ${res.status}`); }
    const data = await res.json();
    if (!data.success) { throw new Error(data.message || "API error"); }
    return data.data as Product[];
  } catch (error) { console.error("Error fetching products:", error); return []; }
}

// Products List Component - Updated grid layout for smaller items
async function ProductList({ category, sort, minPrice, maxPrice }: {
   category?: string;
   sort?: string;
   minPrice?: string;
   maxPrice?: string;
}) {
   // Pass params object to fetch function
   const products = await getProducts({ category, sort, minPrice, maxPrice });

   if (!products || products.length === 0) {
      return (
         <div className="text-center text-muted-foreground mt-10 col-span-full">
            <p>No products found matching your criteria.</p>
            <Button variant="outline" className="mt-4">
              <Link href="/products">View All Products</Link>
            </Button>
         </div>
      );
   }
   
   // Using a more compact grid with smaller gaps
   return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
         {products.map((product) => (
            <ProductCard key={product._id} product={product} />
         ))}
      </div>
   );
}

// Skeleton loading grid - Updated to match the product grid
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}

// Main Page Component
const ProductsPage = ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  // Extract params for passing down
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : undefined;
  const minPrice = typeof searchParams?.minPrice === 'string' ? searchParams.minPrice : undefined;
  const maxPrice = typeof searchParams?.maxPrice === 'string' ? searchParams.maxPrice : undefined;

  // Determine title based on category filter
  const categoryName = category ? category.replace(/\+/g, ' ') : '';
  const pageTitle = category ? `${categoryName} Furniture` : "Our Furniture";

  return (
    <div className="container mx-auto px-4">
      {/* Page Header - Smaller margins */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-playfair mb-2">{pageTitle}</h1>
        <div className="h-0.5 w-16 bg-primary mb-4"></div>
      </div>

      {/* Filters - Using your existing ProductFilters component */}
      <ProductFilters />

      {/* Product Grid with Suspense */}
      <div className="min-h-[300px]">
         <Suspense key={JSON.stringify(searchParams)} fallback={<ProductGridSkeleton />}>
            {/* @ts-expect-error Async Server Component */}
            <ProductList 
              category={category} 
              sort={sort} 
              minPrice={minPrice} 
              maxPrice={maxPrice} 
            />
         </Suspense>
      </div>
    </div>
  );
};

export default ProductsPage;