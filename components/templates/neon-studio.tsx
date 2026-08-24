"use client";

import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Mail, Linkedin, Twitter, Github, MapPin } from "lucide-react";
import { Syne, Inter, Caveat } from "next/font/google";
import { Experience } from "../ExperienceTimeline";
import Image from "next/image";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string;
  link: string;
  cover: string | null;
}

interface Portfolio {
  name: string;
  headline: string;
  bio: string;
  location: string;
  photo: string | null;
  about: string;
  projects: Project[];
  skills: string;
  email: string;
  linkedin: string;
  twitter: string;
  github: string;
  experience?: Experience[];
}

interface TemplateProps {
  portfolio: Portfolio;
}

const TiltCard = ({
  children,
  className,
  onHoverChange,
}: {
  children: React.ReactNode;
  className?: string;
  onHoverChange?: (mode: "default" | "hover" | "magnetic") => void;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const rotateX = React.useRef(0);
  const rotateY = React.useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Limit rotation to max 6deg
    rotateX.current = -((y - centerY) / centerY) * 6;
    rotateY.current = ((x - centerX) / centerX) * 6;

    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX.current}deg) rotateY(${rotateY.current}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHoverChange) onHoverChange("magnetic");
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHoverChange) onHoverChange("default");
    if (ref.current) {
      ref.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-300 ease-out transform-gpu ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Mouse spotlight overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 rounded-[14px]"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(34, 211, 238, 0.08), transparent 80%)`,
          }}
        />
      )}
      {children}
    </div>
  );
};

