// src/app/admin/layout.tsx
import React from "react";
import Link from "next/link";
// Import the AdminGuard we will create next
import AdminGuard from "@/components/AdminGuard";

export const metadata = {
  title: "Admin Dashboard - FancyFurnish",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Wrap the entire admin section content with the guard
    <AdminGuard>
      <div className="flex min-h-screen">
        {/* Sidebar Navigation (Placeholder) */}
        <aside className="w-64 bg-gray-800 text-white p-4 hidden md:block flex-shrink-0">
          <h2 className="text-xl font-semibold mb-6">Admin Menu</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/admin/dashboard" className="block py-2 px-3 rounded hover:bg-gray-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/users" className="block py-2 px-3 rounded hover:bg-gray-700">
                  Users
                </Link>
              </li>
              <li>
                <Link href="/admin/orders" className="block py-2 px-3 rounded hover:bg-gray-700">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/admin/products" className="block py-2 px-3 rounded hover:bg-gray-700">
                  Products
                </Link>
              </li>
              {/* Add more admin links as needed */}
               <li className="pt-4 mt-4 border-t border-gray-700">
                 <Link href="/" className="block py-2 px-3 rounded hover:bg-gray-700 text-sm">
                   &larr; Back to Site
                 </Link>
               </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-6 bg-gray-100">
          {children} {/* Admin page content will be rendered here */}
        </main>
      </div>
    </AdminGuard>
  );
}
