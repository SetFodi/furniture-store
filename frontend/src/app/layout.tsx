// src/app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Raleway } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";

// Font optimization
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

const raleway = Raleway({ 
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap"
});

export const metadata: Metadata = {
  title: "FancyFurnish - Premium Luxury Furniture",
  description: "Discover our curated collection of premium furniture pieces to transform your living spaces with elegance and style.",
  keywords: "luxury furniture, modern furniture, designer pieces, home decor, interior design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${raleway.variable}`}>
      <body className={`${raleway.className} flex flex-col min-h-screen antialiased`}>
        <ThemeProvider
           attribute="class"
           defaultTheme="system"
           enableSystem
           disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <div className="page-transition">
                <Header />
                {/* Added padding-top to create global margin below header */}
                <main className="flex-grow pt-24">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster 
                position="bottom-right" 
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--card)',
                    color: 'var(--card-foreground)',
                    border: '1px solid var(--border)',
                  },
                }} 
              />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}