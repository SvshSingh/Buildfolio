"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Briefcase, 
  Trash2, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  X, 
  Image as ImageIcon, 
  ArrowLeft, 
  ArrowRight,
  Globe, 
  Mail, 
  Link2, 
  Github, 
  Linkedin, 
  Twitter,
  Loader2,
  AlertCircle
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import PortfolioPreview from "@/components/portfolio-preview";
import { Experience } from "@/components/ExperienceTimeline";
import Toast from "@/components/ui/toast";
import ResumeUploadButton from "@/components/resume-import/ResumeUploadButton";
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
  website?: string;
}

interface WizardContainerProps {
  userId: string;
  username: string;
  email: string;
  initialData?: any;
  initialTemplate: string;
  wizardStep: number;
  wizardCompleted: boolean;
}

const defaultEmptyPortfolio: Portfolio = {
  name: "",
  headline: "",
  bio: "",
  location: "",
  photo: null,
  about: "",
  projects: [
    {
      id: "proj-placeholder-1",
      title: "My Awesome Project",
      description: "A web application built using modern technologies that solves a real-world problem.",
      tags: "Next.js, TypeScript, Tailwind CSS",
      link: "https://github.com",
      cover: null
    }
  ],
  experience: [
    {
      id: "exp-placeholder-1",
      jobTitle: "Software Engineer",
      company: "Acme Corp",
      companyLogo: null,
      employmentType: "Full-time",
      locationType: "Remote",
      location: "Hyderabad, India",
      startMonth: "Jan",
      startYear: "2023",
      endMonth: "",
      endYear: "",
      isCurrent: true,
      description: "Worked on building high performance web applications.",
      skills: "React, Next.js, Tailwind CSS"
    }
  ],
  skills: "",
  email: "",
  linkedin: "",
  twitter: "",
  github: "",
  website: ""
};

