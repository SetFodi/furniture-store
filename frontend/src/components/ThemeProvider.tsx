// src/components/ThemeProvider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // attribute="class" tells next-themes to add 'light' or 'dark' to the <html> tag
  // defaultTheme="system" respects the user's OS preference initially
  // enableSystem allows switching to system preference
  // disableTransitionOnChange prevents flash on theme change
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
