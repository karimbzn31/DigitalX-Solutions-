interface LogoProps {
  size?: number;
  className?: string;
  scrolled?: boolean;
}

export function Logo({ size = 32, className = "", scrolled = false }: LogoProps) {
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      {scrolled && (
        <div
          className="absolute -inset-2 rounded-xl bg-gradient-to-r from-violet/30 via-magenta/20 to-rose/30 opacity-80 blur-xl transition-all duration-500"
          aria-hidden
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        className={className}
        aria-label="DigitalX Solutions"
      >
        <defs>
          <linearGradient id="logog" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C5CFF" />
            <stop offset="50%" stopColor="#C45CFF" />
            <stop offset="100%" stopColor="#FF6FB8" />
          </linearGradient>
          <linearGradient id="logog2" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C45CFF" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <rect x="1" y="1" width="38" height="38" rx="10" fill="url(#logog2)" stroke="url(#logog)" strokeWidth="1.5" />

        <path
          d="M12 12L20 20L28 12"
          stroke="url(#logog)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 28L20 20L28 28"
          stroke="url(#logog)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo size={36} />
      <div>
        <span className="font-display text-base font-bold bg-gradient-to-r from-violet via-magenta to-rose bg-clip-text text-transparent leading-tight block">
          DigitalX
        </span>
        <span className="text-[10px] text-mist tracking-normal font-medium leading-tight block -mt-0.5">
          Solutions Academy
        </span>
      </div>
    </div>
  );
}
