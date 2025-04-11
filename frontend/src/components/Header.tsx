// src/components/Header.tsx
import Link from "next/link";
import React from "react";
// You might want an icon library later, e.g., react-icons
// import { FiShoppingCart } from 'react-icons/fi';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 hover:text-gray-700"
        >
          FancyFurnish
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-indigo-600 transition duration-200"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-gray-600 hover:text-indigo-600 transition duration-200"
          >
            Products
          </Link>
          {/* Add other links like About, Contact later if needed */}
        </div>

        {/* Cart Icon/Link */}
        <div>
          <Link
            href="/cart"
            className="relative text-gray-600 hover:text-indigo-600 transition duration-200"
          >
            {/* Replace with an actual cart icon later */}
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
            {/* Optional: Cart item count badge */}
            {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span> */}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
