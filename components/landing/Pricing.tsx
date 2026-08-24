"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative w-full py-24 md:py-32 px-6 z-10 bg-[#07070f]"
    >
      {/* Background Glow */}
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Headings */}
      <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
        <span className="font-jakarta text-xs md:text-sm font-semibold tracking-[0.15em] text-[#c084fc] uppercase">
          PRICING PLANS
        </span>
        <h2 className="font-jakarta font-bold text-[32px] md:text-[42px] text-white tracking-tight mt-3 mb-4 leading-tight">
          Simple pricing.
          <br className="hidden md:inline" />
          No hidden fees.
        </h2>
        <p className="font-sans text-sm md:text-base text-white/55 max-w-[480px] mx-auto leading-relaxed">
          Start building for free. Upgrade to Pro when you need custom domains and full access.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative z-10">
        {/* FREE CARD */}
        <div
          className={`rounded-2xl p-8 bg-[#0e0e1c] border border-white/7 flex flex-col justify-between hover:border-[#8b5cf6]/30 transition-all duration-700 ease-out hover:-translate-y-0.5 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <span className="text-[11px] font-jakarta font-bold uppercase tracking-widest text-white/40">
              FREE FOREVER
            </span>
            <div className="flex items-baseline gap-1 mt-4 mb-6">
              <span className="text-5xl font-jakarta font-extrabold text-white">$0</span>
            </div>
            <p className="text-xs text-white/55 font-sans mb-8 leading-relaxed">
              Perfect for getting started and building your first online layout.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                "1 portfolio",
                "Subdomain hosting (.foliofast.co)",
                "3 templates",
                "Contact form integration",
                "Password protection",
                "Basic SEO optimization",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                  <Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/auth"
            className="w-full text-center font-semibold text-white border border-white/15 py-3 rounded-full hover:bg-white/5 hover:border-white/25 active:scale-[0.98] transition-all text-sm"
          >
            Start free &rarr;
          </Link>
        </div>

        {/* PRO CARD (Highlighted) */}
        <div
          className={`rounded-2xl p-8 bg-[#13132a] border-2 border-[#8b5cf6]/40 flex flex-col justify-between hover:border-[#8b5cf6]/60 transition-all duration-700 ease-out hover:-translate-y-0.5 shadow-2xl shadow-[#7c3aed]/10 relative ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          {/* Badge */}
          <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white text-[10px] font-jakarta font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] tracking-wide uppercase">
            Most popular
          </div>

          <div>
            <span className="text-[11px] font-jakarta font-bold uppercase tracking-widest text-[#c084fc]">
              PRO PLAN
            </span>
            <div className="flex items-baseline gap-2 mt-4 mb-1">
              <span className="text-5xl font-jakarta font-extrabold text-white">$29</span>
              <span className="text-xs text-white/50 font-sans">/ year</span>
            </div>
            <span className="text-[10px] font-medium text-emerald-400 font-sans block mb-6">
              ($2.40/mo billed annually)
            </span>
            <p className="text-xs text-white/55 font-sans mb-8 leading-relaxed font-normal">
              For professionals who want absolute control over layout branding and domain paths.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-2.5 text-xs text-[#c084fc] font-bold">
                <Check size={14} className="text-[#c084fc] mt-0.5 flex-shrink-0" />
                <span>Everything in Free, plus:</span>
              </li>
              {[
                "Custom domain connection (yourname.com)",
                "Unlock all 12 templates",
                "Advanced analytics dashboard",
                "Unlimited portfolios",
                "Advanced SEO & social sharing cards",
                "Priority email support",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                  <Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/auth"
            className="w-full text-center font-semibold text-white bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] py-3.5 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
          >
            Upgrade to Pro &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
