import { cn } from "@/lib/utils";

interface NebulaBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "violet" | "success";
  className?: string;
}

export function NebulaBadge({ children, variant = "default", className }: NebulaBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium px-3 py-1 rounded-full",
        variant === "default" && "bg-violet/8 text-mist border border-white/8",
        variant === "violet" && "bg-gradient-to-r from-violet/10 to-magenta/10 text-violet border border-violet/15",
        variant === "success" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15",
        className
      )}
    >
      {children}
    </span>
  );
}
