// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Or choose another font
import "./globals.css";
import Header from "@/components/Header"; // Import Header using alias
import Footer from "@/components/Footer"; // Import Footer using alias

const inter = Inter({ subsets: ["latin"] }); // Example font loading

export const metadata: Metadata = {
  title: "FancyFurnish - Premium Furniture", // Default title
  description: "Discover stylish and high-quality furniture online.", // Default description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {" "}
        {/* Added flex classes */}
        <Header />
        <main className="flex-grow container mx-auto px-6 py-8">
          {" "}
          {/* Added flex-grow and padding */}
          {children} {/* Page content will be rendered here */}
        </main>
        <Footer />
      </body>
    </html>
  );
}
