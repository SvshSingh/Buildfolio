import { Skeleton } from "@/components/ui/loading-skeleton";

export default function SettingsLoading() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 text-zinc-100 select-none">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-3.5 w-64" />
      </div>

      {/* Account Settings Card Skeleton */}
      <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 space-y-6">
        <div className="border-b border-zinc-900 pb-4 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full max-w-md rounded-lg" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-10 w-full max-w-md rounded-lg" />
          </div>

          <div className="pt-2">
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Privacy & Publication Settings Card Skeleton */}
      <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 space-y-6">
        <div className="border-b border-zinc-900 pb-4 space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64" />
        </div>

        <div className="flex items-center justify-between p-4 bg-black border border-zinc-900 rounded-lg">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </section>

      {/* Danger Zone Skeleton */}
      <section className="bg-zinc-950 border border-red-950/40 rounded-xl p-6 space-y-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3.5 w-72" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </section>
    </div>
  );
}
