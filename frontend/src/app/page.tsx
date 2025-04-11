// src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import { Suspense } from 'react';

// --- Fetch Featured Products Function (remains the same) ---
async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiUrl}/products?sort=newest&limit=${limit}`;
  if (!apiUrl) { console.error("API URL not defined."); return []; }
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) { throw new Error(`Failed to fetch products: ${res.status}`); }
    const data = await res.json();
    if (!data.success) { throw new Error(data.message || "API error"); }
    return data.data as Product[];
  } catch (error) { console.error("Error fetching featured products:", error); return []; }
}

// --- Component to Render Featured Products (remains the same) ---
async function FeaturedProductList() {
   const featuredProducts = await getFeaturedProducts(4);
   if (!featuredProducts || featuredProducts.length === 0) { return null; }
   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
         {featuredProducts.map((product) => ( <ProductCard key={product._id} product={product} /> ))}
      </div>
   );
}

// --- Component for Featured Skeletons (remains the same) ---
function FeaturedProductSkeleton() {
   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
         {Array.from({ length: 4 }).map((_, index) => ( <ProductCardSkeleton key={`featured-skeleton-${index}`} /> ))}
      </div>
   );
}

// --- Main Home Component ---
export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1170&q=80" alt="Stylish modern living room" fill style={{ objectFit: 'cover' }} className="absolute inset-0 z-0" priority />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 p-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg"> Design Your Dream Space </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto drop-shadow"> Discover curated collections of high-quality, modern furniture to elevate your home. </p>
          {/* --- Corrected Hero Button --- */}
          <Link href="/products" legacyBehavior={false}>
             <Button size="lg">Shop All Furniture</Button> {/* Removed asChild */}
          </Link>
          {/* --- End Correction --- */}
        </div>
      </section>

      {/* Featured Categories Section (remains the same) */}
      <section className="py-16 px-4 bg-secondary/30">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Category Cards ... */}
          <Link href="/products?category=Living+Room" className="group block"> <div className="relative aspect-video overflow-hidden rounded-lg shadow-md mb-3"> <Image src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=880&q=80" alt="Living Room Collection" fill style={{ objectFit: 'cover' }} className="transition-transform duration-300 group-hover:scale-105"/> </div> <h3 className="text-xl font-semibold group-hover:text-primary">Living Room</h3> <p className="text-muted-foreground text-sm">Sofas, chairs, coffee tables & more.</p> </Link>
          <Link href="/products?category=Bedroom" className="group block"> <div className="relative aspect-video overflow-hidden rounded-lg shadow-md mb-3"> <Image src="https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=1170&q=80" alt="Bedroom Collection" fill style={{ objectFit: 'cover' }} className="transition-transform duration-300 group-hover:scale-105"/> </div> <h3 className="text-xl font-semibold group-hover:text-primary">Bedroom</h3> <p className="text-muted-foreground text-sm">Beds, nightstands, dressers & essentials.</p> </Link>
          <Link href="/products?category=Dining" className="group block"> <div className="relative aspect-video overflow-hidden rounded-lg shadow-md mb-3"> <Image src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=764&q=80" alt="Dining Collection" fill style={{ objectFit: 'cover' }} className="transition-transform duration-300 group-hover:scale-105"/> </div> <h3 className="text-xl font-semibold group-hover:text-primary">Dining Room</h3> <p className="text-muted-foreground text-sm">Tables, chairs, benches & sets.</p> </Link>
        </div>
      </section>

      {/* --- New Featured Products Section --- */}
      <section className="py-16 px-4">
         <h2 className="text-3xl font-bold text-center mb-10">New Arrivals</h2>
         <div className="max-w-7xl mx-auto">
            <Suspense fallback={<FeaturedProductSkeleton />}>
               {/* @ts-expect-error Async Server Component */}
               <FeaturedProductList />
            </Suspense>
         </div>
         <div className="text-center mt-10">
            {/* --- Corrected View All Button --- */}
            <Link href="/products" legacyBehavior={false}>
               <Button variant="outline">View All Products</Button> {/* Removed asChild */}
            </Link>
            {/* --- End Correction --- */}
         </div>
      </section>

    </>
  );
}
