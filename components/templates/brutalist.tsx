"use client";

import { useState } from "react";
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

export default function Brutalist({ portfolio }: TemplateProps) {
  const [bgYellow, setBgYellow] = useState(true);

  const parseTags = (tagsStr: string) => {
    return tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  return (
    <div
      className={`w-full min-h-screen py-16 px-6 sm:px-12 md:px-16 transition-colors duration-150 select-none relative overflow-x-hidden ${
        bgYellow ? "bg-[#f5f500]" : "bg-white"
      } text-black`}
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Toggle button in top right corner */}
      <button
        onClick={() => setBgYellow(!bgYellow)}
        className="fixed top-6 right-6 border-4 border-black bg-black text-white hover:bg-white hover:text-black font-black uppercase text-xs px-4 py-2 z-50 transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
      >
        {bgYellow ? "WHITE MODE" : "YELLOW MODE"}
      </button>

      {/* Large decorative brutalist square in background */}
      <div className="absolute top-20 left-[75%] w-32 h-32 bg-black transform rotate-45 pointer-events-none hidden lg:block border-4 border-white" />

      <div className="w-full flex flex-col gap-12 relative z-10">
        
        {/* HERO SECTION */}
        <header className="w-full relative text-left">
          <h1
            className="text-6xl sm:text-7xl md:text-[96px] font-black uppercase tracking-tighter leading-none select-none"
            style={{ fontFamily: "Impact, sans-serif" }}
          >
            {portfolio.name || "YOUR NAME"}
          </h1>
          
          <div className="mt-4 max-w-xl border-b-8 border-black pb-2">
            <p className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              {portfolio.headline || "YOUR HEADLINE"}
            </p>
          </div>

          {portfolio.location && (
            <p className="text-xs font-bold uppercase mt-3 tracking-widest bg-black text-white inline-block px-2 py-1 border-2 border-black">
              LOC: {portfolio.location}
            </p>
          )}

          {portfolio.bio && (
            <div className="text-sm font-bold uppercase mt-8 max-w-xl border-4 border-black p-6 bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] leading-relaxed">
              {portfolio.bio}
            </div>
          )}
        </header>

        {/* PHOTO SECTION */}
        {portfolio.photo ? (
          <div className="w-[200px] h-[240px] border-4 border-black bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)] overflow-hidden relative">
            <Image
              src={portfolio.photo}
              alt={`${portfolio.name} profile photo`}
              width={200}
              height={240}
              className="w-full h-full object-cover grayscale"
            />
          </div>
        ) : null}

        {/* ABOUT SECTION */}
        {portfolio.about && (
          <section className="border-4 border-black p-6 md:p-8 bg-white max-w-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-4">
            <h2
              className="text-3xl font-black uppercase tracking-tight border-b-4 border-black pb-2"
              style={{ fontFamily: "Impact, sans-serif" }}
            >
              ABOUT ME
            </h2>
            <div className="text-xs font-bold uppercase leading-loose text-justify">
              {portfolio.about}
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <section className="border-4 border-black p-6 md:p-8 bg-white max-w-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-6">
            <h2
              className="text-3xl font-black uppercase tracking-tight border-b-4 border-black pb-2"
              style={{ fontFamily: "Impact, sans-serif" }}
            >
              PROJECT LIST
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {portfolio.projects.map((project) => {
                const projectTags = parseTags(project.tags);
                const hasLink = Boolean(project.link);

                return (
                  <div
                    key={project.id}
                    className="border-4 border-black p-5 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-sm uppercase tracking-tight border-b-2 border-black pb-1">
                        {project.title || "UNTITLED PROJECT"}
                      </h3>
                      <p className="text-[11px] font-bold uppercase leading-relaxed text-stone-700">
                        {project.description || "Project description goes here."}
                      </p>
                    </div>

                    <div className="mt-4 space-y-3">
                      {projectTags.length > 0 && (
                        <p className="text-[9px] font-bold uppercase tracking-widest text-stone-500">
                          {projectTags.join(" / ")}
                        </p>
                      )}
                      {hasLink && (
                        <a
                          href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-black uppercase border-4 border-black px-2 py-1 bg-black text-white hover:bg-white hover:text-black inline-block text-center transition-colors cursor-pointer"
                        >
                          → VIEW PROJECT
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* EXPERIENCE SECTION */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <section className="border-4 border-black p-6 md:p-8 bg-white max-w-2xl shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-4">
            <h2
              className="text-3xl font-black uppercase tracking-tight border-b-4 border-black pb-2"
              style={{ fontFamily: "Impact, sans-serif" }}
            >
              EXPERIENCE
            </h2>
            <div className="pt-2">
              <ExperienceTimeline
                experience={portfolio.experience}
                accentColor="#000000"
                textColor="#000000"
                mutedColor="#333333"
                bgColor="transparent"
                useFramerMotion={false}
                isBrutalist={true}
              />
            </div>
          </section>
        )}

        {/* SKILLS SECTION */}
        {portfolio.skills && (
          <section className="border-4 border-black p-6 md:p-8 bg-white max-w-xl shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-4">
            <h2
              className="text-3xl font-black uppercase tracking-tight border-b-4 border-black pb-2"
              style={{ fontFamily: "Impact, sans-serif" }}
            >
              CAPABILITIES
            </h2>
            <p className="text-xs font-black uppercase tracking-wider leading-loose">
              {parseTags(portfolio.skills).join(" / ")}
            </p>
          </section>
        )}

        {/* CONTACT SECTION */}
        <section className="border-4 border-black p-6 bg-white max-w-xl shadow-[6px_6px_0px_rgba(0,0,0,1)] space-y-4">
          <h2
            className="text-3xl font-black uppercase tracking-tight border-b-4 border-black pb-2"
            style={{ fontFamily: "Impact, sans-serif" }}
          >
            CONTACT CHANNELS
          </h2>
          <div className="flex flex-col gap-2.5 text-xs font-bold uppercase">
            {portfolio.email && (
              <a href={`mailto:${portfolio.email}`} className="hover:underline flex items-center gap-1.5">
                <span>[EMAIL]</span>
                <span>{portfolio.email}</span>
              </a>
            )}
            {portfolio.linkedin && (
              <a
                href={portfolio.linkedin.startsWith("http") ? portfolio.linkedin : `https://${portfolio.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1.5"
              >
                <span>[LINKEDIN]</span>
                <span>VIEW PROFILE</span>
              </a>
            )}
            {portfolio.twitter && (
              <a
                href={portfolio.twitter.startsWith("http") ? portfolio.twitter : `https://${portfolio.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1.5"
              >
                <span>[TWITTER]</span>
                <span>VIEW FEED</span>
              </a>
            )}
            {portfolio.github && (
              <a
                href={portfolio.github.startsWith("http") ? portfolio.github : `https://${portfolio.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1.5"
              >
                <span>[GITHUB]</span>
                <span>VIEW CODE</span>
              </a>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-xs font-black uppercase tracking-widest pt-8 border-t-4 border-black text-black">
          &copy; {new Date().getFullYear()} {portfolio.name || "PORTFOLIO"}. ALL BORDERS INTENTIONAL.
        </footer>
      </div>
    </div>
  );
}
