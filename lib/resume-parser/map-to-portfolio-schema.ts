import { Experience } from "@/components/ExperienceTimeline";

export interface ExtractedResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  projects: {
    title: string;
    description: string;
    tech: string[];
  }[];
  skills: string[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
}

// Match the existing wizard's local Portfolio shape
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string;
  link: string;
  cover: string | null;
}

export interface PortfolioFormData {
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

function formatMonth(m: string): string {
  const monthMap: Record<string, string> = {
    jan: "Jan", january: "Jan",
    feb: "Feb", february: "Feb",
    mar: "Mar", march: "Mar",
    apr: "Apr", april: "Apr",
    may: "May",
    jun: "Jun", june: "Jun",
    jul: "Jul", july: "Jul",
    aug: "Aug", august: "Aug",
    sep: "Sep", september: "Sep",
    oct: "Oct", october: "Oct",
    nov: "Nov", november: "Nov",
    dec: "Dec", december: "Dec",
  };
  return monthMap[m.toLowerCase().substring(0, 3)] || "Jan";
}

/**
 * Splits a resume duration on a dash or the word "to".
 *
 * This was previously the character class /[-–—to]/i, which matched the letters
 * "t" and "o" individually — so "Oct 2020 - Dec 2021" split on the leading "O"
 * and lost its start year, and "March 2021 to June 2023" lost its end date.
 * Only durations with no "t" or "o" survived.
 */
const DURATION_SEPARATOR = /\s*(?:[-–—]|\bto\b)\s*/i;

export function parseDuration(duration: string) {
  const result = {
    startMonth: "Jan",
    startYear: "2023",
    endMonth: "",
    endYear: "",
    isCurrent: false,
  };

  if (!duration) return result;

  const durationLower = duration.toLowerCase();
  if (durationLower.includes("present") || durationLower.includes("current") || durationLower.includes("now")) {
    result.isCurrent = true;
  }

  const parts = duration.split(DURATION_SEPARATOR).map((s) => s.trim());
  const startPart = parts[0] || "";
  const endPart = parts[1] || "";

  // Parse start date (look for year and optionally month prefix)
  const startMatch = startPart.match(/([a-zA-Z]+)?\s*(\d{4})/);
  if (startMatch) {
    if (startMatch[1]) {
      result.startMonth = formatMonth(startMatch[1]);
    }
    result.startYear = startMatch[2];
  }

  // Parse end date if not current
  if (!result.isCurrent && endPart) {
    const endMatch = endPart.match(/([a-zA-Z]+)?\s*(\d{4})/);
    if (endMatch) {
      if (endMatch[1]) {
        result.endMonth = formatMonth(endMatch[1]);
      } else {
        result.endMonth = "Jan";
      }
      result.endYear = endMatch[2];
    }
  }

  return result;
}

export function mapResumeToPortfolioData(extracted: ExtractedResumeData): Partial<PortfolioFormData> {
  const latestExp = extracted.experience && extracted.experience[0];
  const generatedHeadline = latestExp 
    ? `${latestExp.role} at ${latestExp.company}` 
    : "";

  const mappedExperience: Experience[] = (extracted.experience || []).map((exp, index) => {
    const durationDetails = parseDuration(exp.duration);
    return {
      id: `exp-imported-${index}-${Math.random().toString(36).substring(2, 9)}`,
      jobTitle: exp.role || "Software Engineer",
      company: exp.company || "Company",
      companyLogo: null,
      employmentType: "Full-time",
      locationType: "Remote",
      location: "",
      startMonth: durationDetails.startMonth,
      startYear: durationDetails.startYear,
      endMonth: durationDetails.endMonth,
      endYear: durationDetails.endYear,
      isCurrent: durationDetails.isCurrent,
      description: exp.description || "",
      skills: "",
    };
  });

  const mappedProjects: Project[] = (extracted.projects || []).map((proj, index) => {
    return {
      id: `proj-imported-${index}-${Math.random().toString(36).substring(2, 9)}`,
      title: proj.title || "Project Title",
      description: proj.description || "",
      tags: proj.tech ? proj.tech.join(", ") : "",
      link: "https://github.com",
      cover: null,
    };
  });

  const mappedSkills = extracted.skills ? extracted.skills.join(", ") : "";

  return {
    name: extracted.name || "",
    headline: generatedHeadline,
    bio: extracted.summary ? extracted.summary.slice(0, 160) : "",
    location: extracted.location || "",
    about: extracted.summary || "",
    experience: mappedExperience,
    projects: mappedProjects,
    skills: mappedSkills,
    email: extracted.email || "",
  };
}
