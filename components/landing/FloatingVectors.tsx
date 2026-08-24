"use client";

import React from "react";

interface ShapeConfig {
  type: "circle" | "triangle" | "blob" | "cross" | "diamond";
  top: string;
  left: string;
  size: number;
  mobileSize: number;
  animationClass: string;
  duration: string;
  color: string;
  mobileHidden?: boolean;
}

const SHAPES: ShapeConfig[] = [
  // 6 Shapes shown on both mobile and desktop (smaller sizes on mobile)
  {
    type: "circle",
    top: "10%",
    left: "8%",
    size: 60,
    mobileSize: 35,
    animationClass: "animate-float-a",
    duration: "14s",
    color: "rgba(139,92,246,0.14)",
  },
  {
    type: "triangle",
    top: "22%",
    left: "84%",
    size: 50,
    mobileSize: 30,
    animationClass: "animate-float-b",
    duration: "16s",
    color: "rgba(99,102,241,0.12)",
  },
  {
    type: "blob",
    top: "38%",
    left: "5%",
    size: 70,
    mobileSize: 45,
    animationClass: "animate-float-c",
    duration: "20s",
    color: "rgba(139,92,246,0.1)",
  },
  {
    type: "cross",
    top: "15%",
    left: "45%",
    size: 40,
    mobileSize: 25,
    animationClass: "animate-float-b",
    duration: "11s",
    color: "rgba(99,102,241,0.08)",
  },
  {
    type: "diamond",
    top: "58%",
    left: "88%",
    size: 45,
    mobileSize: 28,
    animationClass: "animate-float-a",
    duration: "13s",
    color: "rgba(139,92,246,0.13)",
  },
  {
    type: "circle",
    top: "72%",
    left: "12%",
    size: 80,
    mobileSize: 50,
    animationClass: "animate-float-c",
    duration: "22s",
    color: "rgba(99,102,241,0.11)",
  },

  // 8 Shapes hidden on mobile, visible only on desktop
  {
    type: "triangle",
    top: "86%",
    left: "78%",
    size: 55,
    mobileSize: 0,
    animationClass: "animate-float-b",
    duration: "15s",
    color: "rgba(139,92,246,0.12)",
    mobileHidden: true,
  },
  {
    type: "cross",
    top: "48%",
    left: "72%",
    size: 44,
    mobileSize: 0,
    animationClass: "animate-float-a",
    duration: "10s",
    color: "rgba(99,102,241,0.09)",
    mobileHidden: true,
  },
  {
    type: "diamond",
    top: "30%",
    left: "22%",
    size: 36,
    mobileSize: 0,
    animationClass: "animate-float-c",
    duration: "12s",
    color: "rgba(139,92,246,0.11)",
    mobileHidden: true,
  },
  {
    type: "blob",
    top: "65%",
    left: "38%",
    size: 75,
    mobileSize: 0,
    animationClass: "animate-float-b",
    duration: "18s",
    color: "rgba(99,102,241,0.08)",
    mobileHidden: true,
  },
  {
    type: "circle",
    top: "5%",
    left: "90%",
    size: 50,
    mobileSize: 0,
    animationClass: "animate-float-c",
    duration: "19s",
    color: "rgba(139,92,246,0.1)",
    mobileHidden: true,
  },
  {
    type: "triangle",
    top: "50%",
    left: "14%",
    size: 46,
    mobileSize: 0,
    animationClass: "animate-float-a",
    duration: "15s",
    color: "rgba(99,102,241,0.12)",
    mobileHidden: true,
  },
  {
    type: "cross",
    top: "80%",
    left: "48%",
    size: 42,
    mobileSize: 0,
    animationClass: "animate-float-c",
    duration: "13s",
    color: "rgba(139,92,246,0.09)",
    mobileHidden: true,
  },
  {
    type: "diamond",
    top: "92%",
    left: "18%",
    size: 48,
    mobileSize: 0,
    animationClass: "animate-float-b",
    duration: "17s",
    color: "rgba(99,102,241,0.11)",
    mobileHidden: true,
  },
];

const ShapeRenderer: React.FC<{ shape: ShapeConfig }> = ({ shape }) => {
  const getSvgContent = () => {
    switch (shape.type) {
      case "circle":
        return <circle cx="20" cy="20" r="18" fill="none" />;
      case "triangle":
        return <polygon points="20,4 36,34 4,34" fill="none" />;
      case "diamond":
        return <polygon points="20,4 34,20 20,36 6,20" fill="none" />;
      case "cross":
        return <path d="M20,6 L20,34 M6,20 L34,20" />;
      case "blob":
        return (
          <path
            d="M20,6 C28,8 34,14 36,22 C38,30 38,38 32,44 C26,50 14,52 8,46 C2,40 0,30 2,22 C4,14 10,8 20,6 Z"
            fill="none"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: shape.top,
        left: shape.left,
        animationDuration: shape.duration,
      }}
      className={`pointer-events-none select-none ${shape.animationClass} ${
        shape.mobileHidden ? "hidden md:block" : "block"
      }`}
    >
      <svg
        viewBox="0 0 40 40"
        className="stroke-[0.7px] md:stroke-[1px] w-[var(--mobile-w)] h-[var(--mobile-w)] md:w-[var(--desktop-w)] md:h-[var(--desktop-w)]"
        style={
          {
            "--mobile-w": `${shape.mobileSize}px`,
            "--desktop-w": `${shape.size}px`,
            stroke: shape.color,
          } as React.CSSProperties
        }
      >
        {getSvgContent()}
      </svg>
    </div>
  );
};

export default function FloatingVectors() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* 3 Large Ambient Glow Blobs */}
      {/* Blob 1: top-left area */}
      <div 
        className="fixed top-0 left-0 -translate-x-[20%] -translate-y-[20%] rounded-full opacity-60 mix-blend-screen pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)",
          filter: "blur(120px)",
        }}
      />

      {/* Blob 2: top-right area */}
      <div 
        className="fixed top-0 right-0 translate-x-[20%] -translate-y-[20%] rounded-full opacity-60 mix-blend-screen pointer-events-none"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 65%)",
          filter: "blur(100px)",
        }}
      />

      {/* Blob 3: center-bottom */}
      <div 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 translate-y-[20%] rounded-full opacity-60 mix-blend-screen pointer-events-none"
        style={{
          width: "700px",
          height: "400px",
          background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 65%)",
          filter: "blur(150px)",
        }}
      />

      {/* SVG Vectors Floating overlay */}
      <div className="absolute inset-0 w-full h-full">
        {SHAPES.map((shape, index) => (
          <ShapeRenderer key={index} shape={shape} />
        ))}
      </div>
    </div>
  );
}
