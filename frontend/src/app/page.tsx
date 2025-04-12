// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { Suspense } from "react";
import { ArrowRight, Award, Clock, Truck } from "lucide-react";

// --- Fetch Featured Products Function (remains the same) ---
async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiUrl}/products?sort=newest&limit=${limit}`;
  if (!apiUrl) {
    console.error("API URL not defined.");
    return [];
  }
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || "API error");
    }
    return data.data as Product[];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

// --- Component to Render Featured Products (remains the same) ---
async function FeaturedProductList() {
  const featuredProducts = await getFeaturedProducts(4);
  if (!featuredProducts || featuredProducts.length === 0) {
    return null;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {featuredProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

// --- Component for Featured Skeletons (remains the same) ---
function FeaturedProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <ProductCardSkeleton key={`featured-skeleton-${index}`} />
      ))}
    </div>
  );
}

// --- Main Home Component ---
export default function Home() {
  return (
    <>
      {/* Hero Section - Enhanced */}
      <section className="furniture-hero relative flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80"
            alt="Elegant living room with modern furniture"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 px-4 py-24 md:py-40 animate-fade-in">
          <div className="max-w-3xl">
            {/* Eyebrow text */}
            <p className="text-primary font-medium mb-4 tracking-wide">
              LUXURY FURNITURE COLLECTION
            </p>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 font-playfair leading-tight">
              Elevate Your Living Space
            </h1>

            {/* Subheading with decorative element */}
            <div className="relative mb-8">
              <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
                Discover our curated collection of premium, handcrafted
                furniture designed to transform your home into a sanctuary of
                style and comfort.
              </p>
              <div className="gold-accent mt-6"></div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/products" legacyBehavior={false}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Shop Collection
                </Button>
              </Link>
              <Link
                href="/products?category=Living+Room"
                legacyBehavior={false}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-black hover:bg-white/10"
                >
                  Explore Living Room
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Bar */}
      <section className="bg-secondary py-6 text-secondary-foreground border-y border-border/30">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Award className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">
                Premium Quality Craftsmanship
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Truck className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">
                Free Delivery & Assembly
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">
                5-Year Furniture Warranty
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Section - Enhanced */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
              Curated Collections
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully selected furniture collections designed to
              create harmony in every space
            </p>
            <div className="w-20 h-1 bg-primary mx-auto mt-6"></div>
          </div>

          {/* Collection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Living Room Collection */}
            <Link
              href="/products?category=Living+Room"
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-md mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80"
                  alt="Living Room Collection"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">Living Room</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Timeless elegance for your everyday sanctuary
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm transition-transform duration-300 transform group-hover:translate-x-2">
                    <span>Explore collection</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Bedroom Collection */}
            <Link href="/products?category=Bedroom" className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-md mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&q=80"
                  alt="Bedroom Collection"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">Bedroom</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Serene designs for restful retreats
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm transition-transform duration-300 transform group-hover:translate-x-2">
                    <span>Explore collection</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Dining Collection */}
            <Link href="/products?category=Dining" className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-md mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80"
                  alt="Dining Collection"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">Dining Room</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Sophisticated spaces for memorable gatherings
                  </p>
                  <div className="flex items-center text-primary font-medium text-sm transition-transform duration-300 transform group-hover:translate-x-2">
                    <span>Explore collection</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Design Philosophy Section - New */}
      <section className="py-24 px-4 bg-accent/5 border-y border-border/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="max-w-xl">
              <p className="text-primary font-medium mb-3">OUR PHILOSOPHY</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair">
                Craftsmanship Meets Modern Design
              </h2>
              <div className="gold-accent mb-8"></div>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                At FancyFurnish, we believe that exceptional furniture is born
                from a harmonious blend of traditional craftsmanship and
                contemporary vision. Each piece in our collection is
                thoughtfully designed to bring enduring beauty and
                functionality to your space.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Sustainable Materials
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Responsibly sourced woods and eco-friendly production
                    processes
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Timeless Design
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Pieces that transcend trends and remain relevant for years
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Expert Construction
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Meticulous attention to detail and precision engineering
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Comfort Focus
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ergonomic designs that prioritize your comfort and
                    wellbeing
                  </p>
                </div>
              </div>
              <Link href="/products" legacyBehavior={false}>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Discover Our Approach
                </Button>
              </Link>
            </div>

            {/* Right Column - Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80"
                    alt="Handcrafted furniture detail"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-lg shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80" // <-- UPDATED URL
                    alt="Modern furniture design"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="relative aspect-square overflow-hidden rounded-lg shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80"
                    alt="Elegant chair design"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1611117775350-ac3950990985?auto=format&fit=crop&q=80"
                    alt="Furniture material detail"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section - Enhanced */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-primary font-medium mb-3">NEW ARRIVALS</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
              Latest Additions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our newest pieces, fresh from the workshop to your home
            </p>
            <div className="w-20 h-1 bg-primary mx-auto mt-6"></div>
          </div>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<FeaturedProductSkeleton />}>
              {/* @ts-expect-error Async Server Component */}
              <FeaturedProductList />
            </Suspense>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16">
            <Link href="/products" legacyBehavior={false}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                View All Collections
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section - New */}
      <section className="py-24 px-4 bg-card">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
            Join Our Community
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to receive exclusive offers, early access to new
            collections, and interior design inspiration
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
              Subscribe
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates from FancyFurnish
          </p>
        </div>
      </section>
    </>
  );
}
