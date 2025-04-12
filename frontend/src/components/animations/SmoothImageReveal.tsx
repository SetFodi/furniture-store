// src/components/animations/SmoothImageReveal.tsx
// This component creates a smooth image reveal animation

"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface SmoothImageRevealProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill";
  sizes?: string;
}

const SmoothImageReveal: React.FC<SmoothImageRevealProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  objectFit = "cover",
  sizes,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Loading Overlay */}
      <motion.div
        className="absolute inset-0 bg-muted z-10"
        initial={{ scaleY: 1 }}
        animate={isLoaded ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{ duration: 0.7, ease: [0.645, 0.045, 0.355, 1.000], delay: 0.2 }}
        style={{ originY: 0 }}
      />

      {/* Actual Image */}
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes={sizes}
          style={{ objectFit }}
          fill={!width || !height}
          className={`transition-transform duration-700 ease-out ${isLoaded ? 'scale-100' : 'scale-105'}`}
          onLoadingComplete={() => setIsLoaded(true)}
        />
      </div>
    </motion.div>
  );
};

export default SmoothImageReveal;