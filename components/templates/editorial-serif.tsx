"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Experience } from "../ExperienceTimeline";
import Image from "next/image";

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

export default function EditorialSerif({ portfolio }: TemplateProps) {
  const parseTags = (tagsStr: string) => {
    return tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  // Page turn reveal: mimics unfolding or sliding open a printed magazine page
  const pageTurnReveal = {
    initial: { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)", opacity: 0.6, y: 15 },
    whileInView: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", opacity: 1, y: 0 },
    viewport: { once: true, margin: "-10%" },
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
  };

  // Image fade into print quality (grayscale + blur into sharp full color)
  const printImageFade = {
    initial: { filter: "grayscale(100%) contrast(1.15) blur(4px)", scale: 1.03, opacity: 0.85 },
    whileInView: { filter: "grayscale(0%) contrast(1) blur(0px)", scale: 1, opacity: 1 },
    viewport: { once: true, margin: "-10%" },
    transition: { duration: 1.4, ease: "easeOut" as const },
  };

  return (
    <div
      className="w-full min-h-screen bg-[#FDFBF7] text-[#1C1A18] py-12 px-6 sm:px-12 md:px-24 select-none font-sans antialiased"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-24">
        
        {/* HERO SECTION - MAGAZINE COVER */}
        <motion.section
          {...pageTurnReveal}
          className="min-h-screen flex flex-col justify-between py-12 border-b border-[#1C1A18]/15 relative"
        >
          {/* Cover Header */}
          <div className="grid grid-cols-2 gap-4 text-[10px] tracking-[0.25em] text-stone-400 uppercase border-b border-[#1C1A18]/10 pb-3 font-semibold">
            <div className="space-y-1">
              <span className="text-[#6B1D2F] block">COLLECTOR&apos;S EDITION</span>
              <span className="block">VOL. 01 / ISSUE NO. 12</span>
            </div>
            <div className="text-right space-y-1">
              <span className="text-stone-700 block">{portfolio.location || "WORLDWIDE"}</span>
              <span className="block">EST. {new Date().getFullYear()}</span>
            </div>
          </div>

          {/* Cover Content */}
          <div className="my-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-8">
            {/* Left Column: Cover Story Highlights */}
            <div className="hidden md:flex md:col-span-3 flex-col gap-6 text-left border-r border-[#1C1A18]/10 pr-6">
              <div>
                <span className="text-[9px] font-bold tracking-widest text-[#6B1D2F] uppercase block">
                  IN THIS ISSUE
                </span>
                <h4 className="text-sm font-serif italic text-stone-800 mt-1.5 leading-relaxed">
                  The complete works and visual essay of a modern creator
                </h4>
              </div>
              <hr className="border-[#1C1A18]/10" />
              <div>
                <span className="text-[9px] font-bold tracking-widest text-stone-400 uppercase block">
                  SELECTED WORK
                </span>
                <span className="text-xs font-medium uppercase tracking-wider block mt-1.5 text-stone-700 font-semibold">
                  Case Studies & Development
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold tracking-widest text-stone-400 uppercase block">
                  THE CV CHRONOLOGY
                </span>
                <span className="text-xs font-medium uppercase tracking-wider block mt-1.5 text-stone-700 font-semibold">
                  A Timeline of Professional Experience
                </span>
              </div>
            </div>

            {/* Center Column: Masthead & Portrait */}
            <div className="md:col-span-6 text-center flex flex-col items-center justify-center">
              {/* Huge Serif Name (Masthead) */}
              <div className="overflow-hidden select-none py-1.5 w-full">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as const }}
                  className="text-5xl sm:text-7xl md:text-[80px] lg:text-[95px] font-light tracking-tight text-stone-900 leading-[0.85] font-serif uppercase"
                >
                  {portfolio.name || "Your Name"}
                </motion.h1>
              </div>

              {/* Portrait treated like a fashion portrait */}
              <div className="flex justify-center my-8">
                {portfolio.photo ? (
                  <motion.div
                    {...printImageFade}
                    className="w-48 h-64 sm:w-56 sm:h-76 md:w-60 md:h-80 relative overflow-hidden border border-stone-850/10 shadow-2xl bg-stone-150 aspect-[3/4]"
                  >
                    <Image
                      src={portfolio.photo}
                      alt={`${portfolio.name} profile photo`}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-w-640px) 200px, 300px"
                    />
                    {/* Fashion Portrait Overlay Frame */}
                    <div className="absolute inset-2.5 border border-white/25 pointer-events-none" />
                  </motion.div>
                ) : (
                  <div className="w-48 h-64 bg-stone-200 border border-stone-300 flex items-center justify-center text-[10px] tracking-widest text-stone-400 uppercase">
                    No portrait
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#6B1D2F] block">
                  {portfolio.headline || "CREATIVE PORTFOLIO"}
                </span>
                {portfolio.bio && (
                  <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed italic">
                    &ldquo;{portfolio.bio}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Mini Colophon / Index */}
            <div className="hidden md:flex md:col-span-3 flex-col gap-6 text-right border-l border-[#1C1A18]/10 pl-6">
              <div>
                <span className="text-[9px] font-bold tracking-widest text-[#6B1D2F] uppercase block">
                  CURRICULUM VITAE
                </span>
                <h4 className="text-sm font-serif italic text-stone-800 mt-1.5 leading-relaxed">
                  Chronology of creative and technical tenures
                </h4>
              </div>
              <hr className="border-[#1C1A18]/10" />
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold tracking-widest text-stone-400 uppercase block font-semibold">
                  INDEX SUMMARY
                </span>
                <span className="text-[10px] block text-stone-600 uppercase font-medium">
                  SECTION I: THE CREATIVE ESSAY
                </span>
                <span className="text-[10px] block text-stone-600 uppercase font-medium">
                  SECTION II: PORTFOLIO PLATES
                </span>
                <span className="text-[10px] block text-stone-600 uppercase font-medium">
                  SECTION III: CHRONOLOGY REGISTER
                </span>
              </div>
            </div>
          </div>

          {/* Cover Footer */}
          <div className="border-t border-[#1C1A18]/10 pt-4 text-center">
            <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400 font-bold">
              SCROLL TO OPEN PORTFOLIO // VOL. I NO. 12
            </span>
          </div>
        </motion.section>

        {/* ABOUT SECTION - THE ESSAY */}
        {portfolio.about && (
          <motion.section
            {...pageTurnReveal}
            className="py-16 md:py-24 border-b border-[#1C1A18]/15 relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center text-[10px] tracking-[0.25em] text-stone-400 uppercase mb-16 border-b border-[#1C1A18]/10 pb-3 font-semibold">
              <span>SECTION I // THE CREATIVE ESSAY</span>
              <span>EDITOR&apos;S NOTE // PAGE 02</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
              {/* Side Note column */}
              <div className="md:col-span-3 space-y-4 text-left border-l-2 border-[#6B1D2F] pl-4 md:border-l-0 md:pl-0 md:text-right md:pr-6 md:border-r md:border-stone-200">
                <span className="text-[10px] font-bold tracking-widest text-[#6B1D2F] uppercase block font-semibold">
                  AUTHOR PROFILE
                </span>
                <div className="text-[11px] text-stone-500 leading-relaxed uppercase tracking-wider space-y-2 font-medium">
                  <p>NAME: {portfolio.name}</p>
                  <p>FOCUS: {parseTags(portfolio.skills)[0] || "DEVELOPER"}</p>
                  <p>LOC. {portfolio.location || "WORLDWIDE"}</p>
                </div>
              </div>

              {/* Reading column */}
              <div className="md:col-span-9 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-6 italic leading-tight">
                  Introduction & Creative Philosophy
                </h2>
                <div className="text-base sm:text-[17px] text-stone-700 leading-relaxed font-sans text-justify">
                  <span className="float-left text-6xl md:text-7xl font-serif font-light text-[#6B1D2F] mr-3 mt-1.5 leading-[0.8] select-none">
                    {portfolio.about.charAt(0)}
                  </span>
                  {portfolio.about.slice(1)}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* PROJECTS SECTION - MAGAZINE SPREADS */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <motion.section
            {...pageTurnReveal}
            className="space-y-4"
          >
            <div className="flex justify-between items-center text-[10px] tracking-[0.25em] text-stone-400 uppercase mb-16 border-b border-[#1C1A18]/10 pb-3 font-semibold">
              <span>SECTION II // PORTFOLIO PLATES</span>
              <span>FEATURED SPREADS // INDEX</span>
            </div>

            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight font-serif text-stone-900">
                Selected Works
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B1D2F] mt-2 font-semibold font-semibold">
                An exhibition of modern execution and design
              </p>
            </div>

            <div className="flex flex-col">
              {portfolio.projects.map((project, idx) => {
                const projectTags = parseTags(project.tags);
                const hasLink = Boolean(project.link);
                const isEven = idx % 2 === 0;
                const pageNum = String(idx * 6 + 4).padStart(2, '0');

                return (
                  <div
                    key={project.id}
                    className="min-h-screen flex flex-col justify-center border-b border-[#1C1A18]/10 py-16 md:py-24 relative"
                  >
                    {/* Spread Header */}
                    <div className="flex justify-between items-center text-[10px] tracking-[0.25em] text-stone-400 uppercase mb-8 border-b border-[#1C1A18]/5 pb-3">
                      <span>FEATURED STORY // {project.title || "UNTITLED PROJECT"}</span>
                      <span>PLATE {String(idx + 1).padStart(2, '0')} // PAGE {pageNum}</span>
                    </div>

                    {/* Spread Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                      {/* Cover Photo Block */}
                      <div className={`lg:col-span-7 ${isEven ? "lg:order-2" : ""}`}>
                        <motion.div
                          {...printImageFade}
                          className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-stone-100 border border-stone-800/10 overflow-hidden group shadow-lg"
                        >
                          {project.cover ? (
                            <Image
                              src={project.cover}
                              alt={project.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-103"
                              sizes="(max-w-1024px) 100vw, 700px"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-stone-150">
                              <span className="text-[9px] tracking-widest text-stone-400 uppercase font-medium">NO PHOTOGRAPHIC PREVIEW AVAILABLE</span>
                            </div>
                          )}
                          {/* Photo Caption Label */}
                          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 text-[9px] text-[#FDFBF7] tracking-wider uppercase font-sans">
                            PLATE {String(idx + 1).padStart(2, '0')} &copy; {portfolio.name}
                          </div>
                        </motion.div>
                        <div className="mt-2 text-right">
                          <span className="text-[9px] italic text-stone-400 tracking-wider font-serif uppercase">
                            Image credits: Photography by {portfolio.name}
                          </span>
                        </div>
                      </div>

                      {/* Details Block */}
                      <div className={`lg:col-span-5 flex flex-col justify-center space-y-6 ${isEven ? "lg:order-1" : ""}`}>
                        <div className="space-y-2">
                          <div className="overflow-hidden">
                            <motion.span
                              initial={{ y: "100%" }}
                              whileInView={{ y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, ease: "easeOut" as const }}
                              className="text-xs font-bold tracking-[0.2em] text-[#6B1D2F] uppercase block"
                            >
                              CASE STUDY NO. {String(idx + 1).padStart(2, '0')}
                            </motion.span>
                          </div>
                          <div className="overflow-hidden">
                            <motion.h3
                              initial={{ y: "100%" }}
                              whileInView={{ y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
                              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-stone-900 leading-tight font-serif"
                            >
                              {project.title || "Untitled Project"}
                            </motion.h3>
                          </div>
                        </div>

                        <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-sans text-justify">
                          {project.description || "No project description provided."}
                        </p>

                        {projectTags.length > 0 && (
                          <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-2">
                            {projectTags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] font-bold uppercase tracking-widest text-[#6B1D2F]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {hasLink && (
                          <div className="pt-4">
                            <a
                              href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 group text-xs uppercase tracking-[0.2em] font-bold text-stone-850 hover:text-[#6B1D2F] transition-colors border-b border-stone-800 hover:border-[#6B1D2F] pb-1"
                            >
                              Launch Feature
                              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* EXPERIENCE SECTION - THE CHRONOLOGY */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <motion.section
            {...pageTurnReveal}
            className="py-16 md:py-24 border-b border-[#1C1A18]/15 relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center text-[10px] tracking-[0.25em] text-stone-400 uppercase mb-16 border-b border-[#1C1A18]/10 pb-3 font-semibold">
              <span>SECTION III // CURRICULUM VITAE</span>
              <span>CHRONOLOGICAL REGISTER // PAGE 24</span>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extralight tracking-tight font-serif text-stone-900">
                  Publication Chronology
                </h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B1D2F] mt-2 font-semibold font-semibold">
                  A career documented through time
                </p>
              </div>

              <div className="flex flex-col">
                {portfolio.experience.map((exp, idx) => {
                  const parsedSkills = exp.skills
                    ? exp.skills.split(",").map((s) => s.trim()).filter(Boolean)
                    : [];
                  
                  return (
                    <div
                      key={exp.id || idx}
                      className="grid grid-cols-1 md:grid-cols-12 gap-6 py-10 border-t-4 border-double border-stone-900/20"
                    >
                      {/* Year column */}
                      <div className="md:col-span-3">
                        <span className="text-xl md:text-2xl font-light font-serif text-[#6B1D2F] block">
                          {exp.startYear} — {exp.isCurrent ? "PRESENT" : exp.endYear}
                        </span>
                        <span className="text-[10px] tracking-wider text-stone-400 uppercase mt-1 block font-semibold">
                          {exp.startMonth} - {exp.isCurrent ? "Present" : exp.endMonth}
                        </span>
                      </div>

                      {/* Details column */}
                      <div className="md:col-span-9 space-y-3">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-lg md:text-xl font-medium text-stone-900 font-serif leading-none">
                            {exp.jobTitle}
                          </h3>
                          <div className="text-xs uppercase tracking-widest text-stone-500 font-medium font-semibold">
                            {exp.company} &middot; {exp.employmentType}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border border-stone-800/10 text-stone-500 font-semibold">
                            {exp.locationType}
                          </span>
                          {exp.location && (
                            <span className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 border border-stone-800/10 text-stone-500 font-semibold">
                              {exp.location}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-stone-600 leading-relaxed font-sans text-justify pt-1">
                          {exp.description}
                        </p>

                        {parsedSkills.length > 0 && (
                          <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-1">
                            {parsedSkills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="text-[9px] font-semibold text-stone-500 uppercase tracking-widest"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* Closing double-line separator */}
                <div className="border-t-4 border-double border-stone-900/20 w-full" />
              </div>
            </div>
          </motion.section>
        )}

        {/* SKILLS SECTION - THE INDEX */}
        {portfolio.skills && (
          <motion.section
            {...pageTurnReveal}
            className="py-16 md:py-24 border-b border-[#1C1A18]/15 relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center text-[10px] tracking-[0.25em] text-[#A3A29E] uppercase mb-16 border-b border-[#1C1A18]/10 pb-3 font-semibold font-semibold">
              <span>SECTION IV // TECHNICAL REGISTER</span>
              <span>INDEX SPREAD // PAGE 38</span>
            </div>

            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-extralight tracking-tight font-serif text-stone-900">
                  The Skills Index
                </h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#6B1D2F] mt-2 font-semibold">
                  Alphabetical & Topical Directory of Competencies
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {parseTags(portfolio.skills).map((skill, idx) => (
                  <div key={idx} className="flex items-end justify-between">
                    <span className="font-medium text-stone-800 tracking-wide text-sm">{skill}</span>
                    <div className="flex-grow border-b border-dotted border-stone-800/30 mx-2 h-4 mb-[3px]" />
                    <span className="font-serif italic text-[#6B1D2F] text-xs font-semibold">
                      p. {String(idx * 3 + 12).padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* CONTACT SECTION - BACK COVER */}
        <motion.section
          {...pageTurnReveal}
          className="min-h-screen flex flex-col justify-between py-12 text-center relative"
        >
          {/* Header */}
          <div className="flex justify-between items-center text-[10px] tracking-[0.25em] text-[#A3A29E] uppercase border-b border-[#1C1A18]/10 pb-3 font-semibold">
            <span>BACK COVER // ISSUE FINAL</span>
            <span>ISSN 977-1047-2851</span>
          </div>

          {/* Main content - massive email */}
          <div className="my-auto space-y-6 px-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#6B1D2F] font-bold block">
              GET IN TOUCH
            </span>
            {portfolio.email ? (
              <div className="overflow-hidden py-4">
                <a
                  href={`mailto:${portfolio.email}`}
                  className="inline-block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight font-serif text-stone-900 hover:text-[#6B1D2F] transition-all duration-300 hover:italic"
                >
                  {portfolio.email}
                </a>
              </div>
            ) : (
              <span className="text-2xl font-serif text-stone-400 italic">no.email@provided.com</span>
            )}
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed uppercase tracking-wider font-semibold">
              Accepting select collaborations, speaking opportunities, and creative advisories.
            </p>
          </div>

          {/* Footer colophon & barcode */}
          <div className="border-t border-[#1C1A18]/10 pt-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-end text-left">
            {/* Col 1: Social Directory */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest text-[#A3A29E] font-bold block">
                SOCIAL DIRECTORY
              </span>
              <div className="flex flex-wrap gap-4 font-semibold font-semibold">
                {portfolio.linkedin && (
                  <a
                    href={portfolio.linkedin.startsWith("http") ? portfolio.linkedin : `https://${portfolio.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-700 hover:text-[#6B1D2F] text-xs transition-colors flex items-center gap-1"
                  >
                    LinkedIn <ArrowUpRight className="w-2.5 h-2.5" />
                  </a>
                )}
                {portfolio.twitter && (
                  <a
                    href={portfolio.twitter.startsWith("http") ? portfolio.twitter : `https://${portfolio.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-700 hover:text-[#6B1D2F] text-xs transition-colors flex items-center gap-1"
                  >
                    Twitter <ArrowUpRight className="w-2.5 h-2.5" />
                  </a>
                )}
                {portfolio.github && (
                  <a
                    href={portfolio.github.startsWith("http") ? portfolio.github : `https://${portfolio.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-700 hover:text-[#6B1D2F] text-xs transition-colors flex items-center gap-1"
                  >
                    GitHub <ArrowUpRight className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Col 2: Credits / Publication Info */}
            <div className="text-center md:text-left space-y-1.5 text-[10px] text-stone-500 font-semibold uppercase tracking-wider">
              <span className="text-[9px] uppercase tracking-widest text-[#A3A29E] font-bold block mb-1">
                PUBLICATION SPECS
              </span>
              <p>&copy; {new Date().getFullYear()} {portfolio.name || "Portfolio"}. ALL RIGHTS RESERVED.</p>
              <p>MADE WITH FOLIOFAST &middot; LUXURY MAGAZINE SPREAD V1.0</p>
            </div>

            {/* Col 3: Barcode */}
            <div className="flex flex-col items-center md:items-end">
              <div className="flex items-end h-8 w-28 gap-[1.5px] opacity-80">
                <div className="w-[2px] h-full bg-[#1C1A18]" />
                <div className="w-[1px] h-full bg-[#1C1A18]" />
                <div className="w-[1px] h-full bg-[#1C1A18]" />
                <div className="w-[2px] h-[90%] bg-[#1C1A18]" />
                <div className="w-[3px] h-[90%] bg-[#1C1A18]" />
                <div className="w-[1px] h-[90%] bg-[#1C1A18]" />
                <div className="w-[2px] h-[90%] bg-[#1C1A18]" />
                <div className="w-[2px] h-full bg-[#1C1A18]" />
                <div className="w-[1px] h-full bg-[#1C1A18]" />
                <div className="w-[2px] h-[90%] bg-[#1C1A18]" />
                <div className="w-[1px] h-[90%] bg-[#1C1A18]" />
                <div className="w-[4px] h-[90%] bg-[#1C1A18]" />
                <div className="w-[2px] h-full bg-[#1C1A18]" />
                <div className="w-[1px] h-full bg-[#1C1A18]" />
              </div>
              <span className="text-[7px] tracking-[0.4em] text-stone-400 mt-1 block font-semibold">
                ISSN 977-1047-2851
              </span>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
