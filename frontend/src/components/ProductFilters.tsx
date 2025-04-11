// src/components/ProductFilters.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react'; // Icon for clearing

// Debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), waitFor);
  };
}


const ProductFilters: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Gets the current path (/products)
  const searchParams = useSearchParams(); // Gets current search params

  // --- State for controlled inputs ---
  // Initialize state from URL search params
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  // State to track if filters are active for the clear button
  const [isFiltered, setIsFiltered] = useState(false);

  // Update isFiltered state based on searchParams
  useEffect(() => {
     setIsFiltered(
        !!searchParams.get('category') ||
        !!searchParams.get('sort') && searchParams.get('sort') !== 'newest' ||
        !!searchParams.get('minPrice') ||
        !!searchParams.get('maxPrice')
     );
  }, [searchParams]);


  // --- Function to update URL search params ---
  // Use useCallback to prevent unnecessary re-creation on re-renders
  const updateSearchParams = useCallback((newParams: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // Create mutable copy

    // Set or delete new params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        // Remove param if value is empty or default
        current.delete(key);
      }
    });

    // Special handling for defaults (category='all', sort='newest')
    if (current.get('category') === 'all') current.delete('category');
    if (current.get('sort') === 'newest') current.delete('sort');

    const search = current.toString();
    const query = search ? `?${search}` : "";

    // Use router.push to navigate and trigger re-render of Server Components
    router.push(`${pathname}${query}`, { scroll: false }); // Prevent scrolling to top
  }, [searchParams, pathname, router]);


  // --- Debounced handlers for price inputs ---
  const debouncedUpdatePrice = useCallback(
     debounce((name: 'minPrice' | 'maxPrice', value: string) => {
        updateSearchParams({ [name]: value });
     }, 800), // 800ms delay after user stops typing
     [updateSearchParams]
  );

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value;
     setMinPrice(value); // Update local state immediately
     debouncedUpdatePrice('minPrice', value); // Update URL after delay
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value;
     setMaxPrice(value); // Update local state immediately
     debouncedUpdatePrice('maxPrice', value); // Update URL after delay
  };


  // --- Handlers for selects ---
  const handleCategoryChange = (value: string) => {
     setCategory(value); // Update local state
     updateSearchParams({ category: value }); // Update URL immediately
  };

  const handleSortChange = (value: string) => {
     setSort(value); // Update local state
     updateSearchParams({ sort: value }); // Update URL immediately
  };

  // --- Handler for clearing all filters ---
  const clearFilters = () => {
     setCategory('all');
     setSort('newest');
     setMinPrice('');
     setMaxPrice('');
     router.push(pathname, { scroll: false }); // Navigate to base path
  };


  const categories = ["all", "Living Room", "Bedroom", "Dining", "Office", "Outdoor"]; // Add 'all'

  return (
    <div className="mb-8 p-4 border rounded-lg bg-card shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        {/* Category Select */}
        <div className="space-y-1">
          <Label htmlFor="category-filter">Category</Label>
          <Select name="category" value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Select */}
        <div className="space-y-1">
          <Label htmlFor="sort-filter">Sort By</Label>
          <Select name="sort" value={sort} onValueChange={handleSortChange}>
            <SelectTrigger id="sort-filter">
              <SelectValue placeholder="Sort products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              {/* <SelectItem value="name_asc">Name: A to Z</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Inputs */}
        <div className="space-y-1">
           <Label>Price Range</Label>
           <div className="flex items-center gap-2">
              <Input
                 id="min-price"
                 name="minPrice"
                 type="number"
                 placeholder="Min $"
                 value={minPrice}
                 onChange={handleMinPriceChange}
                 min="0"
                 step="1"
                 className="text-sm"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                 id="max-price"
                 name="maxPrice"
                 type="number"
                 placeholder="Max $"
                 value={maxPrice}
                 onChange={handleMaxPriceChange}
                 min="0"
                 step="1"
                 className="text-sm"
              />
           </div>
        </div>

         {/* Clear Filters Button */}
         <div className="flex items-end justify-end">
            {isFiltered && ( // Only show if filters are active
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground"
               >
                  <X size={14} className="mr-1" /> Clear Filters
               </Button>
            )}
         </div>

      </div>
    </div>
  );
};

export default ProductFilters;
