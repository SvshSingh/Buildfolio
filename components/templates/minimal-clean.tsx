"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Linkedin,
  Twitter,
  Github,
  MapPin,
  ArrowUpRight,
  Check,
  Copy,
  Sparkles,
  Briefcase,
  Code2,
  User,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
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

// Custom easing curve matching Apple/Linear (cubic-bezier)
const easeOutCubic: [number, number, number, number] = [0.16, 1, 0.3, 1];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeOutCubic,
      staggerChildren: 0.08,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutCubic },
  },
};

export default function MinimalClean({ portfolio }: TemplateProps) {
  const [copied, setCopied] = useState(false);

  const parseTags = (tagsStr: string) => {
    if (!tagsStr) return [];
    return tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const handleCopyEmail = () => {
    if (!portfolio.email) return;
    navigator.clipboard.writeText(portfolio.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const projectList = portfolio.projects || [];
  const skillsList = parseTags(portfolio.skills);
  const experienceList = portfolio.experience || [];

  return (
    <div
      className="w-full min-h-screen bg-[#FAFAFC] text-zinc-900 py-6 px-4 sm:px-8 md:px-12 selection:bg-zinc-900 selection:text-white relative font-sans antialiased overflow-x-hidden"
      style={{
        fontFamily:
          'var(--font-geist-sans), var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Background Micro Grid Pattern & Subtle Gradient Light */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-zinc-200/50 via-zinc-100/20 to-transparent blur-[120px] opacity-70" />
      </div>

      {/* Floating Sticky Navigation Glass Header */}
      <header className="sticky top-4 z-50 max-w-[840px] mx-auto mb-12 sm:mb-16">
        <div className="px-4 py-2.5 rounded-full border border-zinc-200/80 bg-white/80 backdrop-blur-md shadow-xs flex items-center justify-between gap-4">
          <a
            href="#hero"
            className="flex items-center gap-2.5 group transition-opacity hover:opacity-80"
          >
            {portfolio.photo ? (
              <Image
                src={portfolio.photo}
                alt={portfolio.name || "Avatar"}
                width={28}
                height={28}
                className="w-7 h-7 rounded-full object-cover border border-zinc-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white font-semibold text-xs flex items-center justify-center">
                {(portfolio.name || "P").charAt(0)}
              </div>
            )}
            <span className="text-xs font-semibold text-zinc-800 tracking-tight hidden sm:inline">
              {portfolio.name || "Portfolio"}
            </span>
          </a>

          {/* Quick Nav Links */}
          <nav className="flex items-center gap-1 sm:gap-4 text-xs font-medium text-zinc-500">
            {portfolio.about && (
              <a
                href="#about"
                className="px-2.5 py-1 rounded-full hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                About
              </a>
            )}
            {projectList.length > 0 && (
              <a
                href="#projects"
                className="px-2.5 py-1 rounded-full hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                Work
              </a>
            )}
            {experienceList.length > 0 && (
              <a
                href="#experience"
                className="px-2.5 py-1 rounded-full hover:text-zinc-900 hover:bg-zinc-100 transition-colors hidden sm:inline"
              >
                Experience
              </a>
            )}
            {skillsList.length > 0 && (
              <a
                href="#skills"
                className="px-2.5 py-1 rounded-full hover:text-zinc-900 hover:bg-zinc-100 transition-colors hidden md:inline"
              >
                Skills
              </a>
            )}
          </nav>

          {/* Copy Email Button */}
          {portfolio.email && (
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-200 shadow-2xs active:scale-95 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[840px] mx-auto space-y-28 sm:space-y-36 relative z-10">
        
        {/* HERO SECTION */}
        <motion.section
          id="hero"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 pt-2"
        >
          {/* Status Indicator Badge */}
          <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Available for projects & roles
            </span>
          </motion.div>

          <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="space-y-4 flex-1">
              <motion.h1
                variants={fadeUpVariants}
                className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-950 leading-[1.05]"
              >
                {portfolio.name || "Your Name"}
              </motion.h1>

              <motion.div variants={fadeUpVariants} className="space-y-2">
                <p className="text-lg sm:text-2xl font-semibold text-zinc-700 tracking-tight leading-snug">
                  {portfolio.headline || "Digital Craftsman & Software Engineer"}
                </p>

                {portfolio.location && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{portfolio.location}</span>
                  </div>
                )}
              </motion.div>
            </div>

            {portfolio.photo && (
              <motion.div
                variants={fadeUpVariants}
                className="relative flex-shrink-0 group"
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden p-1 bg-white border border-zinc-200 shadow-md group-hover:shadow-xl group-hover:border-zinc-300 transition-all duration-300">
                  <Image
                    src={portfolio.photo}
                    alt={portfolio.name || "Profile"}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover rounded-[20px] transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </div>
              </motion.div>
            )}
          </div>

          {portfolio.bio && (
            <motion.p
              variants={fadeUpVariants}
              className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-[62ch] font-normal"
            >
              {portfolio.bio}
            </motion.p>
          )}

          {/* Social Links & Action Pill Bar */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            {portfolio.email && (
              <a
                href={`mailto:${portfolio.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <Mail className="w-4 h-4 text-zinc-300" />
                <span>Get in touch</span>
              </a>
            )}

            <div className="flex items-center gap-2">
              {portfolio.github && (
                <a
                  href={
                    portfolio.github.startsWith("http")
                      ? portfolio.github
                      : `https://${portfolio.github}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 transition-all hover:-translate-y-0.5 shadow-2xs"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {portfolio.linkedin && (
                <a
                  href={
                    portfolio.linkedin.startsWith("http")
                      ? portfolio.linkedin
                      : `https://${portfolio.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 transition-all hover:-translate-y-0.5 shadow-2xs"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {portfolio.twitter && (
                <a
                  href={
                    portfolio.twitter.startsWith("http")
                      ? portfolio.twitter
                      : `https://${portfolio.twitter}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 transition-all hover:-translate-y-0.5 shadow-2xs"
                  title="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        </motion.section>

        {/* ABOUT SECTION */}
        {portfolio.about && (
          <motion.section
            id="about"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
                [ 01 / ABOUT ]
              </span>
              <div className="h-[1px] flex-1 bg-zinc-200/80" />
            </div>

            <div className="bg-white/80 border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-xs backdrop-blur-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-zinc-900 rounded-l-3xl" />
              <p className="text-zinc-700 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-normal">
                {portfolio.about}
              </p>
            </div>
          </motion.section>
        )}

        {/* PROJECTS SECTION */}
        {projectList.length > 0 && (
          <motion.section
            id="projects"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8 scroll-mt-24"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
                  [ 02 / FEATURED WORK ]
                </span>
                <div className="h-[1px] flex-1 bg-zinc-200/80" />
              </div>
              <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-full border border-zinc-200">
                {projectList.length} {projectList.length === 1 ? "Project" : "Projects"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {projectList.map((project) => {
                const projectTags = parseTags(project.tags);
                const hasLink = Boolean(project.link);
                const projectLink = hasLink
                  ? project.link.startsWith("http")
                    ? project.link
                    : `https://${project.link}`
                  : null;

                const cardContent = (
                  <div className="group h-full bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-zinc-950/5 flex flex-col justify-between">
                    {/* Project Image / Cover Mockup */}
                    {project.cover ? (
                      <div className="w-full h-48 sm:h-56 overflow-hidden bg-zinc-100 relative border-b border-zinc-100">
                        <Image
                          src={project.cover}
                          alt={project.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 400px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200/60 border-b border-zinc-100 flex items-center justify-center relative overflow-hidden group-hover:from-zinc-100 group-hover:to-zinc-200 transition-colors">
                        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                        <div className="text-center space-y-1 z-10 px-4">
                          <Code2 className="w-6 h-6 text-zinc-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
                          <span className="block text-[10px] tracking-widest uppercase font-mono text-zinc-400 font-semibold">
                            {project.title || "Project Preview"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-lg text-zinc-900 tracking-tight leading-snug group-hover:text-black">
                            {project.title || "Untitled Project"}
                          </h3>
                          {hasLink && (
                            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0 mt-1" />
                          )}
                        </div>

                        <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed line-clamp-3 font-normal">
                          {project.description || "No description provided."}
                        </p>
                      </div>

                      {projectTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {projectTags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 text-zinc-600 px-2.5 py-0.5 rounded-full border border-zinc-200/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );

                return (
                  <motion.div key={project.id} variants={fadeUpVariants} className="h-full">
                    {projectLink ? (
                      <a
                        href={projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full cursor-pointer"
                      >
                        {cardContent}
                      </a>
                    ) : (
                      cardContent
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* EXPERIENCE SECTION */}
        {experienceList.length > 0 && (
          <motion.section
            id="experience"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
                [ 03 / EXPERIENCE ]
              </span>
              <div className="h-[1px] flex-1 bg-zinc-200/80" />
            </div>

            <div className="space-y-6 relative before:absolute before:left-6 before:top-3 before:bottom-3 before:w-[1px] before:bg-zinc-200">
              {experienceList.map((exp) => {
                const logoLetters = exp.company ? exp.company.slice(0, 2).toUpperCase() : "CO";
                return (
                  <motion.div
                    key={exp.id}
                    variants={fadeUpVariants}
                    className="relative pl-14 flex flex-col gap-2 group"
                  >
                    {/* Node Circle Logo */}
                    <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-center text-xs font-bold text-zinc-700 overflow-hidden group-hover:border-zinc-400 transition-colors z-10">
                      {exp.companyLogo ? (
                        <Image
                          src={exp.companyLogo}
                          alt={exp.company}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{logoLetters}</span>
                      )}
                    </div>

                    <div className="bg-white/90 border border-zinc-200/80 rounded-2xl p-5 shadow-xs space-y-2 hover:border-zinc-300 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h3 className="font-bold text-base sm:text-lg text-zinc-900 tracking-tight">
                            {exp.jobTitle}
                          </h3>
                          <p className="text-xs font-semibold text-zinc-500">
                            {exp.company} &middot; {exp.employmentType}
                          </p>
                        </div>

                        <span className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wide bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-200/60 self-start sm:self-auto">
                          {exp.startMonth} {exp.startYear} &ndash;{" "}
                          {exp.isCurrent ? "Present" : `${exp.endMonth} ${exp.endYear}`}
                        </span>
                      </div>

                      {exp.description && (
                        <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap pt-1 font-normal">
                          {exp.description}
                        </p>
                      )}

                      {exp.skills && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {parseTags(exp.skills).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] font-medium bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md border border-zinc-200/50"
                            >
                              {skill}
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
        {skillsList.length > 0 && (
          <motion.section
            id="skills"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6 scroll-mt-24"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
                [ 04 / SKILLS & STACK ]
              </span>
              <div className="h-[1px] flex-1 bg-zinc-200/80" />
            </div>

            <div className="flex flex-wrap gap-2.5">
              {skillsList.map((skill, index) => (
                <motion.span
                  key={index}
                  variants={fadeUpVariants}
                  whileHover={{ y: -2 }}
                  className="px-4 py-2 rounded-xl border border-zinc-200/80 bg-white text-zinc-700 text-xs sm:text-sm font-semibold hover:border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-200 shadow-2xs cursor-default select-none"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.section>
        )}

        {/* CONTACT / FOOTER SECTION */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="pt-16 pb-12 border-t border-zinc-200/80 space-y-12 text-center"
        >
          <div className="space-y-4 max-w-[540px] mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
              Let&apos;s work together
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base leading-relaxed">
              Have a project in mind or interested in collaborating? Feel free to reach out.
            </p>
          </div>

          {portfolio.email && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-zinc-900 text-white hover:bg-zinc-800 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-zinc-300" />
                    <span>{portfolio.email}</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-6 pt-4">
            {portfolio.github && (
              <a
                href={
                  portfolio.github.startsWith("http")
                    ? portfolio.github
                    : `https://${portfolio.github}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-wider"
              >
                GitHub
              </a>
            )}
            {portfolio.linkedin && (
              <a
                href={
                  portfolio.linkedin.startsWith("http")
                    ? portfolio.linkedin
                    : `https://${portfolio.linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-wider"
              >
                LinkedIn
              </a>
            )}
            {portfolio.twitter && (
              <a
                href={
                  portfolio.twitter.startsWith("http")
                    ? portfolio.twitter
                    : `https://${portfolio.twitter}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-wider"
              >
                Twitter/X
              </a>
            )}
          </div>

          <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest pt-4">
            &copy; {new Date().getFullYear()} {portfolio.name || "Portfolio"}. Designed with FolioFast.
          </p>
        </motion.section>

      </main>
    </div>
  );
}
