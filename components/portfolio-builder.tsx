"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  User, 
  Briefcase, 
  Wrench, 
  Contact, 
  Info,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  LayoutGrid,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  Loader2,
  AlertCircle
} from "lucide-react";
import PortfolioPreview from "./portfolio-preview";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Experience } from "./ExperienceTimeline";
import Toast from "@/components/ui/toast";
import ConfirmModal from "@/components/ui/confirm-modal";

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
  experience: Experience[];
}

const defaultPortfolio: Portfolio = {
  name: "Alex Johnson",
  headline: "Senior Full-Stack Developer",
  bio: "I build high-performance, accessible, and delightful web applications. Specialized in React, Next.js, and cloud architectures.",
  location: "Hyderabad, India",
  photo: null,
  about: "I am a full-stack engineer with over five years of experience designing and developing digital products. I specialize in building reactive user interfaces, serverless APIs, and optimizing database performance.\n\nOutside of coding, I write technical articles, contribute to open-source libraries, and mentor junior developers. I believe in clean code, robust testing, and user-centered design.",
  projects: [
    {
      id: "1",
      title: "DevFlow - Developer Community Q&A Platform",
      description: "A full-stack StackOverflow clone featuring AI-generated answers, voting systems, badge awards, global search, and recommendation algorithms.",
      tags: "Next.js, TypeScript, Tailwind CSS, OpenAI, MongoDB",
      link: "https://github.com",
      cover: null
    },
    {
      id: "2",
      title: "Zenith - Collaborative Task Manager",
      description: "A real-time workspace collaboration tool with drag-and-drop Kanban boards, active user presence indicators, comments, and task analytics dashboards.",
      tags: "React, Node.js, Socket.io, Tailwind CSS, PostgreSQL",
      link: "https://github.com",
      cover: null
    }
  ],
  experience: [
    {
      id: "exp-1",
      jobTitle: "Senior Frontend Developer",
      company: "Acme Corp",
      companyLogo: null,
      employmentType: "Full-time",
      locationType: "Remote",
      location: "Hyderabad, India",
      startMonth: "Jan",
      startYear: "2022",
      endMonth: "",
      endYear: "",
      isCurrent: true,
      description: "Led frontend architecture for a SaaS platform serving 50K+ users. Built reusable component library in React + TypeScript.",
      skills: "React, TypeScript, Next.js, Tailwind CSS"
    },
    {
      id: "exp-2",
      jobTitle: "Frontend Developer",
      company: "Startup XYZ",
      companyLogo: null,
      employmentType: "Full-time",
      locationType: "On-site",
      location: "Bangalore, India",
      startMonth: "Jun",
      startYear: "2020",
      endMonth: "Dec",
      endYear: "2021",
      isCurrent: false,
      description: "Built and shipped 3 client-facing products from scratch. Reduced page load time by 40% via code splitting and lazy loading.",
      skills: "Vue.js, JavaScript, CSS, Firebase"
    }
  ],
  skills: "React, Next.js, TypeScript, Node.js, Tailwind CSS, Framer Motion, PostgreSQL, MongoDB, Git, Docker",
  email: "alex@example.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  github: "https://github.com"
};

function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

interface PortfolioBuilderProps {
  initialData?: any;
  initialTemplate?: string;
  userId: string;
  username: string;
  email: string;
}

const TEMPLATES_LIST = [
  { key: "minimal-clean", name: "Minimal Clean", desc: "Elegant, content-first layout using refined typography and clean spacing." },
  { key: "bold-dark", name: "Bold Dark", desc: "High-contrast dark layout with massive headlines and purple accents." },
  { key: "corporate-pro", name: "Corporate Pro", desc: "Warm editorial aesthetic using serif headings and two-column grid." },
  { key: "neon-studio", name: "Neon Studio", desc: "Cyberpunk neon vibes with deep navy bg and glowing borders." },
  { key: "soft-minimal", name: "Soft Minimal", desc: "Warmer, softer clean layout with DM Sans font." },
  { key: "grid-modern", name: "Grid Modern", desc: "Modern & geometric layout featuring strict grid components." },
  { key: "editorial-serif", name: "Editorial Serif", desc: "Elegant editorial spread with Cormorant Garamond headings." },
  { key: "frost-glass", name: "Frost Glass", desc: "Stunning glassmorphism card layout with animated gradients." },
  { key: "retro-terminal", name: "Retro Terminal", desc: "Classic terminal simulation with monospace fonts." },
  { key: "magazine-spread", name: "Magazine Spread", desc: "True magazine grid asymmetric columns print design." },
  { key: "zen-space", name: "Zen Space", desc: "Japanese zen minimalism, extreme whitespace." },
  { key: "brutalist", name: "Brutalist", desc: "Aggressive raw typography with heavy black borders." }
];

