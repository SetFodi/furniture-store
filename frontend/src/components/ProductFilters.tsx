// src/components/ProductFilters.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { X, SlidersHorizontal } from 'lucide-react'; // Added SlidersHorizontal icon

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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State for controlled inputs
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [isFiltered, setIsFiltered] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Update isFiltered state based on searchParams
  useEffect(() => {
     setIsFiltered(
        !!searchParams.get('category') ||
        (!!searchParams.get('sort') && searchParams.get('sort') !== 'newest') ||
        !!searchParams.get('minPrice') ||
        !!searchParams.get('maxPrice')
     );
  }, [searchParams]);

  // Function to update URL search params
  const updateSearchParams = useCallback((newParams: Record<string, string>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Set or delete new params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    // Special handling for defaults
    if (current.get('category') === 'all') current.delete('category');
    if (current.get('sort') === 'newest') current.delete('sort');

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // Debounced handlers for price inputs
  const debouncedUpdatePrice = useCallback(
     debounce((name: 'minPrice' | 'maxPrice', value: string) => {
        updateSearchParams({ [name]: value });
     }, 400), // 400ms delay (reduced from 800ms for faster response)
     [updateSearchParams]
  );

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value;
     setMinPrice(value);
     debouncedUpdatePrice('minPrice', value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value;
     setMaxPrice(value);
     debouncedUpdatePrice('maxPrice', value);
  };

  // Handlers for selects
  const handleCategoryChange = (value: string) => {
     setCategory(value);
     updateSearchParams({ category: value });
  };

  const handleSortChange = (value: string) => {
     setSort(value);
     updateSearchParams({ sort: value });
  };

  // Handler for clearing all filters
  const clearFilters = () => {
     setCategory('all');
     setSort('newest');
     setMinPrice('');
     setMaxPrice('');
     router.push(pathname, { scroll: false });
  };

  // Available categories
  const categories = ["all", "Living Room", "Bedroom", "Dining", "Office", "Outdoor"];

  // Responsive design - For smaller screens, we'll use a collapsible layout
  const toggleMobileFilters = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <div className="mb-6">
      {/* Mobile Filter Toggle Button */}
      <div className="sm:hidden mb-4">
        <Button 
          variant="outline" 
          onClick={toggleMobileFilters} 
          className="w-full flex items-center justify-between"
          size="sm"
        >
          <span>Filters & Sorting</span>
          <SlidersHorizontal size={16} />
        </Button>
      </div>

      {/* Filter Panel - Desktop always visible, Mobile collapsible */}
      <div className={`border rounded-lg bg-card shadow-sm overflow-hidden transition-all duration-300 ${
        isMobileFilterOpen || window.innerWidth >= 640 
          ? 'max-h-[500px] opacity-100' 
          : 'max-h-0 opacity-0 sm:max-h-[500px] sm:opacity-100'
      }`}>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            {/* Category Select */}
            <div className="space-y-1">
              <Label htmlFor="category-filter" className="text-sm font-medium">Category</Label>
              <Select name="category" value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category-filter" className="h-9">
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
              <Label htmlFor="sort-filter" className="text-sm font-medium">Sort By</Label>
              <Select name="sort" value={sort} onValueChange={handleSortChange}>
                <SelectTrigger id="sort-filter" className="h-9">
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
              <Label className="text-sm font-medium">Price Range</Label>
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
                  className="text-sm h-9"
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
                  className="text-sm h-9"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end justify-end">
              {isFiltered && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs h-9"
                >
                  <X size={14} className="mr-1.5" /> Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;