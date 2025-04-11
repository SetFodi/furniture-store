// src/components/ui/loading-spinner.tsx
import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have the cn utility

interface LoadingSpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = 24, // Default size
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin text-primary", className)} // Use primary color
      {...props}
    >
      {/* Simple rotating line */}
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />

      {/* Optional: More complex shape - uncomment if desired */}
      {/* Example: Abstract shape */}
      {/* <path d="M12 2v4" />
      <path d="m4.93 4.93 2.83 2.83" />
      <path d="M2 12h4" />
      <path d="m4.93 19.07 2.83-2.83" />
      <path d="M12 20v-4" />
      <path d="m19.07 19.07-2.83-2.83" />
      <path d="M22 12h-4" />
      <path d="m19.07 4.93-2.83 2.83" /> */}
    </svg>
  );
};

export default LoadingSpinner;
