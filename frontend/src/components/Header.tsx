// src/components/Header.tsx
import Link from "next/link";
import React from "react";
import CartIcon from "./CartIcon"; // Import the new CartIcon component

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
        </div>

        {/* Cart Icon/Link */}
        <div>
          <CartIcon /> {/* Use the CartIcon component here */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
