// src/components/CartIcon.tsx
"use client"; // Mark as Client Component

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const CartIcon: React.FC = () => {
  const { getItemCount } = useCart(); // Get item count function
  const itemCount = getItemCount();

  return (
    <Link
      href="/cart"
      className="relative text-gray-600 hover:text-indigo-600 transition duration-200"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {itemCount > 0 && ( // Only show badge if items exist
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
