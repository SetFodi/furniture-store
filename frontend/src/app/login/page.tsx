// src/app/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Import Button
import { Input } from "@/components/ui/input";   // Import Input
import { Label } from "@/components/ui/label";   // Import Label
import { toast } from "react-hot-toast";         // Import toast

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // No need for separate error state, use toast directly
  // const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Clear previous toasts if any
    toast.dismiss();

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      setIsLoading(false);

      if (result?.error) {
        // Show error toast
        toast.error(result.error || "Invalid credentials. Please try again.");
        console.error("Login Error:", result.error);
      } else if (result?.ok) {
        toast.success("Login successful! Redirecting...");
        router.push(callbackUrl);
        router.refresh();
      } else {
        toast.error("An unknown error occurred during login.");
      }
    } catch (err) {
      console.error("SignIn function error:", err);
      setIsLoading(false);
      toast.error("Login failed. Please try again.");
    }
  };

  if (status === "loading") {
    // Add a more visually appealing loader later if desired
    return <div className="text-center p-10">Loading...</div>;
  }
  if (status === "authenticated") { return null; }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      {/* Use Card component later for better structure */}
      <div className="max-w-md w-full space-y-8 bg-card p-8 shadow-lg rounded-lg border"> {/* Added border */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground"> {/* Use foreground color */}
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email-address">Email address</Label> {/* Use Label */}
            <Input // Use Input component
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>
          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label> {/* Use Label */}
            <Input // Use Input component
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button // Use Button component
              type="submit"
              disabled={isLoading}
              className="w-full" // Make button full width
            >
              {isLoading ? "Signing In..." : "Sign in"}
            </Button>
          </div>
        </form>
        <div className="text-sm text-center">
          <span className="text-muted-foreground">Don't have an account? </span> {/* Use muted color */}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/90" // Use primary color
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
