"use client";

import React from "react";

export default function SocialProof() {
  const statItem = "2,400+ portfolios created &nbsp;&middot;&nbsp; 12 premium templates &nbsp;&middot;&nbsp; 4.9★ rating from early users &nbsp;&middot;&nbsp; 100% serverless hosting &nbsp;&middot;&nbsp;";

  // Repeat the content to create a seamless marquee loop
  const repeatedStats = Array(8).fill(statItem);

  return (
    <div className="w-full bg-white/[0.02] border-t border-b border-white/[0.05] py-4 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        {/* Marquee Track */}
        <div className="flex gap-4 whitespace-nowrap animate-marquee-fast hover:[animation-play-state:paused] pointer-events-auto">
          {repeatedStats.map((item, index) => (
            <span
              key={index}
              className="text-xs md:text-sm font-jakarta font-medium tracking-[0.06em] text-white/40 flex items-center"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
