"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface TemplateItem {
  id: string;
  name: string;
  vibe: string;
  bgClass: string;
  preview: React.ReactNode;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    vibe: "Elegant & Crisp",
    bgClass: "bg-slate-50 text-slate-900 border-slate-200",
    preview: (
      <div className="p-4 flex flex-col h-full justify-between font-sans">
        <div>
          <div className="w-8 h-8 rounded-full bg-slate-800 mb-2" />
          <div className="w-16 h-2 bg-slate-800 rounded mb-1.5" />
          <div className="w-24 h-1.5 bg-slate-400 rounded" />
        </div>
        <div className="space-y-1">
          <div className="w-full h-1 bg-slate-200 rounded" />
          <div className="w-5/6 h-1 bg-slate-200 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: "bold-dark",
    name: "Bold Dark",
    vibe: "High Contrast & Impact",
    bgClass: "bg-[#0b0b14] text-slate-100 border-violet-500/20",
    preview: (
      <div className="p-4 flex flex-col h-full justify-between font-sans bg-radial-to-t from-violet-950/20 to-[#0b0b14]">
        <div>
          <div className="w-8 h-8 rounded-full border border-violet-500 bg-violet-600/20 mb-2" />
          <div className="w-20 h-2 bg-white rounded mb-1.5" />
          <div className="w-14 h-1 bg-violet-500 rounded" />
        </div>
        <div className="space-y-1">
          <div className="w-full h-1 bg-slate-800 rounded" />
          <div className="w-3/4 h-1 bg-slate-800 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: "neon-studio",
    name: "Neon Studio",
    vibe: "Electric & Cyberpunk",
    bgClass: "bg-[#05090f] text-slate-100 border-[#06b6d4]/20",
    preview: (
      <div className="p-4 flex flex-col h-full justify-between font-sans">
        <div>
          <div className="w-6 h-6 rounded bg-[#06b6d4]/20 border border-[#06b6d4] mb-2" />
          <div className="w-16 h-2 bg-[#06b6d4] rounded mb-1.5" />
          <div className="w-12 h-1 bg-[#06b6d4]/40 rounded" />
        </div>
        <div className="space-y-1">
          <div className="w-full h-1 bg-slate-800 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: "frost-glass",
    name: "Frost Glass",
    vibe: "Modern & Translucent",
    bgClass: "bg-gradient-to-tr from-purple-950/60 to-indigo-950/60 text-slate-100 border-white/10",
    preview: (
      <div className="p-4 flex flex-col h-full justify-between font-sans relative overflow-hidden">
        <div className="absolute inset-2 bg-white/5 backdrop-blur-[3px] rounded-lg border border-white/10" />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 mb-2" />
            <div className="w-18 h-2 bg-white/70 rounded" />
          </div>
          <div className="w-full h-1 bg-white/20 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: "editorial-serif",
    name: "Editorial Serif",
    vibe: "Sophisticated & Editorial",
    bgClass: "bg-[#fcfbf7] text-[#1c1917] border-stone-200",
    preview: (
      <div className="p-4 flex flex-col h-full justify-between font-serif">
        <div>
          <div className="w-7 h-7 rounded-sm bg-stone-800 mb-2" />
          <div className="w-16 h-2.5 border-b border-stone-800 mb-1.5" />
          <div className="w-12 h-1 bg-stone-400 rounded" />
        </div>
        <div className="text-[8px] text-stone-400 tracking-widest font-mono">PORTFOLIO</div>
      </div>
    ),
  },
  {
    id: "brutalist",
    name: "Brutalist",
    vibe: "Raw & Architectural",
    bgClass: "bg-yellow-400 text-black border-black border-2",
    preview: (
      <div className="p-4 flex flex-col h-full justify-between font-mono">
        <div>
          <div className="w-8 h-8 bg-black border-2 border-black mb-2" />
          <div className="w-20 h-3 bg-black text-yellow-400 font-extrabold px-1 text-[8px] uppercase">CREATIVE</div>
        </div>
        <div className="border-t border-black pt-1">
          <div className="w-full h-1.5 bg-black" />
        </div>
      </div>
    ),
  },
  {
    id: "corporate-pro",
    name: "Corporate Pro",
    vibe: "Professional & Sharp",
    bgClass: "bg-slate-900 text-white border-blue-500/20",
    preview: (
      <div className="p-4 flex flex-col h-full justify-between font-sans">
        <div>
          <div className="flex gap-1.5 items-center mb-2">
            <div className="w-4 h-4 rounded-sm bg-blue-500" />
            <div className="w-12 h-1.5 bg-white rounded" />
          </div>
          <div className="w-20 h-2 bg-blue-500/50 rounded mb-1" />
          <div className="w-16 h-1 bg-slate-700 rounded" />
        </div>
        <div className="w-full h-3 bg-blue-500 rounded-sm flex items-center justify-center text-[7px] font-bold">
          CONTACT
        </div>
      </div>
    ),
  },
  {
    id: "grid-modern",
    name: "Grid Modern",
    vibe: "Structured & Balanced",
    bgClass: "bg-stone-900 text-stone-100 border-stone-800",
    preview: (
      <div className="p-4 flex flex-col h-full justify-between font-sans">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="h-8 rounded bg-stone-800 flex items-center justify-center text-[8px]">A</div>
          <div className="h-8 rounded bg-stone-800 flex items-center justify-center text-[8px]">B</div>
        </div>
        <div className="h-6 rounded bg-stone-800 w-full" />
      </div>
    ),
  },
  {
    id: "magazine-spread",
    name: "Magazine Spread",
    vibe: "Bold & Artistic",
    bgClass: "bg-amber-50 text-amber-950 border-amber-200/80",
    preview: (
      <div className="p-4 flex flex-col h-full justify-between font-sans bg-radial-to-br from-amber-100/50 to-amber-50">
        <div>
          <span className="text-[7px] uppercase font-bold tracking-widest text-red-600">ISSUE 04</span>
          <h4 className="text-sm font-black italic tracking-tighter text-amber-950 mb-1 leading-none mt-1">
            CREATOR
          </h4>
          <div className="w-14 h-1 bg-amber-900/60 rounded" />
        </div>
        <div className="w-6 h-6 rounded bg-red-600 self-end" />
      </div>
    ),
  },
  {
    id: "retro-terminal",
    name: "Retro Terminal",
    vibe: "Vintage & Geeky",
    bgClass: "bg-black text-green-500 border-green-500/20 font-mono",
    preview: (
      <div className="p-4 flex flex-col h-full justify-between">
        <div>
          <div className="flex gap-1 mb-2">
            <span className="text-[9px] font-bold text-green-400">&gt;_</span>
            <div className="w-12 h-1.5 bg-green-500/80 rounded" />
          </div>
          <p className="text-[7px] leading-none text-green-600">SYSTEM: ONLINE</p>
        </div>
        <div className="space-y-0.5">
          <div className="w-full h-1 bg-green-900" />
          <div className="w-3/4 h-1 bg-green-900" />
        </div>
      </div>
    ),
  },
  {
    id: "soft-minimal",
    name: "Soft Minimal",
    vibe: "Warm & Minimalist",
    bgClass: "bg-[#f5ebe6] text-[#4a3e3d] border-[#ebdcd5]",
    preview: (
      <div className="p-4 flex flex-col h-full justify-between font-sans">
        <div>
          <div className="w-8 h-8 rounded-full bg-[#ebdcd5] border border-[#dfc3b5] mb-2" />
          <div className="w-16 h-2 bg-[#4a3e3d] rounded-sm mb-1" />
          <div className="w-12 h-1.5 bg-[#4a3e3d]/50 rounded-sm" />
        </div>
        <div className="w-6 h-3 bg-[#e8c6b7]/30 border border-[#e8c6b7] rounded-sm" />
      </div>
    ),
  },
  {
    id: "zen-space",
    name: "Zen Space",
    vibe: "Calm & Centered",
    bgClass: "bg-[#1f2421] text-[#e0e2db] border-[#373d39]",
    preview: (
      <div className="p-4 flex flex-col h-full justify-between font-sans">
        <div className="flex flex-col items-center">
          <div className="w-7 h-7 rounded-full border border-[#94a187] flex items-center justify-center mb-2">
            <div className="w-3 h-3 rounded-full bg-[#94a187]" />
          </div>
          <div className="w-14 h-1.5 bg-[#e0e2db] rounded" />
        </div>
        <div className="w-full h-1 bg-[#373d39] rounded" />
      </div>
    ),
  },
];

export default function TemplateShowcase() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 240; // Card width + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCardClick = () => {
    router.push("/auth");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % TEMPLATES.length;
      cardRefs.current[nextIndex]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + TEMPLATES.length) % TEMPLATES.length;
      cardRefs.current[prevIndex]?.focus();
    }
  };

  return (
    <section id="templates" className="relative w-full py-24 md:py-32 px-6 z-10 bg-[#07070f]">
      {/* Background glow */}
      <div className="absolute top-0 right-10 w-[400px] h-[400px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Heading */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <span className="font-jakarta text-xs md:text-sm font-semibold tracking-[0.15em] text-[#c084fc] uppercase">
            DESIGN OPTIONS
          </span>
          <h2 className="font-jakarta font-bold text-[32px] md:text-[42px] text-white tracking-tight mt-3">
            Pick your personality.
          </h2>
          <p className="font-sans text-sm text-white/55 mt-2">
            Every template is a full creative direction. Not just a color swap.
          </p>
        </div>

        {/* Scroll Controls (Desktop only) */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => handleScroll("left")}
            className="w-10 h-10 rounded-full border border-white/10 hover:border-white/20 bg-white/5 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            aria-label="Scroll left"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="w-10 h-10 rounded-full border border-white/10 hover:border-white/20 bg-white/5 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
            aria-label="Scroll right"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal snapping scroll row */}
      <div className="w-full relative overflow-hidden select-none">
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 scrollbar-none px-2 md:px-12"
          style={{ scrollbarWidth: "none" }}
        >
          {TEMPLATES.map((template, idx) => (
            <div
              key={template.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onClick={handleCardClick}
              className="snap-start flex flex-col gap-3.5 flex-shrink-0 cursor-pointer outline-none group focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070f] rounded-xl"
            >
              {/* Styled Preview Div */}
              <div
                className={`w-[180px] h-[230px] rounded-xl border border-white/8 overflow-hidden relative shadow-lg transition-all duration-300 group-hover:border-violet-500/40 group-hover:-translate-y-1 ${template.bgClass}`}
              >
                {template.preview}

                {/* Hover overlay "Try this →" */}
                <div className="absolute inset-0 bg-[#07070f]/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <span className="text-xs font-jakarta font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-4 py-2 rounded-full shadow-lg shadow-violet-500/20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    Try this &rarr;
                  </span>
                </div>
              </div>

              {/* Text label */}
              <div className="flex flex-col text-center sm:text-left px-1">
                <span className="text-xs font-jakarta font-bold text-white group-hover:text-[#c084fc] transition-colors leading-snug">
                  {template.name}
                </span>
                <span className="text-[10px] text-white/40 tracking-wider font-semibold font-sans uppercase mt-0.5">
                  {template.vibe}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
