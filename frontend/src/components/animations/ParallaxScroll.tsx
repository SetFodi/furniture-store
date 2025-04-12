// src/components/animations/ParallaxScroll.tsx
// This component creates a parallax scrolling effect

"use client";
import React, { useRef, useEffect } from "react";

interface ParallaxScrollProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

const ParallaxScroll: React.FC<ParallaxScrollProps> = ({ 
  children, 
  speed = 0.2,
  className = ""
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const initialOffsetY = useRef<number>(0);

  useEffect(() => {
    if (!ref.current) return;
    
    // Store initial position
    initialOffsetY.current = ref.current.offsetTop;
    
    const handleScroll = () => {
      if (!ref.current) return;
      
      const scrollPosition = window.scrollY;
      const elementPosition = initialOffsetY.current;
      const distance = scrollPosition - elementPosition;
      
      // Only apply parallax if element is in view
      if (
        scrollPosition + window.innerHeight > elementPosition &&
        scrollPosition < elementPosition + ref.current.offsetHeight
      ) {
        // Apply parallax effect
        ref.current.style.transform = `translateY(${distance * speed}px)`;
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);
  
  return (
    <div ref={ref} className={`transition-transform duration-300 ease-out ${className}`}>
      {children}
    </div>
  );
};

export default ParallaxScroll;