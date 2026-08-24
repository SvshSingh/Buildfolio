import { Skeleton } from "@/components/ui/loading-skeleton";

export default function WizardLoading() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between p-6 md:p-12 select-none">
      {/* Header Skeleton */}
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-20" />
      </header>

      {/* Center Wizard Step Card Skeleton */}
      <main className="max-w-2xl mx-auto w-full bg-zinc-950 border border-zinc-900 rounded-2xl p-8 space-y-6 my-auto">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        </div>
      </main>

      {/* Bottom Footer Actions Skeleton */}
      <footer className="max-w-2xl mx-auto w-full flex items-center justify-between">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </footer>
    </div>
  );
}
