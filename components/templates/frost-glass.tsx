"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, Linkedin, Twitter, Github, MapPin, ArrowUpRight, Sparkles } from "lucide-react";
import { Experience } from "../ExperienceTimeline";
import Image from "next/image";
import React from "react";

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

// Helper to parse comma-separated tags
const parseTags = (tagsStr: string) => {
  return tagsStr
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

// Static particles for SSR hydration safety
const PARTICLES = [
  { id: 1, top: "12%", left: "8%", size: 3, duration: 14, delay: 0 },
  { id: 2, top: "28%", left: "85%", size: 4, duration: 18, delay: 2 },
  { id: 3, top: "42%", left: "15%", size: 2, duration: 10, delay: 1 },
  { id: 4, top: "62%", left: "75%", size: 3, duration: 22, delay: 3 },
  { id: 5, top: "78%", left: "12%", size: 5, duration: 16, delay: 0 },
  { id: 6, top: "92%", left: "82%", size: 2, duration: 12, delay: 4 },
  { id: 7, top: "35%", left: "55%", size: 3, duration: 19, delay: 2 },
  { id: 8, top: "72%", left: "45%", size: 2, duration: 13, delay: 1 },
  { id: 9, top: "52%", left: "92%", size: 3, duration: 17, delay: 5 },
  { id: 10, top: "20%", left: "40%", size: 4, duration: 21, delay: 1.5 },
];

// Staggered floating container for panels
function FloatingIsland({ children, index, className = "" }: { children: React.ReactNode; index: number; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      animate={shouldReduceMotion ? { y: 0 } : {
        y: [0, -10, 0]
      }}
      transition={shouldReduceMotion ? { duration: 0.1 } : {
        y: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.4
        },
        opacity: { duration: 0.8 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Cursor-reflective glass card component
interface SpatialCardProps {
  children: React.ReactNode;
  className?: string;
}

function SpatialCard({ children, className = "" }: SpatialCardProps) {
  const [coords, setCoords] = React.useState({ x: 50, y: 50 });
  const [hovering, setHovering] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      whileHover={shouldReduceMotion ? {} : { 
        y: -6,
        scale: 1.015,
        borderColor: "rgba(255, 255, 255, 0.28)",
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`relative overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-colors duration-300 ${className}`}
    >
      {/* Light Reflection Highlight shifting with cursor */}
      {!shouldReduceMotion && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            opacity: hovering ? 1 : 0,
            background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(255, 255, 255, 0.12) 0%, transparent 60%)`,
          }}
        />
      )}
      {children}
    </motion.div>
  );
}

// Organic bubble motions for skills
const BUBBLE_MOTIONS = [
  { y: [0, -8, 0], x: [0, 4, 0], duration: 5, delay: 0 },
  { y: [0, -6, 0], x: [0, -3, 0], duration: 4.5, delay: 0.8 },
  { y: [0, -10, 0], x: [0, 3, 0], duration: 6, delay: 0.3 },
  { y: [0, -7, 0], x: [0, -4, 0], duration: 5.2, delay: 1.2 },
  { y: [0, -9, 0], x: [0, 5, 0], duration: 4.8, delay: 1.6 },
];

// Helper to calculate experience months length
const calculateMonths = (exp: Experience): string => {
  const startDate = new Date(`${exp.startMonth} 1, ${exp.startYear}`);
  const endDate = exp.isCurrent ? new Date() : new Date(`${exp.endMonth} 1, ${exp.endYear}`);
  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
  if (months < 0) months = 0;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) return `${remainingMonths} mos`;
  if (remainingMonths === 0) return `${years} yr`;
  return `${years} yr ${remainingMonths} mos`;
};

export default function FrostGlass({ portfolio }: TemplateProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="w-full min-h-screen bg-[#070814] text-white py-20 px-6 sm:px-12 md:px-16 overflow-y-auto select-none font-sans relative"
      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
    >
      {/* BACKGROUND EFFECTS: Shifting spatial auroras */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Shifting light blob 1 (Purple) */}
        <motion.div
          animate={shouldReduceMotion ? { opacity: 0.25 } : {
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-purple-600/25 rounded-full blur-[120px]"
        />

        {/* Shifting light blob 2 (Blue/Indigo) */}
        <motion.div
          animate={shouldReduceMotion ? { opacity: 0.25 } : {
            x: [0, -30, 30, 0],
            y: [0, 40, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[30%] -right-[10%] w-[45vw] h-[45vw] bg-indigo-600/25 rounded-full blur-[120px]"
        />

        {/* Shifting light blob 3 (Pink/Fuchsia) */}
        <motion.div
          animate={shouldReduceMotion ? { opacity: 0.25 } : {
            x: [0, 20, -40, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-[10%] left-[20%] w-[40vw] h-[40vw] bg-pink-600/20 rounded-full blur-[100px]"
        />

        {/* Shifting ambient particles */}
        {!shouldReduceMotion && PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white opacity-20 blur-[0.5px]"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, 15, 0],
              opacity: [0.15, 0.5, 0.15],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* FOREGROUND CONTENT: Floating glass islands */}
      <div className="max-w-[720px] mx-auto flex flex-col gap-16 relative z-10 pb-24">
        
        {/* HERO SECTION */}
        <FloatingIsland index={0}>
          <SpatialCard className="p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-8 relative">
            <div className="flex-1 min-w-0 text-center sm:text-left space-y-3">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-white/50 text-[10px] uppercase font-mono tracking-widest">
                <Sparkles className="w-3 h-3 text-[#a78bfa]" />
                <span>SPATIAL INTERFACE ACTIVATED</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {portfolio.name || "Your Name"}
              </h1>
              
              <p className="text-xs sm:text-sm font-semibold text-[#a78bfa] uppercase tracking-wider">
                {portfolio.headline || "Your Headline"}
              </p>

              {portfolio.location && (
                <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-white/60 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-white/70" />
                  <span>{portfolio.location}</span>
                </div>
              )}

              {portfolio.bio && (
                <p className="text-[14px] text-white/80 mt-4 leading-relaxed whitespace-pre-wrap">
                  {portfolio.bio}
                </p>
              )}
            </div>

            {/* Embedded 3D Layered Bezel Image */}
            {portfolio.photo ? (
              <div className="relative w-32 h-32 flex-shrink-0 group select-none">
                {/* Back glowing halo */}
                <div className="absolute inset-0 rounded-3xl bg-purple-500/20 blur-xl opacity-5 group-hover:opacity-60 transition-opacity" />
                
                {/* Middle glass card photo */}
                <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-white/5 relative z-10 shadow-lg">
                  <Image
                    src={portfolio.photo}
                    alt={`${portfolio.name} profile photo`}
                    fill
                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500"
                    sizes="128px"
                    priority
                  />
                </div>

                {/* Outer floating frosted frame with glass bevel shadow */}
                <div className="absolute -inset-1.5 rounded-[28px] border border-white/25 bg-white/[0.03] backdrop-blur-[2px] z-20 pointer-events-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]" />
              </div>
            ) : null}
          </SpatialCard>
        </FloatingIsland>

        {/* ABOUT SECTION */}
        {portfolio.about && (
          <FloatingIsland index={1}>
            <SpatialCard className="p-8 sm:p-10 space-y-4">
              <h2 className="text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] font-mono">[ 01 / ABOUT ]</h2>
              <div className="text-[14px] leading-relaxed text-white/80 whitespace-pre-wrap">
                {portfolio.about}
              </div>
            </SpatialCard>
          </FloatingIsland>
        )}

        {/* PROJECTS SECTION */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <FloatingIsland index={2}>
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] font-mono">[ 02 / PROJECTS ]</h2>
                <span className="text-[9px] font-mono text-white/30 uppercase">SYSTEM_INDEX: {portfolio.projects.length} ITEMS</span>
              </div>

              {/* Sub-islands for projects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {portfolio.projects.map((project, idx) => {
                  const projectTags = parseTags(project.tags);
                  const hasLink = Boolean(project.link);

                  const CardContent = () => (
                    <SpatialCard className="p-6 h-full flex flex-col justify-between group">
                      <div className="space-y-4">
                        {/* Dynamic cover photo or placeholder inside card */}
                        <div className="aspect-[16/10] overflow-hidden rounded-2xl relative bg-white/5 border border-white/5 shadow-inner">
                          {project.cover ? (
                            <Image
                              src={project.cover}
                              alt={project.title}
                              fill
                              className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                              sizes="(max-w-768px) 100vw, 50vw"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br from-indigo-950/40 to-purple-950/40 relative font-mono text-[9px] text-white/35">
                              <span>NO_COVER_ATTACHED</span>
                              <span className="text-2xl font-black text-white/5 tracking-tighter block leading-none select-none">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <span className="font-sans font-bold text-xs text-white/80 pr-6 uppercase leading-tight select-none">
                                {project.title || "Untitled"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-sm text-white group-hover:text-[#a78bfa] transition-colors leading-tight">
                              {project.title || "Untitled Project"}
                            </h3>
                            {hasLink && (
                              <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                            )}
                          </div>
                          
                          <p className="text-xs text-white/70 leading-relaxed line-clamp-3 font-sans">
                            {project.description || "Project description goes here."}
                          </p>
                        </div>
                      </div>

                      {projectTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-6 border-t border-white/5 pt-4">
                          {projectTags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-mono"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </SpatialCard>
                  );

                  return (
                    <div key={project.id} className="h-full">
                      {hasLink ? (
                        <a
                          href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full"
                        >
                          <CardContent />
                        </a>
                      ) : (
                        <CardContent />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </FloatingIsland>
        )}

        {/* EXPERIENCE SECTION */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <FloatingIsland index={3}>
            <div className="space-y-6">
              <h2 className="text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] font-mono px-2">[ 03 / EXPERIENCE ]</h2>
              
              {/* Floating Spatial Timeline */}
              <div className="relative pl-8 sm:pl-10 space-y-8 select-none">
                {/* Glowing vertical track */}
                <div className="absolute left-[13px] sm:left-[17px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#a78bfa]/60 via-[#ec4899]/25 to-blue-500/60 blur-[0.5px]" />
                
                {portfolio.experience
                  .filter((exp) => exp.jobTitle && exp.company)
                  .map((exp, idx) => {
                    const start = `${exp.startMonth.slice(0, 3)} ${exp.startYear}`;
                    const end = exp.isCurrent ? 'Present' : `${exp.endMonth.slice(0, 3)} ${exp.endYear}`;
                    const parsedSkills = exp.skills
                      ? exp.skills.split(",").map((s) => s.trim()).filter(Boolean)
                      : [];

                    return (
                      <div key={exp.id || idx} className="relative">
                        {/* Drifting Indicator Node */}
                        <motion.div
                          animate={shouldReduceMotion ? { y: 0 } : { y: [0, -5, 0] }}
                          transition={shouldReduceMotion ? { duration: 0.1 } : {
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: idx * 0.4,
                          }}
                          className="absolute left-[-23px] sm:left-[-27px] top-[26px] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#a78bfa] border-2 border-[#070814] shadow-lg flex items-center justify-center z-20"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </motion.div>

                        {/* Experience Spatial glass card */}
                        <SpatialCard className="p-6 sm:p-8 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                              {exp.companyLogo ? (
                                <img 
                                  src={exp.companyLogo} 
                                  alt={exp.company} 
                                  className="w-8 h-8 object-contain rounded-lg border border-white/10 bg-white/5"
                                />
                              ) : (
                                <div className="w-8 h-8 flex items-center justify-center bg-white/10 text-white rounded-lg font-mono text-[10px] font-bold border border-white/15">
                                  {exp.company.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <h3 className="font-bold text-base text-white">{exp.jobTitle}</h3>
                                <div className="text-xs text-[#a78bfa] font-semibold">{exp.company}</div>
                              </div>
                            </div>

                            <div className="text-[10px] sm:text-xs text-white/50 font-mono font-medium text-left sm:text-right">
                              <div>{start} – {end}</div>
                              <div className="text-[10px] text-[#a78bfa]/70 mt-0.5 uppercase tracking-wider">{exp.employmentType}</div>
                            </div>
                          </div>

                          {exp.description && (
                            <p className="text-xs text-white/70 leading-relaxed font-sans whitespace-pre-wrap">
                              {exp.description}
                            </p>
                          )}

                          {parsedSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-2">
                              {parsedSkills.map((skill, sIdx) => (
                                <span 
                                  key={sIdx} 
                                  className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/60 font-mono border border-white/5"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </SpatialCard>
                      </div>
                    );
                  })}
              </div>
            </div>
          </FloatingIsland>
        )}

        {/* SKILLS SECTION */}
        {portfolio.skills && (
          <FloatingIsland index={4}>
            <SpatialCard className="p-8 sm:p-10 space-y-6 overflow-visible">
              <h2 className="text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] font-mono">[ 04 / SKILLS ]</h2>
              
              {/* Organic placement: glass bubble cloud */}
              <div className="flex flex-wrap gap-3.5 justify-center pt-2">
                {parseTags(portfolio.skills).map((skill, index) => {
                  const motionIndex = index % BUBBLE_MOTIONS.length;
                  const m = BUBBLE_MOTIONS[motionIndex];
                  
                  return (
                    <motion.div
                      key={index}
                      animate={shouldReduceMotion ? { y: 0, x: 0 } : {
                        y: m.y,
                        x: m.x,
                      }}
                      transition={shouldReduceMotion ? { duration: 0.1 } : {
                        duration: m.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: m.delay,
                      }}
                      className="px-4.5 py-2.5 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/15 text-xs sm:text-sm font-semibold select-none cursor-default text-white shadow-md hover:bg-white/[0.12] hover:border-white/30 transition-all duration-200"
                    >
                      {skill}
                    </motion.div>
                  );
                })}
              </div>
            </SpatialCard>
          </FloatingIsland>
        )}

        {/* CONTACT SECTION */}
        <FloatingIsland index={5} className="relative">
          <SpatialCard className="p-8 sm:p-10 space-y-6 relative overflow-hidden">
            {/* Glowing mist glow within card */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/[0.04] to-transparent opacity-60 mix-blend-overlay pointer-events-none" />

            <h2 className="text-[10px] uppercase font-bold tracking-widest text-[#a78bfa] font-mono">[ 05 / CONTACT ]</h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/5 pb-6">
              <p className="text-sm text-white/80 leading-relaxed font-sans max-w-sm text-center sm:text-left">
                Get in touch to collaborate or discuss opportunities.
              </p>
              
              {portfolio.email && (
                <a
                  href={`mailto:${portfolio.email}`}
                  className="px-5 py-2.5 rounded-full bg-white text-[#070814] text-xs font-bold hover:bg-white/90 hover:scale-105 transition-all shadow-md inline-block uppercase tracking-wider whitespace-nowrap"
                >
                  Write Message
                </a>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-[10px] font-mono select-none">
              <p>
                &copy; {new Date().getFullYear()} {portfolio.name || "PORTFOLIO"}.
              </p>
              
              <div className="flex items-center gap-2">
                {portfolio.email && (
                  <a
                    href={`mailto:${portfolio.email}`}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all border border-white/5"
                    title="Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                )}
                {portfolio.linkedin && (
                  <a
                    href={portfolio.linkedin.startsWith("http") ? portfolio.linkedin : `https://${portfolio.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all border border-white/5"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                )}
                {portfolio.twitter && (
                  <a
                    href={portfolio.twitter.startsWith("http") ? portfolio.twitter : `https://${portfolio.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all border border-white/5"
                    title="Twitter/X"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                  </a>
                )}
                {portfolio.github && (
                  <a
                    href={portfolio.github.startsWith("http") ? portfolio.github : `https://${portfolio.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all border border-white/5"
                    title="GitHub"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </SpatialCard>
        </FloatingIsland>
      </div>

      {/* Disappears into mist: bottom fog/mist gradient mask */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070814] via-[#070814]/75 to-transparent pointer-events-none z-20" />
    </div>
  );
}
