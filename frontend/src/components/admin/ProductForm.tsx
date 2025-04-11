// src/components/admin/ProductForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Button } from "@/components/ui/button"; // Import Button
import { Input } from "@/components/ui/input";   // Import Input
import { Label } from "@/components/ui/label";   // Import Label
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select
import Image from 'next/image';
import { X } from 'lucide-react'; // Icon for removing images

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (formData: Partial<Product>) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData = null,
  onSubmit,
  isSubmitting,
  submitButtonText = "Submit"
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', price: 0, description: '', category: 'Living Room',
    material: '', stock: 0, imageUrl: '', images: [],
  });
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || 0,
        description: initialData.description || '',
        category: initialData.category || 'Living Room',
        material: initialData.material || '',
        stock: initialData.stock || 0,
        imageUrl: initialData.imageUrl || '',
        images: initialData.images || [],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // Handler for Select component
  const handleCategoryChange = (value: string) => {
     setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleAddImage = () => {
     if (imageInput.trim() && !formData.images?.includes(imageInput.trim())) {
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), imageInput.trim()] }));
        setImageInput('');
     }
  };

  const handleRemoveImage = (indexToRemove: number) => {
     setFormData(prev => ({ ...prev, images: prev.images?.filter((_, index) => index !== indexToRemove) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category || !formData.imageUrl || formData.stock === undefined) {
       alert("Please fill in all required fields (Name, Price, Category, Stock, Main Image URL).");
       return;
    }
    onSubmit(formData);
  };

  const categories = ["Living Room", "Bedroom", "Dining", "Office", "Outdoor"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 shadow rounded-lg border"> {/* Use card styles */}
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isSubmitting} />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="space-y-2">
           <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
           <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required min="0" step="0.01" disabled={isSubmitting} />
         </div>
         <div className="space-y-2">
           <Label htmlFor="stock">Stock <span className="text-red-500">*</span></Label>
           <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required min="0" step="1" disabled={isSubmitting} />
         </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea // Use Textarea component
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Enter product description..."
        />
      </div>

      {/* Category & Material */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="space-y-2">
           <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
           <Select name="category" value={formData.category} onValueChange={handleCategoryChange} required disabled={isSubmitting}>
             <SelectTrigger id="category">
               <SelectValue placeholder="Select category" />
             </SelectTrigger>
             <SelectContent>
               {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
             </SelectContent>
           </Select>
         </div>
          <div className="space-y-2">
           <Label htmlFor="material">Material</Label>
           <Input id="material" name="material" value={formData.material} onChange={handleChange} disabled={isSubmitting} />
         </div>
       </div>

      {/* Main Image URL */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Main Image URL <span className="text-red-500">*</span></Label>
        <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} required placeholder="https://images.unsplash.com/..." disabled={isSubmitting} />
         {formData.imageUrl && (
            <div className="mt-2">
               <Image src={formData.imageUrl} alt="Main image preview" width={80} height={80} className="h-20 w-20 object-cover rounded border" />
            </div>
         )}
      </div>

      {/* Additional Images */}
      <div className="space-y-2">
         <Label htmlFor="additionalImages">Additional Image URLs</Label>
         <div className="flex items-center">
            <Input
               type="url"
               id="additionalImages"
               value={imageInput}
               onChange={(e) => setImageInput(e.target.value)}
               placeholder="https://..."
               className="rounded-r-none" // Adjust border radius
               disabled={isSubmitting}
            />
            <Button
               type="button"
               variant="outline" // Use outline variant
               onClick={handleAddImage}
               className="rounded-l-none border-l-0" // Adjust border radius/margin
               disabled={isSubmitting}
            >
               Add
            </Button>
         </div>
         <div className="mt-2 flex flex-wrap gap-2">
            {formData.images?.map((img, index) => (
               <div key={index} className="relative group">
                  <Image src={img} alt={`Additional image ${index + 1}`} width={64} height={64} className="h-16 w-16 object-cover rounded border" />
                  <Button
                     type="button"
                     variant="destructive" // Use destructive variant
                     size="icon" // Make it small icon size
                     onClick={() => handleRemoveImage(index)}
                     className="absolute -top-1 -right-1 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity" // Adjust size/position
                     aria-label="Remove image"
                     disabled={isSubmitting}
                  >
                     <X size={12} /> {/* Use X icon */}
                  </Button>
               </div>
            ))}
         </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
