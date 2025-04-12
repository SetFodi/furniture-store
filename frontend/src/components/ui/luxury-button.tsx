// src/components/ui/luxury-button.tsx
// A premium styled button with hover effects

"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const luxuryButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:translate-y-0.5",
        outline:
          "border border-primary text-primary hover:bg-primary/10 active:translate-y-0.5",
        ghost:
          "hover:bg-primary/10 text-primary active:translate-y-0.5",
        gold:
          "bg-primary text-primary-foreground after:content-[''] after:absolute after:w-12 after:h-full after:top-0 after:-left-5 after:skew-x-[20deg] after:bg-white/20 after:transition-transform hover:after:translate-x-80 after:duration-700 active:translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:translate-y-0.5",
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 px-2 text-xs",
        sm: "h-9 px-3",
        lg: "h-11 px-8 text-base",
        xl: "h-12 px-10 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LuxuryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof luxuryButtonVariants> {
  asChild?: boolean;
}

const LuxuryButton = React.forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={luxuryButtonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

LuxuryButton.displayName = "LuxuryButton";

export { LuxuryButton, luxuryButtonVariants };