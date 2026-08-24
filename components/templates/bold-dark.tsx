"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Twitter, Github, MapPin, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Experience } from "../ExperienceTimeline";

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

// Custom easing curve matching Apple/Linear/Vercel (cubic-bezier)
const easeOutCubic: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Staggered section entrance animations
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOutCubic,
      staggerChildren: 0.1,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOutCubic },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: easeOutCubic },
  },
};

// Staggered list container variants
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// Timeline item scroll entrance variant
const timelineItemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutCubic },
  },
};

export default function BoldDark({ portfolio }: TemplateProps) {
  // Parse tags helper
  const parseTags = (tagsStr: string) => {
    return tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  return (
    <div
      className="w-full min-h-screen bg-[#090909] text-white py-32 px-6 sm:px-12 md:px-24 overflow-y-auto selection:bg-[#4F8CFF] selection:text-black relative font-sans antialiased"
      style={{
        fontFamily:
          'var(--font-geist-sans), var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* 1. BACKGROUND EFFECTS: Animated aurora-like drifting radial gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Glow behind hero */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-[#4F8CFF]/[0.03] blur-[135px]"
        />

        {/* Glow behind projects */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -40, 0],
            scale: [1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[35%] right-[5%] w-[800px] h-[800px] rounded-full bg-indigo-500/[0.02] blur-[150px]"
        />

        {/* Glow near footer */}
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, 30, 50, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] rounded-full bg-[#4F8CFF]/[0.03] blur-[125px]"
        />
      </div>

      {/* 2. DECORATIVE ELEMENT: Ultra-light animated background grid texture */}
      <motion.div
        animate={{ opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"
        style={{
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black 70%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black 70%, transparent 100%)",
        }}
      />

      <div className="max-w-[850px] mx-auto space-y-40 relative z-10">
        
        {/* HERO SECTION */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-12 pt-8 md:pt-16 pb-8"
        >
          {/* Left Info Column */}
          <div className="flex-1 space-y-8 text-center md:text-left">
            <motion.h1
              variants={fadeUpVariants}
              className="text-5xl sm:text-7xl md:text-[80px] lg:text-[100px] font-black tracking-tight leading-[0.9] text-white"
            >
              {portfolio.name || "Your Name"}
            </motion.h1>

            <motion.div variants={fadeUpVariants} className="space-y-3">
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {portfolio.headline || "Your Professional Headline"}
              </p>
              {portfolio.location && (
                <div className="inline-flex items-center gap-2 text-xs font-bold text-zinc-550 tracking-widest uppercase select-none">
                  <MapPin className="w-4 h-4 text-[#4F8CFF]" />
                  <span>{portfolio.location}</span>
                </div>
              )}
            </motion.div>

            {portfolio.bio && (
              <motion.p
                variants={fadeUpVariants}
                className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-[60ch] mx-auto md:mx-0 font-medium"
              >
                {portfolio.bio}
              </motion.p>
            )}

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2"
            >
              {portfolio.email && (
                <a
                  href={`mailto:${portfolio.email}`}
                  className="px-8 py-3.5 bg-[#4F8CFF] hover:bg-[#3D7BE6] text-white text-sm font-semibold rounded-full shadow-[0_0_20px_rgba(79,140,255,0.2)] hover:shadow-[0_0_30px_rgba(79,140,255,0.4)] transition-all duration-300 hover:-translate-y-0.5 active:scale-98"
                >
                  Get in Touch
                </a>
              )}
              <a
                href="#projects"
                className="px-8 py-3.5 bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white text-sm font-semibold rounded-full backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 active:scale-98"
              >
                View Projects
              </a>
            </motion.div>
          </div>

          {/* Right Floating Profile Image with layered glowing gradients */}
          {portfolio.photo && (
            <motion.div
              variants={imageVariants}
              className="relative flex-shrink-0 w-60 h-60 sm:w-72 sm:h-72 self-center md:self-start mt-4"
            >
              {/* Blurred background glow */}
              <motion.div
                animate={{
                  scale: [1, 1.06, 0.94, 1],
                  opacity: [0.4, 0.6, 0.35, 0.4],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-4 bg-gradient-to-tr from-[#4F8CFF]/20 to-indigo-500/20 rounded-full blur-2xl pointer-events-none"
              />

              {/* Floating glass container */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full rounded-[32px] bg-white/[0.02] backdrop-blur-md border border-white/[0.08] p-4 flex items-center justify-center shadow-2xl relative overflow-hidden"
              >
                <Image
                  src={portfolio.photo}
                  alt={`${portfolio.name} profile photo`}
                  width={288}
                  height={288}
                  className="w-full h-full object-cover rounded-[24px]"
                  priority
                />

                {/* Glass reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />
              </motion.div>
            </motion.div>
          )}
        </motion.section>

        {/* ABOUT SECTION (Large glassmorphism panel) */}
        {portfolio.about && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="flex justify-center py-8"
          >
            <div className="w-full max-w-[760px] rounded-[32px] bg-white/[0.015] backdrop-blur-md border border-white/[0.07] p-8 md:p-12 shadow-2xl flex flex-col items-center space-y-6 relative overflow-hidden group">
              {/* Subtle accent border lighting */}
              <div className="absolute inset-0 border border-[#4F8CFF]/5 rounded-[32px] pointer-events-none" />

              <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-zinc-550">About</h2>
              <div className="text-zinc-300 text-base sm:text-lg leading-[1.8] max-w-[700px] text-center whitespace-pre-wrap font-medium">
                {portfolio.about}
              </div>
            </div>
          </motion.section>
        )}

        {/* PROJECTS SECTION */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <motion.section
            id="projects"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="space-y-12 scroll-mt-20"
          >
            <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-zinc-550">Projects</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {portfolio.projects.map((project) => {
                const projectTags = parseTags(project.tags);
                const hasLink = Boolean(project.link);
                const projectLink = hasLink
                  ? project.link.startsWith("http")
                    ? project.link
                    : `https://${project.link}`
                  : null;

                return (
                  <motion.div
                    key={project.id}
                    variants={fadeUpVariants}
                    className="h-full"
                  >
                    {projectLink ? (
                      <a
                        href={projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full group"
                      >
                        <ProjectCard
                          project={project}
                          tags={projectTags}
                          isClickable={true}
                        />
                      </a>
                    ) : (
                      <ProjectCard
                        project={project}
                        tags={projectTags}
                        isClickable={false}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* EXPERIENCE SECTION */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="space-y-12"
          >
            <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-zinc-555">Experience</h2>

            <motion.div
              variants={listVariants}
              className="relative space-y-12 ml-4 md:ml-5"
            >
              {/* Vertical timeline line with glowing electric blue halo */}
              <div className="absolute left-[16px] md:left-[20px] top-4 bottom-4 w-[1px] bg-white/[0.08] shadow-[0_0_8px_rgba(79,140,255,0.2)]" />

              {portfolio.experience.map((exp) => {
                const logoLetters = exp.company.slice(0, 2).toUpperCase();
                return (
                  <motion.div
                    key={exp.id}
                    variants={timelineItemVariants}
                    className="relative pl-12 md:pl-16 flex flex-col gap-3"
                  >
                    {/* Glowing Circular Badge Centered on Line */}
                    <div className="absolute left-0 top-0.5 w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-white/[0.08] bg-[#090909] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(79,140,255,0.08)] z-10">
                      {exp.isCurrent && (
                        <div className="absolute inset-0 rounded-full border border-[#4F8CFF] animate-pulse opacity-40" />
                      )}
                      {exp.companyLogo ? (
                        <Image
                          src={exp.companyLogo}
                          alt={exp.company}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-xs font-bold text-zinc-400 uppercase">
                          {logoLetters}
                        </span>
                      )}
                    </div>

                    {/* Experience Info */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                            {exp.jobTitle}
                          </h3>
                          <div className="text-xs sm:text-sm font-semibold text-zinc-400">
                            {exp.company} &middot; {exp.employmentType}
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-zinc-550 uppercase tracking-wider">
                          {exp.startMonth} {exp.startYear} &ndash;{" "}
                          {exp.isCurrent
                            ? "Present"
                            : `${exp.endMonth} ${exp.endYear}`}
                        </div>
                      </div>

                      <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {exp.description}
                      </p>

                      {exp.skills && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {exp.skills.split(",").map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] font-bold uppercase tracking-wider bg-white/[0.015] border border-white/[0.07] text-zinc-400 px-2 py-0.5 rounded-full"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.section>
        )}

        {/* SKILLS SECTION */}
        {portfolio.skills && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            className="space-y-12"
          >
            <h2 className="text-xs uppercase tracking-[0.25em] font-bold text-zinc-555">Skills</h2>

            <motion.div
              variants={listVariants}
              className="flex flex-wrap gap-3"
            >
              {parseTags(portfolio.skills).map((skill, index) => (
                <motion.span
                  key={index}
                  variants={fadeUpVariants}
                  whileHover={{
                    scale: 1.08,
                    rotate: 2,
                    borderColor: "rgba(79, 140, 255, 0.4)",
                    boxShadow: "0 0 16px rgba(79, 140, 255, 0.15)",
                    color: "#ffffff",
                    backgroundColor: "rgba(79, 140, 255, 0.04)",
                    transition: { duration: 0.25, ease: easeOutCubic },
                  }}
                  className="border border-white/[0.08] bg-white/[0.015] text-zinc-350 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold select-none cursor-default shadow-xs transition-colors duration-300"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* CONTACT SECTION (Dark glass footer) */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="pt-32 pb-16 border-t border-white/[0.08] flex flex-col items-center justify-center gap-8"
        >
          {portfolio.email && (
            <motion.a
              variants={fadeUpVariants}
              href={`mailto:${portfolio.email}`}
              className="text-2xl sm:text-3xl font-extrabold text-white hover:text-[#4F8CFF] hover:shadow-[0_0_30px_rgba(79,140,255,0.1)] transition-colors tracking-tight"
            >
              {portfolio.email}
            </motion.a>
          )}

          <motion.div
            variants={fadeUpVariants}
            className="flex items-center gap-6"
          >
            {portfolio.linkedin && (
              <motion.a
                href={
                  portfolio.linkedin.startsWith("http")
                    ? portfolio.linkedin
                    : `https://${portfolio.linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  rotate: 12,
                  scale: 1.12,
                  borderColor: "rgba(79, 140, 255, 0.4)",
                  boxShadow: "0 0 16px rgba(79, 140, 255, 0.15)",
                  color: "#4F8CFF",
                }}
                className="w-12 h-12 rounded-full border border-white/[0.08] bg-white/[0.015] flex items-center justify-center text-zinc-400 hover:text-[#4F8CFF] transition-all duration-355"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            )}
            {portfolio.twitter && (
              <motion.a
                href={
                  portfolio.twitter.startsWith("http")
                    ? portfolio.twitter
                    : `https://${portfolio.twitter}`
                }
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  rotate: 12,
                  scale: 1.12,
                  borderColor: "rgba(79, 140, 255, 0.4)",
                  boxShadow: "0 0 16px rgba(79, 140, 255, 0.15)",
                  color: "#4F8CFF",
                }}
                className="w-12 h-12 rounded-full border border-white/[0.08] bg-white/[0.015] flex items-center justify-center text-zinc-400 hover:text-[#4F8CFF] transition-all duration-355"
                title="Twitter/X"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
            )}
            {portfolio.github && (
              <motion.a
                href={
                  portfolio.github.startsWith("http")
                    ? portfolio.github
                    : `https://${portfolio.github}`
                }
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  rotate: 12,
                  scale: 1.12,
                  borderColor: "rgba(79, 140, 255, 0.4)",
                  boxShadow: "0 0 16px rgba(79, 140, 255, 0.15)",
                  color: "#4F8CFF",
                }}
                className="w-12 h-12 rounded-full border border-white/[0.08] bg-white/[0.015] flex items-center justify-center text-zinc-400 hover:text-[#4F8CFF] transition-all duration-355"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </motion.a>
            )}
          </motion.div>

          <motion.p
            variants={fadeUpVariants}
            className="text-[10px] text-zinc-550 font-bold uppercase tracking-widest"
          >
            &copy; {new Date().getFullYear()} {portfolio.name || "Portfolio"}.
            Built with FolioFast.
          </motion.p>
        </motion.section>
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  tags: string[];
  isClickable: boolean;
}

function ProjectCard({ project, tags, isClickable }: ProjectCardProps) {
  // spotlight mouse tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover="hover"
      variants={{
        hover: {
          y: -8,
          boxShadow: "0 24px 48px -15px rgba(0,0,0,0.45)",
          borderColor: "rgba(79, 140, 255, 0.2)",
          transition: { duration: 0.45, ease: easeOutCubic },
        },
      }}
      className="group relative flex flex-col h-full bg-[#121212]/30 backdrop-blur-md border border-white/[0.07] rounded-[28px] overflow-hidden transition-all duration-400 shadow-xl"
    >
      {/* Dynamic Mouse Spotlight overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(79, 140, 255, 0.06), transparent 80%)`,
        }}
      />

      {/* Dynamic Border Spotlight overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[28px] border border-[#4F8CFF]/15 z-0"
        style={{
          maskImage: `radial-gradient(180px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent)`,
          WebkitMaskImage: `radial-gradient(180px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), black, transparent)`,
        }}
      />

      {/* Cover Image */}
      {project.cover ? (
        <div className="w-full h-56 sm:h-64 overflow-hidden bg-zinc-950 relative border-b border-white/[0.06] z-10">
          <motion.div
            variants={{
              hover: {
                scale: 1.04,
                transition: { duration: 0.6, ease: easeOutCubic },
              },
            }}
            className="w-full h-full relative"
          >
            <Image
              src={project.cover}
              alt={project.title}
              fill
              sizes="(max-w-720px) 100vw, 360px"
              className="object-cover"
            />
          </motion.div>
        </div>
      ) : (
        <div className="w-full h-56 sm:h-64 bg-white/[0.01] border-b border-white/[0.06] flex items-center justify-center relative overflow-hidden z-10">
          {/* Futuristic blueprint layout wireframe */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4F8CFF]/5 to-transparent" />
          <svg
            className="w-full h-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-[400ms]"
            viewBox="0 0 200 100"
            fill="none"
          >
            <line
              x1="0"
              y1="50"
              x2="200"
              y2="50"
              stroke="#FFFFFF"
              strokeWidth="0.5"
            />
            <line
              x1="100"
              y1="0"
              x2="100"
              y2="100"
              stroke="#FFFFFF"
              strokeWidth="0.5"
            />
            <circle
              cx="100"
              cy="50"
              r="30"
              stroke="#FFFFFF"
              strokeWidth="0.5"
            />
          </svg>
          <span className="absolute text-[9px] tracking-[0.2em] uppercase font-mono text-zinc-550">
            [ Showcase Asset ]
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-8 flex flex-col flex-1 space-y-4 z-10">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-lg text-white tracking-tight leading-snug group-hover:text-[#4F8CFF] transition-colors duration-300">
            {project.title || "Untitled Project"}
          </h3>
          {isClickable && (
            <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-[#4F8CFF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
          )}
        </div>

        <p className="text-zinc-400 text-sm leading-relaxed flex-1 font-medium">
          {project.description || "Project description goes here."}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {tags.map((tag, tagIndex) => (
              <motion.span
                key={tagIndex}
                custom={tagIndex}
                variants={{
                  hover: (index: number) => ({
                    y: -3,
                    transition: {
                      delay: index * 0.04,
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  }),
                }}
                className="text-[10px] font-bold uppercase tracking-wider bg-white/[0.02] border border-white/[0.08] text-zinc-400 px-2.5 py-1 rounded-full transition-colors duration-300"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
