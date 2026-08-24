"use client";

import { TEMPLATES } from "./templates";
import { Experience } from "./ExperienceTimeline";

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

interface PortfolioPreviewProps {
  portfolio: Portfolio;
  template?: string;
}

export default function PortfolioPreview({ portfolio, template = "minimal-clean" }: PortfolioPreviewProps) {
  const TemplateComponent = TEMPLATES[template] || TEMPLATES["minimal-clean"];
  
  return <TemplateComponent portfolio={portfolio} />;
}

