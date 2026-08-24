"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/ui/toast";

interface TemplateGalleryProps {
  userId: string;
  initialTemplate: string;
}

const FILTERS = ["All", "Minimal", "Modern", "Elegant", "Dark", "Retro"];

const TEMPLATES = [
  {
    key: "minimal-clean",
    name: "Minimal Clean",
    tagline: "Elegant, content-first layout using refined typography and clean spacing.",
    tag: "Minimal",
    categories: ["Minimal", "Elegant"],
  },
  {
    key: "bold-dark",
    name: "Bold Dark",
    tagline: "High-contrast dark layout with massive headlines, purple accents, and Space Grotesk font.",
    tag: "Brutalism",
    categories: ["Modern", "Dark"],
  },
  {
    key: "corporate-pro",
    name: "Corporate Pro",
    tagline: "Warm editorial aesthetic using serif headings, two-column grid, and document layout.",
    tag: "Editorial",
    categories: ["Elegant", "Modern"],
  },
  {
    key: "neon-studio",
    name: "Neon Studio",
    tagline: "Cyberpunk neon vibes with deep navy bg, glowing cyan borders, pink details, and Syne typography.",
    tag: "Creative",
    categories: ["Modern", "Dark"],
  },
  {
    key: "soft-minimal",
    name: "Soft Minimal",
    tagline: "Minimal & clean variant — warmer, softer layout with DM Sans font and dotted separators.",
    tag: "Minimal",
    categories: ["Minimal", "Elegant"],
  },
  {
    key: "grid-modern",
    name: "Grid Modern",
    tagline: "Modern & geometric layout featuring Inter font and strict grid components.",
    tag: "Geometric",
    categories: ["Modern", "Minimal"],
  },
  {
    key: "editorial-serif",
    name: "Editorial Serif",
    tagline: "Elegant editorial spread with Cormorant Garamond headings and magazine-like styling.",
    tag: "Editorial",
    categories: ["Elegant", "Minimal"],
  },
  {
    key: "frost-glass",
    name: "Frost Glass",
    tagline: "Stunning glassmorphism card layout with animated gradient backgrounds.",
    tag: "Glass",
    categories: ["Modern", "Dark", "Elegant"],
  },
  {
    key: "retro-terminal",
    name: "Retro Terminal",
    tagline: "Classic terminal / CLI simulation with monospace fonts and scanline effects.",
    tag: "Retro",
    categories: ["Retro", "Dark", "Modern"],
  },
  {
    key: "magazine-spread",
    name: "Magazine Spread",
    tagline: "True magazine grid asymmetric columns inspired by printed print layouts.",
    tag: "Magazine",
    categories: ["Elegant", "Modern"],
  },
  {
    key: "zen-space",
    name: "Zen Space",
    tagline: "Japanese zen minimalism, extreme whitespace, and haiku-style details.",
    tag: "Zen",
    categories: ["Minimal", "Elegant"],
  },
  {
    key: "brutalist",
    name: "Brutalist",
    tagline: "Aggressive raw typography and layouts featuring heavy black borders and yellow/white background.",
    tag: "Brutalist",
    categories: ["Modern", "Retro"],
  },
];

