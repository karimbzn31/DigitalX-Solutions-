import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return (
    <div className={cn("h-px bg-gradient-to-r from-transparent via-border to-transparent", className)} />
  );
}