export default function WizardContainer({
  userId,
  username,
  email,
  initialData,
  initialTemplate,
  wizardStep,
  wizardCompleted,
}: WizardContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const step = parseInt(searchParams.get("step") || "1") || 1;

  // Initialize state
  const [portfolio, setPortfolio] = useState<Portfolio>(() => {
    if (initialData) {
      return {
        name: initialData.name || "",
        headline: initialData.headline || "",
        bio: initialData.bio || "",
        location: initialData.location || "",
        photo: initialData.photo || null,
        about: initialData.about || "",
        projects: initialData.projects || defaultEmptyPortfolio.projects,
        experience: initialData.experience || defaultEmptyPortfolio.experience,
        skills: initialData.skills || "",
        email: initialData.email || email,
        linkedin: initialData.linkedin || "",
        twitter: initialData.twitter || "",
        github: initialData.github || "",
        website: initialData.website || "",
      };
    }
    return {
      ...defaultEmptyPortfolio,
      email: email,
    };
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isCelebration, setIsCelebration] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLanding, setShowLanding] = useState(() => {
    const forceImport = searchParams.get("import") === "true";
    if (forceImport) {
      return true;
    }
    if (portfolio.name || portfolio.headline) {
      return false;
    }
    return true;
  });

  const handleImportSuccess = (mappedData: any) => {
    setPortfolio((prev) => ({
      ...prev,
      ...mappedData,
      experience: mappedData.experience || prev.experience,
      projects: mappedData.projects || prev.projects,
    }));
    if (mappedData.experience && mappedData.experience.length > 0) {
      setExpandedExperienceId(mappedData.experience[0].id);
    }
    if (mappedData.projects && mappedData.projects.length > 0) {
      setExpandedProjectId(mappedData.projects[0].id);
    }
    setShowLanding(false);
  };
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Experience and project collapsible active states
  const [expandedExperienceId, setExpandedExperienceId] = useState<string | null>(() => {
    return portfolio.experience.length > 0 ? portfolio.experience[0].id : null;
  });
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(() => {
    return portfolio.projects.length > 0 ? portfolio.projects[0].id : null;
  });

  // Photo upload input refs
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Initialize max step
  useEffect(() => {
    if (wizardCompleted) {
      setMaxStepReached(6);
    } else {
      setMaxStepReached((prev) => Math.max(prev, wizardStep));
    }
  }, [wizardStep, wizardCompleted]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showPreviewModal) {
        setShowPreviewModal(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showPreviewModal]);

  // Save progress helper
  const saveWizardState = async (nextStep: number, isFinished = false) => {
    setSaving(true);
    setSaveError(null);
    try {
      const supabase = createClient();
      const payload: any = {
        user_id: userId,
        data: portfolio,
        wizard_step: Math.min(nextStep, 6),
        updated_at: new Date().toISOString(),
      };
      if (isFinished) {
        payload.wizard_completed = true;
      }
      const { error } = await supabase
        .from("portfolios")
        .upsert(payload, { onConflict: "user_id" });

      if (error) throw error;
    } catch (err: any) {
      console.error("Save error:", err);
      setSaveError("Failed to save your progress. Please check your connection and try again.");
      triggerToast("Could not save this step. Please try again.", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const goToStep = async (nextStep: number) => {
    // Only allow navigating to steps <= maxStepReached
    if (nextStep > maxStepReached && !wizardCompleted) return;
    setErrors({});
    const modeParam = mode ? `&mode=${mode}` : "";
    router.push(`/editor/wizard?step=${nextStep}${modeParam}`);
  };

  const handleBack = () => {
    if (step > 1) {
      goToStep(step - 1);
    }
  };

  const handleContinue = async () => {
    // Validate current step
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (!portfolio.name.trim()) stepErrors.name = "Full name is required";
      if (!portfolio.headline.trim()) stepErrors.headline = "Headline / Role is required";
      if (portfolio.bio.length > 160) stepErrors.bio = "Bio cannot exceed 160 characters";
    } else if (step === 3) {
      // Validate experience entries (if present)
      portfolio.experience.forEach((exp) => {
        if (!exp.jobTitle.trim()) stepErrors[`exp-title-${exp.id}`] = "Job Title is required";
        if (!exp.company.trim()) stepErrors[`exp-company-${exp.id}`] = "Company is required";
        if (!exp.isCurrent && exp.startYear && exp.endYear && parseInt(exp.startYear) > parseInt(exp.endYear)) {
          stepErrors[`exp-date-${exp.id}`] = "End year must be after start year";
        }
      });
    } else if (step === 4) {
      // Validate project entries (if present)
      portfolio.projects.forEach((proj) => {
        if (!proj.title.trim()) stepErrors[`proj-title-${proj.id}`] = "Project Title is required";
      });
    } else if (step === 6) {
      if (!portfolio.email.trim()) {
        stepErrors.email = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(portfolio.email)) {
        stepErrors.email = "Please enter a valid email address";
      }
      
      const checkUrl = (url: string, field: string) => {
        if (url && !url.startsWith("https://")) {
          stepErrors[field] = "URL must start with https://";
        }
      };
      checkUrl(portfolio.linkedin, "linkedin");
      checkUrl(portfolio.github, "github");
      checkUrl(portfolio.twitter, "twitter");
      checkUrl(portfolio.website || "", "website");
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      // Auto-expand any invalid items to show the error
      if (step === 3) {
        const firstErrId = Object.keys(stepErrors)[0].split("-").pop();
        if (firstErrId) setExpandedExperienceId(firstErrId);
      } else if (step === 4) {
        const firstErrId = Object.keys(stepErrors)[0].split("-").pop();
        if (firstErrId) setExpandedProjectId(firstErrId);
      }
      return;
    }

    setErrors({});
    try {
      if (step < 6) {
        const nextStep = step + 1;
        await saveWizardState(nextStep);
        if (nextStep > maxStepReached) {
          setMaxStepReached(nextStep);
        }
        const modeParam = mode ? `&mode=${mode}` : "";
        router.push(`/editor/wizard?step=${nextStep}${modeParam}`);
      } else {
        // Step 6 continues to finish
        await saveWizardState(6, true);
        setIsCelebration(true);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      // Error handled and set in saveWizardState
    }
  };

  const handleSkipStep = async () => {
    setErrors({});
    const nextStep = step + 1;
    if (nextStep > maxStepReached) {
      setMaxStepReached(nextStep);
    }
    await saveWizardState(nextStep);
    const modeParam = mode ? `&mode=${mode}` : "";
    router.push(`/editor/wizard?step=${nextStep}${modeParam}`);
  };

  const handleSkipSetup = async () => {
    setShowSkipModal(true);
  };

  const handleConfirmSkipSetup = async () => {
    setShowSkipModal(false);
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase
        .from("portfolios")
        .update({ wizard_completed: true })
        .eq("user_id", userId);
      router.push("/editor");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLeaveModal(true);
  };

  const handleConfirmLeaveWizard = () => {
    setShowLeaveModal(false);
    router.push("/dashboard");
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

  // Image Upload helper
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (portfolio.photo) {
          const oldPath = portfolio.photo.split("/portfolio-assets/")[1];
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

        setPortfolio((prev) => ({ ...prev, photo: publicUrl }));
        triggerToast("Profile picture uploaded successfully", "success");
      } catch (err) {
        console.error(err);
        triggerToast("Failed to upload profile photo.", "error");
      }
    }
  };

  // Project cover upload helper
  const handleProjectCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const valError = validateImageFile(file, ["image/jpeg", "image/png", "image/webp"]);
      if (valError) {
        triggerToast(valError, "error");
        e.target.value = "";
        return;
      }
      try {
        const supabase = createClient();
        const oldCover = portfolio.projects.find((p) => p.id === projectId)?.cover;
        if (oldCover) {
          const oldPath = oldCover.split("/portfolio-assets/")[1];
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

        setPortfolio((prev) => ({
          ...prev,
          projects: prev.projects.map((p) => (p.id === projectId ? { ...p, cover: publicUrl } : p)),
        }));
        triggerToast("Project cover uploaded successfully", "success");
      } catch (err) {
        console.error(err);
        triggerToast("Failed to upload project cover.", "error");
      }
    }
  };

  // Company logo upload helper
  const handleCompanyLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, expId: string) => {
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
        const oldLogo = portfolio.experience.find((exp) => exp.id === expId)?.companyLogo;
        if (oldLogo) {
          const oldPath = oldLogo.split("/portfolio-assets/")[1];
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

        setPortfolio((prev) => ({
          ...prev,
          experience: prev.experience.map((exp) => (exp.id === expId ? { ...exp, companyLogo: publicUrl } : exp)),
        }));
        triggerToast("Logo uploaded successfully", "success");
      } catch (err) {
        console.error(err);
        triggerToast("Failed to upload company logo.", "error");
      }
    }
  };

  // Experience state change
  const handleExperienceChange = (id: string, field: keyof Experience, value: any) => {
    setPortfolio((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }));
  };

  const addExperience = () => {
    if (portfolio.experience.length >= 5) return;
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      jobTitle: "",
      company: "",
      companyLogo: null,
      employmentType: "Full-time",
      locationType: "Remote",
      location: "",
      startMonth: "Jan",
      startYear: "2023",
      endMonth: "",
      endYear: "",
      isCurrent: true,
      description: "",
      skills: "",
    };
    setPortfolio((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), newExp],
    }));
    setExpandedExperienceId(newExp.id);
  };

  const removeExperience = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  // Projects state change
  const handleProjectChange = (id: string, field: keyof Project, value: any) => {
    setPortfolio((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const addProject = () => {
    if (portfolio.projects.length >= 3) return;
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: "",
      description: "",
      tags: "",
      link: "",
      cover: null,
    };
    setPortfolio((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), newProj],
    }));
    setExpandedProjectId(newProj.id);
  };

  const removeProject = (id: string) => {
    setPortfolio((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // Skills input & suggested tags
  const [skillInput, setSkillInput] = useState("");
  const currentSkills = portfolio.skills
    ? portfolio.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const skillsToAdd = skillInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      
      if (skillsToAdd.length > 0) {
        const newSkills = [...currentSkills];
        skillsToAdd.forEach((sk) => {
          if (!newSkills.includes(sk)) {
            newSkills.push(sk);
          }
        });
        setPortfolio((prev) => ({ ...prev, skills: newSkills.join(", ") }));
      }
      setSkillInput("");
    }
  };

  const handleSkillPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    if (pastedText) {
      const skillsToAdd = pastedText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      
      if (skillsToAdd.length > 0) {
        const newSkills = [...currentSkills];
        skillsToAdd.forEach((sk) => {
          if (!newSkills.includes(sk)) {
            newSkills.push(sk);
          }
        });
        setPortfolio((prev) => ({ ...prev, skills: newSkills.join(", ") }));
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    const updated = currentSkills.filter((s) => s !== skill).join(", ");
    setPortfolio((prev) => ({ ...prev, skills: updated }));
  };

  const addSuggestedSkill = (skill: string) => {
    if (!currentSkills.includes(skill)) {
      const updated = [...currentSkills, skill].join(", ");
      setPortfolio((prev) => ({ ...prev, skills: updated }));
    }
  };

  const suggestedCategories = [
    {
      category: "Frontend",
      skills: ["React", "Vue", "Angular", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      category: "Backend",
      skills: ["Node.js", "Python", "Django", "Express", "PostgreSQL", "Supabase"],
    },
    {
      category: "Design",
      skills: ["Figma", "Adobe XD", "Illustrator", "Photoshop"],
    },
    {
      category: "Other",
      skills: ["Git", "Docker", "AWS", "REST APIs", "GraphQL"],
    },
  ];

  // Celebration timer & redirect
  useEffect(() => {
    if (isCelebration) {
      const timer = setTimeout(() => {
        router.push("/editor");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isCelebration, router]);

  // Rendering Celebration overlay
  if (isCelebration) {
    const publicUrl = `${window.location.origin}/p/${username}`;
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center p-6 md:p-8 select-none text-center space-y-6">
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="text-7xl md:text-8xl"
        >
          ✨
        </motion.div>
        
        <div className="space-y-2 max-w-md">
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Your portfolio is live!
          </h1>
          <p className="text-zinc-450 text-xs leading-relaxed">
            Congratulations! Your portfolio has been built and is publicly accessible at the link below.
          </p>
        </div>

        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-indigo-400 hover:text-indigo-350 underline text-xs md:text-sm tracking-wide break-all"
        >
          {publicUrl.replace(/^https?:\/\//, "")}
        </a>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full max-w-sm">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-white hover:bg-zinc-100 text-black text-xs font-semibold px-4 py-3 rounded-lg text-center transition-colors shadow-lg cursor-pointer"
          >
            View my portfolio →
          </a>
          <button
            onClick={() => router.push("/editor")}
            className="flex-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white text-xs font-semibold px-4 py-3 rounded-lg transition-colors cursor-pointer"
          >
            Edit details →
          </button>
        </div>

        <p className="text-zinc-600 text-[10px] pt-8 animate-pulse">
          Redirecting to editor details in 5 seconds...
        </p>
      </div>
    );
  }

  // Calculate progress percent
  // step 1 = 16%, step 6 = 100%
  const progressPercent = Math.round((step / 6) * 100);

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans select-none relative pb-24 md:pb-24">
      {/* HEADER */}
      <header className="w-full h-16 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center px-4 md:px-8 justify-between">
        <div className="flex items-center">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-bold tracking-tight text-white">FolioFast</span>
          </button>
        </div>

        <div className="text-xs font-medium text-zinc-400">
          Step {step} of 6
        </div>

        <div>
          <button
            onClick={handleSkipSetup}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Skip setup →
          </button>
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div className="w-full h-1 bg-zinc-900 sticky top-16 z-40">
        <div
          className="h-full bg-indigo-500 transition-all duration-400 ease-in-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* STEP DOTS CONNECTING RULER */}
      <div className="w-full max-w-xl mx-auto px-4 pt-8 pb-10 relative z-10 flex items-center justify-between">
        {Array.from({ length: 6 }).map((_, idx) => {
          const stepNum = idx + 1;
          const isCurrent = stepNum === step;
          const isCompleted = stepNum < maxStepReached && !isCurrent;
          const isFuture = stepNum > maxStepReached;
          const label = ["Hero", "About", "Exp", "Proj", "Skill", "Contact"][idx];

          const isLineActive = maxStepReached > stepNum;

          return (
            <React.Fragment key={stepNum}>
              <div className="relative flex flex-col items-center">
                <button
                  type="button"
                  disabled={isFuture}
                  onClick={() => goToStep(stepNum)}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold border transition-all duration-300 relative ${
                    isCompleted
                      ? "bg-indigo-600 border-indigo-600 text-white cursor-pointer hover:bg-indigo-500 hover:scale-105 shadow-[0_0_12px_rgba(79,70,229,0.35)]"
                      : isCurrent
                      ? "bg-zinc-950 border-2 border-indigo-500 text-indigo-400 cursor-default ring-4 ring-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-white stroke-[2.5]" />
                  ) : (
                    <span>{stepNum}</span>
                  )}
                </button>
                <span
                  className={`absolute top-10 md:top-12 text-[10px] md:text-xs font-bold tracking-wider uppercase transition-colors whitespace-nowrap ${
                    isCurrent
                      ? "text-indigo-400"
                      : "text-zinc-500 hidden md:block"
                  }`}
                >
                  {label}
                </span>
              </div>

              {idx < 5 && (
                <div className="flex-1 h-[3px] mx-2 bg-zinc-800 rounded-full overflow-hidden self-center">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-450 transition-all duration-500 ease-in-out"
                    style={{ width: isLineActive ? "100%" : "0%" }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP CONTENT AREA (centered, 560px max width) */}
      <main className="flex-1 flex flex-col items-center justify-start pt-6 px-5 w-full">
        <div className="w-full max-w-[560px] space-y-8 min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="space-y-6"
            >
              {/* STEP 1: HERO */}
              {step === 1 && (
                showLanding ? (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <span className="text-4xl block select-none">👋</span>
                      <h2 className="text-xl font-bold tracking-tight text-white">Let&apos;s build your portfolio</h2>
                      <p className="text-zinc-450 text-xs">Import details from your resume or start fresh from scratch.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Resume Upload Option */}
                      <ResumeUploadButton
                        onImportSuccess={handleImportSuccess}
                        triggerToast={triggerToast}
                      />

                      {/* Divider */}
                      <div className="flex items-center justify-center gap-3 py-2">
                        <div className="h-[1px] flex-1 bg-zinc-900" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-650">Or</span>
                        <div className="h-[1px] flex-1 bg-zinc-900" />
                      </div>

                      {/* Start from Scratch Option */}
                      <button
                        onClick={() => setShowLanding(false)}
                        className="w-full border border-zinc-900 hover:border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/80 rounded-xl p-5 flex items-center gap-4 transition-all hover:scale-[1.01] active:scale-99 cursor-pointer group text-left"
                      >
                        <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-450 group-hover:text-white transition-colors">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                            Start from Scratch
                          </p>
                          <p className="text-xs text-zinc-550">
                            Build your portfolio manually step-by-step
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <span className="text-4xl block select-none">👋</span>
                      <h2 className="text-xl font-bold tracking-tight text-white">Let&apos;s start with you</h2>
                      <p className="text-zinc-450 text-xs">This is the first thing visitors see on your portfolio.</p>
                    </div>

                    <div className="space-y-5 bg-zinc-950 border border-zinc-900 rounded-xl p-5 md:p-6 shadow-sm">
                      {/* Circle Image Upload */}
                      <div className="flex flex-col items-center space-y-2 pb-2">
                        <div 
                          onClick={() => photoInputRef.current?.click()}
                          className="w-[120px] h-[120px] rounded-full border-2 border-dashed border-zinc-800 hover:border-zinc-700 bg-black flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-colors relative"
                        >
                          {portfolio.photo ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={portfolio.photo} alt="Profile Photo" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-zinc-300 font-semibold transition-opacity">
                                <ImageIcon className="w-4 h-4 mb-1" />
                                Change Photo
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-2 flex flex-col items-center text-zinc-550 group-hover:text-zinc-400 transition-colors">
                              <ImageIcon className="w-5 h-5 mb-1 text-zinc-650" />
                              <span className="text-[10px] font-semibold uppercase tracking-wider">Upload photo</span>
                            </div>
                          )}
                        </div>
                        <input 
                          type="file"
                          ref={photoInputRef}
                          onChange={handlePhotoUpload}
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                        />
                        {portfolio.photo && (
                          <button
                            type="button"
                            onClick={() => setPortfolio(prev => ({ ...prev, photo: null }))}
                            className="text-[10px] text-rose-500 hover:underline font-semibold"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="wizard-name" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                            Full Name*
                          </label>
                          <input
                            id="wizard-name"
                            type="text"
                            value={portfolio.name}
                            onChange={(e) => setPortfolio(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Alex Johnson"
                            className={`w-full rounded-lg border bg-black px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-755 focus:border-zinc-700 outline-none transition-colors ${
                              errors.name ? "border-red-500 focus:border-red-500" : "border-zinc-900 focus:border-zinc-700"
                            }`}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.name}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="wizard-headline" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                            Your Role / Headline*
                          </label>
                          <input
                            id="wizard-headline"
                            type="text"
                            value={portfolio.headline}
                            onChange={(e) => setPortfolio(prev => ({ ...prev, headline: e.target.value }))}
                            placeholder="e.g. Full-Stack Developer at Acme"
                            className={`w-full rounded-lg border bg-black px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-755 focus:border-zinc-700 outline-none transition-colors ${
                              errors.headline ? "border-red-500 focus:border-red-500" : "border-zinc-900 focus:border-zinc-700"
                            }`}
                          />
                          {errors.headline && (
                            <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.headline}</p>
                          )}
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label htmlFor="wizard-bio" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                              One-line Bio
                            </label>
                            <span className={`text-[10px] ${portfolio.bio.length > 160 ? "text-red-500" : "text-zinc-650"}`}>
                              {portfolio.bio.length} / 160
                            </span>
                          </div>
                          <textarea
                            id="wizard-bio"
                            value={portfolio.bio}
                            onChange={(e) => setPortfolio(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="A short intro about you — 1–2 sentences"
                            rows={2}
                            maxLength={180}
                            className="w-full rounded-lg border border-zinc-900 bg-black px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-755 focus:border-zinc-700 outline-none transition-colors resize-none"
                          />
                        </div>

                        <div>
                          <label htmlFor="wizard-location" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                            Location
                          </label>
                          <input
                            id="wizard-location"
                            type="text"
                            value={portfolio.location}
                            onChange={(e) => setPortfolio(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Hyderabad, India"
                            className="w-full rounded-lg border border-zinc-900 bg-black px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-755 focus:border-zinc-700 outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* STEP 2: ABOUT */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-4xl block select-none">📖</span>
                    <h2 className="text-xl font-bold tracking-tight text-white">Share your story</h2>
                    <p className="text-zinc-450 text-xs font-sans">Tell visitors who you are, what drives you, and what you&apos;ve built.</p>
                  </div>

                  <div className="space-y-4 bg-zinc-950 border border-zinc-900 rounded-xl p-5 md:p-6 shadow-sm">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="wizard-about" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          About Me
                        </label>
                        <span className="text-[10px] text-zinc-650 font-semibold font-mono">
                          {portfolio.about.trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>
                      <textarea
                        id="wizard-about"
                        value={portfolio.about}
                        onChange={(e) => setPortfolio(prev => ({ ...prev, about: e.target.value }))}
                        placeholder="Write a few paragraphs about yourself — your background, what you love building, your values..."
                        rows={8}
                        className="w-full rounded-lg border border-zinc-900 bg-black px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-755 focus:border-zinc-700 outline-none transition-colors resize-none leading-relaxed"
                      />
                    </div>
                    
                    <p className="text-[10px] text-zinc-550 text-center leading-relaxed">
                      💡 You can always fill this in later.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 3: EXPERIENCE */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-4xl block select-none">💼</span>
                    <h2 className="text-xl font-bold tracking-tight text-white">Your work history</h2>
                    <p className="text-zinc-450 text-xs">Add your professional experience. You can always add more later.</p>
                  </div>

                  <div className="space-y-4">
                    {portfolio.experience.length === 0 ? (
                      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-8 text-center text-zinc-500 text-xs leading-relaxed">
                        No experiences added yet. Click &quot;Add another role&quot; below.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {portfolio.experience.map((exp, idx) => {
                          const isExpanded = expandedExperienceId === exp.id;
                          const hasErrors = errors[`exp-title-${exp.id}`] || errors[`exp-company-${exp.id}`] || errors[`exp-date-${exp.id}`];

                          return (
                            <div
                              key={exp.id}
                              className={`bg-zinc-950 border rounded-xl overflow-hidden shadow-xs transition-colors ${
                                hasErrors ? "border-red-500/50" : "border-zinc-900"
                              }`}
                            >
                              {/* Collapsible Header */}
                              <div
                                onClick={() => setExpandedExperienceId(isExpanded ? null : exp.id)}
                                className="flex justify-between items-center px-4 py-3 bg-zinc-950/60 hover:bg-zinc-900/20 cursor-pointer select-none"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <Briefcase className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                                  <span className="text-xs font-semibold text-zinc-200 truncate">
                                    {exp.jobTitle || "Job Title"} @ {exp.company || "Company"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeExperience(exp.id);
                                    }}
                                    className="text-zinc-500 hover:text-rose-500 p-1 hover:bg-zinc-900 rounded transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                                  )}
                                </div>
                              </div>

                              {/* Form Fields inside Drawer */}
                              {isExpanded && (
                                <div className="p-4 border-t border-zinc-900 bg-black/20 space-y-4 text-zinc-150">
                                  <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded border border-zinc-800 bg-zinc-950 overflow-hidden flex-shrink-0 flex items-center justify-center group">
                                      {exp.companyLogo ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={exp.companyLogo} alt="Logo" className="w-full h-full object-cover" />
                                      ) : (
                                        <Briefcase className="w-5 h-5 text-zinc-650" />
                                      )}
                                      <label className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                        <ImageIcon className="w-3.5 h-3.5 text-white" />
                                        <input
                                          type="file"
                                          accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                          onChange={(e) => handleCompanyLogoUpload(e, exp.id)}
                                          className="hidden"
                                        />
                                      </label>
                                    </div>
                                    <div className="flex flex-col gap-0.5 text-[10px] text-zinc-450">
                                      <span className="font-semibold text-zinc-300">Company Logo</span>
                                      <div className="flex gap-2">
                                        <label className="text-indigo-400 hover:text-indigo-350 cursor-pointer underline">
                                          Upload
                                          <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                            onChange={(e) => handleCompanyLogoUpload(e, exp.id)}
                                            className="hidden"
                                          />
                                        </label>
                                        {exp.companyLogo && (
                                          <button
                                            type="button"
                                            onClick={() => handleExperienceChange(exp.id, "companyLogo", null)}
                                            className="text-rose-500 hover:text-rose-450 cursor-pointer"
                                          >
                                            Remove
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                        Job Title*
                                      </label>
                                      <input
                                        type="text"
                                        value={exp.jobTitle}
                                        onChange={(e) => handleExperienceChange(exp.id, "jobTitle", e.target.value)}
                                        placeholder="Senior Frontend Developer"
                                        className={`w-full rounded border bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none transition-colors ${
                                          errors[`exp-title-${exp.id}`] ? "border-red-500 focus:border-red-500" : "border-zinc-900 focus:border-zinc-700"
                                        }`}
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                        Company Name*
                                      </label>
                                      <input
                                        type="text"
                                        value={exp.company}
                                        onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)}
                                        placeholder="Acme Corp"
                                        className={`w-full rounded border bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none transition-colors ${
                                          errors[`exp-company-${exp.id}`] ? "border-red-500 focus:border-red-500" : "border-zinc-900 focus:border-zinc-700"
                                        }`}
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                        Employment Type
                                      </label>
                                      <select
                                        value={exp.employmentType}
                                        onChange={(e) => handleExperienceChange(exp.id, "employmentType", e.target.value)}
                                        className="w-full rounded border border-zinc-900 bg-zinc-950 text-zinc-250 px-2 py-1.5 text-xs focus:border-zinc-700 outline-none"
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
                                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                        Location Type
                                      </label>
                                      <select
                                        value={exp.locationType}
                                        onChange={(e) => handleExperienceChange(exp.id, "locationType", e.target.value)}
                                        className="w-full rounded border border-zinc-900 bg-zinc-950 text-zinc-250 px-2 py-1.5 text-xs focus:border-zinc-700 outline-none"
                                      >
                                        <option value="Remote">Remote</option>
                                        <option value="On-site">On-site</option>
                                        <option value="Hybrid">Hybrid</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                      Location (City, Country)
                                    </label>
                                    <input
                                      type="text"
                                      value={exp.location}
                                      onChange={(e) => handleExperienceChange(exp.id, "location", e.target.value)}
                                      placeholder="Hyderabad, India"
                                      className="w-full rounded border border-zinc-900 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none"
                                    />
                                  </div>

                                  {/* Dates */}
                                  <div className="space-y-2 border-t border-zinc-900 pt-2.5">
                                    <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                                      <input
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
                                        className="rounded border-zinc-800 bg-zinc-950 text-indigo-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                                      />
                                      <span>Currently working here</span>
                                    </label>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                          Start Month
                                        </label>
                                        <select
                                          value={exp.startMonth}
                                          onChange={(e) => handleExperienceChange(exp.id, "startMonth", e.target.value)}
                                          className="w-full rounded border border-zinc-900 bg-zinc-950 text-zinc-250 px-2 py-1.5 text-xs focus:border-zinc-700 outline-none"
                                        >
                                          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                          ))}
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                          Start Year
                                        </label>
                                        <select
                                          value={exp.startYear}
                                          onChange={(e) => handleExperienceChange(exp.id, "startYear", e.target.value)}
                                          className="w-full rounded border border-zinc-900 bg-zinc-950 text-zinc-250 px-2 py-1.5 text-xs focus:border-zinc-700 outline-none"
                                        >
                                          {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => {
                                            const yr = (new Date().getFullYear() - i).toString();
                                            return <option key={yr} value={yr}>{yr}</option>;
                                          })}
                                        </select>
                                      </div>
                                    </div>

                                    {!exp.isCurrent && (
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                            End Month
                                          </label>
                                          <select
                                            value={exp.endMonth}
                                            onChange={(e) => handleExperienceChange(exp.id, "endMonth", e.target.value)}
                                            className="w-full rounded border border-zinc-900 bg-zinc-950 text-zinc-250 px-2 py-1.5 text-xs focus:border-zinc-700 outline-none"
                                          >
                                            <option value="">Month</option>
                                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                                              <option key={m} value={m}>{m}</option>
                                            ))}
                                          </select>
                                        </div>

                                        <div>
                                          <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                            End Year
                                          </label>
                                          <select
                                            value={exp.endYear}
                                            onChange={(e) => handleExperienceChange(exp.id, "endYear", e.target.value)}
                                            className="w-full rounded border border-zinc-900 bg-zinc-950 text-zinc-250 px-2 py-1.5 text-xs focus:border-zinc-700 outline-none"
                                          >
                                            <option value="">Year</option>
                                            {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => {
                                              const yr = (new Date().getFullYear() - i).toString();
                                              return <option key={yr} value={yr}>{yr}</option>;
                                            })}
                                          </select>
                                        </div>
                                      </div>
                                    )}

                                    {errors[`exp-date-${exp.id}`] && (
                                      <p className="text-red-500 text-[10px] font-semibold mt-1">
                                        {errors[`exp-date-${exp.id}`]}
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                      Description
                                    </label>
                                    <textarea
                                      value={exp.description}
                                      onChange={(e) => handleExperienceChange(exp.id, "description", e.target.value)}
                                      placeholder="Describe your responsibilities and key accomplishments..."
                                      rows={3}
                                      className="w-full rounded border border-zinc-900 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none resize-none leading-relaxed"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                      Skills Used (comma-separated)
                                    </label>
                                    <input
                                      type="text"
                                      value={exp.skills}
                                      onChange={(e) => handleExperienceChange(exp.id, "skills", e.target.value)}
                                      placeholder="React, Next.js, Node.js"
                                      className="w-full rounded border border-zinc-900 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {portfolio.experience.length < 5 && (
                      <button
                        type="button"
                        onClick={addExperience}
                        className="flex items-center justify-center gap-1.5 w-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-zinc-200 text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors cursor-pointer active:scale-[0.98]"
                      >
                        <Plus className="w-3.5 h-3.5 text-zinc-450" />
                        <span>Add another role</span>
                      </button>
                    )}
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={handleSkipStep}
                      className="text-xs font-semibold text-zinc-500 hover:text-zinc-350 transition-colors underline decoration-dotted"
                    >
                      Skip for now →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: PROJECTS */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-4xl block select-none">🚀</span>
                    <h2 className="text-xl font-bold tracking-tight text-white">Show your work</h2>
                    <p className="text-zinc-450 text-xs">Add your best projects. Quality over quantity.</p>
                  </div>

                  <div className="space-y-4">
                    {portfolio.projects.length === 0 ? (
                      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-8 text-center text-zinc-500 text-xs leading-relaxed">
                        No projects added yet. Click &quot;Add another project&quot; below.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {portfolio.projects.map((proj, idx) => {
                          const isExpanded = expandedProjectId === proj.id || portfolio.projects.length === 1;
                          const titleErr = errors[`proj-title-${proj.id}`];

                          return (
                            <div
                              key={proj.id}
                              className={`bg-zinc-950 border rounded-xl overflow-hidden shadow-xs transition-colors ${
                                titleErr ? "border-red-500/50" : "border-zinc-900"
                              }`}
                            >
                              {/* Header */}
                              {portfolio.projects.length > 1 && (
                                <div
                                  onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                                  className="flex justify-between items-center px-4 py-3 bg-zinc-950/60 hover:bg-zinc-900/20 cursor-pointer select-none"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                                    <span className="text-xs font-semibold text-zinc-200 truncate">
                                      {proj.title || `Project #${idx + 1}`}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeProject(proj.id);
                                      }}
                                      className="text-zinc-500 hover:text-rose-500 p-1 hover:bg-zinc-900 rounded transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    {isExpanded ? (
                                      <ChevronUp className="w-4 h-4 text-zinc-500" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                                    )}
                                  </div>
                                </div>
                              )}

                              {isExpanded && (
                                <div className="p-4 border-t border-zinc-900 bg-black/20 space-y-4 text-zinc-150">
                                  <div>
                                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                      Project Title*
                                    </label>
                                    <input
                                      type="text"
                                      value={proj.title}
                                      onChange={(e) => handleProjectChange(proj.id, "title", e.target.value)}
                                      placeholder="Project Name"
                                      className={`w-full rounded border bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none transition-colors ${
                                        titleErr ? "border-red-500 focus:border-red-500" : "border-zinc-900 focus:border-zinc-700"
                                      }`}
                                    />
                                    {titleErr && (
                                      <p className="text-red-500 text-[10px] font-semibold mt-1">{titleErr}</p>
                                    )}
                                  </div>

                                  <div>
                                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                      Short Description
                                    </label>
                                    <textarea
                                      value={proj.description}
                                      onChange={(e) => handleProjectChange(proj.id, "description", e.target.value)}
                                      placeholder="Describe what your project is about..."
                                      rows={2}
                                      className="w-full rounded border border-zinc-900 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none resize-none"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                        Tags (comma-separated)
                                      </label>
                                      <input
                                        type="text"
                                        value={proj.tags}
                                        onChange={(e) => handleProjectChange(proj.id, "tags", e.target.value)}
                                        placeholder="React, Next.js, CSS"
                                        className="w-full rounded border border-zinc-900 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                                        Project URL
                                      </label>
                                      <input
                                        type="url"
                                        value={proj.link}
                                        onChange={(e) => handleProjectChange(proj.id, "link", e.target.value)}
                                        placeholder="https://github.com/yourname/project"
                                        className="w-full rounded border border-zinc-900 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wide mb-1.5">
                                      Cover Image
                                    </label>
                                    <div className="flex items-center gap-3">
                                      {proj.cover && (
                                        <div className="relative w-12 h-9 rounded overflow-hidden border border-zinc-800 bg-zinc-950 flex-shrink-0">
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img src={proj.cover} alt="Cover Preview" className="w-full h-full object-cover" />
                                        </div>
                                      )}
                                      <div className="flex gap-2">
                                        <label className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[10px] text-zinc-300 px-3 py-1.5 rounded cursor-pointer transition-colors font-semibold select-none">
                                          <ImageIcon className="w-3.5 h-3.5 text-zinc-450" />
                                          <span>Upload Cover</span>
                                          <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={(e) => handleProjectCoverUpload(e, proj.id)}
                                            className="hidden"
                                          />
                                        </label>
                                        {proj.cover && (
                                          <button
                                            type="button"
                                            onClick={() => handleProjectChange(proj.id, "cover", null)}
                                            className="text-[10px] text-rose-500 hover:text-rose-400 bg-rose-950/10 border border-rose-900/30 px-3 py-1.5 rounded transition-colors font-semibold cursor-pointer"
                                          >
                                            Remove
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {portfolio.projects.length < 3 && (
                      <button
                        type="button"
                        onClick={addProject}
                        className="flex items-center justify-center gap-1.5 w-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 text-zinc-200 text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors cursor-pointer active:scale-[0.98]"
                      >
                        <Plus className="w-3.5 h-3.5 text-zinc-450" />
                        <span>Add another project</span>
                      </button>
                    )}
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={handleSkipStep}
                      className="text-xs font-semibold text-zinc-500 hover:text-zinc-350 transition-colors underline decoration-dotted"
                    >
                      Skip for now →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: SKILLS */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-4xl block select-none">⚡</span>
                    <h2 className="text-xl font-bold tracking-tight text-white">What are you good at?</h2>
                    <p className="text-zinc-450 text-xs">Add your skills — these show as tags on your portfolio.</p>
                  </div>

                  <div className="space-y-5 bg-zinc-950 border border-zinc-900 rounded-xl p-5 md:p-6 shadow-sm">
                    {/* Tag input */}
                    <div className="space-y-2">
                      <label htmlFor="wizard-skills" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Skills Input
                      </label>
                      <input
                        id="wizard-skills"
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        onPaste={handleSkillPaste}
                        placeholder="Type a skill and press Enter..."
                        className="w-full rounded-lg border border-zinc-900 bg-black px-3.5 py-2 text-xs text-zinc-255 placeholder-zinc-700 focus:border-zinc-700 outline-none transition-colors"
                      />
                    </div>

                    {/* Skill Pills */}
                    {currentSkills.length > 0 && (
                      <div className="space-y-2.5">
                        <span className="block text-[9px] font-bold text-zinc-550 uppercase tracking-wider">
                          Added Skills ({currentSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {currentSkills.map((sk) => (
                            <div
                              key={sk}
                              className="bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5"
                            >
                              <span>{sk}</span>
                              <button
                                type="button"
                                onClick={() => removeSkill(sk)}
                                className="p-0.5 hover:bg-indigo-500/20 rounded-md transition-colors text-indigo-400 hover:text-indigo-350 cursor-pointer"
                              >
                                <X className="w-3 h-3 stroke-[2.5]" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Skills Grid */}
                    <div className="space-y-3 pt-2.5 border-t border-zinc-900">
                      <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                        Suggested Skills
                      </span>
                      
                      <div className="space-y-3">
                        {suggestedCategories.map((cat) => (
                          <div key={cat.category} className="space-y-1.5">
                            <span className="text-[9px] font-bold text-zinc-650 uppercase font-mono tracking-wide">
                              {cat.category}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {cat.skills.map((sSkill) => {
                                const isAdded = currentSkills.includes(sSkill);
                                return (
                                  <button
                                    key={sSkill}
                                    type="button"
                                    onClick={() => addSuggestedSkill(sSkill)}
                                    disabled={isAdded}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-semibold border transition-all flex items-center gap-1 select-none ${
                                      isAdded
                                        ? "bg-zinc-900 border-zinc-800 text-zinc-650 cursor-not-allowed opacity-50"
                                        : "bg-black border-zinc-850 hover:border-zinc-700 text-zinc-300 hover:text-white cursor-pointer"
                                    }`}
                                  >
                                    {isAdded && <Check className="w-2.5 h-2.5 text-indigo-400 stroke-[2.5]" />}
                                    <span>{sSkill}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      onClick={handleSkipStep}
                      className="text-xs font-semibold text-zinc-500 hover:text-zinc-350 transition-colors underline decoration-dotted"
                    >
                      Skip for now →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: CONTACT */}
              {step === 6 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-4xl block select-none">🔗</span>
                    <h2 className="text-xl font-bold tracking-tight text-white">How can people reach you?</h2>
                    <p className="text-zinc-450 text-xs">Add your links so visitors can get in touch.</p>
                  </div>

                  <div className="space-y-5 bg-zinc-950 border border-zinc-900 rounded-xl p-5 md:p-6 shadow-sm">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="wizard-email" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Email Address*
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                          <input
                            id="wizard-email"
                            type="email"
                            value={portfolio.email}
                            onChange={(e) => setPortfolio(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="yourname@example.com"
                            className={`w-full rounded-lg border bg-black pl-10 pr-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none transition-colors ${
                              errors.email ? "border-red-500 focus:border-red-500" : "border-zinc-900 focus:border-zinc-700"
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="wizard-linkedin" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                          LinkedIn URL
                        </label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                          <input
                            id="wizard-linkedin"
                            type="text"
                            value={portfolio.linkedin}
                            onChange={(e) => setPortfolio(prev => ({ ...prev, linkedin: e.target.value }))}
                            placeholder="https://linkedin.com/in/yourname"
                            className={`w-full rounded-lg border bg-black pl-10 pr-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none transition-colors ${
                              errors.linkedin ? "border-red-500 focus:border-red-500" : "border-zinc-900 focus:border-zinc-700"
                            }`}
                          />
                        </div>
                        {errors.linkedin && (
                          <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.linkedin}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="wizard-github" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                          GitHub URL
                        </label>
                        <div className="relative">
                          <Github className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                          <input
                            id="wizard-github"
                            type="text"
                            value={portfolio.github}
                            onChange={(e) => setPortfolio(prev => ({ ...prev, github: e.target.value }))}
                            placeholder="https://github.com/yourname"
                            className={`w-full rounded-lg border bg-black pl-10 pr-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none transition-colors ${
                              errors.github ? "border-red-500 focus:border-red-500" : "border-zinc-900 focus:border-zinc-700"
                            }`}
                          />
                        </div>
                        {errors.github && (
                          <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.github}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="wizard-twitter" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Twitter/X URL
                        </label>
                        <div className="relative">
                          <Twitter className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                          <input
                            id="wizard-twitter"
                            type="text"
                            value={portfolio.twitter}
                            onChange={(e) => setPortfolio(prev => ({ ...prev, twitter: e.target.value }))}
                            placeholder="https://twitter.com/yourname"
                            className={`w-full rounded-lg border bg-black pl-10 pr-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none transition-colors ${
                              errors.twitter ? "border-red-500 focus:border-red-500" : "border-zinc-900 focus:border-zinc-700"
                            }`}
                          />
                        </div>
                        {errors.twitter && (
                          <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.twitter}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="wizard-website" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Website URL
                        </label>
                        <div className="relative">
                          <Link2 className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                          <input
                            id="wizard-website"
                            type="text"
                            value={portfolio.website}
                            onChange={(e) => setPortfolio(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="https://yourwebsite.com"
                            className={`w-full rounded-lg border bg-black pl-10 pr-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-750 focus:border-zinc-700 outline-none transition-colors ${
                              errors.website ? "border-red-500 focus:border-red-500" : "border-zinc-900 focus:border-zinc-700"
                            }`}
                          />
                        </div>
                        {errors.website && (
                          <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.website}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER NAV BAR */}
      <footer className="fixed bottom-0 left-0 right-0 min-h-20 bg-zinc-950 border-t border-zinc-900 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 z-30 select-none">
        <div>
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-xs text-zinc-450 hover:text-white transition-colors px-3 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg cursor-pointer font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
        </div>

        {saveError && (
          <p className="text-xs text-red-400 flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {saveError}
          </p>
        )}

        <div className="flex items-center gap-2">
          {saving && (
            <span className="text-[10px] text-zinc-500 font-mono animate-pulse">Saving...</span>
          )}
          
          {!(step === 1 && showLanding) && (
            <button
              onClick={handleContinue}
              disabled={saving}
              className={`flex items-center gap-1 bg-white hover:bg-zinc-100 text-black text-xs font-semibold px-4.5 py-2 rounded-lg transition-colors cursor-pointer ${
                saving ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-black" /> Saving...
                </span>
              ) : (
                <>
                  <span>{step === 6 ? "Finish & View Portfolio ✓" : "Continue"}</span>
                  {step < 6 && <ArrowRight className="w-3.5 h-3.5 text-black" />}
                </>
              )}
            </button>
          )}
        </div>
      </footer>

      {/* FLOATING PREVIEW BUTTON */}
      <button
        onClick={() => setShowPreviewModal(true)}
        aria-label="Preview your portfolio"
        className="fixed bottom-24 right-4 z-40 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-full px-3 py-3 md:px-4 md:py-2.5 flex items-center gap-1.5 shadow-lg active:scale-95 transition-all select-none cursor-pointer"
      >
        <span>👁</span>
        <span className="hidden md:inline">Preview</span>
      </button>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 md:p-10"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPreviewModal(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio preview"
        >
          <div 
            className="w-full max-w-6xl h-full md:h-[90vh] bg-black border border-zinc-800 rounded-xl overflow-hidden flex flex-col text-zinc-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 bg-zinc-950 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Live Preview</span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 hover:bg-zinc-900 rounded transition-colors text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-black">
              <PortfolioPreview portfolio={portfolio} template={initialTemplate} />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      {/* Confirm Skip Wizard Modal */}
      <ConfirmModal
        isOpen={showSkipModal}
        title="Skip Setup Wizard?"
        description="Are you sure you want to skip the setup wizard? You will be redirected directly to the section editor."
        confirmText="Skip Wizard"
        cancelText="Cancel"
        variant="warning"
        onConfirm={handleConfirmSkipSetup}
        onCancel={() => setShowSkipModal(false)}
      />

      {/* Confirm Leave Wizard Modal */}
      <ConfirmModal
        isOpen={showLeaveModal}
        title="Leave Setup Wizard?"
        description="Are you sure you want to return to the dashboard? Your progress is automatically saved."
        confirmText="Leave Wizard"
        cancelText="Stay Here"
        variant="info"
        onConfirm={handleConfirmLeaveWizard}
        onCancel={() => setShowLeaveModal(false)}
      />
    </div>
  );
}
