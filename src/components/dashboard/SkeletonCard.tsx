import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-white/5",
        className
      )}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

export function ModuleCardSkeleton() {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
      <Skeleton className="h-2 rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <ModuleCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}
