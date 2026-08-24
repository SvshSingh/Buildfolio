"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Pencil, Layers, Settings, LogOut, Sparkles, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface DashboardSidebarProps {
  email: string;
}

export default function DashboardSidebar({ email }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const avatarLetter = email ? email.charAt(0).toUpperCase() : "U";
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Clear pendingHref when pathname changes
  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Edit Portfolio", href: "/editor", icon: Pencil },
    { name: "Templates", href: "/dashboard/templates", icon: Layers },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-black border-b border-zinc-900 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2 select-none">
          <Sparkles className="w-4 h-4 text-zinc-100" />
          <span className="text-sm font-bold tracking-tight text-zinc-100">
            FolioFast
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[11px] font-medium text-zinc-300 uppercase">
            {avatarLetter}
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 bg-black border-r border-zinc-900 flex-col justify-between z-50">
        <div>
          {/* Top Logo */}
          <div className="h-14 px-6 border-b border-zinc-900 flex items-center gap-2 select-none">
            <Sparkles className="w-4 h-4 text-zinc-100" />
            <span className="text-sm font-bold tracking-tight text-zinc-100">
              FolioFast
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isPending = pendingHref === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (pathname !== item.href) {
                      setPendingHref(item.href);
                    }
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-zinc-900 text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-zinc-200" : "text-zinc-500"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isPending && (
                    <Loader2 className="w-3 h-3 animate-spin text-violet-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile info */}
        <div className="p-4 border-t border-zinc-900 space-y-3">
          <div className="flex items-center gap-2.5 px-1.5">
            <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-200 uppercase">
              {avatarLetter}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-zinc-400 truncate" title={email}>
                {email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-zinc-500 hover:text-zinc-350 hover:bg-zinc-950 rounded-lg text-[10px] font-semibold tracking-wide uppercase transition-all cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM TAB BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-black border-t border-zinc-900 flex justify-around items-center z-50 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isPending = pendingHref === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (pathname !== item.href) {
                  setPendingHref(item.href);
                }
              }}
              className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all relative ${
                isActive
                  ? "text-zinc-100 bg-zinc-900"
                  : "text-zinc-650 hover:text-zinc-400"
              }`}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
              ) : (
                <Icon className="w-4.5 h-4.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
