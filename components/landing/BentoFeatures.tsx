"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function BentoFeatures() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visibleCells, setVisibleCells] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cellId = entry.target.getAttribute("data-cell");
          if (cellId) {
            // Set cell visible
            setVisibleCells((prev) => ({ ...prev, [cellId]: true }));
            // Unobserve once triggered
            observer.unobserve(entry.target);
          }
        }
      });
    }, observerOptions);

    const cells = gridRef.current?.querySelectorAll("[data-cell]");
    cells?.forEach((cell) => observer.observe(cell));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="features" className="relative w-full py-24 md:py-32 px-6 z-10 bg-[#07070f]">
      {/* Headings */}
      <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
        <span className="font-jakarta text-xs md:text-sm font-semibold tracking-[0.15em] text-[#c084fc] uppercase">
          EVERYTHING YOU NEED
        </span>
        <h2 className="font-jakarta font-bold text-[32px] md:text-[42px] text-white tracking-tight mt-3 mb-4 leading-tight">
          A portfolio tool built for
          <br className="hidden md:inline" />
          people who mean business.
        </h2>
        <p className="font-sans text-sm md:text-base text-white/70 max-w-[500px] mx-auto leading-relaxed">
          Every feature is intentional. Nothing is filler.
        </p>
      </div>

      {/* Bento Grid */}
      <div
        ref={gridRef}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 auto-rows-auto"
      >
        {/* CELL A — Hero Cell (col 1-4, row 1-2) */}
        <div
          data-cell="A"
          className={`md:col-span-4 md:row-span-2 rounded-2xl p-8 bg-gradient-to-br from-[#0d0820] via-[#160d35] to-[#0a1030] border border-[#8b5cf6]/25 flex flex-col justify-between overflow-hidden relative group min-h-[340px] md:min-h-[440px] transition-all duration-750 ease-out ${
            visibleCells["A"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          } hover:border-[#8b5cf6]/40 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-[#7c3aed]/5`}
        >
          {/* Glowing element behind visual */}
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-md">
            <span className="text-[10px] font-jakarta font-semibold tracking-widest text-[#c084fc] uppercase">
              TEMPLATES
            </span>
            <h3 className="text-2xl md:text-3xl font-jakarta font-bold text-white tracking-tight mt-2.5 mb-3.5 leading-tight">
              12 templates.
              <br />
              Zero compromise.
            </h3>
            <p className="text-xs md:text-sm text-white/70 font-sans leading-relaxed">
              From brutalist to elegant, minimal to neon &mdash; every template is a full creative direction, not just a color swap.
            </p>
          </div>

          {/* Visual: stacked template previews */}
          <div className="absolute right-4 md:right-8 bottom-20 md:bottom-8 w-[240px] h-[180px] pointer-events-none select-none flex justify-center items-center">
            {/* Template Card 1 */}
            <div className="absolute w-[110px] h-[140px] bg-slate-900 border border-violet-500/20 rounded-lg shadow-lg rotate-[-12deg] -translate-x-12 -translate-y-2 flex flex-col justify-between p-2.5">
              <div className="w-5 h-5 rounded-full bg-violet-500/30" />
              <div className="space-y-1">
                <div className="w-12 h-1.5 bg-violet-500/60 rounded" />
                <div className="w-8 h-1 bg-violet-500/30 rounded" />
              </div>
            </div>
            {/* Template Card 2 */}
            <div className="absolute w-[110px] h-[140px] bg-[#fcfbf7] border border-stone-200 rounded-lg shadow-2xl rotate-[4deg] translate-x-2 z-10 flex flex-col justify-between p-2.5">
              <div className="w-5 h-5 rounded bg-stone-800" />
              <div className="space-y-1">
                <div className="w-10 h-2 bg-stone-800 rounded" />
                <div className="w-12 h-1 bg-stone-500 rounded" />
              </div>
            </div>
            {/* Template Card 3 */}
            <div className="absolute w-[110px] h-[140px] bg-[#05090f] border border-[#06b6d4]/30 rounded-lg shadow-lg rotate-[18deg] translate-x-16 translate-y-3 flex flex-col justify-between p-2.5">
              <div className="w-5 h-5 rounded-md bg-[#06b6d4]/10 border border-[#06b6d4]" />
              <div className="space-y-1">
                <div className="w-8 h-1.5 bg-[#06b6d4] rounded" />
                <div className="w-10 h-1 bg-[#06b6d4]/40 rounded" />
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <Link
              href="/auth"
              className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[#c084fc] hover:text-white transition-colors duration-200"
            >
              Explore all templates <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* CELL B — Templates Count (col 5-6, row 1) */}
        <div
          data-cell="B"
          className={`md:col-span-2 rounded-2xl p-8 bg-[#0e0e1c] border border-white/7 flex flex-col justify-between transition-all duration-750 ease-out delay-50 ${
            visibleCells["B"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          } hover:border-[#8b5cf6]/40 hover:-translate-y-0.5`}
        >
          <div>
            <h3 className="text-5xl font-jakarta font-extrabold bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] bg-clip-text text-transparent tracking-tight">
              12
            </h3>
            <p className="text-sm font-jakarta font-semibold text-white/80 mt-1">
              Premium templates
            </p>
          </div>

          {/* Mini Visual: Palette boxes */}
          <div className="flex gap-2 my-4">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-violet-600 to-indigo-600 shadow shadow-violet-500/30" />
            <div className="w-8 h-8 rounded bg-[#fcfbf7] border border-stone-200" />
            <div className="w-8 h-8 rounded bg-[#0b0b14] border border-[#8b5cf6]/20" />
          </div>

          {/* Sub: Tiny pills */}
          <div className="flex flex-wrap gap-1.5">
            {["Minimal", "Bold", "Elegant", "Retro", "Brutalist"].map((type, i) => (
              <span
                key={i}
                className="text-[10px] font-medium font-sans px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-white/70"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* CELL C — Analytics (col 5-6, row 2) */}
        <div
          data-cell="C"
          className={`md:col-span-2 rounded-2xl p-8 bg-[#0a0f1e] border border-white/7 flex flex-col justify-between min-h-[220px] transition-all duration-750 ease-out delay-100 ${
            visibleCells["C"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          } hover:border-[#8b5cf6]/40 hover:-translate-y-0.5`}
        >
          <div>
            <span className="text-[10px] font-jakarta font-semibold tracking-widest text-[#c084fc] uppercase">
              ANALYTICS
            </span>
            <h3 className="text-lg font-jakarta font-bold text-white tracking-tight mt-1.5 mb-1 leading-tight">
              Know who's looking.
            </h3>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              See who views your portfolio, where they came from, and when.
            </p>
          </div>

          {/* Visual: Mini bar chart */}
          <div className="flex items-end justify-between gap-1.5 h-16 w-32 mt-4 px-2 bg-white/2 rounded-lg border border-white/5 self-start">
            {[14, 28, 20, 48, 36].map((h, i) => (
              <div
                key={i}
                className="w-4 bg-gradient-to-t from-[#4f46e5] to-[#7c3aed] rounded-t-sm transition-[height] duration-700 ease-out"
                style={
                  {
                    height: visibleCells["C"] ? `${h}px` : "0px",
                    transitionDelay: `${i * 100}ms`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>

        {/* CELL D — Instant Publish (col 1-2, row 3) */}
        <div
          data-cell="D"
          className={`md:col-span-2 rounded-2xl p-8 bg-gradient-to-br from-[#120820] to-[#1e0a3c] border border-white/7 flex flex-col justify-between min-h-[240px] transition-all duration-750 ease-out delay-150 ${
            visibleCells["D"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          } hover:border-[#8b5cf6]/40 hover:-translate-y-0.5 group/url`}
        >
          <div>
            <span className="text-[10px] font-jakarta font-semibold tracking-widest text-[#c084fc] uppercase">
              PUBLISH
            </span>
            <h3 className="text-base font-jakarta font-bold text-white tracking-tight mt-1.5 mb-1">
              Live in 5 minutes.
            </h3>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Fill in the wizard. Hit finish. Share your link. That's it.
            </p>
          </div>

          {/* Visual: URL address bar */}
          <div className="w-full bg-[#07070f] border border-white/10 group-hover/url:border-emerald-500/50 group-hover/url:shadow-[0_0_15px_rgba(34,197,94,0.15)] rounded-lg py-2 px-3 flex items-center justify-between transition-all duration-300">
            <span className="text-[11px] font-mono text-white/75 tracking-tight">
              alex.foliofast.co
            </span>
            <span className="flex items-center gap-1 text-[9px] font-jakarta font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
              Live <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </span>
          </div>
        </div>

        {/* CELL E — Experience Timeline (col 3-4, row 3) */}
        <div
          data-cell="E"
          className={`md:col-span-2 rounded-2xl p-8 bg-[#0a0d1e] border border-white/7 flex flex-col justify-between min-h-[240px] transition-all duration-750 ease-out delay-200 ${
            visibleCells["E"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          } hover:border-[#8b5cf6]/40 hover:-translate-y-0.5`}
        >
          <div>
            <span className="text-[10px] font-jakarta font-semibold tracking-widest text-[#c084fc] uppercase">
              EXPERIENCE
            </span>
            <h3 className="text-base font-jakarta font-bold text-white tracking-tight mt-1.5 mb-1">
              Your career, beautifully told.
            </h3>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Add your work history. It renders as an elegant timeline &mdash; like LinkedIn, but yours.
            </p>
          </div>

          {/* Visual: Mini timeline */}
          <div className="relative pl-5 border-l border-white/10 space-y-3.5 py-1.5 self-start mt-2">
            <div className="absolute top-1.5 -left-[4.5px] w-2.5 h-2.5 rounded-full bg-[#7c3aed] border-2 border-[#0a0d1e]" />
            <div className="absolute bottom-2 -left-[4.5px] w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-[#0a0d1e]" />
            <div className="space-y-0.5">
              <span className="text-[8px] font-bold uppercase tracking-wider text-white/55 font-jakarta">Present</span>
              <p className="text-[10px] font-bold text-white leading-none">Senior Product Designer</p>
              <p className="text-[9px] text-white/70 leading-none">Google</p>
            </div>
            <div className="space-y-0.5 pt-1">
              <span className="text-[8px] font-bold uppercase tracking-wider text-white/55 font-jakarta">2024</span>
              <p className="text-[10px] font-bold text-white leading-none">UI/UX Engineer</p>
              <p className="text-[9px] text-white/70 leading-none">Vercel</p>
            </div>
          </div>
        </div>

        {/* CELL F — Share in 1 Click (col 5-6, row 3) */}
        <div
          data-cell="F"
          className={`md:col-span-2 rounded-2xl p-8 bg-gradient-to-br from-[#0a1a10] to-[#0d2818] border border-white/7 flex flex-col justify-between min-h-[240px] transition-all duration-750 ease-out delay-250 ${
            visibleCells["F"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          } hover:border-[#22c55e]/40 hover:-translate-y-0.5`}
        >
          <div>
            <span className="text-[10px] font-jakarta font-semibold tracking-widest text-[#22c55e] uppercase">
              SHARING
            </span>
            <h3 className="text-base font-jakarta font-bold text-white tracking-tight mt-1.5 mb-1">
              One link. Infinite impressions.
            </h3>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Send it to recruiters, clients, investors. No login required to view.
            </p>
          </div>

          {/* Visual: Avatar connections */}
          <div className="flex items-center gap-3.5 py-1">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-[#0a1a10] flex items-center justify-center text-[10px] font-bold text-emerald-400">R</div>
              <div className="w-7 h-7 rounded-full bg-slate-700 border-2 border-[#0a1a10] flex items-center justify-center text-[10px] font-bold text-[#c084fc]">H</div>
              <div className="w-7 h-7 rounded-full bg-slate-600 border-2 border-[#0a1a10] flex items-center justify-center text-[10px] font-bold text-cyan-400">K</div>
            </div>
            
            {/* Connection line */}
            <div className="flex-1 h-px border-t border-dashed border-[#22c55e]/30 relative flex items-center justify-center">
              <span className="text-[10px] text-emerald-400 font-bold bg-[#0d2818] px-2 relative -top-[5px] rotate-[-5deg] tracking-tight">
                Shared &rarr;
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/40 flex items-center justify-center shadow-md shadow-[#22c55e]/10">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#22c55e] stroke-[2.5px]" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l.908-.452m0 3.09l-.908-.452M10.5 7.5a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zm0 9a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* CELL G — Full-width Bottom CTA Inside Bento (col 1-6, row 4) */}
        <div
          data-cell="G"
          className={`md:col-span-6 rounded-2xl p-8 md:p-10 bg-gradient-to-r from-[#1a0a3e] via-[#0a0a20] to-[#1a0a3e] border border-white/7 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 transition-all duration-750 ease-out delay-300 ${
            visibleCells["G"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          } animate-border-glow`}
        >
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-jakarta font-bold text-white tracking-tight leading-tight">
              Ready to build yours?
            </h3>
            <p className="text-xs md:text-sm text-white/70 font-sans mt-1">
              Select a template and make it yours in under 5 minutes.
            </p>
          </div>

          <Link
            href="/auth"
            className="w-full md:w-auto text-center font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] px-7 py-3.5 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm flex items-center justify-center gap-1.5"
          >
            Start for free &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
