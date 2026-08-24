"use client";

import React from "react";
import { Mail, Linkedin, Twitter, Github, MapPin } from "lucide-react";
import { Playfair_Display, Inter } from "next/font/google";
import { motion } from "framer-motion";
import { Experience } from "../ExperienceTimeline";
import Image from "next/image";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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

const DossierSection = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function CorporatePro({ portfolio }: TemplateProps) {
  const parseTags = (tagsStr: string) => {
    return tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const getExpDateString = (exp: Experience) => {
    const start = `${exp.startMonth.slice(0, 3).toUpperCase()} ${exp.startYear}`;
    const end = exp.isCurrent ? "PRESENT" : `${exp.endMonth.slice(0, 3).toUpperCase()} ${exp.endYear}`;
    return `${start} – ${end}`;
  };

  const validExperiences = (portfolio.experience || []).filter((exp) => exp.jobTitle && exp.company);

  return (
    <div
      className={`${playfair.variable} ${inter.variable} w-full min-h-screen bg-[#F7F4EF] text-[#1a1a1a] py-8 sm:py-16 px-4 sm:px-6 relative overflow-y-auto select-none print-container`}
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* Background paper noise pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-50 opacity-[0.025] overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect */}
      <div className="pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.045)_100%)] overflow-hidden" />

      {/* Inject print-specific styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .print-container {
                background: white !important;
                color: black !important;
                padding: 0 !important;
                min-height: auto !important;
              }
              .print-hidden {
                display: none !important;
              }
              a {
                text-decoration: none !important;
                color: black !important;
              }
            }
          `,
        }}
      />

      {/* Large visual margins: Central dossier sheet */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 md:px-16 py-12 relative min-h-screen border border-[#1a1a1a]/5 bg-[#fcfaf7] shadow-[0_4px_30px_rgba(0,0,0,0.02),0_1px_3px_rgba(0,0,0,0.01)] z-10">
        
        {/* Subtle page fold shadow near the left side */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/[0.035] to-transparent z-20" />

        {/* Tiny corner registration marks */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#1a1a1a]/20 pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#1a1a1a]/20 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#1a1a1a]/20 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#1a1a1a]/20 pointer-events-none" />

        {/* Folded page corner effect at top-right */}
        <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none z-20 print-hidden">
          {/* The triangular cutout showing desk background */}
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-t-[#F7F4EF] border-l-[48px] border-l-transparent" />
          {/* The fold flap */}
          <div className="absolute top-0 right-0 w-0 h-0 border-b-[48px] border-b-[#e8e3d9] border-r-[48px] border-r-transparent shadow-[-2px_2px_4px_rgba(0,0,0,0.08)]" />
        </div>

        {/* Faint Confidential watermark behind sections */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <div className="sticky top-1/4 left-0 right-0 text-[11vw] font-sans font-black text-[#1a1a1a]/[0.012] text-center transform -rotate-12 tracking-[0.2em] leading-none uppercase">
            CONFIDENTIAL
          </div>
          <div className="sticky top-2/3 left-0 right-0 text-[11vw] font-sans font-black text-[#1a1a1a]/[0.012] text-center transform -rotate-12 tracking-[0.2em] leading-none uppercase mt-[30vh]">
            CLASSIFIED RECORD
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 space-y-16">
          
          {/* ========================================================
              HERO (Cover Page)
              ======================================================== */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-12 pb-16"
          >
            {/* Top Cover Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-[#1a1a1a]/10">
              <div className="font-mono text-[9px] sm:text-xs tracking-[0.2em] text-[#1a1a1a]/40">
                DOCUMENT ID: #{(portfolio.name || "UNN").slice(0, 3).toUpperCase()}-{new Date().getFullYear()}-FILE
              </div>

              <div className="flex flex-col items-end font-mono text-[9px] sm:text-xs tracking-wider text-[#1a1a1a]/60">
                <span className="text-red-800 font-bold border border-red-800/40 px-2 py-0.5 inline-block mb-1 select-none">
                  CONFIDENTIAL
                </span>
                <span>DOSSIER TYPE: PROFILE RECORD</span>
                <span>DATE FILED: {new Date().getFullYear()}</span>
              </div>
            </div>

            {/* Main Cover Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start pt-4">
              
              {/* Text info - 7 cols */}
              <div className="md:col-span-7 space-y-6">
                <div className="space-y-3">
                  <span className="font-mono text-xs font-bold text-[#1a1a1a]/50 tracking-[0.22em] block uppercase">
                    EXECUTIVE RECORD
                  </span>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-serif text-[#1a1a1a] tracking-tight leading-none">
                    {portfolio.name || "Candidate Name"}
                  </h1>
                  <div className="w-20 h-[3px] bg-[#1a1a1a] my-4" />
                  <p className="text-lg sm:text-xl font-bold uppercase tracking-wider text-amber-800 font-mono">
                    {portfolio.headline || "Professional Headline"}
                  </p>
                </div>

                {portfolio.location && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#1a1a1a]/60 font-mono tracking-wider border border-[#1a1a1a]/15 bg-[#1a1a1a]/5 px-2.5 py-1 rounded">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{portfolio.location}</span>
                  </div>
                )}

                {portfolio.bio && (
                  <p className="text-sm sm:text-base text-[#1a1a1a]/75 font-sans leading-relaxed border-l-2 border-[#1a1a1a]/15 pl-4 py-1.5 italic bg-[#1a1a1a]/[0.01]">
                    {portfolio.bio}
                  </p>
                )}
              </div>

              {/* Photo frame - 5 cols */}
              <div className="md:col-span-5 flex justify-center md:justify-end pt-6 md:pt-0">
                <div className="relative">
                  
                  {/* The Paperclip */}
                  <svg
                    className="absolute -top-7 left-12 w-8 h-16 text-slate-400 drop-shadow-[1px_3px_2px_rgba(0,0,0,0.2)] z-30 pointer-events-none select-none print-hidden"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  >
                    <path d="M7 10v7a5 5 0 0 0 10 0v-9a3 3 0 0 0-6 0v8a1 1 0 0 0 2 0v-7" />
                  </svg>

                  {/* Polaroid/Print Frame container */}
                  <div
                    className="relative bg-white p-4 pb-10 border border-[#1a1a1a]/10 shadow-[4px_6px_20px_rgba(0,0,0,0.06),1px_2px_5px_rgba(0,0,0,0.03)] transform rotate-[2deg] hover:rotate-[0deg] transition-transform duration-500 z-10 w-64"
                  >
                    {portfolio.photo ? (
                      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden border border-[#1a1a1a]/5">
                        <Image
                          src={portfolio.photo}
                          alt={`${portfolio.name} photograph`}
                          fill
                          className="object-cover filter sepia-[0.15] contrast-[1.05] grayscale-[0.2]"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square w-full bg-slate-50 border border-dashed border-[#1a1a1a]/10 flex flex-col items-center justify-center p-4 text-center font-mono">
                        <span className="text-[10px] text-[#1a1a1a]/40 tracking-widest uppercase">PHOTO ENTRY</span>
                        <span className="text-xs text-[#1a1a1a]/50 mt-1">MISSING</span>
                      </div>
                    )}
                    
                    <div className="mt-4 font-mono text-[9px] text-[#1a1a1a]/40 uppercase tracking-widest text-center select-none">
                      Candidate ID: #{(portfolio.name || "UNN").slice(0, 3).toUpperCase()}-9482
                    </div>
                  </div>

                  {/* Ink Verified Stamp */}
                  <motion.div
                    initial={{ scale: 2.2, opacity: 0, rotate: 30 }}
                    animate={{ scale: 1, opacity: 0.75, rotate: -15 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 90, damping: 12 }}
                    className="absolute -bottom-8 -left-6 z-20 border-[3px] border-double border-red-800/60 text-red-800/80 font-mono text-[10px] font-black tracking-[0.25em] px-3 py-1 bg-[#fcfaf7] shadow-[1px_2px_4px_rgba(0,0,0,0.05)] uppercase select-none pointer-events-none"
                  >
                    <div className="border-t border-b border-red-800/30 py-0.5 px-2">
                      VERIFIED
                    </div>
                  </motion.div>

                </div>
              </div>

            </div>
          </motion.div>

          {/* ========================================================
              ABOUT (Executive Summary)
              ======================================================== */}
          {portfolio.about && (
            <DossierSection className="border-t border-[#1a1a1a]/15 pt-12 pb-6">
              {/* Page Header */}
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-mono text-[#1a1a1a]/40 mb-12">
                <span>Section 01 // EXECUTIVE SUMMARY</span>
                <span>Dossier: {portfolio.name}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-8 uppercase tracking-wide font-serif border-b border-[#1a1a1a]/10 pb-3">
                Executive Summary
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-8 text-base sm:text-lg text-[#1a1a1a]/90 leading-relaxed font-sans font-light text-justify">
                  {(() => {
                    const text = portfolio.about.trim();
                    if (!text) return null;
                    const firstChar = text.charAt(0);
                    const restText = text.slice(1);
                    return (
                      <p className="indent-0">
                        <span className="float-left text-5xl sm:text-6xl font-bold font-serif mr-3 mt-1.5 text-[#1a1a1a] select-none leading-[0.8] align-top">
                          {firstChar}
                        </span>
                        {restText}
                      </p>
                    );
                  })()}
                </div>

                {portfolio.bio && (
                  <div className="md:col-span-4 border-l-2 border-amber-600/40 pl-4 py-2 bg-amber-500/[0.02] rounded-r">
                    <p className="font-sans italic text-sm text-[#1a1a1a]/80 leading-relaxed">
                      &ldquo;{portfolio.bio}&rdquo;
                    </p>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#1a1a1a]/50 mt-2 block">
                      &mdash; Key Executive Objective
                    </span>
                  </div>
                )}
              </div>

              {/* Section Footer */}
              <div className="flex justify-between items-center text-[9px] font-mono text-[#1a1a1a]/30 mt-12 border-t border-[#1a1a1a]/5 pt-4">
                <span>CLASSIFICATION: CONFIDENTIAL RECORD // REF-{(portfolio.name || "UNNAMED").slice(0, 3).toUpperCase()}</span>
                <span>PAGE 01</span>
              </div>
            </DossierSection>
          )}

          {/* ========================================================
              PROJECTS (Case Studies)
              ======================================================== */}
          {portfolio.projects && portfolio.projects.length > 0 && (
            <DossierSection className="border-t border-[#1a1a1a]/15 pt-12 pb-6">
              {/* Page Header */}
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-mono text-[#1a1a1a]/40 mb-12">
                <span>Section 02 // SELECTED CASE STUDIES</span>
                <span>Dossier: {portfolio.name}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-12 uppercase tracking-wide font-serif border-b border-[#1a1a1a]/10 pb-3">
                Selected Case Studies
              </h2>
              
              <div className="space-y-16">
                {portfolio.projects.map((project, index) => {
                  const projectNum = `PROJECT ${String(index + 1).padStart(2, "0")}`;
                  const hasLink = Boolean(project.link);
                  
                  return (
                    <div key={project.id || index} className="group relative pt-4 first:pt-0">
                      {index > 0 && (
                        <div className="w-full h-[1px] bg-[#1a1a1a]/10 mb-16" />
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start transition-all duration-300">
                        
                        {/* Project Image - 5 cols */}
                        <div className="md:col-span-5 relative aspect-[4/3] w-full bg-[#1a1a1a]/5 overflow-hidden border border-[#1a1a1a]/10 shadow-[2px_2px_8px_rgba(0,0,0,0.04)]">
                          {project.cover ? (
                            <Image
                              src={project.cover}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-[1.02]"
                            />
                          ) : (
                            // Blueprint/Technical placeholder if no cover image
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 font-mono select-none">
                              <div className="absolute inset-0 border border-dashed border-[#1a1a1a]/10 m-2 flex items-center justify-center" />
                              <span className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">TECHNICAL SCHEMATIC</span>
                              <span className="text-xs font-bold text-[#1a1a1a]/60 text-center uppercase truncate w-full font-bold px-4">{project.title}</span>
                            </div>
                          )}
                        </div>

                        {/* Project Info - 7 cols */}
                        <div className="md:col-span-7 space-y-4">
                          <div>
                            <span className="font-mono text-xs font-bold text-amber-700 tracking-wider block uppercase">
                              {projectNum}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#1a1a1a] mt-1 group-hover:text-amber-800 transition-colors">
                              {project.title || "Untitled Project"}
                            </h3>
                          </div>

                          <p className="text-sm sm:text-base text-[#1a1a1a]/85 leading-relaxed font-sans font-light">
                            {project.description || "Detailed project summary and key deliverables."}
                          </p>

                          {/* Metadata Table */}
                          <div className="border-t border-b border-[#1a1a1a]/10 py-2.5 my-4">
                            <div className="grid grid-cols-[100px_1fr] text-xs font-mono py-1 border-b border-[#1a1a1a]/5 last:border-0">
                              <span className="font-bold text-[#1a1a1a]/50">METADATA:</span>
                              <span className="text-[#1a1a1a]/80 uppercase">CASE STUDY RECORD</span>
                            </div>
                            {project.tags && (
                              <div className="grid grid-cols-[100px_1fr] text-xs font-mono py-1 border-b border-[#1a1a1a]/5 last:border-0">
                                <span className="font-bold text-[#1a1a1a]/50">STACK:</span>
                                <span className="text-[#1a1a1a]/80">{project.tags}</span>
                              </div>
                            )}
                            {hasLink && (
                              <div className="grid grid-cols-[100px_1fr] text-xs font-mono py-1 last:border-0">
                                <span className="font-bold text-[#1a1a1a]/50">EXTERNAL:</span>
                                <span>
                                  <a
                                    href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-800 hover:underline inline-flex items-center gap-1 font-bold group-hover:translate-x-0.5 transition-transform"
                                  >
                                    Reference →
                                  </a>
                                </span>
                              </div>
                            )}
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Section Footer */}
              <div className="flex justify-between items-center text-[9px] font-mono text-[#1a1a1a]/30 mt-12 border-t border-[#1a1a1a]/5 pt-4">
                <span>CLASSIFICATION: CONFIDENTIAL RECORD // REF-{(portfolio.name || "UNNAMED").slice(0, 3).toUpperCase()}</span>
                <span>PAGE 02</span>
              </div>
            </DossierSection>
          )}

          {/* ========================================================
              EXPERIENCE (Career Timeline)
              ======================================================== */}
          {validExperiences.length > 0 && (
            <DossierSection className="border-t border-[#1a1a1a]/15 pt-12 pb-6">
              {/* Page Header */}
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-mono text-[#1a1a1a]/40 mb-12">
                <span>Section 03 // PROFESSIONAL EXPERIENCE</span>
                <span>Dossier: {portfolio.name}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-12 uppercase tracking-wide font-serif border-b border-[#1a1a1a]/10 pb-3">
                Career Timeline
              </h2>

              <div className="relative pl-2 sm:pl-0">
                {/* Scroll-animated Timeline Line */}
                <div className="absolute top-4 bottom-4 left-[95px] sm:left-[145px] w-[1px] bg-[#1a1a1a]/10 -translate-x-1/2" />
                <motion.div
                  className="absolute top-4 bottom-4 left-[95px] sm:left-[145px] w-[1px] bg-[#1a1a1a] -translate-x-1/2"
                  style={{ originY: 0 }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />

                <div className="space-y-10">
                  {validExperiences.map((exp, idx) => {
                    const isCurrent = exp.isCurrent;
                    return (
                      <div key={exp.id || idx} className="flex gap-4 sm:gap-6 items-start relative">
                        
                        {/* Left side: Date */}
                        <div className="w-[80px] sm:w-[120px] text-right font-mono text-[9px] sm:text-xs font-bold tracking-wider text-[#1a1a1a]/70 pt-1 flex-shrink-0">
                          {getExpDateString(exp)}
                        </div>

                        {/* Center: Timeline Dot */}
                        <div className="relative flex justify-center items-center w-8 pt-1.5 flex-shrink-0 z-10">
                          <div className={`w-3 h-3 rounded-full border-2 ${isCurrent ? "bg-amber-600 border-[#fcfaf7] ring-2 ring-amber-600/30" : "bg-white border-[#1a1a1a]"} flex-shrink-0`} />
                          {isCurrent && (
                            <span className="absolute w-5 h-5 rounded-full bg-amber-600/20 animate-ping" />
                          )}
                        </div>

                        {/* Right side: Role, Company, Description */}
                        <div className={`flex-1 space-y-2 pb-2 ${isCurrent ? "border-l-2 border-amber-600/40 bg-amber-600/[0.02] p-4 rounded-r shadow-xs" : ""}`}>
                          <div>
                            <h4 className="font-serif text-base sm:text-lg font-bold text-[#1a1a1a] flex flex-wrap items-baseline gap-2">
                              {exp.jobTitle}
                            </h4>
                            <p className="text-xs font-mono uppercase tracking-wider text-[#1a1a1a]/60 font-bold mt-0.5">
                              {exp.company} &bull; {exp.employmentType}
                            </p>
                            {exp.location && (
                              <p className="text-[10px] text-[#1a1a1a]/55 font-medium mt-0.5">
                                {exp.location} &bull; {exp.locationType}
                              </p>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-[#1a1a1a]/85 leading-relaxed font-sans font-normal">
                            {exp.description}
                          </p>
                          {exp.skills && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {exp.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill, sIdx) => (
                                <span key={sIdx} className="text-[9px] font-mono border border-[#1a1a1a]/15 bg-[#1a1a1a]/[0.02] px-2 py-0.5 text-[#1a1a1a]/65 uppercase">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section Footer */}
              <div className="flex justify-between items-center text-[9px] font-mono text-[#1a1a1a]/30 mt-12 border-t border-[#1a1a1a]/5 pt-4">
                <span>CLASSIFICATION: CONFIDENTIAL RECORD // REF-{(portfolio.name || "UNNAMED").slice(0, 3).toUpperCase()}</span>
                <span>PAGE 03</span>
              </div>
            </DossierSection>
          )}

          {/* ========================================================
              SKILLS (Competency Report)
              ======================================================== */}
          {portfolio.skills && (
            <DossierSection className="border-t border-[#1a1a1a]/15 pt-12 pb-6">
              {/* Page Header */}
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-mono text-[#1a1a1a]/40 mb-12">
                <span>Section 04 // AREAS OF COMPETENCY</span>
                <span>Dossier: {portfolio.name}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-8 uppercase tracking-wide font-serif border-b border-[#1a1a1a]/10 pb-3">
                Areas of Competency
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4">
                {parseTags(portfolio.skills).map((skill, index) => {
                  const skillLevels = ["EXPERT / SENIOR", "ADVANCED / PROFESSIONAL", "SPECIALIST / EXEC", "PROFESSIONAL / CORE"];
                  const skillBars = [
                    "██████████", // Expert
                    "████████░░", // Advanced
                    "██████░░░░", // Specialist
                    "████████░░", // Professional
                  ];
                  
                  const level = skillLevels[index % skillLevels.length];
                  const bar = skillBars[index % skillBars.length];

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-[#1a1a1a]/10 hover:bg-[#1a1a1a]/[0.02] px-2 transition-colors duration-150"
                    >
                      <span className="font-mono text-sm font-bold tracking-tight text-[#1a1a1a]">
                        {skill}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-[#1a1a1a]/60 select-none hidden sm:inline tracking-wider">
                          {bar}
                        </span>
                        <span className="font-mono text-[9px] sm:text-xs font-semibold px-2 py-0.5 border border-[#1a1a1a]/20 bg-[#1a1a1a]/5 text-[#1a1a1a]/70">
                          {level}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Section Footer */}
              <div className="flex justify-between items-center text-[9px] font-mono text-[#1a1a1a]/30 mt-12 border-t border-[#1a1a1a]/5 pt-4">
                <span>CLASSIFICATION: CONFIDENTIAL RECORD // REF-{(portfolio.name || "UNNAMED").slice(0, 3).toUpperCase()}</span>
                <span>PAGE 04</span>
              </div>
            </DossierSection>
          )}

          {/* ========================================================
              CONTACT (Final Approval Page)
              ======================================================== */}
          <DossierSection className="border-t border-[#1a1a1a]/15 pt-12 pb-6">
            {/* Page Header */}
            <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-mono text-[#1a1a1a]/40 mb-12">
              <span>Section 05 // FINAL APPROVAL & REFERENCE</span>
              <span>Dossier: {portfolio.name}</span>
            </div>

            <div className="max-w-xl mx-auto text-center space-y-12">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] uppercase tracking-wider font-serif">
                Candidate Certification
              </h2>

              <p className="text-xs sm:text-sm text-[#1a1a1a]/70 font-sans leading-relaxed">
                I hereby certify that the information contained within this Dossier profile is a true and accurate representation of my professional career, credentials, and competency history.
              </p>

              {/* Large Signature Line */}
              <div className="flex flex-col items-center py-6">
                <span className="font-serif italic text-3xl text-slate-800/90 font-light select-none transform rotate-[-2deg] tracking-wide">
                  {portfolio.name}
                </span>
                <div className="w-64 h-[1px] bg-[#1a1a1a]/30 mt-2 relative">
                  <span className="absolute -left-4 -top-3.5 font-mono text-sm text-[#1a1a1a]/40">x</span>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#1a1a1a]/50 mt-2">
                  Signature of Candidate (Authorized Representative)
                </span>
              </div>

              <div className="w-full h-[1px] bg-[#1a1a1a]/10" />

              {/* Contact Info Stacked */}
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-mono text-[#1a1a1a]/70">
                  {portfolio.email && (
                    <a href={`mailto:${portfolio.email}`} className="flex items-center gap-1.5 hover:text-amber-800 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-amber-700" />
                      <span className="border-b border-transparent hover:border-amber-700/30 pb-0.5">{portfolio.email}</span>
                    </a>
                  )}
                  {portfolio.linkedin && (
                    <a href={portfolio.linkedin.startsWith("http") ? portfolio.linkedin : `https://${portfolio.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-amber-800 transition-colors">
                      <Linkedin className="w-3.5 h-3.5 text-amber-700" />
                      <span className="border-b border-transparent hover:border-amber-700/30 pb-0.5">LinkedIn</span>
                    </a>
                  )}
                  {portfolio.twitter && (
                    <a href={portfolio.twitter.startsWith("http") ? portfolio.twitter : `https://${portfolio.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-amber-800 transition-colors">
                      <Twitter className="w-3.5 h-3.5 text-amber-700" />
                      <span className="border-b border-transparent hover:border-amber-700/30 pb-0.5">Twitter / X</span>
                    </a>
                  )}
                  {portfolio.github && (
                    <a href={portfolio.github.startsWith("http") ? portfolio.github : `https://${portfolio.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-amber-800 transition-colors">
                      <Github className="w-3.5 h-3.5 text-amber-700" />
                      <span className="border-b border-transparent hover:border-amber-700/30 pb-0.5">GitHub</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Footer Barcode / Security ID */}
              <div className="flex flex-col items-center pt-6 opacity-35 font-mono select-none">
                <div className="h-6 w-48 bg-gradient-to-r from-transparent via-[#1a1a1a]/80 to-transparent flex items-center justify-between px-2 text-[6px] tracking-widest text-[#1a1a1a]">
                  <span>||||||| | |||| | |||||| |||</span>
                  <span>|| ||||| | ||| |||||| ||</span>
                </div>
                <span className="text-[8px] uppercase tracking-[0.25em] text-[#1a1a1a] mt-1.5">
                  EOF // SECURE-FILE-EX-{(portfolio.name || "UNN").slice(0, 3).toUpperCase()}
                </span>
              </div>

              <div className="text-[10px] text-[#1a1a1a]/40 pt-4">
                &copy; {new Date().getFullYear()} {portfolio.name}. All rights reserved.
              </div>

              <div className="text-[10px] uppercase font-bold text-red-800/40 tracking-[0.3em] pt-2 select-none">
                End of Executive Profile
              </div>
            </div>

            {/* Section Footer */}
            <div className="flex justify-between items-center text-[9px] font-mono text-[#1a1a1a]/30 mt-12 border-t border-[#1a1a1a]/5 pt-4">
              <span>CLASSIFICATION: CONFIDENTIAL RECORD // REF-{(portfolio.name || "UNNAMED").slice(0, 3).toUpperCase()}</span>
              <span>PAGE 05</span>
            </div>
          </DossierSection>

        </div>
      </div>
    </div>
  );
}
