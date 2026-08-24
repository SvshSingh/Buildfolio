"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, Linkedin, Twitter, Github, MapPin, ArrowUpRight, Plus } from "lucide-react";
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

// Copy calculateMonths logic to make template independent and self-contained
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

// Text reveal animation using overflow hidden container (clipping mask)
function RevealText({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className={`overflow-hidden inline-block ${className}`}>
      <motion.div
        initial={shouldReduceMotion ? { y: 0 } : { y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Technical engineering-style ruler component
function TechnicalRuler({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-8 border-b border-black/15 relative overflow-hidden font-mono text-[7px] text-neutral-400 select-none ${className}`}>
      <div className="absolute inset-0 flex justify-between items-end pb-1 px-1">
        {Array.from({ length: 41 }).map((_, i) => {
          const isMajor = i % 10 === 0;
          const isMedium = i % 5 === 0 && !isMajor;
          return (
            <div key={i} className="flex flex-col items-center justify-end h-full">
              {isMajor && <span className="mb-0.5 font-semibold text-neutral-500">{String(i * 2.5).padStart(2, '0')}</span>}
              <div 
                className={`w-[1px] ${isMajor ? 'bg-black/40' : 'bg-black/20'}`} 
                style={{ height: isMajor ? '8px' : isMedium ? '6px' : '4px' }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Section Header with border line animation drawing itself
function SectionHeader({ num, title }: { num: string; title: string }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="w-full pt-4 pb-12 flex justify-between items-start select-none relative">
      <motion.div 
        className="absolute top-0 left-0 right-0 h-[2px] bg-black"
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "left" }}
      />
      <div className="absolute -top-[1.5px] left-0 w-8 h-[2px] bg-black" />
      <div>
        <span className="font-mono text-[9px] block text-neutral-400 font-semibold tracking-wider mb-2">SEC. {num} / CATEGORY</span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none text-black">
          <RevealText>{title}</RevealText>
        </h2>
      </div>
      <div className="font-mono text-right text-[8px] text-neutral-400 leading-normal font-semibold">
        <div>[ STATUS: STABLE ]</div>
        <div>[ COORD: X.{num} / Y.09 ]</div>
      </div>
    </div>
  );
}

// Grid lines that animate on mount (drawing themselves)
function GridBackground() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <div className="max-w-5xl mx-auto h-full px-6 sm:px-12 md:px-16 relative">
        <div className="absolute inset-y-0 left-6 sm:left-12 md:left-16 right-6 sm:right-12 md:right-16 flex justify-between">
          {Array.from({ length: 13 }).map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="h-full w-[1px] bg-black/[0.04] relative"
              initial={shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
              style={{ transformOrigin: "top" }}
            >
              {/* Coordinate label markers on internal grid lines */}
              {i > 0 && i < 12 && (
                <span className="absolute top-2 left-1 font-mono text-[6px] text-neutral-300 hidden md:block">
                  C{String(i + 1).padStart(2, '0')}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GridModern({ portfolio }: TemplateProps) {
  const shouldReduceMotion = useReducedMotion();

  // Name split into individual uppercase words for staggered layout
  const nameWords = (portfolio.name || "YOUR NAME").toUpperCase().split(" ").filter(Boolean);

  return (
    <div className="w-full min-h-screen bg-[#ffffff] text-black relative select-none overflow-x-hidden font-sans antialiased">
      {/* Self-drawing vertical grid background lines */}
      <GridBackground />

      {/* Margins measurements & Ruler at the very top of page */}
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-12 md:px-16 pt-4 relative z-10 flex justify-between items-center select-none font-mono text-[8px] text-neutral-400 font-semibold uppercase">
        <span>[ REF_009 / SWISS_SHEET ]</span>
        <span>[ MARGIN_L: 64PX / MARGIN_R: 64PX ]</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col gap-16 relative z-10">
        
        {/* HERO SECTION - 12 COL poster-like exhibition poster */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pt-12 md:pt-20 pb-12 border-b border-black/[0.08] relative"
        >
          {/* Header element on the poster */}
          <div className="col-span-1 md:col-span-12 flex justify-between items-center border-b border-black pb-4 select-none">
            <div className="font-mono text-[9px] uppercase tracking-wider font-bold text-neutral-400 flex gap-4">
              <span>SERIES: FOLIOFAST_NO.10</span>
              <span className="hidden sm:inline">GRID: 12-COLUMNS</span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-wider font-bold text-neutral-400">
              <span>EXHIBITION CHRONOLOGY: {new Date().getFullYear()}</span>
            </div>
          </div>

          {/* Staggered Title Names (Col 1-8) */}
          <div className="col-span-1 md:col-span-8 flex flex-col justify-between">
            <div className="flex flex-col tracking-tighter leading-[0.8] select-none text-black">
              {nameWords.map((word, wIdx) => {
                // Dynamically offset name rows
                const offsets = ["pl-0", "pl-8 sm:pl-16 md:pl-20", "pl-16 sm:pl-32 md:pl-40"];
                const offsetClass = offsets[wIdx % offsets.length];
                return (
                  <RevealText 
                    key={wIdx} 
                    className={`text-6xl sm:text-8xl md:text-9xl font-black ${offsetClass} block`} 
                    delay={wIdx * 0.1}
                  >
                    {word}
                  </RevealText>
                );
              })}
            </div>

            {/* Headline and Location */}
            <div className="mt-8 md:mt-12 space-y-4">
              <div className="border-t border-black pt-4 max-w-xl">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black leading-snug">
                  <RevealText delay={0.3}>{portfolio.headline || "YOUR HEADLINE"}</RevealText>
                </h2>
              </div>
              
              {portfolio.location && (
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-neutral-600" />
                  <span>{portfolio.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cropped Profile Image (Col 9-12) */}
          <div className="col-span-1 md:col-span-4 flex justify-center md:justify-end items-start md:pt-4">
            <div className="relative aspect-square w-full max-w-[280px] md:max-w-full border border-black p-2 bg-white flex items-center justify-center select-none">
              {/* Geometric Crop Marks */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-black" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t border-r border-black" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b border-l border-black" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-black" />
              <Plus className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 text-black/20 pointer-events-none" />
              <Plus className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 text-black/20 pointer-events-none" />
              
              {/* Profile Photo cropped inside perfect geometric shape (circle nested inside square borders) */}
              <div className="w-full h-full overflow-hidden rounded-full relative bg-neutral-100 border border-neutral-200">
                {portfolio.photo ? (
                  <Image
                    src={portfolio.photo}
                    alt={portfolio.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-neutral-400 font-mono text-[9px] tracking-widest select-none">
                    <span>NO PHOTO</span>
                    <span>IMG_CELL_09</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stretched technical ruler inside hero */}
          <div className="col-span-1 md:col-span-12 mt-4">
            <TechnicalRuler />
          </div>

          {/* Bio paragraph (Col 1-8) */}
          {portfolio.bio && (
            <div className="col-span-1 md:col-span-8 mt-4">
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed max-w-2xl whitespace-pre-wrap font-sans">
                {portfolio.bio}
              </p>
            </div>
          )}
        </motion.section>

        {/* ABOUT SECTION */}
        {portfolio.about && (
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-4 relative"
          >
            <div className="col-span-1 md:col-span-12">
              <SectionHeader num="01" title="About" />
            </div>
            
            {/* Sidebar metadata */}
            <div className="col-span-1 md:col-span-3 font-mono text-[8px] text-neutral-400 space-y-2 uppercase leading-snug hidden md:block select-none font-semibold">
              <div>[ DESCRIPTION: RETROSPECTIVE ]</div>
              <div>[ INDEX_ID: ABT_001 ]</div>
              <div>[ ENCODING: UTF-8 ]</div>
              <div>[ ALIGN: FLUSH_LEFT ]</div>
            </div>
            
            {/* High-impact typography content */}
            <div className="col-span-1 md:col-span-9">
              <p className="text-lg md:text-xl font-medium text-black leading-relaxed max-w-3xl whitespace-pre-wrap font-sans tracking-tight">
                {portfolio.about}
              </p>
            </div>
          </motion.section>
        )}

        {/* PROJECTS SECTION */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-4 relative"
          >
            <div className="col-span-1 md:col-span-12">
              <SectionHeader num="02" title="Projects" />
            </div>

            <div className="col-span-1 md:col-span-12">
              {/* Grid lines remain visible beneath cards via grid borders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border-t border-l border-black/10 bg-white relative">
                {/* Visual crosshair markers at the corners */}
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-black/30 pointer-events-none" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t border-r border-black/30 pointer-events-none" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b border-l border-black/30 pointer-events-none" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-black/30 pointer-events-none" />

                {portfolio.projects.map((project, idx) => {
                  const projectTags = parseTags(project.tags);
                  const hasLink = Boolean(project.link);
                  const displayIdx = String(idx + 1).padStart(2, '0');

                  const CardContent = () => (
                    <motion.div
                      initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
                      className="h-full flex flex-col justify-between p-6 border-r border-b border-black/10 hover:bg-neutral-50/50 transition-colors group cursor-pointer relative"
                    >
                      <div>
                        {/* Large Editorial cover image - expanding inside static alignment */}
                        <div className="aspect-[16/10] overflow-hidden relative bg-neutral-100 border border-black/5">
                          {project.cover ? (
                            <Image
                              src={project.cover}
                              alt={project.title}
                              fill
                              className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-[0.16,1,0.3,1]"
                              sizes="(max-w-768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col justify-between p-4 bg-neutral-900 text-white relative select-none">
                              <span className="font-mono text-[7px] text-neutral-400 font-bold">[ POSTER_NO_COVER ]</span>
                              <span className="font-mono text-6xl font-black text-white/5 absolute right-2 bottom-0 leading-none">
                                {displayIdx}
                              </span>
                              <span className="font-black text-sm uppercase tracking-tight z-10 break-words pr-8">
                                {project.title || "Untitled"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Title and Action Link */}
                        <div className="mt-5 flex items-start justify-between gap-2">
                          <h3 className="font-black text-base text-black uppercase tracking-tight leading-tight">
                            {project.title || "Untitled Project"}
                          </h3>
                          {hasLink && (
                            <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors flex-shrink-0" />
                          )}
                        </div>

                        <p className="text-xs text-neutral-500 leading-relaxed mt-2.5 line-clamp-3 font-sans">
                          {project.description || "Project description data details."}
                        </p>
                      </div>

                      {/* Monospaced technical tags list */}
                      {projectTags.length > 0 && (
                        <div className="flex flex-wrap gap-x-2 gap-y-1 mt-6 border-t border-black/5 pt-4">
                          {projectTags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider font-semibold"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
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
          </motion.section>
        )}

        {/* EXPERIENCE SECTION */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-4 relative"
          >
            <div className="col-span-1 md:col-span-12">
              <SectionHeader num="03" title="Experience" />
            </div>

            <div className="col-span-1 md:col-span-12 space-y-0 border-t border-black/10">
              {portfolio.experience
                .filter((exp) => exp.jobTitle && exp.company)
                .map((exp, idx) => {
                  const start = `${exp.startMonth.slice(0, 3)} ${exp.startYear}`;
                  const end = exp.isCurrent ? 'PRES' : `${exp.endMonth.slice(0, 3)} ${exp.endYear}`;
                  const parsedSkills = exp.skills
                    ? exp.skills.split(",").map((s) => s.trim()).filter(Boolean)
                    : [];

                  return (
                    <motion.div
                      key={exp.id || idx}
                      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-y-4 md:gap-y-0 py-8 border-b border-black/10 items-start relative group"
                    >
                      {/* Col 1-3: Date Column (Date Perfectly Aligned) */}
                      <div className="col-span-1 md:col-span-3 pr-4 md:border-r md:border-black/5 h-full select-none">
                        <span className="font-mono text-[8px] text-neutral-400 font-semibold block mb-1">CHRONOLOGY</span>
                        <span className="text-base sm:text-lg font-black uppercase tracking-tighter text-black block leading-none">
                          {start} — {end}
                        </span>
                        <span className="font-mono text-[8px] text-neutral-400 font-semibold mt-1 block">
                          {calculateMonths(exp).toUpperCase()}
                        </span>
                      </div>

                      {/* Col 4-7: Company Column (Logos aligned strictly to baseline) */}
                      <div className="col-span-1 md:col-span-4 px-0 md:px-6 md:border-r md:border-black/5 h-full flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-[8px] text-neutral-400 font-semibold block mb-2 select-none">ORGANIZATION</span>
                          
                          {/* Logo and company aligned strictly on baseline */}
                          <div className="flex items-end gap-2.5">
                            {exp.companyLogo ? (
                              <img 
                                src={exp.companyLogo} 
                                alt={exp.company} 
                                className="w-7 h-7 object-contain grayscale border border-black/10 bg-white"
                              />
                            ) : (
                              <div className="w-7 h-7 flex items-center justify-center bg-black text-white font-mono text-[9px] font-extrabold flex-shrink-0 select-none">
                                {exp.company.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <h3 className="font-black text-lg text-black uppercase tracking-tight leading-none pb-0.5">
                              {exp.company}
                            </h3>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[8px] font-semibold text-neutral-400 uppercase select-none">
                          <span>{exp.employmentType}</span>
                          <span>&middot;</span>
                          <span>{exp.locationType}</span>
                          {exp.location && (
                            <>
                              <span>&middot;</span>
                              <span>{exp.location}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Col 8-12: Job Details Column */}
                      <div className="col-span-1 md:col-span-5 pl-0 md:pl-6">
                        <span className="font-mono text-[8px] text-neutral-400 font-semibold block mb-1 select-none">POSITION DESCRIPTION</span>
                        <h4 className="font-black text-xl text-black uppercase tracking-tight leading-tight">
                          {exp.jobTitle}
                        </h4>
                        
                        {exp.description && (
                          <p className="text-xs text-neutral-600 leading-relaxed font-sans mt-3 whitespace-pre-wrap">
                            {exp.description}
                          </p>
                        )}

                        {parsedSkills.length > 0 && (
                          <div className="flex flex-wrap gap-x-2 gap-y-1 mt-4 border-t border-black/5 pt-3">
                            {parsedSkills.map((skill, sIdx) => (
                              <span 
                                key={sIdx} 
                                className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider font-semibold"
                              >
                                #{skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.section>
        )}

        {/* SKILLS SECTION */}
        {portfolio.skills && (
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-4 relative"
          >
            <div className="col-span-1 md:col-span-12">
              <SectionHeader num="04" title="Skills" />
            </div>

            <div className="col-span-1 md:col-span-12 relative">
              {/* Geometric Crop Marks for Modular Block Skills */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-black/30 pointer-events-none" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t border-r border-black/30 pointer-events-none" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b border-l border-black/30 pointer-events-none" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-black/30 pointer-events-none" />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 border-t border-l border-black/10 bg-white">
                {parseTags(portfolio.skills).map((skill, index) => {
                  const cellId = String(index + 1).padStart(2, '0');
                  return (
                    <motion.div
                      key={index}
                      initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.04 }}
                      className="aspect-square flex flex-col justify-between p-5 border-r border-b border-black/10 bg-white relative cursor-pointer group overflow-hidden select-none"
                    >
                      {/* Slide-in Background Accent Color (Classic Swiss Red) */}
                      <div className="absolute inset-0 bg-[#ff3b30] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-[0.16,1,0.3,1]" />
                      
                      {/* Coordinate marker label */}
                      <span className="font-mono text-[7px] text-neutral-400 group-hover:text-white/40 z-10 transition-colors">
                        [ SKL_{cellId} ]
                      </span>

                      {/* Skill Tag Title */}
                      <span className="font-black text-sm uppercase tracking-tight leading-tight text-black group-hover:text-white z-10 transition-colors break-words">
                        {skill}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}

        {/* CONTACT / FOOTER SECTION */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20 relative"
        >
          <div className="col-span-1 md:col-span-12">
            <SectionHeader num="05" title="Contact" />
          </div>

          <div className="col-span-1 md:col-span-12">
            {portfolio.email && (
              <div className="pb-10 border-b border-black/10">
                <span className="font-mono text-[8px] text-neutral-400 font-semibold block mb-3 select-none">EMAIL INQUIRIES</span>
                <a 
                  href={`mailto:${portfolio.email}`}
                  className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-black hover:text-[#ff3b30] transition-colors break-all leading-none block"
                >
                  {portfolio.email}
                </a>
              </div>
            )}

            {/* Social Grid (Modular Blocks in perfect symmetry) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-black/10 bg-white mt-12 relative">
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t border-l border-black/30 pointer-events-none" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t border-r border-black/30 pointer-events-none" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b border-l border-black/30 pointer-events-none" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b border-r border-black/30 pointer-events-none" />

              {/* LinkedIn block */}
              {portfolio.linkedin ? (
                <a
                  href={portfolio.linkedin.startsWith("http") ? portfolio.linkedin : `https://${portfolio.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square sm:aspect-auto sm:h-32 flex flex-col justify-between p-5 border-r border-b border-black/10 bg-white relative cursor-pointer group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[0.16,1,0.3,1]" />
                  <span className="font-mono text-[7px] text-neutral-400 group-hover:text-white/40 z-10 transition-colors">[ LINKEDIN_ACC ]</span>
                  <div className="flex items-center justify-between z-10 text-black group-hover:text-white transition-colors">
                    <span className="font-black text-sm uppercase tracking-tight">LinkedIn</span>
                    <Linkedin className="w-4 h-4" />
                  </div>
                </a>
              ) : (
                <div className="aspect-square sm:aspect-auto sm:h-32 flex flex-col justify-between p-5 border-r border-b border-black/10 bg-neutral-50 text-neutral-300 select-none">
                  <span className="font-mono text-[7px] text-neutral-400">[ LINKEDIN_ACC ]</span>
                  <span className="font-black text-xs uppercase tracking-tight">Inactive</span>
                </div>
              )}

              {/* Twitter block */}
              {portfolio.twitter ? (
                <a
                  href={portfolio.twitter.startsWith("http") ? portfolio.twitter : `https://${portfolio.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square sm:aspect-auto sm:h-32 flex flex-col justify-between p-5 border-r border-b border-black/10 bg-white relative cursor-pointer group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[0.16,1,0.3,1]" />
                  <span className="font-mono text-[7px] text-neutral-400 group-hover:text-white/40 z-10 transition-colors">[ TWITTER_ACC ]</span>
                  <div className="flex items-center justify-between z-10 text-black group-hover:text-white transition-colors">
                    <span className="font-black text-sm uppercase tracking-tight">Twitter</span>
                    <Twitter className="w-4 h-4" />
                  </div>
                </a>
              ) : (
                <div className="aspect-square sm:aspect-auto sm:h-32 flex flex-col justify-between p-5 border-r border-b border-black/10 bg-neutral-50 text-neutral-300 select-none">
                  <span className="font-mono text-[7px] text-neutral-400">[ TWITTER_ACC ]</span>
                  <span className="font-black text-xs uppercase tracking-tight">Inactive</span>
                </div>
              )}

              {/* GitHub block */}
              {portfolio.github ? (
                <a
                  href={portfolio.github.startsWith("http") ? portfolio.github : `https://${portfolio.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square sm:aspect-auto sm:h-32 flex flex-col justify-between p-5 border-r border-b border-black/10 bg-white relative cursor-pointer group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[0.16,1,0.3,1]" />
                  <span className="font-mono text-[7px] text-neutral-400 group-hover:text-white/40 z-10 transition-colors">[ GITHUB_ACC ]</span>
                  <div className="flex items-center justify-between z-10 text-black group-hover:text-white transition-colors">
                    <span className="font-black text-sm uppercase tracking-tight">GitHub</span>
                    <Github className="w-4 h-4" />
                  </div>
                </a>
              ) : (
                <div className="aspect-square sm:aspect-auto sm:h-32 flex flex-col justify-between p-5 border-r border-b border-black/10 bg-neutral-50 text-neutral-300 select-none">
                  <span className="font-mono text-[7px] text-neutral-400">[ GITHUB_ACC ]</span>
                  <span className="font-black text-xs uppercase tracking-tight">Inactive</span>
                </div>
              )}

              {/* Email Block */}
              {portfolio.email ? (
                <a
                  href={`mailto:${portfolio.email}`}
                  className="aspect-square sm:aspect-auto sm:h-32 flex flex-col justify-between p-5 border-r border-b border-black/10 bg-white relative cursor-pointer group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[0.16,1,0.3,1]" />
                  <span className="font-mono text-[7px] text-neutral-400 group-hover:text-white/40 z-10 transition-colors">[ E_MAIL_ACC ]</span>
                  <div className="flex items-center justify-between z-10 text-black group-hover:text-white transition-colors">
                    <span className="font-black text-sm uppercase tracking-tight">Write Mail</span>
                    <Mail className="w-4 h-4" />
                  </div>
                </a>
              ) : (
                <div className="aspect-square sm:aspect-auto sm:h-32 flex flex-col justify-between p-5 border-r border-b border-black/10 bg-neutral-50 text-neutral-300 select-none">
                  <span className="font-mono text-[7px] text-neutral-400">[ E_MAIL_ACC ]</span>
                  <span className="font-black text-xs uppercase tracking-tight">Inactive</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer technical specifications */}
          <div className="col-span-1 md:col-span-12 border-t border-black pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] text-neutral-400 font-semibold uppercase tracking-wider select-none mt-12">
            <div className="flex items-center gap-6">
              <span>&copy; {new Date().getFullYear()} {portfolio.name || "PORTFOLIO"}</span>
              <span>[ LOC: {portfolio.location || "GLOBAL"} ]</span>
            </div>
            <div className="flex items-center gap-4">
              <span>GRID SYSTEM: 12-COL / OK</span>
              <span>TEMPLATE: SWISS-MODERN-v1.0</span>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
