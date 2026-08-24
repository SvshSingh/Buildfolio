import { Skeleton } from "@/components/ui/loading-skeleton";

export default function EditorLoading() {
  return (
    <div className="flex flex-col h-screen bg-black text-zinc-100 overflow-hidden select-none">
      {/* Top Header Bar Skeleton */}
      <header className="h-14 bg-black border-b border-zinc-900 px-4 md:px-6 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Skeleton className="h-7 w-28 rounded-lg" />
          <Skeleton className="h-5 w-32 rounded-md hidden md:block" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </header>

      {/* Main Split Body Skeleton */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form Sidebar Skeleton */}
        <aside className="w-full md:w-[480px] lg:w-[520px] border-r border-zinc-900 bg-zinc-950 p-6 space-y-6 overflow-y-auto flex-shrink-0">
          {/* Section Navigation Tabs Skeleton */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-900">
            <Skeleton className="h-9 w-24 rounded-lg flex-shrink-0" />
            <Skeleton className="h-9 w-24 rounded-lg flex-shrink-0" />
            <Skeleton className="h-9 w-24 rounded-lg flex-shrink-0" />
            <Skeleton className="h-9 w-24 rounded-lg flex-shrink-0" />
          </div>

          {/* Form Fields Skeleton */}
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </aside>

        {/* Right Preview Panel Skeleton */}
        <main className="hidden md:flex flex-1 bg-zinc-900/40 p-8 items-center justify-center relative overflow-hidden">
          <div className="w-full max-w-3xl h-full bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6 animate-pulse">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
            <div className="pt-6 grid grid-cols-2 gap-4">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
