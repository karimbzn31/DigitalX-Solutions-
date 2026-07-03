"use client";

import { useEffect } from "react";
import { NebulaBackground } from "@/components/shared/NebulaBackground";
import { PageTransition } from "@/components/shared/PageTransition";
import { SearchModal } from "@/components/shared/SearchModal";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { SocialProof } from "@/components/shared/SocialProof";
import { useSearchStore } from "@/store/useSearchStore";
import { useCmdK } from "@/hooks/useKeyboard";

export function Providers({ children }: { children: React.ReactNode }) {
  const open = useSearchStore((s) => s.open);
  const setOpen = useSearchStore((s) => s.setOpen);
  const toggle = useSearchStore((s) => s.toggle);

  useCmdK(toggle);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);

  return (
    <>
      <NebulaBackground />
      <div className="relative z-10">
        <PageTransition>{children}</PageTransition>
      </div>
      <SearchModal open={open} onClose={() => setOpen(false)} />
      <ChatWidget />
      <SocialProof />
    </>
  );
}