export default function PortfolioBuilder({ 
  initialData, 
  initialTemplate = "minimal-clean", 
  userId, 
  username, 
  email 
}: PortfolioBuilderProps) {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio>(() => {
    if (initialData) {
      return { 
        ...defaultPortfolio, 
        ...initialData,
        experience: initialData.experience || defaultPortfolio.experience
      };
    }
    return defaultPortfolio;
  });
  
  // Section toggle state
  const [openSections, setOpenSections] = useState({
    hero: true,
    about: true,
    experience: true,
    projects: true,
    skills: true,
    contact: true,
  });

  // Mobile preview collapse/expand state
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  // Supabase save status state
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<string | null>(null);
  const [deleteExpId, setDeleteExpId] = useState<string | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [showRerunWizardConfirmModal, setShowRerunWizardConfirmModal] = useState(false);
  const [hasSavedOnce, setHasSavedOnce] = useState(() => !!initialData);
  const [copied, setCopied] = useState(false);

  const [attemptedSave, setAttemptedSave] = useState(false);
  const experienceEndRef = useRef<HTMLDivElement>(null);

  const [activeTemplate, setActiveTemplate] = useState(initialTemplate);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/p/${username}`
    : `/p/${username}`;

  const userIdRef = useRef(userId);
  const hasSavedOnceRef = useRef(hasSavedOnce);

  const handleTemplateChange = async (newTemplate: string) => {
    setActiveTemplate(newTemplate);
    setSaveStatus("saving");
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("portfolios")
        .update({ template: newTemplate })
        .eq("user_id", userId);
      
      if (error) throw error;
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Error updating template:", err);
      setSaveStatus("error");
      triggerToast("Failed to update template. Please try again.", "error");
    }
  };

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    hasSavedOnceRef.current = hasSavedOnce;
  }, [hasSavedOnce]);

  const debouncedSave = useCallback(
    debounce(async (state: Portfolio) => {
      try {
        console.log("Saving to Supabase...", state);
        const supabase = createClient();
        const payload: any = {
          user_id: userIdRef.current,
          data: state,
          updated_at: new Date().toISOString(),
        };

        if (!hasSavedOnceRef.current) {
          payload.is_published = true;
          hasSavedOnceRef.current = true;
          setHasSavedOnce(true);
        }

        const { error } = await supabase
          .from("portfolios")
          .upsert(payload, { onConflict: 'user_id' });

        if (error) throw error;

        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch (err) {
        console.error("Save failed:", err);
        setSaveStatus("error");
        triggerToast("Failed to save changes. Check your connection and try again.", "error");
      }
    }, 1500),
    []
  );

  // Debounced auto-save effect
  useEffect(() => {
    if (portfolio === defaultPortfolio && !initialData) {
      return;
    }

    if (initialData && JSON.stringify(portfolio) === JSON.stringify(initialData)) {
      return;
    }

    const hasInvalidExperience = portfolio.experience?.some(
      (exp) =>
        !exp.jobTitle.trim() ||
        !exp.company.trim() ||
        (!exp.isCurrent && parseInt(exp.startYear) > parseInt(exp.endYear))
    );

    if (hasInvalidExperience) {
      setSaveStatus("idle");
      setAttemptedSave(true);
      return;
    }

    setAttemptedSave(false);
    setSaveStatus("saving");
    debouncedSave(portfolio);
  }, [portfolio, initialData, debouncedSave]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (field: keyof Portfolio, value: string | null) => {
    setPortfolio((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProjectChange = (id: string, field: keyof Project, value: string | null) => {
    setPortfolio((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    }));
  };

  const addProject = () => {
    if (portfolio.projects.length >= 6) return;
    const newProject: Project = {
      id: Date.now().toString(),
      title: "",
      description: "",
      tags: "",
      link: "",
      cover: null,
    };
    setPortfolio((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const removeProject = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id),
    }));
  };

  const handleExperienceChange = (id: string, field: keyof Experience, value: any) => {
    setPortfolio((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addExperience = () => {
    const currentYear = new Date().getFullYear();
    const newExp: Experience = {
      id: crypto.randomUUID(),
      jobTitle: "",
      company: "",
      companyLogo: null,
      employmentType: "Full-time",
      locationType: "Remote",
      location: "",
      startMonth: "Jan",
      startYear: currentYear.toString(),
      endMonth: "Jan",
      endYear: currentYear.toString(),
      isCurrent: false,
      description: "",
      skills: "",
    };
    setPortfolio((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), newExp],
    }));
    setTimeout(() => {
      experienceEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const removeExperience = (id: string) => {
    setDeleteExpId(id);
  };

  const handleConfirmRemoveExperience = () => {
    if (deleteExpId) {
      setPortfolio((prev) => ({
        ...prev,
        experience: prev.experience.filter((exp) => exp.id !== deleteExpId),
      }));
      setDeleteExpId(null);
      triggerToast("Experience removed.", "info");
    }
  };

  const moveExperience = (index: number, direction: "up" | "down") => {
    setPortfolio((prev) => {
      const list = [...prev.experience];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      
      return {
        ...prev,
        experience: list,
      };
    });
  };

  const validateImageFile = (file: File, allowedTypes: string[]): string | null => {
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
      return `File type not supported. Please upload a supported format (JPEG, PNG, WebP, GIF, SVG).`;
    }
    if (file.size > maxFileSize) {
      return `File is too large. Maximum size is 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`;
    }
    return null;
  };

  const handleLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    experienceId: string,
    oldLogoUrl: string | null
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const valError = validateImageFile(file, ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
      if (valError) {
        triggerToast(valError, "error");
        e.target.value = "";
        return;
      }
      try {
        const supabase = createClient();
        if (oldLogoUrl) {
          const oldPath = oldLogoUrl.split("/portfolio-assets/")[1];
          if (oldPath) {
            await supabase.storage.from("portfolio-assets").remove([oldPath]);
          }
        }
        const filePath = `${userId}/logos/${Date.now()}-${file.name}`;
        
        const { error } = await supabase.storage
          .from("portfolio-assets")
          .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from("portfolio-assets")
          .getPublicUrl(filePath);

        handleExperienceChange(experienceId, "companyLogo", publicUrl);
        triggerToast("Logo uploaded successfully", "success");
      } catch (err) {
        console.error("Upload error:", err);
        triggerToast("Failed to upload logo image.", "error");
      }
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    oldPhotoUrl: string | null,
    callback: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const valError = validateImageFile(file, ["image/jpeg", "image/png", "image/webp", "image/gif"]);
      if (valError) {
        triggerToast(valError, "error");
        e.target.value = "";
        return;
      }
      try {
        const supabase = createClient();
        if (oldPhotoUrl) {
          const oldPath = oldPhotoUrl.split("/portfolio-assets/")[1];
          if (oldPath) {
            await supabase.storage.from("portfolio-assets").remove([oldPath]);
          }
        }
        const filePath = `${userId}/${Date.now()}-${file.name}`;
        
        const { error } = await supabase.storage
          .from("portfolio-assets")
          .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from("portfolio-assets")
          .getPublicUrl(filePath);

        callback(publicUrl);
        triggerToast("Image uploaded successfully", "success");
      } catch (err) {
        console.error("Upload error:", err);
        triggerToast("Failed to upload image.", "error");
      }
    }
  };

  const resetToDefault = () => {
    setShowResetConfirmModal(true);
  };

  const handleConfirmReset = () => {
    setPortfolio(defaultPortfolio);
    setShowResetConfirmModal(false);
    triggerToast("Portfolio reset to default sample data.", "info");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#09090b] text-zinc-150 antialiased font-sans overflow-hidden select-none">
      
      {/* TOP NAVIGATION BAR */}
      <nav className="w-full h-16 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between z-30 sticky top-0 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 select-none hover:opacity-90 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white font-sans">
              FolioFast
            </span>
          </Link>
          <Link href="/dashboard" className="hidden sm:inline-flex items-center gap-1 text-[10px] text-zinc-450 hover:text-zinc-200 transition-colors bg-zinc-900/60 border border-zinc-800 px-2.5 py-1 rounded-lg">
            ← Dashboard
          </Link>
        </div>

        {/* Center: Copy Public URL */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-black/40 hover:bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer select-none active:scale-98"
            title="Click to copy path"
          >
            <span>{publicUrl.replace(/^https?:\/\//, "")}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-sans font-semibold ${copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-zinc-800 text-zinc-400"}`}>
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>

        {/* Right Action Stack */}
        <div className="flex items-center gap-4">
          {/* Cloud Sync Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/40 border border-zinc-800/80 rounded-full">
            {saveStatus === "saving" && (
              <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Syncing...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                <Check className="h-3 w-3" /> Saved ✓
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-[10px] font-semibold text-rose-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Failed to save
              </span>
            )}
            {saveStatus === "idle" && (
              <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" /> Up-to-date
              </span>
            )}
          </div>

          {/* Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-200 transition-all cursor-pointer select-none active:scale-98"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
              <span>Theme: {TEMPLATES_LIST.find(t => t.key === activeTemplate)?.name || activeTemplate}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            {showTemplateDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowTemplateDropdown(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 max-h-[350px] overflow-y-auto">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    Select Theme
                  </div>
                  {TEMPLATES_LIST.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => {
                        handleTemplateChange(t.key);
                        setShowTemplateDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex flex-col gap-0.5 hover:bg-zinc-900 transition-colors cursor-pointer ${
                        activeTemplate === t.key ? "bg-zinc-900 text-white border border-zinc-800" : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{t.name}</span>
                        {activeTemplate === t.key && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] text-zinc-500 line-clamp-1">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setShowRerunWizardConfirmModal(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg cursor-pointer font-medium"
          >
            <span>✨ Re-run wizard</span>
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-zinc-900">
            <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-250 uppercase border border-zinc-700" title={email}>
              {email.slice(0, 1)}
            </div>
            <button
              onClick={handleSignOut}
              className="text-xs text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* BODY CONTAINER */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden w-full bg-black">
        
        {/* LEFT PANEL: EDITOR (40% width) */}
        <div className="w-full md:w-[40%] h-full md:overflow-y-auto border-r border-zinc-900 flex flex-col bg-zinc-950/40 text-zinc-100 shrink-0">
          {/* Editor Sub-Header */}
          <header className="px-5 py-3.5 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/80 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center">
              <span className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider">Editor Mode: @{username}</span>
            </div>
            <button
              onClick={resetToDefault}
              className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-semibold"
              title="Reset data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </header>

          {/* Editor Form Container */}
          <div className="p-4 space-y-4 flex-1 pb-24 md:pb-8">
            
            {/* SECTION 1: HERO */}
            <div className="bg-zinc-900/10 hover:bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs transition-all duration-200">
              <button
                onClick={() => toggleSection("hero")}
                className="flex justify-between items-center w-full px-4 py-3.5 text-left font-semibold hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <User className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-bold tracking-tight">1. Hero Section</span>
                </div>
                {openSections.hero ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>
              
              <AnimatePresence initial={false}>
                {openSections.hero && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-zinc-900/60"
                  >
                    <div className="p-4 bg-zinc-950/40 space-y-4">
                      <div>
                        <label htmlFor="hero-name" className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                          Full Name
                        </label>
                        <input
                          id="hero-name"
                          type="text"
                          value={portfolio.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="e.g. Alex Johnson"
                          className="w-full rounded-lg border border-zinc-800 bg-black/55 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-800 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="hero-headline" className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                          Headline / Role
                        </label>
                        <input
                          id="hero-headline"
                          type="text"
                          value={portfolio.headline}
                          onChange={(e) => handleInputChange("headline", e.target.value)}
                          placeholder="e.g. Product Designer at Acme"
                          className="w-full rounded-lg border border-zinc-800 bg-black/55 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-800 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label htmlFor="hero-bio" className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                            One-Line Bio
                          </label>
                          <span className={`text-[9px] font-semibold ${portfolio.bio.length > 150 ? 'text-rose-500' : 'text-zinc-500'}`}>
                            {portfolio.bio.length} / 160
                          </span>
                        </div>
                        <textarea
                          id="hero-bio"
                          value={portfolio.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value.slice(0, 160))}
                          placeholder="Brief overview..."
                          rows={2}
                          maxLength={160}
                          className="w-full rounded-lg border border-zinc-800 bg-black/55 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-800 outline-none transition-all resize-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="hero-location" className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                          Location (Optional)
                        </label>
                        <input
                          id="hero-location"
                          type="text"
                          value={portfolio.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="e.g. Hyderabad, India"
                          className="w-full rounded-lg border border-zinc-800 bg-black/55 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-800 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                          Profile Photo
                        </span>
                        <div className="flex items-center gap-3">
                          {portfolio.photo && (
                            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900 flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={portfolio.photo} alt="Avatar Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 flex gap-2">
                            <label htmlFor="hero-photo" className="flex items-center gap-1.5 bg-zinc-905 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors font-bold select-none">
                              <ImageIcon className="w-3.5 h-3.5 text-zinc-455" />
                              <span>Upload Image</span>
                              <input
                                id="hero-photo"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={(e) => handleImageUpload(e, portfolio.photo, (url) => handleInputChange("photo", url))}
                                className="hidden"
                                aria-label="Upload profile image"
                              />
                            </label>
                            {portfolio.photo && (
                              <button
                                type="button"
                                onClick={() => handleInputChange("photo", null)}
                                aria-label="Remove profile image"
                                className="text-[10px] text-rose-500 hover:text-rose-455 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SECTION 2: ABOUT */}
            <div className="bg-zinc-900/10 hover:bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs transition-all duration-200">
              <button
                onClick={() => toggleSection("about")}
                className="flex justify-between items-center w-full px-4 py-3.5 text-left font-semibold hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold tracking-tight">2. About Section</span>
                </div>
                {openSections.about ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {openSections.about && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-zinc-900/60"
                  >
                    <div className="p-4 bg-zinc-950/40">
                      <label htmlFor="editor-about" className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                        About Me
                      </label>
                      <textarea
                        id="editor-about"
                        value={portfolio.about}
                        onChange={(e) => handleInputChange("about", e.target.value)}
                        placeholder="Write your background and story..."
                        rows={5}
                        className="w-full rounded-lg border border-zinc-800 bg-black/55 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-800 outline-none transition-all resize-y"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SECTION 3: EXPERIENCE */}
            <div className="bg-zinc-900/10 hover:bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs transition-all duration-200">
              <button
                type="button"
                onClick={() => toggleSection("experience")}
                className="flex justify-between items-center w-full px-4 py-3.5 text-left font-semibold hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <Briefcase className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold tracking-tight">3. Experience ({(portfolio.experience || []).length} { (portfolio.experience || []).length === 1 ? 'entry' : 'entries' })</span>
                </div>
                {openSections.experience ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {openSections.experience && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-zinc-900/60"
                  >
                    <div className="p-4 bg-zinc-950/40 space-y-4">
                      {(!portfolio.experience || portfolio.experience.length === 0) ? (
                        <p className="text-[11px] text-zinc-500 text-center py-6 border border-dashed border-zinc-800 rounded-lg">
                          No experience added yet. Click &quot;Add Experience&quot; below.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {portfolio.experience.map((exp, index) => {
                            const isDateErr = !exp.isCurrent && parseInt(exp.startYear) > parseInt(exp.endYear);
                            return (
                              <div
                                key={exp.id}
                                className="bg-black/60 border border-zinc-900 hover:border-zinc-800 rounded-xl p-4 relative space-y-4 transition-all"
                              >
                                <div className="flex items-start gap-3 justify-between">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="relative w-10 h-10 rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden flex-shrink-0 flex items-center justify-center group">
                                      {exp.companyLogo ? (
                                        <img src={exp.companyLogo} alt="Logo" className="w-full h-full object-cover" />
                                      ) : (
                                        <Briefcase className="w-5 h-5 text-zinc-650" />
                                      )}
                                      <label className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                        <ImageIcon className="w-3.5 h-3.5 text-white" />
                                        <input
                                          type="file"
                                          accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                          onChange={(e) => handleLogoUpload(e, exp.id, exp.companyLogo)}
                                          className="hidden"
                                        />
                                      </label>
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="text-xs font-bold text-zinc-200 truncate">
                                        {exp.jobTitle || "Job Title"}
                                      </h4>
                                      <p className="text-[10px] text-zinc-500 truncate">
                                        {exp.company || "Company Name"}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Custom Controls Toolbar */}
                                  <div className="flex items-center gap-0.5 bg-zinc-900 border border-zinc-800/80 rounded-lg p-0.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => moveExperience(index, "up")}
                                      disabled={index === 0}
                                      className="text-zinc-500 hover:text-zinc-200 disabled:opacity-20 disabled:hover:text-zinc-500 p-1 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                                      title="Move up"
                                    >
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => moveExperience(index, "down")}
                                      disabled={index === portfolio.experience.length - 1}
                                      className="text-zinc-500 hover:text-zinc-200 disabled:opacity-20 disabled:hover:text-zinc-500 p-1 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                                      title="Move down"
                                    >
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="w-px h-3.5 bg-zinc-850 mx-0.5" />
                                    <button
                                      type="button"
                                      onClick={() => removeExperience(exp.id)}
                                      className="text-zinc-500 hover:text-rose-400 p-1 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                                      title="Remove entry"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-[9px] font-semibold text-zinc-500 tracking-wide uppercase">
                                  <span>Logo:</span>
                                  <label className="text-violet-400 hover:text-violet-300 cursor-pointer underline">
                                    Upload
                                    <input
                                      type="file"
                                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                      onChange={(e) => handleLogoUpload(e, exp.id, exp.companyLogo)}
                                      className="hidden"
                                    />
                                  </label>
                                  {exp.companyLogo && (
                                    <>
                                      <span>&middot;</span>
                                      <button
                                        type="button"
                                        onClick={() => handleExperienceChange(exp.id, "companyLogo", null)}
                                        className="text-rose-500 hover:text-rose-400 cursor-pointer hover:underline"
                                      >
                                        Remove
                                      </button>
                                    </>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label htmlFor={`exp-jobTitle-${exp.id}`} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                      Job Title*
                                    </label>
                                    <input
                                      id={`exp-jobTitle-${exp.id}`}
                                      type="text"
                                      value={exp.jobTitle}
                                      onChange={(e) => handleExperienceChange(exp.id, "jobTitle", e.target.value)}
                                      placeholder="Senior Frontend Developer"
                                      className={`w-full rounded-lg border bg-zinc-950/40 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-colors ${
                                        attemptedSave && !exp.jobTitle.trim()
                                          ? "border-red-500 focus:border-red-500"
                                          : "border-zinc-800 focus:border-zinc-700"
                                      }`}
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor={`exp-company-${exp.id}`} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                      Company Name*
                                    </label>
                                    <input
                                      id={`exp-company-${exp.id}`}
                                      type="text"
                                      value={exp.company}
                                      onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)}
                                      placeholder="Acme Corp"
                                      className={`w-full rounded-lg border bg-zinc-950/40 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-colors ${
                                        attemptedSave && !exp.company.trim()
                                          ? "border-red-500 focus:border-red-500"
                                          : "border-zinc-800 focus:border-zinc-700"
                                      }`}
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label htmlFor={`exp-employmentType-${exp.id}`} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                      Employment Type
                                    </label>
                                    <select
                                      id={`exp-employmentType-${exp.id}`}
                                      value={exp.employmentType}
                                      onChange={(e) => handleExperienceChange(exp.id, "employmentType", e.target.value)}
                                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-200 px-3 py-2 text-xs focus:border-zinc-500 outline-none transition-colors"
                                    >
                                      <option value="Full-time">Full-time</option>
                                      <option value="Part-time">Part-time</option>
                                      <option value="Freelance">Freelance</option>
                                      <option value="Internship">Internship</option>
                                      <option value="Contract">Contract</option>
                                      <option value="Volunteer">Volunteer</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label htmlFor={`exp-locationType-${exp.id}`} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                      Location Type
                                    </label>
                                    <select
                                      id={`exp-locationType-${exp.id}`}
                                      value={exp.locationType}
                                      onChange={(e) => handleExperienceChange(exp.id, "locationType", e.target.value)}
                                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-200 px-3 py-2 text-xs focus:border-zinc-500 outline-none transition-colors"
                                    >
                                      <option value="Remote">Remote</option>
                                      <option value="On-site">On-site</option>
                                      <option value="Hybrid">Hybrid</option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label htmlFor={`exp-location-${exp.id}`} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                    Location (city, country)
                                  </label>
                                  <input
                                    id={`exp-location-${exp.id}`}
                                    type="text"
                                    value={exp.location}
                                    onChange={(e) => handleExperienceChange(exp.id, "location", e.target.value)}
                                    placeholder="Hyderabad, India"
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-colors"
                                  />
                                </div>

                                <div className="space-y-2 border-t border-zinc-900 pt-3">
                                  <label htmlFor={`exp-isCurrent-${exp.id}`} className="flex items-center gap-2 text-xs font-semibold text-zinc-400 cursor-pointer select-none">
                                    <input
                                      id={`exp-isCurrent-${exp.id}`}
                                      type="checkbox"
                                      checked={exp.isCurrent}
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        handleExperienceChange(exp.id, "isCurrent", checked);
                                        if (checked) {
                                          handleExperienceChange(exp.id, "endMonth", "");
                                          handleExperienceChange(exp.id, "endYear", "");
                                        }
                                      }}
                                      className="rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
                                    />
                                    <span>Currently working here</span>
                                  </label>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label htmlFor={`exp-startMonth-${exp.id}`} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                        Start Month
                                      </label>
                                      <select
                                        id={`exp-startMonth-${exp.id}`}
                                        value={exp.startMonth}
                                        onChange={(e) => handleExperienceChange(exp.id, "startMonth", e.target.value)}
                                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-200 px-3 py-2 text-xs focus:border-zinc-500 outline-none transition-colors"
                                      >
                                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                                          <option key={m} value={m}>{m}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label htmlFor={`exp-startYear-${exp.id}`} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                        Start Year
                                      </label>
                                      <select
                                        id={`exp-startYear-${exp.id}`}
                                        value={exp.startYear}
                                        onChange={(e) => handleExperienceChange(exp.id, "startYear", e.target.value)}
                                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-200 px-3 py-2 text-xs focus:border-zinc-500 outline-none transition-colors"
                                      >
                                        {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => {
                                          const year = (new Date().getFullYear() - i).toString();
                                          return <option key={year} value={year}>{year}</option>;
                                        })}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label htmlFor={`exp-endMonth-${exp.id}`} className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${exp.isCurrent ? 'text-zinc-800' : 'text-zinc-500'}`}>
                                        End Month
                                      </label>
                                      <select
                                        id={`exp-endMonth-${exp.id}`}
                                        value={exp.endMonth}
                                        disabled={exp.isCurrent}
                                        onChange={(e) => handleExperienceChange(exp.id, "endMonth", e.target.value)}
                                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-200 px-3 py-2 text-xs focus:border-zinc-500 outline-none transition-colors disabled:opacity-20"
                                      >
                                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                                          <option key={m} value={m}>{m}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label htmlFor={`exp-endYear-${exp.id}`} className={`block text-[9px] font-bold uppercase tracking-wider mb-1 ${exp.isCurrent ? 'text-zinc-800' : 'text-zinc-500'}`}>
                                        End Year
                                      </label>
                                      <select
                                        id={`exp-endYear-${exp.id}`}
                                        value={exp.endYear}
                                        disabled={exp.isCurrent}
                                        onChange={(e) => handleExperienceChange(exp.id, "endYear", e.target.value)}
                                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-200 px-3 py-2 text-xs focus:border-zinc-500 outline-none transition-colors disabled:opacity-20"
                                      >
                                        {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => {
                                          const year = (new Date().getFullYear() - i).toString();
                                          return <option key={year} value={year}>{year}</option>;
                                        })}
                                      </select>
                                    </div>
                                  </div>

                                  {isDateErr && (
                                    <p className="text-red-400 text-[10px] font-semibold mt-1">End date must be after start date</p>
                                  )}
                                </div>

                                <div>
                                  <label htmlFor={`exp-description-${exp.id}`} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                    Description / Key responsibilities
                                  </label>
                                  <textarea
                                    id={`exp-description-${exp.id}`}
                                    value={exp.description}
                                    onChange={(e) => handleExperienceChange(exp.id, "description", e.target.value)}
                                    placeholder="Describe your key responsibilities and achievements..."
                                    rows={4}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-colors resize-y"
                                  />
                                </div>

                                <div>
                                  <label htmlFor={`exp-skills-${exp.id}`} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                    Skills used (comma-separated)
                                  </label>
                                  <input
                                    id={`exp-skills-${exp.id}`}
                                    type="text"
                                    value={exp.skills}
                                    onChange={(e) => handleExperienceChange(exp.id, "skills", e.target.value)}
                                    placeholder="React, TypeScript, Node.js"
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-colors"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      <div ref={experienceEndRef} />

                      <button
                        type="button"
                        onClick={addExperience}
                        className="flex items-center justify-center gap-1.5 w-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-bold py-2.5 px-4 rounded-lg transition-all active:scale-98 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Add Experience</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SECTION 4: PROJECTS */}
            <div className="bg-zinc-900/10 hover:bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs transition-all duration-200">
              <button
                onClick={() => toggleSection("projects")}
                className="flex justify-between items-center w-full px-4 py-3.5 text-left font-semibold hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold tracking-tight">4. Projects ({portfolio.projects.length} / 6)</span>
                </div>
                {openSections.projects ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {openSections.projects && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-zinc-900/60"
                  >
                    <div className="p-4 bg-zinc-950/40 space-y-4">
                      
                      {portfolio.projects.length === 0 ? (
                        <p className="text-[11px] text-zinc-500 text-center py-6 border border-dashed border-zinc-800 rounded-lg">
                          No projects added yet. Click &quot;Add Project&quot; below.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {portfolio.projects.map((project, index) => (
                            <div
                              key={project.id}
                              className="bg-black/60 border border-zinc-900 hover:border-zinc-800 rounded-xl p-4 relative space-y-4 transition-all"
                            >
                              <div className="flex items-center justify-between border-b border-zinc-900/60 pb-2.5 mb-1">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                  Project #{index + 1}
                                </span>
                                {confirmDeleteProject === project.id ? (
                                   <div className="flex items-center gap-1.5">
                                     <span className="text-[9px] font-semibold text-rose-500 uppercase tracking-wider">Confirm Delete?</span>
                                     <button
                                       type="button"
                                       onClick={() => {
                                         removeProject(project.id);
                                         setConfirmDeleteProject(null);
                                       }}
                                       className="text-[9px] text-white bg-rose-650 hover:bg-rose-600 px-2 py-0.5 rounded font-bold uppercase cursor-pointer"
                                     >
                                       Yes
                                     </button>
                                     <button
                                       type="button"
                                       onClick={() => setConfirmDeleteProject(null)}
                                       className="text-[9px] text-zinc-400 bg-zinc-850 hover:bg-zinc-800 px-2 py-0.5 rounded font-bold uppercase cursor-pointer"
                                     >
                                       No
                                     </button>
                                   </div>
                                 ) : (
                                   <button
                                     type="button"
                                     onClick={() => setConfirmDeleteProject(project.id)}
                                     className="text-zinc-500 hover:text-rose-455 p-1 hover:bg-zinc-900 border border-zinc-800 rounded transition-colors cursor-pointer"
                                     title="Remove project"
                                   >
                                     <Trash2 className="w-3.5 h-3.5" />
                                   </button>
                                 )}
                              </div>

                              <div>
                                <label htmlFor={`proj-title-${project.id}`} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                  Project Title
                                </label>
                                <input
                                  id={`proj-title-${project.id}`}
                                  type="text"
                                  value={project.title}
                                  onChange={(e) => handleProjectChange(project.id, "title", e.target.value)}
                                  placeholder="Project title"
                                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-colors"
                                />
                              </div>

                              <div>
                                <label htmlFor={`proj-desc-${project.id}`} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                  Short Description
                                </label>
                                <textarea
                                  id={`proj-desc-${project.id}`}
                                  value={project.description}
                                  onChange={(e) => handleProjectChange(project.id, "description", e.target.value)}
                                  placeholder="Short summary..."
                                  rows={2.5}
                                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-colors resize-none"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label htmlFor={`proj-tags-${project.id}`} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                    Tags (comma-separated)
                                  </label>
                                  <input
                                    id={`proj-tags-${project.id}`}
                                    type="text"
                                    value={project.tags}
                                    onChange={(e) => handleProjectChange(project.id, "tags", e.target.value)}
                                    placeholder="React, Tailwind"
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-colors"
                                  />
                                </div>
                                <div>
                                  <label htmlFor={`proj-link-${project.id}`} className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                    Project URL
                                  </label>
                                  <input
                                    id={`proj-link-${project.id}`}
                                    type="url"
                                    value={project.link}
                                    onChange={(e) => handleProjectChange(project.id, "link", e.target.value)}
                                    placeholder="https://..."
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-colors"
                                  />
                                </div>
                              </div>

                              <div>
                                <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                                  Cover Image
                                </span>
                                <div className="flex items-center gap-3">
                                  {project.cover && (
                                    <div className="relative w-9 h-7 rounded border border-zinc-800 bg-zinc-950 flex-shrink-0 overflow-hidden">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={project.cover} alt="Cover Preview" className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    <label htmlFor={`proj-cover-${project.id}`} className="flex items-center gap-1.5 bg-zinc-905 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors font-bold select-none">
                                      <ImageIcon className="w-3.5 h-3.5 text-zinc-450" />
                                      <span>Upload Cover</span>
                                      <input
                                        id={`proj-cover-${project.id}`}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(e) =>
                                          handleImageUpload(e, project.cover, (url) =>
                                            handleProjectChange(project.id, "cover", url)
                                          )
                                        }
                                        className="hidden"
                                        aria-label="Upload project cover image"
                                      />
                                    </label>
                                    {project.cover && (
                                      <button
                                        type="button"
                                        onClick={() => handleProjectChange(project.id, "cover", null)}
                                        aria-label="Remove project cover image"
                                        className="text-[10px] text-rose-500 hover:text-rose-455 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {portfolio.projects.length < 6 && (
                        <button
                          onClick={addProject}
                          className="flex items-center justify-center gap-1.5 w-full bg-zinc-900 hover:bg-zinc-855 border border-zinc-800 text-zinc-200 text-xs font-bold py-2.5 px-4 rounded-lg transition-all active:scale-98 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Add Project</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SECTION 5: SKILLS */}
            <div className="bg-zinc-900/10 hover:bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs transition-all duration-200">
              <button
                onClick={() => toggleSection("skills")}
                className="flex justify-between items-center w-full px-4 py-3.5 text-left font-semibold hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <Wrench className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold tracking-tight">5. Skills</span>
                </div>
                {openSections.skills ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {openSections.skills && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-zinc-900/60"
                  >
                    <div className="p-4 bg-zinc-950/40">
                      <label htmlFor="editor-skills" className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                        Skills (comma-separated)
                      </label>
                      <input
                        id="editor-skills"
                        type="text"
                        value={portfolio.skills}
                        onChange={(e) => handleInputChange("skills", e.target.value)}
                        placeholder="e.g. React, TypeScript, Node.js"
                        className="w-full rounded-lg border border-zinc-800 bg-black/55 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-all"
                      />
                      <p className="text-[10px] text-zinc-500 mt-2 pl-0.5 italic font-medium">
                        Comma-separated skills will render as pill items in templates.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SECTION 6: CONTACT */}
            <div className="bg-zinc-900/10 hover:bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800/80 rounded-xl overflow-hidden shadow-xs transition-all duration-200">
              <button
                onClick={() => toggleSection("contact")}
                className="flex justify-between items-center w-full px-4 py-3.5 text-left font-semibold hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-zinc-200">
                  <Contact className="w-4 h-4 text-cyan-500" />
                  <span className="text-xs font-bold tracking-tight">6. Contact Links</span>
                </div>
                {openSections.contact ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {openSections.contact && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-zinc-900/60"
                  >
                    <div className="p-4 bg-zinc-950/40 space-y-4">
                      <div>
                        <label htmlFor="contact-email" className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={portfolio.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="alex@example.com"
                          className="w-full rounded-lg border border-zinc-800 bg-black/55 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-linkedin" className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                          LinkedIn URL (Optional)
                        </label>
                        <input
                          id="contact-linkedin"
                          type="url"
                          value={portfolio.linkedin}
                          onChange={(e) => handleInputChange("linkedin", e.target.value)}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full rounded-lg border border-zinc-800 bg-black/55 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-twitter" className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                          Twitter/X URL (Optional)
                        </label>
                        <input
                          id="contact-twitter"
                          type="url"
                          value={portfolio.twitter}
                          onChange={(e) => handleInputChange("twitter", e.target.value)}
                          placeholder="https://twitter.com/..."
                          className="w-full rounded-lg border border-zinc-800 bg-black/55 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-github" className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                          GitHub URL (Optional)
                        </label>
                        <input
                          id="contact-github"
                          type="url"
                          value={portfolio.github}
                          onChange={(e) => handleInputChange("github", e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full rounded-lg border border-zinc-800 bg-black/55 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:border-zinc-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: LIVE PREVIEW (60% width on desktop, stacked & collapsible on mobile) */}
        <div className={`w-full md:w-[60%] h-full md:overflow-y-auto bg-[#0a0a0c] flex flex-col transition-all duration-300 ${
          isPreviewExpanded ? "h-[75vh] fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800" : "h-auto"
        }`}>
          
          {/* Mobile Preview Header/Toggle Bar */}
          <div
            onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
            className="md:hidden flex items-center justify-between px-5 py-3.5 border-y border-zinc-900 bg-zinc-950 sticky top-0 z-30 cursor-pointer select-none active:bg-zinc-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-[10px] text-zinc-350 uppercase tracking-wider">Live Preview</span>
            </div>
            <button className="text-zinc-500 flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase">
              <span>{isPreviewExpanded ? "Collapse" : "Expand"}</span>
              {isPreviewExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </button>
          </div>

          {/* Desktop Preview Header (Device Toolbar) */}
          <div className="hidden md:flex h-14 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-sm px-6 items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Live Preview</span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-black/40 border border-zinc-900 rounded-lg p-0.5">
              <button
                onClick={() => setDeviceView("desktop")}
                className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deviceView === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDeviceView("tablet")}
                className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deviceView === "tablet" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setDeviceView("mobile")}
                className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deviceView === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            <a
              href={`/p/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <span>View Site</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-400" />
            </a>
          </div>

          {/* Preview Panel Body: Device Canvas */}
          <div className={`flex-1 overflow-y-auto ${!isPreviewExpanded ? "hidden md:flex" : "flex"} flex-col items-center justify-center p-4 md:p-8 bg-[radial-gradient(#1f1f23_1px,transparent_1px)] [background-size:16px_16px] bg-[#0c0c0e]`}>
            
            <div 
              className={`flex flex-col bg-black border border-zinc-900 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
                deviceView === "desktop" ? "w-full h-full max-w-full" : 
                deviceView === "tablet" ? "w-[768px] h-full max-w-full border-zinc-800" : 
                "w-[375px] h-[680px] max-h-full rounded-[2.5rem] border-[10px] border-zinc-800 relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] shrink-0"
              }`}
            >
              {/* Browser Header Bar for Desktop/Tablet */}
              {deviceView !== "mobile" ? (
                <div className="h-10 border-b border-zinc-900 bg-zinc-950 px-4 flex items-center justify-between select-none shrink-0">
                  <div className="flex items-center gap-1.5 w-1/4">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="w-2/4 bg-black border border-zinc-900 rounded-md py-1 px-3 text-[9px] font-mono text-zinc-500 text-center select-all truncate">
                    foliofast.com/p/{username}
                  </div>
                  <div className="w-1/4 flex justify-end">
                    <a
                      href={`/p/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:bg-zinc-900 rounded text-zinc-500 hover:text-zinc-250 transition-colors"
                      title="Open in new tab"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                // Smartphone Screen Header
                <div className="h-9 bg-zinc-950 flex items-center justify-between px-6 text-[9px] text-zinc-500 select-none shrink-0 font-medium font-sans relative border-b border-zinc-900">
                  <span>9:41</span>
                  <div className="w-20 h-4.5 bg-zinc-800 rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-black border border-zinc-900 mr-2" />
                    <div className="w-5 h-1 bg-black rounded" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-zinc-500" />
                    <span className="w-3.5 h-2 bg-zinc-500 rounded-xs" />
                  </div>
                </div>
              )}

              {/* Scrollable Frame Content */}
              <div className="flex-1 overflow-y-auto bg-black">
                <PortfolioPreview portfolio={portfolio} template={activeTemplate} />
              </div>
            </div>

          </div>
        </div>

        {/* Overlay to dim background when mobile preview is expanded */}
        {isPreviewExpanded && (
          <div
            onClick={() => setIsPreviewExpanded(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity"
          />
        )}
      </div>
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* Confirm Experience Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteExpId}
        title="Remove Experience?"
        description="Are you sure you want to remove this experience item from your portfolio?"
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmRemoveExperience}
        onCancel={() => setDeleteExpId(null)}
      />

      {/* Confirm Reset Demo Data Modal */}
      <ConfirmModal
        isOpen={showResetConfirmModal}
        title="Reset Portfolio Data?"
        description="This will replace your current edits with default sample portfolio data. Are you sure?"
        confirmText="Reset to Default"
        cancelText="Cancel"
        variant="warning"
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetConfirmModal(false)}
      />

      {/* Confirm Re-run Wizard Modal */}
      <ConfirmModal
        isOpen={showRerunWizardConfirmModal}
        title="Re-run Setup Wizard?"
        description="This will guide you through the step-by-step setup wizard again. Your existing data will be pre-filled."
        confirmText="Start Wizard"
        cancelText="Cancel"
        variant="info"
        onConfirm={() => {
          setShowRerunWizardConfirmModal(false);
          router.push("/editor/wizard?step=1&mode=wizard");
        }}
        onCancel={() => setShowRerunWizardConfirmModal(false)}
      />
    </div>
  );
}
