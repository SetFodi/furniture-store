// src/components/Footer.tsx
import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card text-card-foreground border-t border-border/30">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & About */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold tracking-tighter">
                <span className="font-playfair">Fancy</span>
                <span className="text-primary font-playfair">Furnish</span>
              </h2>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Curated furniture collections designed to elevate your living spaces with timeless elegance and exceptional craftsmanship.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
                <Mail size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=Living+Room" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Living Room
                </Link>
              </li>
              <li>
                <Link href="/products?category=Bedroom" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Bedroom
                </Link>
              </li>
              <li>
                <Link href="/products?category=Dining" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Dining Room
                </Link>
              </li>
              <li>
                <Link href="/products?category=Office" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Office
                </Link>
              </li>
              <li>
                <Link href="/products?category=Outdoor" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Outdoor
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Warranty Information
                </Link>
              </li>
              <li>
                <Link href="/my-orders" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Track My Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Payment */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 mb-6">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Careers
                </Link>
              </li>
            </ul>
            
            <h3 className="font-semibold text-lg mb-3">We Accept</h3>
            <div className="flex flex-wrap gap-2">
              {/* Simple payment method icons - replace with actual icons */}
              <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">
                <span className="text-xs">Visa</span>
              </div>
              <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">
                <span className="text-xs">MC</span>
              </div>
              <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">
                <span className="text-xs">Amex</span>
              </div>
              <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">
                <span className="text-xs">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="border-t border-border py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {currentYear} FancyFurnish. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;