export default function TemplateGallery({ userId, initialTemplate }: TemplateGalleryProps) {
  const [activeTemplate, setActiveTemplate] = useState(initialTemplate);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const handleSelectTemplate = async (templateKey: string) => {
    if (templateKey === activeTemplate) return;
    setLoadingKey(templateKey);

    try {
      const supabase = createClient();

      const { data: existing, error: fetchError } = await supabase
        .from("portfolios")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let error;
      if (existing) {
        const { error: updateError } = await supabase
          .from("portfolios")
          .update({ template: templateKey })
          .eq("user_id", userId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("portfolios")
          .insert({
            user_id: userId,
            template: templateKey,
            data: {},
            is_published: false,
          });
        error = insertError;
      }

      if (error) throw error;

      setActiveTemplate(templateKey);
      triggerToast("Template applied successfully");
    } catch (err) {
      console.error("Error setting template:", err);
      triggerToast("Failed to apply template");
    } finally {
      setLoadingKey(null);
    }
  };

  const filteredTemplates = activeFilter === "All"
    ? TEMPLATES
    : TEMPLATES.filter((tpl) => tpl.categories.includes(activeFilter));

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 select-none text-zinc-100">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Themes</span>
          </h1>
          <p className="text-zinc-550 text-xs mt-0.5">
            Select a template style for your public portfolio. Content is automatically reformatted.
          </p>
        </div>

        {/* FILTER ROW */}
        <div className="flex flex-wrap gap-1.5 bg-zinc-950 p-1 border border-zinc-900 rounded-lg">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold tracking-wide transition-all cursor-pointer ${
                activeFilter === filter
                  ? "bg-white text-black"
                  : "text-zinc-450 hover:text-zinc-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* GALLERY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => {
          const isActive = activeTemplate === tpl.key;
          const isLoading = loadingKey === tpl.key;

          return (
            <div
              key={tpl.key}
              className={`bg-zinc-950 rounded-xl p-4 flex flex-col justify-between transition-all duration-150 border ${
                isActive
                  ? "border-zinc-100 shadow-sm"
                  : "border-zinc-900 hover:border-zinc-800"
              }`}
            >
              {/* Card visual preview */}
              <div>
                <div className="h-40 w-full bg-black rounded-lg overflow-hidden p-1.5 mb-3 relative">
                  
                  {tpl.key === "minimal-clean" && (
                    <div className="w-full h-full bg-white border border-zinc-200 rounded-md p-3 flex flex-col gap-2 text-zinc-850 shadow-inner">
                      <div className="flex gap-2 items-center">
                        <div className="w-6 h-6 rounded-full bg-zinc-100" />
                        <div className="flex-1 space-y-0.5">
                          <div className="h-2 w-14 bg-zinc-850 rounded" />
                          <div className="h-1 w-20 bg-zinc-400 rounded" />
                        </div>
                      </div>
                      <div className="space-y-1 mt-1">
                        <div className="h-1 w-full bg-zinc-200 rounded" />
                        <div className="h-1 w-[80%] bg-zinc-200 rounded" />
                      </div>
                    </div>
                  )}

                  {tpl.key === "bold-dark" && (
                    <div className="w-full h-full bg-[#0f0f0f] border border-zinc-850 rounded-md p-3 flex flex-col gap-2 text-[#f5f5f5] shadow-inner">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <div className="h-2.5 w-16 bg-zinc-200 rounded-none font-bold" />
                          <div className="h-1 w-10 bg-purple-500 rounded-none" />
                        </div>
                        <div className="w-6 h-6 bg-zinc-900 border border-[#a855f7] rounded-none" />
                      </div>
                      <div className="h-1 w-full bg-zinc-700 rounded-none mt-1" />
                    </div>
                  )}

                  {tpl.key === "corporate-pro" && (
                    <div className="w-full h-full bg-[#f8f4ef] border border-[#e5e0d8] rounded-md p-3 flex gap-3 text-[#1a1a1a] shadow-inner">
                      <div className="w-[30%] flex flex-col gap-1 border-r border-[#e5e0d8] pr-2">
                        <div className="w-5 h-5 rounded-md bg-[#e5e0d8]" />
                        <div className="h-2 w-full bg-slate-800 rounded" />
                      </div>
                      <div className="w-[75%] space-y-1.5">
                        <div className="h-1 w-8 bg-slate-400 rounded" />
                        <div className="h-1 w-full bg-slate-300 rounded" />
                        <hr className="border-[#e5e0d8]" />
                      </div>
                    </div>
                  )}

                  {tpl.key === "neon-studio" && (
                    <div className="w-full h-full bg-[#0d0d1a] border border-cyan-900/35 rounded-md p-3 flex flex-col gap-2 text-[#e2e8f0] shadow-inner">
                      <div className="flex gap-2 items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="h-2 w-12 bg-cyan-400 rounded" />
                          <div className="h-1 w-14 bg-pink-400 rounded" />
                        </div>
                        <div className="w-5 h-5 rounded-full bg-slate-900 border border-cyan-400" />
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded" />
                    </div>
                  )}

                  {tpl.key === "soft-minimal" && (
                    <div className="w-full h-full bg-[#fafaf9] border border-stone-200 rounded-md p-3 flex flex-col gap-1 text-[#292524] shadow-inner">
                      <div className="flex gap-2 items-center">
                        <div className="w-5 h-5 rounded-full bg-stone-200" />
                        <div className="h-2 w-16 bg-stone-300 rounded" />
                      </div>
                      <hr className="border-stone-200 border-dotted" />
                      <div className="h-1 w-full bg-stone-250 rounded" />
                      <div className="h-1 w-2/3 bg-stone-250 rounded" />
                    </div>
                  )}

                  {tpl.key === "grid-modern" && (
                    <div className="w-full h-full bg-[#f1f5f9] border border-slate-200 rounded-md p-3 flex flex-col gap-2 text-[#0f172a] shadow-inner">
                      <div className="grid grid-cols-3 gap-1">
                        <div className="h-4 bg-white border-t border-[#0ea5e9] rounded" />
                        <div className="h-4 bg-white border-t border-slate-655 rounded" />
                        <div className="h-4 bg-white border-t border-sky-400 rounded" />
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded" />
                      <div className="h-1 w-3/4 bg-slate-200 rounded" />
                    </div>
                  )}

                  {tpl.key === "editorial-serif" && (
                    <div className="w-full h-full bg-[#fffef7] border border-stone-200 rounded-md p-3 flex flex-col gap-1.5 text-[#1c1917] shadow-inner">
                      <div className="text-center font-serif text-[10px] text-[#be185d] border-b border-stone-100 pb-1">
                        THE JOURNAL
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="w-1/2 h-8 bg-stone-100 border border-stone-200" />
                        <div className="w-1/2 space-y-1">
                          <div className="h-1 w-full bg-stone-300 rounded" />
                          <div className="h-1 w-2/3 bg-stone-300 rounded" />
                        </div>
                      </div>
                    </div>
                  )}

                  {tpl.key === "frost-glass" && (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-md p-3 flex flex-col justify-center items-center shadow-inner">
                      <div className="w-[85%] h-[80%] rounded-lg bg-white/10 backdrop-blur-md border border-white/20 p-2 flex flex-col gap-1.5 justify-center">
                        <div className="h-1.5 w-8 bg-white/60 rounded" />
                        <div className="h-1 w-full bg-white/40 rounded" />
                      </div>
                    </div>
                  )}

                  {tpl.key === "retro-terminal" && (
                    <div className="w-full h-full bg-[#0a0a0a] border border-stone-850 rounded-md p-3 flex flex-col gap-1.5 font-mono text-[#00ff41] shadow-inner text-[7px] leading-tight">
                      <p>&gt; whoami</p>
                      <p className="text-white">alex_johnson</p>
                      <p>&gt; ls projects/</p>
                      <p className="text-stone-400">[proj_1] [proj_2]</p>
                    </div>
                  )}

                  {tpl.key === "magazine-spread" && (
                    <div className="w-full h-full bg-white border border-stone-200 rounded-md p-2 flex flex-col gap-1 text-[#111827] shadow-inner">
                      <div className="w-full h-1 bg-[#dc2626]" />
                      <div className="text-[10px] font-bold tracking-tighter leading-none border-b border-black pb-0.5 uppercase">
                        ALEX
                      </div>
                      <div className="flex gap-2">
                        <div className="w-[60%] space-y-1">
                          <div className="h-1 w-full bg-stone-300 rounded" />
                          <div className="h-1 w-2/3 bg-stone-300 rounded" />
                        </div>
                        <div className="w-[40%] h-8 bg-stone-100 border border-stone-200" />
                      </div>
                    </div>
                  )}

                  {tpl.key === "zen-space" && (
                    <div className="w-full h-full bg-[#f5f0e8] border border-stone-200 rounded-md p-3 flex flex-col justify-between items-center text-[#2d2d2d] shadow-inner">
                      <div className="flex gap-2 items-center w-full justify-between">
                        <div className="flex items-center gap-1">
                          <div className="w-0.5 h-3 bg-[#c0392b]" />
                          <div className="h-1 w-8 bg-stone-400 rounded" />
                        </div>
                        <div className="w-3 h-3 rounded-full bg-[#c0392b]/20" />
                      </div>
                      <div className="w-full h-[1px] bg-stone-200 flex items-center justify-center my-0.5">
                        <div className="w-1 h-1 rounded-full bg-[#c0392b]" />
                      </div>
                      <div className="h-2 w-14 bg-stone-350 rounded" />
                    </div>
                  )}

                  {tpl.key === "brutalist" && (
                    <div className="w-full h-full bg-[#f5f500] border-2 border-black rounded-md p-2 flex flex-col gap-1.5 text-black shadow-inner">
                      <div className="text-[9px] font-black uppercase tracking-tighter leading-none border-b-2 border-black pb-0.5">
                        ALEX
                      </div>
                      <div className="border-2 border-black bg-white p-1 text-[6px] font-bold">
                        PROJECTS
                      </div>
                    </div>
                  )}

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute top-2.5 right-2.5 bg-white text-black p-0.5 rounded-full shadow-md z-10 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  )}

                  {/* Tag */}
                  <span className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-xs text-zinc-500 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-zinc-900">
                    {tpl.tag}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1 px-1">
                  <h3 className="font-bold text-white text-sm">
                    {tpl.name}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed min-h-[32px]">
                    {tpl.tagline}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 px-0.5">
                {isActive ? (
                  <div className="w-full text-center py-2 px-3 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-500 text-[11px] font-medium tracking-wide flex items-center justify-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Applied</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectTemplate(tpl.key)}
                    disabled={isLoading}
                    className="w-full py-2 px-3 rounded-lg bg-white hover:bg-zinc-150 disabled:bg-white/40 text-black text-[11px] font-semibold tracking-wide transition-all select-none cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Applying..." : "Use this style"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* TOAST */}
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
