// src/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1170&q=80" // Example living room background
          alt="Stylish modern living room"
          fill
          style={{ objectFit: 'cover' }}
          className="absolute inset-0 z-0"
          priority // Prioritize loading hero image
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div> {/* Dark overlay */}

        {/* Content */}
        <div className="relative z-20 p-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Design Your Dream Space
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto drop-shadow">
            Discover curated collections of high-quality, modern furniture to elevate your home.
          </p>
          <Button size="lg" asChild>
            <Link href="/products">Shop All Furniture</Link>
          </Button>
        </div>
      </section>

      {/* Featured Categories/Products Section (Example) */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Example Category Card 1 */}
          <Link href="/products?category=Living+Room" className="group block">
            <div className="relative aspect-video overflow-hidden rounded-lg shadow-md mb-3">
              <Image
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=880&q=80"
                alt="Living Room Collection"
                fill style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="text-xl font-semibold group-hover:text-primary">Living Room</h3>
            <p className="text-muted-foreground text-sm">Sofas, chairs, coffee tables & more.</p>
          </Link>
          {/* Example Category Card 2 */}
          <Link href="/products?category=Bedroom" className="group block">
             <div className="relative aspect-video overflow-hidden rounded-lg shadow-md mb-3">
              <Image
                src="https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=1170&q=80"
                alt="Bedroom Collection"
                fill style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="text-xl font-semibold group-hover:text-primary">Bedroom</h3>
            <p className="text-muted-foreground text-sm">Beds, nightstands, dressers & essentials.</p>
          </Link>
          {/* Example Category Card 3 */}
           <Link href="/products?category=Dining" className="group block">
             <div className="relative aspect-video overflow-hidden rounded-lg shadow-md mb-3">
              <Image
                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=764&q=80" // Reusing marble table image
                alt="Dining Collection"
                fill style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="text-xl font-semibold group-hover:text-primary">Dining Room</h3>
            <p className="text-muted-foreground text-sm">Tables, chairs, benches & sets.</p>
          </Link>
        </div>
      </section>

      {/* Add more sections as needed: Testimonials, About Snippet, etc. */}

    </>
  );
}
