// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider"; // Ensure this path is correct

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FancyFurnish - Premium Furniture",
  description: "Discover stylish and high-quality furniture online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Ensure NO whitespace/comments between <html> and <body> */}
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* Ensure NO whitespace/comments between <body> and <ThemeProvider> */}
        <ThemeProvider
           attribute="class"
           defaultTheme="system"
           enableSystem
           disableTransitionOnChange
        >
          {/* Ensure NO whitespace/comments between <ThemeProvider> and <AuthProvider> */}
          <AuthProvider>
            {/* Ensure NO whitespace/comments between <AuthProvider> and <CartProvider> */}
            <CartProvider>
              {/* Ensure NO whitespace/comments between <CartProvider> and <Header> */}
              <Header />
              <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
                {children}
              </main>
              <Footer />
              <Toaster position="bottom-right" />
              {/* Ensure NO whitespace/comments between <Toaster> and </CartProvider> */}
            </CartProvider>
            {/* Ensure NO whitespace/comments between </CartProvider> and </AuthProvider> */}
          </AuthProvider>
          {/* Ensure NO whitespace/comments between </AuthProvider> and </ThemeProvider> */}
        </ThemeProvider>
        {/* Ensure NO whitespace/comments between </ThemeProvider> and </body> */}
      </body>
      {/* Ensure NO whitespace/comments between </body> and </html> */}
    </html>
  );
}

