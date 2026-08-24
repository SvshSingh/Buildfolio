"use client";

import { useState } from "react";
import { Experience } from "./ExperienceTimeline";
import Link from "next/link";
import { ExternalLink, Copy, Pencil, Layers, Settings, Share2, Sparkles, Check, FileText } from "lucide-react";
import Toast from "@/components/ui/toast";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string;
  link: string;
  cover: string | null;
}

interface PortfolioData {
  name?: string;
  headline?: string;
  bio?: string;
  location?: string;
  photo?: string | null;
  about?: string;
  projects?: Project[];
  skills?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  experience?: Experience[];
}

interface Portfolio {
  data: PortfolioData | null;
  is_published: boolean;
  template: string;
}

interface DashboardHomeProps {
  username: string;
  portfolio: Portfolio | null;
}

export default function DashboardHome({ username, portfolio }: DashboardHomeProps) {
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/p/${username}`
    : `/p/${username}`;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      triggerToast("Link copied to clipboard");
    } catch (err) {
      console.error("Failed to copy link:", err);
      triggerToast("Failed to copy URL");
    }
  };

  const getTemplateName = (key: string) => {
    switch (key) {
      case "minimal-clean": return "Minimal Clean";
      case "bold-dark": return "Bold Dark";
      case "corporate-pro": return "Corporate Pro";
      case "neon-studio": return "Neon Studio";
      default: return "Minimal Clean";
    }
  };

  const getSectionsCount = () => {
    if (!portfolio || !portfolio.data) return 0;
    const data = portfolio.data;
    let count = 0;
    
    if (data.name || data.headline || data.bio) count++;
    if (data.about) count++;
    if (data.projects && data.projects.length > 0) count++;
    if (data.skills) count++;
    if (data.email || data.linkedin || data.twitter || data.github) count++;
    
    return count;
  };

  const sectionsFilled = getSectionsCount();
  const activeTemplate = portfolio?.template || "minimal-clean";
  const isPublished = portfolio?.is_published || false;
  const portfolioName = portfolio?.data?.name;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 select-none text-zinc-100">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-zinc-550 text-xs mt-0.5">
            Manage your professional portfolio and active themes.
          </p>
        </div>
        <Link
          href="/editor"
          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-white hover:bg-zinc-105 text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer select-none"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit Portfolio</span>
        </Link>
      </div>

      {/* SECTION 1: YOUR PORTFOLIO CARD (MINIMAL WHITE BORDERS) */}
      <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-xs relative overflow-hidden flex flex-col lg:flex-row gap-8">
        
        {/* Left Side Details */}
        <div className="flex-1 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-white leading-tight">
                {portfolioName || "Complete your portfolio"}
              </h2>
              {isPublished ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-medium uppercase tracking-wider">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Published</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] font-medium uppercase tracking-wider">
                  <span>Draft</span>
                </span>
              )}
            </div>

            {/* Clickable Public URL */}
            <div className="mt-4 space-y-1">
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">
                Public URL
              </label>
              <div 
                onClick={handleCopy}
                className="inline-flex items-center gap-2 bg-black hover:bg-zinc-950 border border-zinc-900 hover:border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 cursor-pointer transition-colors max-w-full"
                title="Click to copy"
              >
                <span className="truncate select-all">{publicUrl.replace(/^https?:\/\//, "")}</span>
                <Copy className="w-3 h-3 text-zinc-500 flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/editor"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-white text-xs font-medium rounded-lg border border-zinc-800 transition-colors"
            >
              <Pencil className="w-3 h-3 text-zinc-400" />
              <span>Modify</span>
            </Link>
            <a
              href={`/p/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-100 text-black text-xs font-medium rounded-lg transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3 text-zinc-800" />
            </a>
          </div>
        </div>

        {/* Right Side: Miniature styled replica */}
        <div className="w-full lg:w-60 flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">
            Style: {getTemplateName(activeTemplate)}
          </label>
          <div className="h-36 w-full bg-black border border-zinc-900 rounded-lg overflow-hidden p-1 flex-shrink-0">
            {activeTemplate === "minimal-clean" && (
              <div className="w-full h-full bg-white border border-zinc-200 rounded-md p-3 flex flex-col gap-1.5 text-zinc-800 shadow-inner">
                <div className="flex gap-1.5 items-center">
                  <div className="w-5 h-5 rounded-full bg-zinc-100" />
                  <div className="flex-1 space-y-0.5">
                    <div className="h-2 w-12 bg-zinc-800 rounded" />
                    <div className="h-1 w-16 bg-zinc-400 rounded" />
                  </div>
                </div>
                <div className="space-y-0.5 mt-0.5">
                  <div className="h-1 w-full bg-zinc-200 rounded" />
                  <div className="h-1 w-[80%] bg-zinc-200 rounded" />
                </div>
              </div>
            )}
            
            {activeTemplate === "bold-dark" && (
              <div className="w-full h-full bg-[#0f0f0f] border border-zinc-800 rounded-md p-3 flex flex-col gap-1.5 text-[#f5f5f5] shadow-inner">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <div className="h-2.5 w-16 bg-zinc-200 rounded-none font-bold" />
                    <div className="h-1 w-12 bg-purple-500 rounded-none" />
                  </div>
                  <div className="w-5 h-5 bg-zinc-900 border border-[#a855f7] rounded-none" />
                </div>
                <div className="h-1 w-full bg-zinc-700 rounded-none" />
              </div>
            )}

            {activeTemplate === "corporate-pro" && (
              <div className="w-full h-full bg-[#f8f4ef] border border-[#e5e0d8] rounded-md p-3 flex gap-2.5 text-[#1a1a1a] shadow-inner">
                <div className="w-[30%] flex flex-col gap-1 border-r border-[#e5e0d8] pr-1.5">
                  <div className="w-4 h-4 rounded-md bg-[#e5e0d8]" />
                  <div className="h-2 w-full bg-slate-800 rounded" />
                </div>
                <div className="w-[70%] space-y-1">
                  <div className="h-1.5 w-full bg-slate-300 rounded" />
                  <div className="h-1 w-full bg-slate-200 rounded" />
                </div>
              </div>
            )}

            {activeTemplate === "neon-studio" && (
              <div className="w-full h-full bg-[#0d0d1a] border border-cyan-900/35 rounded-md p-3 flex flex-col gap-1.5 text-[#e2e8f0] shadow-inner">
                <div className="flex gap-1.5 items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="h-2 w-10 bg-cyan-400 rounded" />
                    <div className="h-1 w-12 bg-pink-400 rounded" />
                  </div>
                  <div className="w-5 h-5 rounded-full bg-slate-900 border border-cyan-400" />
                </div>
                <div className="h-1 w-full bg-slate-800 rounded" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: STATS ROW */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sections Filled */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wide">Progress</span>
            <FileText className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-white">{sectionsFilled}</span>
            <span className="text-[10px] text-zinc-650 font-medium">/ 5 sections</span>
          </div>
          <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-300" 
              style={{ width: `${(sectionsFilled / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Template */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wide">Theme</span>
            <Layers className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div>
            <p className="text-xl font-bold text-white truncate">
              {getTemplateName(activeTemplate)}
            </p>
            <span className="text-[10px] text-zinc-600 font-medium">Active layout style</span>
          </div>
        </div>

        {/* Profile Views */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wide">Visits</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-600" />
          </div>
          <div className="space-y-1">
            <span className="inline-flex px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] font-semibold uppercase tracking-wide rounded">
              Coming soon
            </span>
            <p className="text-[10px] text-zinc-600 font-medium">Analytics arriving in Phase 4</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: QUICK ACTIONS */}
      <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 shadow-xs space-y-3">
        <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">Shortcuts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/dashboard/templates"
            className="flex items-center justify-between p-3.5 bg-black border border-zinc-900 hover:border-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
          >
            <div className="space-y-0.5">
              <span className="text-[9px] text-zinc-600 font-semibold uppercase tracking-wide">Design</span>
              <p className="text-xs font-semibold text-zinc-200">Switch Theme</p>
            </div>
            <Layers className="w-4 h-4 text-zinc-500" />
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center justify-between p-3.5 bg-black border border-zinc-900 hover:border-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
          >
            <div className="space-y-0.5">
              <span className="text-[9px] text-zinc-600 font-semibold uppercase tracking-wide">Config</span>
              <p className="text-xs font-semibold text-zinc-200">URL & Privacy</p>
            </div>
            <Settings className="w-4 h-4 text-zinc-500" />
          </Link>

          <button
            onClick={handleCopy}
            className="flex items-center justify-between p-3.5 bg-black border border-zinc-900 hover:border-zinc-800 rounded-lg text-left transition-colors cursor-pointer w-full"
          >
            <div className="space-y-0.5">
              <span className="text-[9px] text-zinc-600 font-semibold uppercase tracking-wide">Share</span>
              <p className="text-xs font-semibold text-zinc-200">Copy Portfolio link</p>
            </div>
            <Share2 className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </section>

      {/* TOAST SYSTEM */}
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
