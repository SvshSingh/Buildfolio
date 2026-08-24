"use client";

import React, { useEffect, useRef, useState } from "react";

interface StepConfig {
  number: string;
  title: string;
  body: string;
}

const STEPS: StepConfig[] = [
  {
    number: "01",
    title: "Sign up free",
    body: "No credit card, no setup. Just your email and a magic link.",
  },
  {
    number: "02",
    title: "Fill the wizard",
    body: "6 guided steps. Your bio, experience, projects, skills. Done in minutes.",
  },
  {
    number: "03",
    title: "Share your link",
    body: "yourname.foliofast.co goes live instantly. Send it everywhere.",
  },
];

export default function HowItWorks() {
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
    <section ref={containerRef} className="relative w-full py-24 md:py-32 px-6 z-10 bg-[#07070f]">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Headings */}
      <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
        <span className="font-jakarta text-xs md:text-sm font-semibold tracking-[0.15em] text-[#c084fc] uppercase">
          THREE STEPS
        </span>
        <h2 className="font-jakarta font-bold text-[32px] md:text-[42px] text-white tracking-tight mt-3">
          How it works.
        </h2>
      </div>

      {/* Steps Container */}
      <div className="max-w-6xl mx-auto relative">
        {/* Connecting dashed line (Desktop only) */}
        <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-white/10 -z-10" />

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              style={{ transitionDelay: `${idx * 150}ms` }}
              className={`flex flex-col items-center text-center md:items-start md:text-left relative pl-6 md:pl-0 border-l-2 border-dashed border-white/10 md:border-l-0 transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {/* Mobile connecting dot on the dashed line */}
              <div className="absolute top-0 -left-[7px] w-3 h-3 rounded-full bg-[#7c3aed] border-2 border-[#07070f] md:hidden" />

              {/* Number */}
              <div className="font-jakarta font-extrabold text-5xl md:text-6xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent leading-none mb-4 md:mb-5">
                {step.number}
              </div>

              {/* Text */}
              <h3 className="font-jakarta font-bold text-lg md:text-xl text-white mb-2 tracking-tight">
                {step.title}
              </h3>
              <p className="font-sans text-xs md:text-sm text-white/55 leading-relaxed max-w-xs md:max-w-none">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
