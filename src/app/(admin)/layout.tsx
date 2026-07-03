"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { NebulaBackground } from "@/components/shared/NebulaBackground";
import { useAppStore } from "@/store/useAppStore";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useAppStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
      return unsub;
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    supabase.auth.getUser().then(({ data: { user: sbUser } }) => {
      if (!sbUser) {
        useAppStore.getState().setUser(null);
        router.replace("/login");
      }
    });
  }, [hydrated, router]);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!user.isAdmin) {
      router.replace("/dashboard");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user || !user.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col bg-void relative">
        <NebulaBackground intensity={0.4} />
        <AdminHeader />
        <main className="relative z-10 flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
