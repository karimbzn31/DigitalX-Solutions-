import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "cosmos-card rounded-[0.625rem] p-6 transition-all duration-300 relative overflow-hidden group",
        hover && "cosmos-card-hover",
        className
      )}
    >
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-core/40 to-transparent" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
