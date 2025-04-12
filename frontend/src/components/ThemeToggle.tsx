// src/components/ThemeToggle.tsx
"use client";
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering theme-dependent UI
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    // Render placeholder during server render / hydration
    return <Button variant="ghost" size="icon" disabled className="h-9 w-9" />;
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      aria-label="Toggle theme"
      className="relative w-9 h-9 rounded-full overflow-hidden"
    >
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme === 'dark' ? 'dark' : 'light'}
            initial={{ scale: 0, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 90 }}
            transition={{ 
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-primary" />
            ) : (
              <Moon className="h-5 w-5 text-foreground" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Animated background color */}
      <div 
        className={`absolute inset-0 transition-colors duration-500 rounded-full ${
          theme === 'dark' 
            ? 'bg-foreground/5' 
            : 'bg-primary/5'
        }`}
      />
    </Button>
  );
}