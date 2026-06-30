"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface NebulaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const NebulaButton = forwardRef<HTMLButtonElement, NebulaButtonProps>(
  ({ className, isLoading, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        "bg-gradient-to-r from-violet to-magenta text-white font-medium hover:brightness-110 hover:shadow-nebula-glow hover:scale-[1.02] active:scale-[0.97]",
      secondary:
        "border border-white/15 text-star-white hover:bg-violet/10 active:scale-[0.97]",
      ghost:
        "text-mist hover:text-star-white hover:bg-violet/5 active:scale-[0.97]",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-10 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-[0.75rem] transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-void",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
NebulaButton.displayName = "NebulaButton";
