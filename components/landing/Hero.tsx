"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface PreviewTemplate {
  name: string;
  styleClass: string;
  previewContent: React.ReactNode;
}

const PREVIEW_TEMPLATES: PreviewTemplate[] = [
  {
    name: "Minimal Clean",
    styleClass: "bg-slate-50 text-slate-900 border-slate-200/80 font-sans",
    previewContent: (
      <div className="p-4 flex flex-col h-full justify-between">
        <div>
          <div className="w-8 h-8 rounded-full bg-slate-800 mb-3" />
          <div className="w-16 h-2 bg-slate-800 rounded mb-1.5" />
          <div className="w-24 h-1.5 bg-slate-400 rounded mb-4" />
          <div className="space-y-1">
            <div className="w-full h-1 bg-slate-300 rounded" />
            <div className="w-5/6 h-1 bg-slate-300 rounded" />
            <div className="w-4/6 h-1 bg-slate-300 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-3 bg-slate-200 border border-slate-300 rounded" />
          <div className="w-10 h-3 bg-slate-800 rounded" />
        </div>
      </div>
    ),
  },
  {
    name: "Bold Dark",
    styleClass: "bg-[#0b0b14] text-slate-100 border-[#8b5cf6]/20 font-sans",
    previewContent: (
      <div className="p-4 flex flex-col h-full justify-between bg-radial-[circle_at_top,_var(--tw-gradient-stops)] from-violet-950/20 to-[#0b0b14]">
        <div>
          <div className="w-8 h-8 rounded-full border border-violet-500 bg-violet-600/20 mb-3" />
          <div className="w-20 h-2.5 bg-white rounded mb-1.5 font-bold" />
          <div className="w-14 h-1.5 bg-violet-500 rounded mb-4" />
          <div className="space-y-1">
            <div className="w-full h-1 bg-slate-800 rounded" />
            <div className="w-full h-1 bg-slate-800 rounded" />
            <div className="w-3/4 h-1 bg-slate-800 rounded" />
          </div>
        </div>
        <div className="w-full h-4 bg-violet-600/30 rounded border border-violet-500/30 flex items-center justify-center">
          <div className="w-8 h-1 bg-white rounded" />
        </div>
      </div>
    ),
  },
  {
    name: "Neon Studio",
    styleClass: "bg-[#05090f] text-slate-100 border-[#06b6d4]/20 font-sans",
    previewContent: (
      <div className="p-4 flex flex-col h-full justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#06b6d4]/10 blur-md rounded-full" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-6 h-6 rounded-md bg-[#06b6d4]/20 border border-[#06b6d4]/80" />
            <div className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" />
          </div>
          <div className="w-20 h-2 bg-[#06b6d4] rounded mb-1.5" />
          <div className="w-16 h-1 bg-[#06b6d4]/40 rounded mb-4" />
          <div className="space-y-1">
            <div className="w-full h-1 bg-slate-800/80 rounded" />
            <div className="w-full h-1 bg-slate-800/80 rounded" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="w-12 h-3.5 rounded border border-[#06b6d4] bg-[#06b6d4]/10" />
          <div className="w-4 h-4 rounded-full bg-slate-800" />
        </div>
      </div>
    ),
  },
  {
    name: "Frost Glass",
    styleClass: "bg-gradient-to-tr from-purple-900/50 to-indigo-900/50 text-slate-100 border-white/10 font-sans",
    previewContent: (
      <div className="p-4 flex flex-col h-full justify-between relative overflow-hidden">
        <div className="absolute -inset-2 bg-white/5 backdrop-blur-[4px] rounded-xl border border-white/10" />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 mb-3 shadow-[0_0_10px_rgba(236,72,153,0.3)]" />
            <div className="w-24 h-2 bg-white/80 rounded mb-1.5" />
            <div className="w-12 h-1 bg-white/40 rounded mb-4" />
            <div className="space-y-1">
              <div className="w-full h-1 bg-white/20 rounded" />
              <div className="w-5/6 h-1 bg-white/20 rounded" />
            </div>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full flex items-center px-1">
            <div className="w-3 h-1.5 rounded-full bg-white" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Editorial Serif",
    styleClass: "bg-[#fcfbf7] text-[#1c1917] border-stone-200 font-serif",
    previewContent: (
      <div className="p-4 flex flex-col h-full justify-between">
        <div>
          <div className="w-7 h-7 rounded bg-stone-800 mb-3" />
          <div className="w-20 h-3 border-b-2 border-stone-800 mb-2 font-bold italic" style={{ fontFamily: "Georgia, serif" }} />
          <div className="w-24 h-1.5 bg-stone-500 rounded mb-3" />
          <div className="space-y-1">
            <div className="w-full h-1 bg-stone-300 rounded" />
            <div className="w-full h-1 bg-stone-300 rounded" />
            <div className="w-11/12 h-1 bg-stone-300 rounded" />
          </div>
        </div>
        <div className="border-t border-stone-200 pt-2 flex items-center justify-between text-[8px] text-stone-500">
          <span>PORTFOLIO</span>
          <span>&copy;2026</span>
        </div>
      </div>
    ),
  },
];

export default function Hero() {
  // We duplicate the list to make the infinite horizontal scroll seamless
  const extendedTemplates = [...PREVIEW_TEMPLATES, ...PREVIEW_TEMPLATES, ...PREVIEW_TEMPLATES];

  return (
    <section className="relative min-h-[calc(100vh-64px)] w-full flex flex-col justify-between items-center overflow-hidden z-10 py-16 md:py-20 px-6">
      {/* 
        A/B Test Variant (as commented code):
        Headline:
        "Stop sending CVs. Start sending portfolios that close."
      */}

      {/* Hero Content Container */}
      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl mx-auto">
        
        {/* Eyebrow Pill */}
        <div className="opacity-0 translate-y-6 animate-[fadeInUp_0.4s_ease-out_0.1s_forwards] mb-6 md:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8b5cf6]/12 border border-[#8b5cf6]/30 text-[#c084fc] font-jakarta font-semibold text-xs md:text-sm tracking-wide">
            ✦ The portfolio that gets you hired
          </div>
        </div>

        {/* Headline */}
        <h1 className="opacity-0 translate-y-6 animate-[fadeInUp_0.5s_ease-out_0.25s_forwards] font-jakarta font-extrabold text-[44px] md:text-[72px] text-[#f8fafc] leading-[1.05] tracking-[-0.03em] max-w-3xl mb-6 md:mb-8">
          Your work speaks.
          <br />
          Your portfolio should
          <br />
          <span className="bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent">
            scream.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="opacity-0 translate-y-6 animate-[fadeInUp_0.4s_ease-out_0.4s_forwards] font-sans font-normal text-sm md:text-lg text-white/55 leading-relaxed max-w-[520px] mb-8 md:mb-10">
          Build a stunning, shareable portfolio in minutes — not weeks.
          <br className="hidden md:inline" />
          12 premium templates. Built-in analytics. One link that does the talking.
        </p>

        {/* CTA Buttons */}
        <div className="opacity-0 translate-y-6 animate-[fadeInUp_0.4s_ease-out_0.55s_forwards] flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md sm:max-w-none mb-4">
          <Link
            href="/auth"
            className="w-full sm:w-auto text-center font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-8 py-4 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:scale-[1.02] transition-all duration-200 text-base"
          >
            Build my portfolio free &rarr;
          </Link>
          <a
            href="#templates"
            className="w-full sm:w-auto text-center font-semibold text-white border border-white/15 px-8 py-4 rounded-full hover:bg-white/5 hover:border-white/25 transition-all duration-200 text-base"
          >
            See live examples
          </a>
        </div>

        {/* Muted Text */}
        <p className="opacity-0 translate-y-6 animate-[fadeInUp_0.4s_ease-out_0.65s_forwards] font-sans text-xs text-white/35 mt-3">
          No credit card needed &middot; Free forever &middot; Live in 5 minutes
        </p>
      </div>

      {/* Hero Visual Strip (Scrolling) */}
      <div className="opacity-0 scale-[0.97] animate-[fadeIn_0.6s_ease-out_0.8s_forwards] w-full max-w-6xl mx-auto overflow-hidden mt-16 md:mt-24 relative select-none">
        {/* Left and Right Fade Mask */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#07070f] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#07070f] to-transparent z-10 pointer-events-none" />

        {/* 3D tilted row wrapper */}
        <div 
          className="w-full py-4 flex transition-transform duration-500"
          style={{ transform: "perspective(1000px) rotateX(8deg)" }}
        >
          {/* Scrolling track */}
          <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] pointer-events-auto">
            {extendedTemplates.map((template, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2.5 flex-shrink-0"
              >
                <div
                  className={`w-[180px] h-[234px] md:w-[200px] md:h-[260px] rounded-xl border border-white/8 overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.03] hover:border-white/15 ${template.styleClass}`}
                >
                  {template.previewContent}
                </div>
                <span className="text-[11px] font-jakarta font-semibold tracking-wide text-white/35 text-center uppercase">
                  {template.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_1.2s_forwards] mt-10 md:mt-12">
        <a 
          href="#features" 
          className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors"
          aria-label="Scroll down to features"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">Explore Features</span>
          <ChevronDown className="animate-bounce-chevron w-4 h-4 text-violet-400" />
        </a>
      </div>

      {/* Inline styles for custom fadeInUp animation to ensure it loads perfectly */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
