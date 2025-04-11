// src/types/index.ts
export interface Product {
    _id: string; // MongoDB typically uses _id
    name: string;
    description: string;
    price: number;
    category: string;
    material?: string; // Optional fields marked with ?
    dimensions?: {
      width?: number;
      height?: number;
      depth?: number;
    };
    imageUrl: string;
    images?: string[];
    stock: number;
    rating?: number;
    numReviews?: number;
    createdAt: string; // Added by timestamps: true
    updatedAt: string; // Added by timestamps: true
  }
  
  // You might add other types here later (e.g., CartItem, Order)
  