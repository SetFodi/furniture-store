// src/components/AdminGuard.tsx
"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading-spinner"; // <<< Import the spinner

// Extend session type
import { Session } from "next-auth";
interface CustomSession extends Session {
  accessToken?: string;
  user?: Session["user"] & {
    _id?: string;
    role?: string;
  };
}

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") { return; }
    if (status === "unauthenticated") { router.replace("/login?callbackUrl=/admin/dashboard"); return; }
    if (status === "authenticated") {
      if (!session?.user?.role || session.user.role !== 'admin') {
         console.warn("Access Denied: User is not an admin.", session?.user);
         router.replace("/"); return;
      }
      console.log("Admin access granted for:", session.user.email);
    }
  }, [session, status, router]);

  // Render loading state or null while checking/redirecting
  if (status === "loading" || (status === "authenticated" && session?.user?.role !== 'admin') || status === "unauthenticated") {
    // --- Use the spinner ---
    return (
      <div className="flex justify-center items-center min-h-screen">
         <LoadingSpinner size={48} /> {/* <<< Use the spinner component */}
      </div>
    );
    // --- End spinner usage ---
  }

  // If authenticated and user is admin, render the children components
  return <>{children}</>;
};

export default AdminGuard;
