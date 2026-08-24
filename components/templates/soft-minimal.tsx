"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Twitter, Github, MapPin } from "lucide-react";
import { Noto_Serif_JP, DM_Sans } from "next/font/google";
import { Experience } from "../ExperienceTimeline";
import Image from "next/image";

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
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

const ZenSection = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function SoftMinimal({ portfolio }: TemplateProps) {
  const parseTags = (tagsStr: string) => {
    return tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const validExperiences = (portfolio.experience || []).filter((exp) => exp.jobTitle && exp.company);

  return (
    <div
      className={`${notoSerif.variable} ${dmSans.variable} w-full min-h-screen bg-[#F7F5F0] text-[#2E2A25] py-20 px-6 sm:px-12 md:px-16 overflow-y-auto select-none font-sans relative`}
      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
    >
      {/* Linen texture crosshatch overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-40 opacity-[0.012] print-hidden overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h80v1H0zm0 10h80v1H0zm0 10h80v1H0zm0 10h80v1H0zm0 10h80v1H0zm0 10h80v1H0zm0 10h80v1H0zm0 10h80v1H0zM0 0v80h1V0zm10 0v80h1V0zm10 0v80h1V0zm10 0v80h1V0zm10 0v80h1V0zm10 0v80h1V0zm10 0v80h1V0zm10 0v80h1V0z' fill='%232e2a25' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle paper noise texture */}
      <div
        className="pointer-events-none absolute inset-0 z-50 opacity-[0.018] print-hidden overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft Vignette around screen edges */}
      <div className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(46,42,37,0.035)_100%)] overflow-hidden" />

      {/* Main centered container with large negative space and breathing room */}
      <div className="max-w-[700px] mx-auto flex flex-col gap-24 relative z-10">
        
        {/* ========================================================
            HERO (Zen Entrance)
            ======================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-center sm:items-start pt-8 relative"
        >
          {/* Animated brush-like thin SVG curves */}
          <svg className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)] pointer-events-none select-none z-0 opacity-[0.12] hidden md:block" viewBox="0 0 500 400" fill="none">
            <motion.path
              d="M30 180 Q 180 80, 320 220 T 480 180"
              stroke="#2E2A25"
              strokeWidth="0.75"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4.5, ease: "easeInOut" }}
            />
            <motion.path
              d="M80 140 Q 250 280, 420 140"
              stroke="#2E2A25"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 5.5, ease: "easeInOut", delay: 0.6 }}
            />
          </svg>

          {/* Morphing avatar frame */}
          {portfolio.photo ? (
            <div className="relative flex-shrink-0 z-10">
              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-24 h-24 sm:w-28 sm:h-28 overflow-hidden bg-[#FCFAF7] border border-[#EBE7DF] shadow-[0_4px_12px_rgba(0,0,0,0.02)] select-none pointer-events-none"
                style={{
                  animation: "zenMorph 15s ease-in-out infinite",
                }}
              >
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes zenMorph {
                    0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
                    50% { border-radius: 60% 40% 30% 70% / 55% 45% 65% 35%; }
                    100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
                  }
                `}} />
                <Image
                  src={portfolio.photo}
                  alt={portfolio.name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover filter contrast-[0.98] sepia-[0.05]"
                />
              </motion.div>
            </div>
          ) : null}

          {/* Text block */}
          <div className="flex-1 min-w-0 text-center sm:text-left z-10">
            <h1 
              className="text-4xl sm:text-5xl font-normal tracking-tight text-[#2E2A25] leading-tight font-serif"
              style={{ fontFamily: "var(--font-noto-serif), serif" }}
            >
              {portfolio.name || "Name"}
            </h1>
            
            <p className="text-sm uppercase tracking-[0.25em] text-[#9A7D64] mt-2 font-medium">
              {portfolio.headline || "Designer / Craftsperson"}
            </p>

            {portfolio.location && (
              <div className="flex items-center justify-center sm:justify-start gap-1 text-[10px] tracking-widest font-mono text-stone-400 mt-2.5 uppercase font-medium">
                <MapPin className="w-3.5 h-3.5 text-stone-450" />
                <span>{portfolio.location}</span>
              </div>
            )}

            {portfolio.bio && (
              <p className="text-[14px] sm:text-base text-stone-500 mt-6 leading-relaxed font-sans max-w-lg font-light text-justify">
                {portfolio.bio}
              </p>
            )}
          </div>
        </motion.section>

        {/* ========================================================
            ABOUT (Atelier Notebook)
            ======================================================== */}
        {portfolio.about && (
          <ZenSection className="space-y-4">
            <div className="flex items-center gap-4 text-[#2E2A25]/30">
              <span className="font-serif text-xs italic tracking-widest uppercase">Atelier Note</span>
              <div className="h-[0.75px] bg-[#2E2A25]/10 flex-1" />
            </div>

            <div className="bg-[#FCFAF7] border border-[#EBE7DF] rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              {portfolio.about.split("\n\n").map((pText, pIdx) => (
                <motion.p
                  key={pIdx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: pIdx * 0.15 }}
                  className="text-[14px] sm:text-[15px] leading-relaxed text-stone-650 font-light"
                >
                  {pText}
                </motion.p>
              ))}
            </div>
          </ZenSection>
        )}

        {/* ========================================================
            PROJECTS (Handcrafted Cards)
            ======================================================== */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <ZenSection className="space-y-8">
            <div className="flex items-center gap-4 text-[#2E2A25]/30">
              <span className="font-serif text-xs italic tracking-widest uppercase">Selected Works</span>
              <div className="h-[0.75px] bg-[#2E2A25]/10 flex-1" />
            </div>

            <div className="space-y-12">
              {portfolio.projects.map((project, index) => {
                const projectTags = parseTags(project.tags);
                const hasLink = Boolean(project.link);
                const isLeft = index % 2 === 0;

                return (
                  <motion.div
                    key={project.id || index}
                    initial={{ opacity: 0, x: isLeft ? -25 : 25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                    className="group relative bg-[#FCFAF7] border border-[#EBE7DF] rounded-3xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.01)] transition-all duration-500 overflow-hidden flex flex-col md:flex-row gap-6 md:gap-8 items-center"
                  >
                    {/* Gentle moss green wash of color behind on hover */}
                    <div className="absolute inset-0 bg-[#F1F3EE] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out z-0 pointer-events-none" />

                    {/* Image block */}
                    <div className={`w-full md:w-[42%] aspect-[4/3] relative overflow-hidden rounded-2xl border border-[#EBE7DF] bg-[#F7F5F0] z-10 flex-shrink-0 ${
                      isLeft ? "md:order-1" : "md:order-2"
                    }`}>
                      {project.cover ? (
                        <Image
                          src={project.cover}
                          alt={project.title}
                          fill
                          sizes="(max-w-700px) 100vw, 300px"
                          className="object-cover group-hover:scale-103 transition-transform duration-700 filter contrast-[0.98] sepia-[0.05]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center font-mono">
                          <span className="text-[9px] text-[#9A7D64] tracking-widest uppercase">Handcrafted</span>
                        </div>
                      )}
                    </div>

                    {/* Info block */}
                    <div className={`flex-1 space-y-3 z-10 text-center md:text-left ${
                      isLeft ? "md:order-2" : "md:order-1"
                    }`}>
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] tracking-widest text-[#9A7D64] uppercase block">
                          Exhibit No.{(index + 1).toString().padStart(2, "0")}
                        </span>
                        <h3 className="text-lg font-bold text-[#2E2A25] font-serif leading-tight">
                          {project.title || "Untitled"}
                        </h3>
                      </div>

                      <p className="text-[13px] text-stone-500 leading-relaxed font-light">
                        {project.description || "Detailed overview of handcrafted installation."}
                      </p>

                      {projectTags.length > 0 && (
                        <p className="text-[11px] text-[#9A7D64] font-mono tracking-wide">
                          {projectTags.join(" · ")}
                        </p>
                      )}

                      {hasLink && (
                        <div className="pt-2">
                          <a
                            href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-[#2E2A25] hover:text-[#9A7D64] transition-colors"
                          >
                            <span>Browse Project</span>
                            <span className="transform translate-y-[0.5px] font-sans">&rarr;</span>
                          </a>
                        </div>
                      )}
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </ZenSection>
        )}

        {/* ========================================================
            EXPERIENCE (Stepping Stones)
            ======================================================== */}
        {validExperiences.length > 0 && (
          <ZenSection className="space-y-10">
            <div className="flex items-center gap-4 text-[#2E2A25]/30">
              <span className="font-serif text-xs italic tracking-widest uppercase">Chronology</span>
              <div className="h-[0.75px] bg-[#2E2A25]/10 flex-1" />
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-12">
              {/* Thin ink-drawn vertical timeline line */}
              <svg className="absolute left-[8px] top-4 bottom-0 w-2 pointer-events-none opacity-20" preserveAspectRatio="none">
                <path d="M 4 0 Q 2 40, 4 80 T 4 480" fill="none" stroke="#2e2a25" strokeWidth="0.75" strokeDasharray="3 4" />
              </svg>

              {validExperiences.map((exp, idx) => {
                const isCurrent = exp.isCurrent;
                return (
                  <div key={exp.id || idx} className="relative flex flex-col gap-2 items-start group">
                    {/* Stepping stone ink dot */}
                    <div className={`absolute -left-[23px] sm:-left-[27px] w-2 h-2 rounded-full border ${
                      isCurrent 
                        ? "bg-[#9A7D64] border-[#9A7D64] shadow-[0_0_8px_rgba(154,125,100,0.4)]" 
                        : "bg-[#F7F5F0] border-[#2E2A25]/30"
                    } z-10`} />

                    <div className="space-y-1">
                      <span className="font-mono text-[10px] tracking-widest text-stone-400 block uppercase">
                        {exp.startMonth.slice(0, 3).toUpperCase()} {exp.startYear} &ndash; {isCurrent ? "PRESENT" : `${exp.endMonth.slice(0, 3).toUpperCase()} ${exp.endYear}`}
                      </span>

                      <h4 className="text-base font-bold text-[#2E2A25] font-serif flex items-baseline gap-2">
                        {exp.jobTitle}
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9A7D64] animate-pulse" />
                        )}
                      </h4>

                      <p className="text-[11px] font-mono uppercase tracking-wider text-[#9A7D64] font-semibold">
                        {exp.company} &bull; {exp.employmentType}
                      </p>
                    </div>

                    <p className="text-[13px] text-stone-500 leading-relaxed font-light pt-1.5 max-w-xl text-justify">
                      {exp.description}
                    </p>

                    {exp.skills && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {exp.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill, sIdx) => (
                          <span key={sIdx} className="text-[9px] font-mono border border-[#EBE7DF] bg-[#FCFAF7] px-2 py-0.5 text-stone-450 uppercase rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ZenSection>
        )}

        {/* ========================================================
            SKILLS (Ceramic Chips)
            ======================================================== */}
        {portfolio.skills && (
          <ZenSection className="space-y-6">
            <div className="flex items-center gap-4 text-[#2E2A25]/30">
              <span className="font-serif text-xs italic tracking-widest uppercase">Competencies</span>
              <div className="h-[0.75px] bg-[#2E2A25]/10 flex-1" />
            </div>

            {/* Ceramic Chip layout */}
            <div className="flex flex-wrap gap-3 py-2 justify-center">
              {parseTags(portfolio.skills).map((skill, index) => {
                return (
                  <div
                    key={index}
                    className="relative overflow-hidden group px-4 py-2.5 rounded-[18px] border border-[#E3DED5] bg-[#EFECE6] text-xs font-medium text-[#4a453e] select-none cursor-default shadow-[inset_0_1.5px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(46,42,37,0.03)] transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* Soft ripple overlay */}
                    <span className="absolute inset-0 bg-[#E3DED5] rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 ease-out origin-center opacity-30 pointer-events-none" />
                    <span className="relative z-10 font-mono tracking-wide uppercase text-[10px] sm:text-xs">
                      {skill}
                    </span>
                  </div>
                );
              })}
            </div>
          </ZenSection>
        )}

        {/* ========================================================
            CONTACT (Centered Ending)
            ======================================================== */}
        <ZenSection className="flex flex-col items-center pt-8 border-t border-dashed border-[#EBE7DF]">
          
          <h2 
            className="text-2xl font-normal text-[#2E2A25] font-serif tracking-wide text-center"
            style={{ fontFamily: "var(--font-noto-serif), serif" }}
          >
            Say Hello
          </h2>

          {portfolio.email && (
            <div className="py-4">
              <a
                href={`mailto:${portfolio.email}`}
                className="text-base sm:text-lg text-stone-500 hover:text-[#9A7D64] transition-colors border-b border-[#2E2A25]/10 hover:border-[#9A7D64]/30 pb-0.5 font-mono"
              >
                {portfolio.email}
              </a>
            </div>
          )}

          {/* Socials minimal block */}
          <div className="flex items-center gap-4 py-2">
            {portfolio.linkedin && (
              <a
                href={portfolio.linkedin.startsWith("http") ? portfolio.linkedin : `https://${portfolio.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-stone-400 hover:text-[#9A7D64] transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {portfolio.twitter && (
              <a
                href={portfolio.twitter.startsWith("http") ? portfolio.twitter : `https://${portfolio.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-stone-400 hover:text-[#9A7D64] transition-colors"
                title="Twitter/X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {portfolio.github && (
              <a
                href={portfolio.github.startsWith("http") ? portfolio.github : `https://${portfolio.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-stone-400 hover:text-[#9A7D64] transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Japanese-inspired seal/enso dot divider */}
          <div className="flex items-center justify-center gap-4 my-10 select-none pointer-events-none">
            <div className="w-16 h-[0.75px] bg-[#2e2a25]/15" />
            <div className="w-3.5 h-3.5 rounded-full border border-[#2e2a25]/20 bg-transparent flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-red-800/35" />
            </div>
            <div className="w-16 h-[0.75px] bg-[#2e2a25]/15" />
          </div>

          {/* Footer copyright */}
          <div className="text-[10px] font-mono tracking-widest text-stone-400 uppercase text-center space-y-1">
            <p>&copy; {new Date().getFullYear()} {portfolio.name}. All rights reserved.</p>
            <p className="opacity-50">Zen Atelier Edition // FolioFast</p>
          </div>
          
        </ZenSection>

      </div>
    </div>
  );
}
