"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Twitter, Github, MapPin, ArrowRight } from "lucide-react";
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

export default function ZenSpace({ portfolio }: TemplateProps) {
  const parseTags = (tagsStr: string) => {
    return tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const slowFade = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1.2, ease: "easeOut" as const },
  };

  // Construct Haiku skills lines
  const skillsList = parseTags(portfolio.skills);
  const half = Math.ceil(skillsList.length / 2);
  const line1 = skillsList.slice(0, half).join(" · ");
  const line2 = skillsList.slice(half).join(" · ");

  return (
    <div
      className="w-full min-h-screen bg-[#f5f0e8] text-[#2d2d2d] py-24 px-6 sm:px-12 md:px-20 select-none font-sans"
      style={{ fontFamily: "var(--font-noto-sans), sans-serif" }}
    >
      <div className="max-w-[650px] mx-auto flex flex-col gap-16">
        
        {/* HERO SECTION */}
        <motion.section {...slowFade} className="flex justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-[64px] bg-[#c0392b]" />
            <div>
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2d2d2d]"
                style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
              >
                {portfolio.name || "Your Name"}
              </h1>
              <p className="text-xs uppercase tracking-widest text-[#c0392b] font-semibold mt-1">
                {portfolio.headline || "Your Headline"}
              </p>
              {portfolio.location && (
                <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-2 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-stone-450" />
                  <span>{portfolio.location}</span>
                </div>
              )}
            </div>
          </div>

          {portfolio.photo ? (
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#c0392b]/25 flex-shrink-0 bg-stone-100 relative">
              <Image
                src={portfolio.photo}
                alt={`${portfolio.name} profile photo`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}
        </motion.section>

        {portfolio.bio && (
          <motion.section {...slowFade} className="text-[14px] text-stone-600 leading-relaxed text-center italic">
            &ldquo;{portfolio.bio}&rdquo;
          </motion.section>
        )}

        {/* ZEN Divider */}
        <div className="flex items-center justify-center">
          <div className="w-1/4 h-[1px] bg-stone-300" />
          <div className="w-2 h-2 rounded-full bg-[#c0392b] mx-4 shadow-sm" />
          <div className="w-1/4 h-[1px] bg-stone-300" />
        </div>

        {/* ABOUT SECTION (120px padding simulated) */}
        {portfolio.about && (
          <motion.section {...slowFade} className="py-8 space-y-4 text-center">
            <h2
              className="text-lg font-bold tracking-wider text-[#2d2d2d] uppercase"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              Summary
            </h2>
            <div className="text-[14px] leading-loose text-stone-650 max-w-xl mx-auto whitespace-pre-wrap">
              {portfolio.about}
            </div>
          </motion.section>
        )}

        {/* PROJECTS SECTION */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <motion.section {...slowFade} className="py-8 space-y-6">
            <h2
              className="text-lg font-bold tracking-wider text-center text-[#2d2d2d] uppercase"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              Creations
            </h2>
            <div className="flex flex-col gap-8">
              {portfolio.projects.map((project) => {
                const hasLink = Boolean(project.link);

                return (
                  <div key={project.id} className="group space-y-1.5 max-w-lg mx-auto w-full text-center sm:text-left pl-0 sm:pl-6 border-l-0 sm:border-l border-stone-250">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3
                        className="text-base font-bold text-slate-800"
                        style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
                      >
                        {project.title || "Untitled Project"}
                      </h3>
                      {hasLink && (
                        <a
                          href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#c0392b] hover:text-[#a02c20] inline-flex items-center gap-1 text-xs font-semibold justify-center"
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-[13px] text-stone-550 leading-relaxed">
                      {project.description || "Project description goes here."}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* EXPERIENCE SECTION */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <motion.section {...slowFade} className="py-8 space-y-6">
            <h2
              className="text-lg font-bold tracking-wider text-center text-[#2d2d2d] uppercase"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              Experience
            </h2>
            <div className="max-w-lg mx-auto w-full">
              <ExperienceTimeline
                experience={portfolio.experience}
                accentColor="#c0392b"
                textColor="#2d2d2d"
                mutedColor="#8c8c7a"
                bgColor="#f5f0e8"
                useFramerMotion={false}
                isZen={true}
              />
            </div>
          </motion.section>
        )}

        {/* SKILLS SECTION (Haiku style) */}
        {portfolio.skills && (
          <motion.section {...slowFade} className="py-8 text-center space-y-4">
            <h2
              className="text-lg font-bold tracking-wider text-[#2d2d2d] uppercase"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              Craft
            </h2>
            <div 
              className="italic text-stone-600 text-[15px] leading-loose space-y-1.5"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              {line1 && <p>{line1}</p>}
              {line2 && <p>{line2}</p>}
              <p className="text-[#c0392b] font-medium">Always learning</p>
            </div>
          </motion.section>
        )}

        {/* CONTACT SECTION */}
        <motion.section 
          {...slowFade}
          className="border-t border-stone-300 pt-10 flex flex-col items-center gap-6"
        >
          <div className="flex justify-center items-center gap-8">
            {portfolio.email && (
              <a
                href={`mailto:${portfolio.email}`}
                className="text-stone-500 hover:text-[#c0392b] transition-colors"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
            {portfolio.linkedin && (
              <a
                href={portfolio.linkedin.startsWith("http") ? portfolio.linkedin : `https://${portfolio.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-[#c0392b] transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {portfolio.twitter && (
              <a
                href={portfolio.twitter.startsWith("http") ? portfolio.twitter : `https://${portfolio.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-[#c0392b] transition-colors"
                title="Twitter/X"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {portfolio.github && (
              <a
                href={portfolio.github.startsWith("http") ? portfolio.github : `https://${portfolio.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 hover:text-[#c0392b] transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
          <p className="text-[10px] text-stone-400 font-medium tracking-wide uppercase">
            &copy; {new Date().getFullYear()} {portfolio.name || "Portfolio"}. less is more.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
