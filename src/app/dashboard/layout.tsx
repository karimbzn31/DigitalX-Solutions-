import { Sidebar } from "@/components/layout/Sidebar";
import { NebulaBackground } from "@/components/shared/NebulaBackground";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-void relative">
        <NebulaBackground intensity={0.4} />
        <div className="relative z-10 max-w-6xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
