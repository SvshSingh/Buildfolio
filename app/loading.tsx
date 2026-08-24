import { Sparkles, Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-zinc-100 select-none">
      <div className="relative flex flex-col items-center gap-4">
        {/* Glow effect background */}
        <div className="absolute -inset-4 rounded-full bg-violet-600/20 blur-xl animate-pulse" />

        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <Sparkles className="w-7 h-7 text-white animate-bounce" />
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-zinc-300">
          <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
          <span>Loading FolioFast...</span>
        </div>
      </div>
    </div>
  );
}
