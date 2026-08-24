"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function FinalCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-28 md:py-36 px-6 overflow-hidden z-10 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-[#0d0820] to-[#07070f]"
    >
      {/* Visual background lines / glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div
        className={`max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
        }`}
      >
        {/* Large Headline */}
        <h2 className="font-jakarta font-extrabold text-[36px] md:text-[52px] text-white tracking-tight leading-[1.1] mb-6">
          Your next opportunity
          <br />
          is one link away.
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-sm md:text-lg text-white/55 max-w-[500px] mx-auto leading-relaxed mb-10">
          Join thousands of professionals who let their work do the talking.
        </p>

        {/* Large Button */}
        <div className="flex justify-center mb-10">
          <Link
            href="/auth"
            className="w-full sm:w-auto h-14 px-10 rounded-full font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] flex items-center justify-center shadow-[0_0_25px_rgba(124,58,237,0.5)] hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-base"
          >
            Build my portfolio &mdash; it's free
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs text-white/40">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#c084fc]" />
            <span>Live in under 5 minutes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-cyan-400" />
            <span>Free forever, upgrade when ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
