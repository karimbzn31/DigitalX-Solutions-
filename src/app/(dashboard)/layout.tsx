"use client";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { SearchModal } from "@/components/shared/SearchModal";
import { useSearchStore } from "@/store/useSearchStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const searchOpen = useSearchStore((s) => s.open);
  const setSearchOpen = useSearchStore((s) => s.setOpen);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 bg-void relative pb-16 md:pb-0">
        <DashboardHeader />
        <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
      <BottomNav />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
