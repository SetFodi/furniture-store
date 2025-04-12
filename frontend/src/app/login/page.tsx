"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Lock, Mail } from "lucide-react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    toast.dismiss();

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      setIsLoading(false);

      if (result?.error) {
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
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
          <div className="h-4 w-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  if (status === "authenticated") { return null; }

  return (
    <div className="flex flex-col md:flex-row items-stretch min-h-[calc(100vh-200px)]">
      {/* Left side - Decorative panel with image */}
      <div className="hidden md:flex md:w-1/2 bg-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/0"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="w-24 h-24 mb-8 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
            <Image 
              src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=687&q=80" 
              alt="Elegant furniture" 
              fill 
              className="object-cover rounded-full"
            />
          </div>
          <h2 className="text-3xl font-playfair font-bold mb-6 text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            Sign in to access your account and explore our premium collection of luxury furniture for your home.
          </p>
          <div className="w-20 h-1 bg-primary"></div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Logo/branding for mobile */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              <span className="font-playfair">Fancy</span>
              <span className="text-primary font-playfair">Furnish</span>
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="bg-card border border-border/50 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-foreground">
                Sign in
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                Enter your credentials to access your account
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="space-y-2">
                <Label 
                  htmlFor="email-address" 
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Mail size={16} className="text-muted-foreground" />
                  Email address
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Lock size={16} className="text-muted-foreground" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 mt-8"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    <span>Signing In...</span>
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;