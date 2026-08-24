"use client";

import { Mail, Linkedin, Twitter, Github, MapPin, ArrowUpRight } from "lucide-react";
import ExperienceTimeline, { Experience } from "../ExperienceTimeline";
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

export default function MagazineSpread({ portfolio }: TemplateProps) {
  const parseTags = (tagsStr: string) => {
    return tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const featuredProject = portfolio.projects?.[0];
  const otherProjects = portfolio.projects?.slice(1) || [];

  return (
    <div
      className="w-full min-h-screen bg-white text-[#111827] py-16 px-6 sm:px-12 md:px-16 select-none font-serif"
      style={{ fontFamily: "Georgia, serif" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-12 relative">
        
        {/* TIME-STYLE TOP BAR */}
        <div className="w-full h-3 bg-[#dc2626] mb-2" />

        {/* HERO SECTION */}
        <header className="relative pb-8 border-b-2 border-[#111827] pr-0 md:pr-[260px]">
          <div>
            <h1
              className="text-6xl sm:text-7xl md:text-[96px] font-normal leading-none tracking-tight text-[#111827] uppercase"
              style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
            >
              {portfolio.name || "Your Name"}
            </h1>
            <p className="italic text-lg md:text-xl text-[#dc2626] mt-4 font-medium">
              {portfolio.headline || "Your Professional Headline"}
            </p>
            {portfolio.location && (
              <div className="flex items-center gap-1 text-xs text-stone-500 mt-2 font-sans font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{portfolio.location}</span>
              </div>
            )}
            {portfolio.bio && (
              <p className="text-sm text-stone-600 mt-6 leading-relaxed max-w-xl">
                {portfolio.bio}
              </p>
            )}
          </div>

          {/* Overlapping rectangular photo on desktop */}
          {portfolio.photo ? (
            <>
              {/* Desktop image */}
              <div className="hidden md:block absolute right-0 top-2 w-[220px] h-[280px] bg-stone-100 border border-stone-200 shadow-md overflow-hidden z-10">
                <Image
                  src={portfolio.photo}
                  alt={`${portfolio.name} profile photo`}
                  width={220}
                  height={280}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Mobile image */}
              <div className="md:hidden w-full h-64 mt-6 overflow-hidden bg-stone-100 border border-stone-200 relative">
                <Image
                  src={portfolio.photo}
                  alt={`${portfolio.name} profile photo`}
                  fill
                  className="object-cover"
                />
              </div>
            </>
          ) : null}
        </header>

        {/* 7-COL SYMMETRIC GRID CONTAINER FOR ABOUT + FEAT PROJECT */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-8 items-start">
          
          {/* ABOUT (Col-span 3) */}
          {portfolio.about && (
            <div className="md:col-span-3 space-y-4">
              <h2
                className="text-2xl font-bold uppercase tracking-wider text-[#dc2626] border-b border-[#dc2626] pb-2"
                style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
              >
                Profile Detail
              </h2>
              <div className="columns-1 sm:columns-2 md:columns-1 gap-6 text-xs text-stone-750 leading-relaxed text-justify">
                {portfolio.about}
              </div>
            </div>
          )}

          {/* FEATURED PROJECT (Col-span 4) */}
          {featuredProject && (
            <div className="md:col-span-4 space-y-4">
              <h2
                className="text-2xl font-bold uppercase tracking-wider text-slate-800 border-b border-stone-300 pb-2"
                style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
              >
                Featured Story
              </h2>
              <div className="space-y-4">
                {featuredProject.cover ? (
                  <div className="w-full h-[220px] overflow-hidden bg-stone-100 border border-stone-200 relative">
                    <Image
                      src={featuredProject.cover}
                      alt={featuredProject.title}
                      fill
                      sizes="(max-w-700px) 100vw, 600px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-slate-900 hover:text-[#dc2626] transition-colors leading-tight">
                      {featuredProject.title || "Featured Project"}
                    </h3>
                    {featuredProject.link && (
                      <a
                        href={featuredProject.link.startsWith("http") ? featuredProject.link : `https://${featuredProject.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#dc2626] hover:underline inline-flex items-center gap-0.5 text-xs font-sans font-bold uppercase"
                      >
                        <span>Read</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {featuredProject.description || "Project description goes here."}
                  </p>
                  {featuredProject.tags && (
                    <p className="text-[10px] text-stone-500 font-sans uppercase font-bold tracking-wider">
                      Filed under: {parseTags(featuredProject.tags).join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* OTHER PROJECTS (3-COL STRIP) */}
        {otherProjects.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h2
              className="text-xl font-bold uppercase tracking-wider text-slate-800"
              style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
            >
              Recent Dispatch
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {otherProjects.map((project) => {
                const projectTags = parseTags(project.tags);
                const hasLink = Boolean(project.link);

                return (
                  <div key={project.id} className="space-y-3">
                    {project.cover ? (
                      <div className="w-full h-32 overflow-hidden bg-stone-100 border border-stone-200 relative">
                        <Image
                          src={project.cover}
                          alt={project.title}
                          fill
                          sizes="(max-w-700px) 100vw, 300px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-stone-50 border border-stone-100 flex items-center justify-center">
                        <span className="text-[9px] text-stone-400 font-sans uppercase font-bold tracking-widest">No Cover</span>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm text-[#111827] leading-tight">
                          {project.title || "Untitled Project"}
                        </h3>
                        {hasLink && (
                          <a
                            href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#dc2626] hover:text-[#b91c1c]"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                        {project.description || "Project description goes here."}
                      </p>
                      {projectTags.length > 0 && (
                        <p className="text-[9px] text-stone-400 font-sans font-bold uppercase tracking-wider">
                          Tags: {projectTags.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EXPERIENCE SECTION */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <div className="border-l-4 border-[#dc2626] pl-6 py-2 my-6">
            <h3
              className="text-2xl font-bold uppercase text-[#dc2626] mb-4 tracking-wider"
              style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
            >
              Experience
            </h3>
            <div className="pt-2">
              <ExperienceTimeline
                experience={portfolio.experience}
                accentColor="#dc2626"
                textColor="#111827"
                mutedColor="#6b7280"
                bgColor="#ffffff"
                useFramerMotion={false}
              />
            </div>
          </div>
        )}

        {/* SKILLS AS BOLD RED PULL-QUOTE */}
        {portfolio.skills && (
          <div className="border-l-4 border-[#dc2626] pl-6 py-2 my-4">
            <h3
              className="text-2xl font-bold uppercase text-[#dc2626] mb-3 tracking-wider"
              style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
            >
              Skills
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs text-stone-750 font-bold uppercase tracking-wide font-sans">
              {parseTags(portfolio.skills).map((skill, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <span className="text-[#dc2626] text-[8px]">●</span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER & CONTACTS */}
        <footer className="mt-8 border-t border-[#111827] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans font-bold tracking-wider">
          <div className="text-[10px] text-stone-500">
            01 / PORTFOLIO &middot; Built with FolioFast.
          </div>
          
          <div className="flex items-center gap-4 text-[#111827]">
            {portfolio.email && (
              <a
                href={`mailto:${portfolio.email}`}
                className="hover:text-[#dc2626] transition-colors"
                title="Email"
              >
                <span className="uppercase text-[10px]">Email</span>
              </a>
            )}
            {portfolio.linkedin && (
              <a
                href={portfolio.linkedin.startsWith("http") ? portfolio.linkedin : `https://${portfolio.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#dc2626] transition-colors"
                title="LinkedIn"
              >
                <span className="uppercase text-[10px]">LinkedIn</span>
              </a>
            )}
            {portfolio.twitter && (
              <a
                href={portfolio.twitter.startsWith("http") ? portfolio.twitter : `https://${portfolio.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#dc2626] transition-colors"
                title="Twitter/X"
              >
                <span className="uppercase text-[10px]">Twitter</span>
              </a>
            )}
            {portfolio.github && (
              <a
                href={portfolio.github.startsWith("http") ? portfolio.github : `https://${portfolio.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#dc2626] transition-colors"
                title="GitHub"
              >
                <span className="uppercase text-[10px]">GitHub</span>
              </a>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
