// src/components/Header.tsx
"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import CartIcon from "./CartIcon";
import UserNav from "./UserNav";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { 
      name: 'Collections', 
      href: '#',
      dropdown: [
        { name: 'Living Room', href: '/products?category=Living+Room' },
        { name: 'Bedroom', href: '/products?category=Bedroom' },
        { name: 'Dining', href: '/products?category=Dining' },
        { name: 'Office', href: '/products?category=Office' },
        { name: 'Outdoor', href: '/products?category=Outdoor' },
      ]
    },
  ];

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "shadow-md" 
          : ""
      } bg-background/95 backdrop-blur-md py-2`}
    >
      <nav className="container mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
        {/* Logo/Brand Name */}
        <Link href="/" className="relative group">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tighter transition-colors">
            <span className="font-playfair text-foreground">Fancy</span>
            <span className="text-primary font-playfair">Furnish</span>
          </h1>
          <motion.div 
            className="absolute -bottom-1 left-0 h-0.5 bg-primary origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isScrolled ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </Link>

        {/* Middle Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              {link.dropdown ? (
                <button 
                  className="text-base font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                  onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.name}
                  <ChevronDown size={16} className={`transition-transform ${activeDropdown === link.name ? 'rotate-180' : 'rotate-0'}`} />
                </button>
              ) : (
                <Link href={link.href} className="text-base font-medium text-foreground hover:text-primary transition-colors">
                  {link.name}
                </Link>
              )}
              
              {/* Dropdown Menu */}
              {link.dropdown && (
                <AnimatePresence>
                  {activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 py-2 px-4 bg-card shadow-xl rounded-md min-w-[200px] z-20"
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.dropdown.map((item) => (
                        <Link 
                          key={item.name} 
                          href={item.href}
                          className="block py-2 text-foreground hover:text-primary transition-colors whitespace-nowrap"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        {/* Right Side Icons/Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <ThemeToggle />
          <CartIcon />
          <UserNav />
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden flex" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-card/95 backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <div key={link.name} className="py-1">
                  {link.dropdown ? (
                    <>
                      <button 
                        className="flex justify-between items-center w-full py-2 text-foreground hover:text-primary transition-colors"
                        onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                      >
                        <span className="font-medium">{link.name}</span>
                        <ChevronDown size={16} className={`transition-transform ${activeDropdown === link.name ? 'rotate-180' : 'rotate-0'}`} />
                      </button>
                      
                      <AnimatePresence>
                        {activeDropdown === link.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pl-4 py-2 flex flex-col space-y-2 border-l-2 border-primary/30 ml-2 mt-1"
                          >
                            {link.dropdown.map((item) => (
                              <Link 
                                key={item.name} 
                                href={item.href}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link 
                      href={link.href}
                      className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;