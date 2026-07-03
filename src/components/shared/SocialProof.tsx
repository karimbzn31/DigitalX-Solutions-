"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";

export function SocialProof() {
  const [count] = useState(() => Math.floor(Math.random() * 15) + 8);

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-40 hidden md:block">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/80 backdrop-blur-md border border-white/[0.06] text-[11px] text-mist">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <Users className="w-3 h-3" />
        <span>{count} personnes regardent cette page</span>
      </div>
    </div>
  );
}
