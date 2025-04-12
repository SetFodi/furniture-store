"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { User, Mail, Lock, CheckCircle } from "lucide-react";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();
  const { data: session, status } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    // Simple password strength checker
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (!apiUrl) {
      toast.error("API endpoint not configured. Cannot register.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed.");
      }

      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      console.error("Registration Error:", err);
      toast.error(err.message || "An error occurred during registration.");
      setIsLoading(false);
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
      <div className="hidden md:flex md:w-1/2 bg-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background/0"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="w-24 h-24 mb-8 relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
            <Image 
              src="https://images.unsplash.com/photo-1618220252344-88b9a1893d9f?auto=format&fit=crop&w=687&q=80" 
              alt="Elegant furniture" 
              fill 
              className="object-cover rounded-full"
            />
          </div>
          <h2 className="text-3xl font-playfair font-bold mb-6 text-foreground">Join FancyFurnish</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            Create an account to explore our premium collection, save your favorites, and enjoy a personalized furniture shopping experience.
          </p>
          <div className="w-20 h-1 bg-primary"></div>
        </div>
      </div>

      {/* Right side - Register form */}
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
                Create Account
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                Join us and discover premium furniture for your home
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="space-y-2">
                <Label 
                  htmlFor="name"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <User size={16} className="text-muted-foreground" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
              
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min. 6 characters)"
                  disabled={isLoading}
                  className="h-11"
                />
                
                {/* Password strength indicator */}
                {password && (
                  <div className="flex items-center mt-1">
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordStrength === 0 ? 'w-1/4 bg-red-500' :
                          passwordStrength === 1 ? 'w-2/4 bg-orange-500' :
                          passwordStrength === 2 ? 'w-3/4 bg-yellow-500' :
                          'w-full bg-green-500'
                        }`}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {passwordStrength === 0 ? 'Weak' :
                       passwordStrength === 1 ? 'Fair' :
                       passwordStrength === 2 ? 'Good' :
                       'Strong'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Confirm Password Input */}
              <div className="space-y-2">
                <Label 
                  htmlFor="confirm-password"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <CheckCircle size={16} className="text-muted-foreground" />
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  disabled={isLoading}
                  className={`h-11 ${
                    confirmPassword && password !== confirmPassword 
                      ? 'border-red-500 focus-visible:ring-red-500' 
                      : ''
                  }`}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || (confirmPassword && password !== confirmPassword)}
                className="w-full h-11 mt-8"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    <span>Creating Account...</span>
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;