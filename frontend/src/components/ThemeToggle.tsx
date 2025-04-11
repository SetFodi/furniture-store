// src/components/ThemeToggle.tsx (Conceptual Animated Toggle)
"use client";
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion'; // Example library

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering theme-dependent UI
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    // Render placeholder or null during server render / hydration mismatch potential
    return <Button variant="ghost" size="icon" disabled className="h-9 w-9" />;
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {/* Basic fade example (replace with better animation) */}
      {theme === 'dark' ? (
         <Sun className="h-[1.2rem] w-[1.2rem] transition-opacity duration-300 opacity-100" />
      ) : (
         <Moon className="h-[1.2rem] w-[1.2rem] transition-opacity duration-300 opacity-100" />
      )}
      {/* Using Framer Motion (Example)
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme === 'dark' ? 'sun' : 'moon'}
          initial={{ opacity: 0, rotate: -90, scale: 0 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </motion.div>
      </AnimatePresence>
      */}
    </Button>
  );
}
