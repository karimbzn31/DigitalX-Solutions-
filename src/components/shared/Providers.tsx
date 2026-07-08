"use client";

import { useEffect } from "react";
import { NebulaBackground } from "@/components/shared/NebulaBackground";
import { PageTransition } from "@/components/shared/PageTransition";
import { SearchModal } from "@/components/shared/SearchModal";
import { useSearchStore } from "@/store/useSearchStore";
import { useAppStore } from "@/store/useAppStore";
import { useCmdK } from "@/hooks/useKeyboard";

export function Providers({ children }: { children: React.ReactNode }) {
  const open = useSearchStore((s) => s.open);
  const setOpen = useSearchStore((s) => s.setOpen);
  const toggle = useSearchStore((s) => s.toggle);
  const setUser = useAppStore((s) => s.setUser);

  useCmdK(toggle);

  // Re-fetch le profil utilisateur au chargement (après login/reload)
  useEffect(() => {
    fetch("/api/auth/profile")
      .then((r) => {
        if (!r.ok) throw new Error("Non authentifié");
        return r.json();
      })
      .then((data) => {
        if (data.profile) {
          const p = data.profile;
          setUser({
            id: p.id,
            name: p.name,
            initials: p.initials,
            email: p.email,
            isAdmin: p.is_admin,
            status: p.status,
            level: p.level,
            totalProgress: p.total_progress,
            videosWatched: p.videos_watched,
            totalVideos: p.total_videos,
            timeSpent: p.time_spent,
            certificates: p.certificates,
            joinedAt: p.created_at,
          });
        }
      })
      .catch(() => {
        // Silencieux — pas connecté (page login, etc.)
      });
  }, [setUser]);

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
    </>
  );
}
