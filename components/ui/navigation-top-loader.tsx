"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function LoaderBarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete progress and fade out when route finishes changing
  useEffect(() => {
    if (isLoading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept internal anchor clicks for instant feedback before Next.js route transition begins
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (anchor && anchor.href) {
        try {
          const currentUrl = new URL(window.location.href);
          const targetUrl = new URL(anchor.href, window.location.href);

          // Check if internal navigation to a different path/query
          if (
            targetUrl.origin === currentUrl.origin &&
            (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search) &&
            !anchor.target &&
            !anchor.download &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.shiftKey &&
            !e.altKey
          ) {
            setIsLoading(true);
            setProgress(25);
          }
        } catch {
          // Ignore invalid URLs
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, []);

  // Increment progress incrementally while loading
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const diff = Math.random() * 12;
        return Math.min(prev + diff, 90);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none">
          <motion.div
            initial={{ width: "0%", opacity: 1 }}
            animate={{ width: `${progress}%`, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeOut", duration: 0.2 }}
            className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-400 shadow-[0_0_12px_rgba(139,92,246,0.85)] relative"
          >
            <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/80 animate-pulse" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function NavigationTopLoader() {
  return (
    <Suspense fallback={null}>
      <LoaderBarContent />
    </Suspense>
  );
}
