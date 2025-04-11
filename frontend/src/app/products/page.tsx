// src/app/products/page.tsx
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import ProductFilters from "@/components/ProductFilters"; // <<< Import Filters
import { Product } from "@/types";
import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// --- Updated Fetch Function ---
// Accepts category, sort, minPrice, maxPrice
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
// --- End Updated Fetch Function ---


// --- Updated ProductList Component ---
// Accepts all relevant params
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
            {/* Keep clear filter link concept if needed, though button is now separate */}
            {/* <Button variant="link" asChild className="mt-2"><Link href="/products">View All Products</Link></Button> */}
         </div>
      );
   }
   return ( <> {products.map((product) => ( <ProductCard key={product._id} product={product} /> ))} </> );
}
// --- End Updated ProductList Component ---


// Component to render the skeletons (remains the same)
function ProductGridSkeleton() { /* ... */ }


// --- Updated Main Page Component ---
const ProductsPage = ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  // Extract params for passing down (ensure they are strings)
  const category = typeof searchParams?.category === 'string' ? searchParams.category : undefined;
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : undefined;
  const minPrice = typeof searchParams?.minPrice === 'string' ? searchParams.minPrice : undefined;
  const maxPrice = typeof searchParams?.maxPrice === 'string' ? searchParams.maxPrice : undefined;

  // Determine title based on category filter
  const pageTitle = category ? `${category} Furniture` : "Our Furniture";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">{pageTitle}</h1>

      {/* Render Filter Component */}
      <ProductFilters />

      {/* Product Grid with Suspense */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
         <Suspense key={JSON.stringify(searchParams)} fallback={<ProductGridSkeleton />}> {/* Add key to force refetch on param change */}
            {/* Pass extracted params to ProductList */}
            {/* @ts-expect-error Async Server Component */}
            <ProductList category={category} sort={sort} minPrice={minPrice} maxPrice={maxPrice} />
         </Suspense>
      </div>
    </div>
  );
};

export default ProductsPage;
