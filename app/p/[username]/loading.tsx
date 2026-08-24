import { Skeleton } from "@/components/ui/loading-skeleton";

export default function PublicPortfolioLoading() {
  return (
    <div className="min-h-screen bg-[#07070f] text-zinc-100 p-6 md:p-16 space-y-12 max-w-4xl mx-auto select-none">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-full flex-shrink-0" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      {/* About Section Skeleton */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[85%]" />
      </div>

      {/* Projects Skeleton */}
      <div className="space-y-6 pt-4 border-t border-white/5">
        <Skeleton className="h-5 w-28" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
