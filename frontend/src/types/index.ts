// src/types/index.ts

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    material?: string;
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
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  
  // --- Added Order related types ---
  
  export interface OrderItem {
    // Mongoose usually adds an _id to subdocuments, but we might only care about the product ref
    // Let's assume we don't need a specific OrderItem _id on the frontend for now.
    // _id: string;
    name: string;
    quantity: number;
    imageUrl: string;
    price: number; // Price at time of order
    product: string; // Reference to the Product._id
  }
  
  export interface ShippingAddress {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }
  
  export interface Order {
    _id: string;
    user: string | ({ _id: string; name: string; email: string });
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string; // ISO Date string
    isDelivered: boolean;
    deliveredAt?: string; // ISO Date string
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
  }
  // src/types/index.ts
// ... (Product, CartItem, Order types) ...

// Add User type
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin'; // Use enum values from backend model
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    // Add other fields if needed, but exclude password
  }
  
  // --- End Order related types ---
  