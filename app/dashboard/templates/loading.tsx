import { Skeleton } from "@/components/ui/loading-skeleton";

export default function TemplatesLoading() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 text-zinc-100 select-none">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-3.5 w-72" />
      </div>

      {/* Templates Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden p-5 space-y-4 shadow-xs"
          >
            <Skeleton className="h-44 w-full rounded-lg" />
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