export default function NeonStudio({ portfolio }: TemplateProps) {
  const parseTags = (tagsStr: string) => {
    return tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const [cursorMode, setCursorMode] = React.useState<"default" | "hover" | "magnetic">("default");
  const [hasHover, setHasHover] = React.useState(false);

  React.useEffect(() => {
    setHasHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  React.useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const validExperiences = (portfolio.experience || []).filter((exp) => exp.jobTitle && exp.company);

  // Split name for typography multi-line styling
  const nameParts = (portfolio.name || "Your Name").split(" ");

  return (
    <div
      className={`${syne.variable} ${inter.variable} ${caveat.variable} w-full min-h-screen bg-[#0B0B0F] text-[#e2e8f0] py-16 px-6 sm:px-12 md:px-16 overflow-y-auto select-none font-sans relative ${
        hasHover ? "cursor-none" : ""
      }`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Subtle animated noise grain overlay */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes grain {
              0%, 100% { transform:translate(0, 0) }
              10% { transform:translate(-1%, -1%) }
              20% { transform:translate(-2%, 1%) }
              30% { transform:translate(1%, -2%) }
              40% { transform:translate(-1%, 3%) }
              50% { transform:translate(-2%, 1%) }
              60% { transform:translate(1%, 3%) }
              70% { transform:translate(3%, -2%) }
              80% { transform:translate(-2%, 1%) }
              90% { transform:translate(1%, -3%) }
            }
            .animate-grain {
              animation: grain 8s steps(10) infinite;
            }
          `,
        }}
      />
      <div
        className="pointer-events-none fixed -inset-[100%] z-50 opacity-[0.015] animate-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Layered slow animated background blobs */}
      <motion.div
        className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0"
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -70, 50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none z-0"
        animate={{
          x: [0, -80, 50, 0],
          y: [0, 40, -60, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none z-0"
        animate={{
          x: [0, 30, -50, 0],
          y: [0, 50, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating micro particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-[1px] ${
              i % 2 === 0 ? "bg-cyan-400/20" : "bg-purple-400/20"
            }`}
            style={{
              width: `${Math.random() * 4 + 3}px`,
              height: `${Math.random() * 4 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -120 - Math.random() * 120, 0],
              x: [0, Math.sin(i) * 40, 0],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Premium custom cursor */}
      {hasHover && (
        <>
          <motion.div
            className="pointer-events-none fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-400 z-50 mix-blend-difference"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: "-50%",
              translateY: "-50%",
            }}
          />
          <motion.div
            className="pointer-events-none fixed top-0 left-0 rounded-full border border-purple-500/50 bg-purple-500/5 z-50"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: "-50%",
              translateY: "-50%",
              width: 24,
              height: 24,
            }}
            animate={{
              scale: cursorMode === "hover" ? 2.2 : cursorMode === "magnetic" ? 3.0 : 1,
              borderColor: cursorMode === "hover" ? "rgba(34, 211, 238, 0.8)" : "rgba(168, 85, 247, 0.5)",
              backgroundColor: cursorMode === "magnetic" ? "rgba(34, 211, 238, 0.05)" : "rgba(168, 85, 247, 0.02)",
            }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
          />
        </>
      )}

      {/* Main Container */}
      <div className="max-w-[840px] mx-auto flex flex-col gap-28 relative z-10">
        
        {/* ========================================================
            HERO (Creative Stage)
            ======================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 pt-8"
        >
          <div className="flex-1 min-w-0 text-center md:text-left space-y-6">
            
            {/* Studio Location label */}
            {portfolio.location && (
              <div className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] font-mono text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 rounded-full select-none shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>STUDIO LOC: {portfolio.location.toUpperCase()}</span>
              </div>
            )}

            {/* Oversized typography layout */}
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-white font-serif"
              style={{ fontFamily: "var(--font-syne), sans-serif" }}
            >
              {nameParts.map((part, i) => (
                <span key={i} className="block last:text-transparent last:bg-clip-text last:bg-gradient-to-r last:from-cyan-400 last:to-purple-500">
                  {part}
                </span>
              ))}
            </h1>

            <p className="text-lg md:text-xl font-bold uppercase tracking-wider text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.25)]">
              {portfolio.headline || "Creative Director / Developer"}
            </p>

            {portfolio.bio && (
              <div 
                className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-xl p-5 shadow-2xl relative overflow-hidden group max-w-xl"
                onMouseEnter={() => setCursorMode("hover")}
                onMouseLeave={() => setCursorMode("default")}
              >
                <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-cyan-500 to-purple-500" />
                <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                  {portfolio.bio}
                </p>
              </div>
            )}
          </div>

          {/* Morphing Avatar frame */}
          <div className="flex-shrink-0 relative">
            {/* Animated Halo behind image */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-xl animate-pulse pointer-events-none" />
            
            {/* Rotating rings */}
            <div className="absolute -inset-2 border border-dashed border-cyan-500/20 rounded-full animate-[spin_30s_linear_infinite] pointer-events-none" />
            <div className="absolute -inset-6 border border-dashed border-purple-500/10 rounded-full animate-[spin_20s_linear_infinite_reverse] pointer-events-none" />

            {portfolio.photo ? (
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-40 h-40 md:w-48 md:h-48 overflow-hidden bg-slate-900 border border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.15)] select-none pointer-events-none transform-[gpu]"
                style={{
                  animation: "morph 12s ease-in-out infinite",
                }}
              >
                {/* CSS morph animation */}
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes morph {
                    0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
                    100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                  }
                `}} />
                <Image
                  src={portfolio.photo}
                  alt={portfolio.name}
                  fill
                  className="object-cover filter contrast-[1.05]"
                />
              </motion.div>
            ) : (
              <div
                className="w-40 h-40 md:w-48 md:h-48 rounded-full border border-dashed border-cyan-500/35 bg-slate-950/80 flex flex-col items-center justify-center text-cyan-400 text-xs font-semibold shadow-inner"
              >
                <span>STUDIO</span>
                <span className="text-[10px] text-purple-400">CREATIVE</span>
              </div>
            )}
          </div>
        </motion.section>

        {/* ========================================================
            ABOUT (Designer's Notebook)
            ======================================================== */}
        {portfolio.about && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Floating abstract decorative shapes */}
            <div className="absolute -top-10 -right-6 w-16 h-16 rounded-full border border-purple-500/10 pointer-events-none select-none" />
            <div className="absolute -bottom-8 -left-10 w-24 h-24 rounded-full border border-cyan-500/5 pointer-events-none select-none" />

            <div className="space-y-6">
              <h2
                className="text-4xl text-purple-300 font-normal tracking-wide transform rotate-[-1.5deg] block origin-left"
                style={{ fontFamily: "var(--font-caveat), cursive" }}
              >
                &mdash; Designer's Notebook
              </h2>

              <div className="bg-white/[0.015] border border-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative">
                {/* Floating wire attachment detail */}
                <div className="absolute top-3 right-4 font-mono text-[9px] text-[#e2e8f0]/20 select-none tracking-widest uppercase">
                  RECORD // 01-NOTE
                </div>
                
                {/* Split text into paragraphs and fade independently */}
                {portfolio.about.split("\n\n").map((para, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className="text-[15px] sm:text-base leading-relaxed text-slate-350"
                  >
                    {para}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ========================================================
            PROJECTS (Art Exhibits)
            ======================================================== */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <section className="space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 border-b border-white/5 pb-4">
              <h2
                className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider"
                style={{ fontFamily: "var(--font-syne), sans-serif" }}
              >
                Selected Exhibits
              </h2>
              <span className="font-mono text-[10px] text-cyan-400/40 tracking-[0.2em] uppercase">
                EXHIBITS DECK // C.{(portfolio.name || "UN").slice(0, 2).toUpperCase()}
              </span>
            </div>

            <div className="space-y-24">
              {portfolio.projects.map((project, index) => {
                const projectTags = parseTags(project.tags);
                const hasLink = Boolean(project.link);
                const isLeft = index % 2 === 0;

                return (
                  <motion.div
                    key={project.id || index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <TiltCard
                      onHoverChange={setCursorMode}
                      className="w-full relative rounded-2xl overflow-hidden bg-[#12121e]/40 border border-white/5 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-stretch"
                    >
                      {/* Left/Right alignment visual switcher */}
                      <div className={`flex flex-col flex-1 gap-6 justify-between ${isLeft ? "md:order-1" : "md:order-2"}`}>
                        
                        <div className="space-y-4">
                          <div className="font-mono text-[10px] text-purple-400 tracking-[0.2em] uppercase">
                            INSTALLATION {(index + 1).toString().padStart(2, "0")}
                          </div>

                          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                            {project.title || "Untitled Installation"}
                          </h3>

                          <p className="text-sm leading-relaxed text-slate-355">
                            {project.description || "Project exhibit summary."}
                          </p>
                        </div>

                        {/* Interactive Arrow Link */}
                        {hasLink && (
                          <div className="pt-4">
                            <a
                              href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 group/btn font-mono text-xs uppercase tracking-wider text-cyan-300 hover:text-cyan-200 transition-colors"
                              onMouseEnter={() => setCursorMode("hover")}
                              onMouseLeave={() => setCursorMode("magnetic")}
                            >
                              <span>Enter Exhibit</span>
                              <span className="inline-block transform group-hover/btn:translate-x-1.5 transition-transform duration-300">
                                &rarr;
                              </span>
                            </a>
                            {/* Underline link effect */}
                            <div className="w-16 h-[1px] bg-gradient-to-r from-cyan-400 to-transparent mt-1" />
                          </div>
                        )}
                      </div>

                      {/* Image / Canvas Display */}
                      <div className={`w-full md:w-[48%] aspect-[4/3] relative bg-slate-950 rounded-xl overflow-hidden border border-white/5 select-none ${isLeft ? "md:order-2" : "md:order-1"}`}>
                        
                        {/* Floating dynamic tags around the image */}
                        {projectTags.map((tag, tagIndex) => {
                          const positions = [
                            "top-3 left-3",
                            "bottom-3 right-3",
                            "top-3 right-3",
                            "bottom-3 left-3",
                          ];
                          const pos = positions[tagIndex % positions.length];
                          return (
                            <span
                              key={tagIndex}
                              className={`absolute ${pos} z-20 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#0B0B0F]/90 border border-cyan-500/20 text-cyan-300 backdrop-blur-xs shadow-[0_0_10px_rgba(34,211,238,0.15)] pointer-events-none`}
                            >
                              {tag}
                            </span>
                          );
                        })}

                        {project.cover ? (
                          <Image
                            src={project.cover}
                            alt={project.title}
                            fill
                            sizes="(max-w-700px) 100vw, 400px"
                            className="object-cover scale-[1.01] hover:scale-105 transition-transform duration-700 filter contrast-[1.02] opacity-80"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center font-mono">
                            <span className="text-[10px] text-purple-400/50 tracking-widest uppercase">CANVAS RECORD</span>
                            <span className="text-xs text-slate-400 mt-1 uppercase font-bold">{project.title}</span>
                          </div>
                        )}
                      </div>

                    </TiltCard>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================
            EXPERIENCE (Hanging Art Gallery)
            ======================================================== */}
        {validExperiences.length > 0 && (
          <section className="space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 border-b border-white/5 pb-4">
              <h2
                className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider"
                style={{ fontFamily: "var(--font-syne), sans-serif" }}
              >
                Gallery Chronology
              </h2>
              <span className="font-mono text-[10px] text-purple-400/40 tracking-[0.2em] uppercase">
                CAREER TIMELINE // STAGED RECORD
              </span>
            </div>

            <div className="space-y-12 pl-2">
              {validExperiences.map((exp, idx) => {
                const isCurrent = exp.isCurrent;
                
                return (
                  <motion.div
                    key={exp.id || idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="relative pt-12 pb-4"
                  >
                    {/* Hanging wire */}
                    <div className="absolute top-0 left-12 w-[1px] h-12 bg-gradient-to-b from-cyan-500/40 to-cyan-500/10 pointer-events-none" />

                    <div 
                      className={`relative bg-[#12121e]/50 border border-white/5 rounded-2xl p-6 shadow-2xl hover:border-cyan-500/20 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start ${
                        isCurrent ? "shadow-[0_0_30px_rgba(34,211,238,0.05)] border-cyan-500/15" : ""
                      }`}
                    >
                      {/* Logo Container (Illuminated Circle) */}
                      <div className="relative flex-shrink-0 z-10 mt-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold uppercase border bg-slate-950 ${
                          isCurrent 
                            ? "border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)]" 
                            : "border-white/10 text-slate-400"
                        }`}>
                          {exp.companyLogo ? (
                            <Image
                              src={exp.companyLogo}
                              alt={exp.company}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            exp.company.slice(0, 2)
                          )}
                        </div>
                        {isCurrent && (
                          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#0B0B0F] animate-pulse" />
                        )}
                      </div>

                      {/* Main details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2">
                          <h4 className="text-lg font-bold text-white tracking-tight">
                            {exp.jobTitle}
                          </h4>
                          <span className="font-mono text-[10px] sm:text-xs text-purple-300/80 bg-purple-500/5 border border-purple-500/10 px-2.5 py-0.5 rounded-full select-none">
                            {exp.startMonth.slice(0, 3).toUpperCase()} {exp.startYear} &ndash; {isCurrent ? "PRESENT" : `${exp.endMonth.slice(0, 3).toUpperCase()} ${exp.endYear}`}
                          </span>
                        </div>

                        <p className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                          {exp.company} &bull; {exp.employmentType}
                        </p>
                        {exp.location && (
                          <p className="text-[10px] text-slate-400/80">
                            {exp.location} ({exp.locationType})
                          </p>
                        )}
                        <p className="text-sm text-slate-300 leading-relaxed font-light pt-1">
                          {exp.description}
                        </p>

                        {exp.skills && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {exp.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill, sIdx) => (
                              <span key={sIdx} className="text-[9px] font-mono border border-white/5 bg-white/[0.02] px-2 py-0.5 text-slate-400 uppercase tracking-widest rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================
            SKILLS (Drifting Capsules)
            ======================================================== */}
        {portfolio.skills && (
          <section className="space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 border-b border-white/5 pb-4">
              <h2
                className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider"
                style={{ fontFamily: "var(--font-syne), sans-serif" }}
              >
                Competency Install
              </h2>
              <span className="font-mono text-[10px] text-cyan-400/40 tracking-[0.2em] uppercase">
                ORGANIC SYSTEM // DRIFTING NODES
              </span>
            </div>

            {/* Drifting Capsule Field */}
            <div className="flex flex-wrap justify-center gap-4 py-8">
              {parseTags(portfolio.skills).map((skill, index) => {
                return (
                  <motion.div
                    key={index}
                    className={`inline-block px-5 py-2.5 rounded-full border text-xs sm:text-sm font-semibold select-none cursor-default relative overflow-hidden group ${
                      index % 2 === 0
                        ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-300 hover:border-cyan-400 hover:text-white"
                        : "bg-purple-500/5 border-purple-500/20 text-purple-300 hover:border-purple-400 hover:text-white"
                    }`}
                    style={{
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                    animate={{
                      y: [0, Math.sin(index) * 12, 0],
                      x: [0, Math.cos(index) * 10, 0],
                      rotate: [0, index % 2 === 0 ? 3 : -3, 0],
                    }}
                    transition={{
                      duration: 6 + (index % 3) * 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    whileHover={{
                      scale: 1.08,
                      y: -5,
                      boxShadow: index % 2 === 0 ? "0 0 20px rgba(34,211,238,0.25)" : "0 0 20px rgba(168,85,247,0.25)",
                    }}
                    onMouseEnter={() => setCursorMode("hover")}
                    onMouseLeave={() => setCursorMode("default")}
                  >
                    {skill}
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ========================================================
            CONTACT (Neon Studio Sign)
            ======================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-16 border-t border-white/5 flex flex-col items-center justify-center text-center gap-12 relative overflow-hidden"
        >
          {/* Neon Sign title */}
          <div className="space-y-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-400/50 uppercase select-none">
              CONNECTION GATEWAY
            </span>
            
            <h2 
              className="text-4xl sm:text-5xl font-black text-white uppercase tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              style={{ fontFamily: "var(--font-syne), sans-serif" }}
            >
              Sign Off
            </h2>
          </div>

          {/* Large glowing email */}
          {portfolio.email && (
            <div 
              className="relative py-2 group"
              onMouseEnter={() => setCursorMode("hover")}
              onMouseLeave={() => setCursorMode("default")}
            >
              <a
                href={`mailto:${portfolio.email}`}
                className="text-2xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-transform duration-300 inline-block hover:scale-[1.02]"
              >
                {portfolio.email}
              </a>
              <div className="w-0 group-hover:w-full h-[1px] bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 transition-all duration-500 mt-2" />
            </div>
          )}

          {/* Circle buttons and reflections */}
          <div className="relative pt-6 flex flex-col items-center">
            
            <div className="flex items-center gap-4">
              {portfolio.linkedin && (
                <a
                  href={portfolio.linkedin.startsWith("http") ? portfolio.linkedin : `https://${portfolio.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 text-slate-400 hover:text-cyan-300 hover:border-cyan-400 bg-white/[0.02] border border-white/10 rounded-full transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                  title="LinkedIn"
                  onMouseEnter={() => setCursorMode("hover")}
                  onMouseLeave={() => setCursorMode("default")}
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {portfolio.twitter && (
                <a
                  href={portfolio.twitter.startsWith("http") ? portfolio.twitter : `https://${portfolio.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 text-slate-400 hover:text-cyan-300 hover:border-cyan-400 bg-white/[0.02] border border-white/10 rounded-full transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                  title="Twitter/X"
                  onMouseEnter={() => setCursorMode("hover")}
                  onMouseLeave={() => setCursorMode("default")}
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {portfolio.github && (
                <a
                  href={portfolio.github.startsWith("http") ? portfolio.github : `https://${portfolio.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 text-slate-400 hover:text-cyan-300 hover:border-cyan-400 bg-white/[0.02] border border-white/10 rounded-full transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                  title="GitHub"
                  onMouseEnter={() => setCursorMode("hover")}
                  onMouseLeave={() => setCursorMode("default")}
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Soft desk/floor reflection beneath icons */}
            <div className="absolute top-[80px] left-0 right-0 h-10 opacity-20 pointer-events-none select-none blur-[2px] scale-y-[-1] origin-top bg-gradient-to-b from-cyan-400 to-transparent flex items-center justify-center gap-4">
              {portfolio.linkedin && <div className="w-5 h-5 rounded-full bg-cyan-400/20" />}
              {portfolio.twitter && <div className="w-5 h-5 rounded-full bg-cyan-400/20" />}
              {portfolio.github && <div className="w-5 h-5 rounded-full bg-cyan-400/20" />}
            </div>
          </div>

          {/* Footer bar */}
          <div className="pt-16 text-[10px] font-mono tracking-widest text-slate-500 uppercase space-y-2">
            <p>&copy; {new Date().getFullYear()} {portfolio.name}. All exhibits archived.</p>
            <p className="opacity-40">Creative Studio Edition // FolioFast</p>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
