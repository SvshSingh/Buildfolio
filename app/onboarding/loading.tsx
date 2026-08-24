import { Skeleton } from "@/components/ui/loading-skeleton";

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-6 select-none">
      <div className="max-w-md w-full bg-zinc-950 border border-zinc-900 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="flex justify-center">
          <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
        <div className="space-y-2 text-center">
          <Skeleton className="h-6 w-40 mx-auto" />
          <Skeleton className="h-3.5 w-60 mx-auto" />
        </div>
        <div className="space-y-4 pt-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
