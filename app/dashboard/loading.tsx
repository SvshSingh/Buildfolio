import { Skeleton, SkeletonCard } from "@/components/ui/loading-skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 text-zinc-100 select-none">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Main Portfolio Summary Card Skeleton */}
      <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 relative overflow-hidden flex flex-col lg:flex-row gap-8 animate-pulse">
        <div className="flex-1 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-64 rounded-lg" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>

        {/* Replica skeleton */}
        <div className="w-full lg:w-60 flex flex-col gap-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-36 w-full rounded-lg" />
        </div>
      </section>

      {/* Stats Cards Skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-3 w-32" />
        </div>
      </section>

      {/* Quick Actions Shortcuts Skeleton */}
      <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
        <Skeleton className="h-3 w-20" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </section>
    </div>
  );
}
