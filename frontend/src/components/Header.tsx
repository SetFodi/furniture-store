// src/components/Header.tsx
import Link from "next/link";
import React from "react";
import CartIcon from "./CartIcon";
import UserNav from "./UserNav";
import { ThemeToggle } from "./ThemeToggle"; // <<< Import ThemeToggle

const Header: React.FC = () => {
  return (
    // Use themed background/border for header
    <header className="bg-card border-b sticky top-0 z-50 shadow-sm"> {/* Changed bg/shadow */}
      <nav className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center"> {/* Adjusted padding/height slightly */}
        {/* Logo/Brand Name */}
        <Link href="/" className="text-2xl font-bold text-foreground hover:text-foreground/80 transition-colors"> {/* Use themed text color */}
          FancyFurnish
        </Link>

        {/* Middle Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"> {/* Use themed text colors */}
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Products
          </Link>
        </div>

        {/* Right Side Icons/Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3"> {/* Adjusted spacing */}
          <ThemeToggle /> {/* <<< Add ThemeToggle button */}
          <CartIcon />
          <UserNav />
        </div>
      </nav>
    </header>
  );
};

export default Header;
