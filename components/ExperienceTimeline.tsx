import React from "react";
import { motion } from "framer-motion";

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo: string | null;
  employmentType: string;
  locationType: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isCurrent: boolean;
  description: string;
  skills: string;
}

export interface ExperienceTimelineProps {
  experience?: Experience[];
  accentColor: string;
  textColor: string;
  mutedColor: string;
  bgColor: string;
  fontFamily?: string;
  useFramerMotion?: boolean;
  isBrutalist?: boolean;
  isZen?: boolean;
}

export const calculateMonths = (exp: Experience): string => {
  const startDate = new Date(`${exp.startMonth} 1, ${exp.startYear}`);
  const endDate = exp.isCurrent ? new Date() : new Date(`${exp.endMonth} 1, ${exp.endYear}`);
  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
  if (months < 0) months = 0;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) return `${remainingMonths} mos`;
  if (remainingMonths === 0) return `${years} yr`;
  return `${years} yr ${remainingMonths} mos`;
};

export const formatDateRange = (exp: Experience): string => {
  const start = `${exp.startMonth} ${exp.startYear}`;
  const end = exp.isCurrent ? 'Present' : `${exp.endMonth} ${exp.endYear}`;
  const months = calculateMonths(exp);
  return `${start} – ${end} · ${months}`;
};

export default function ExperienceTimeline({
  experience,
  accentColor,
  textColor,
  mutedColor,
  bgColor,
  fontFamily,
  useFramerMotion = true,
  isBrutalist = false,
  isZen = false,
}: ExperienceTimelineProps) {
  const validExperience = (experience || []).filter(exp => exp.jobTitle && exp.company);

  if (validExperience.length === 0) return null;

  const timelineLineStyle = isBrutalist
    ? { backgroundColor: "#000000" }
    : { backgroundColor: accentColor, opacity: 0.3 };

  const timelineLineWidth = isBrutalist ? "w-[3px]" : "w-[2px]";
  const containerStyle = fontFamily ? { fontFamily } : {};

  return (
    <div className="relative pl-10 sm:pl-12" style={containerStyle}>
      {/* Pulse Animation Style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes exp-dot-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
        .exp-pulse-animation {
          animation: exp-dot-pulse 2s infinite ease-in-out;
        }
      `}} />

      {/* The Line */}
      <div 
        className={`absolute top-2 bottom-2 left-[16px] ${timelineLineWidth}`}
        style={timelineLineStyle}
      />

      <div className={`flex flex-col ${isZen ? "space-y-[60px]" : "space-y-8"}`}>
        {validExperience.map((exp, idx) => {
          const renderDot = () => {
            const pulseClass = (exp.isCurrent && !isBrutalist) ? "exp-pulse-animation" : "";
            const dotShape = isBrutalist ? "" : "rounded-full";
            const dotSize = isZen ? "w-2.5 h-2.5" : "w-3 h-3";
            
            return (
              <div 
                className={`absolute left-[17px] top-[22px] -translate-x-1/2 -translate-y-1/2 ${dotShape} ${dotSize} ${pulseClass} z-10`}
                style={{
                  backgroundColor: isBrutalist ? "#000000" : accentColor,
                  border: isBrutalist ? "none" : `2px solid ${bgColor === 'transparent' ? '#ffffff' : bgColor}`,
                  transformOrigin: "center"
                }}
              />
            );
          };

          const renderContent = () => {
            const logoBorder = isBrutalist 
              ? "border-2 border-black" 
              : "border-[0.5px] border-slate-200";
            const logoRadius = isBrutalist ? "" : "rounded-lg";
            
            const renderLogo = () => {
              if (exp.companyLogo) {
                return (
                  <img 
                    src={exp.companyLogo} 
                    alt={exp.company} 
                    className={`w-9 h-9 object-cover ${logoRadius} ${logoBorder}`} 
                    style={{ borderColor: isBrutalist ? "#000000" : `${mutedColor}33` }}
                  />
                );
              }
              const initials = exp.company.slice(0, 2);
              return (
                <div 
                  className={`w-9 h-9 flex items-center justify-center text-xs font-bold uppercase ${logoRadius} ${logoBorder}`}
                  style={{
                    backgroundColor: `${accentColor}26`,
                    color: accentColor,
                    borderColor: isBrutalist ? "#000000" : `${mutedColor}33`
                  }}
                >
                  {initials}
                </div>
              );
            };

            const parsedSkills = exp.skills
              ? exp.skills.split(",").map((s) => s.trim()).filter(Boolean)
              : [];

            return (
              <div className="flex items-start gap-4 text-left">
                <div className="flex-shrink-0">
                  {renderLogo()}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 
                    className="font-semibold text-sm sm:text-base" 
                    style={{ color: textColor }}
                  >
                    {exp.jobTitle}
                  </h3>
                  <div 
                    className="text-xs sm:text-sm font-medium flex flex-wrap items-center gap-1.5"
                    style={{ color: mutedColor }}
                  >
                    <span>{exp.company}</span>
                    <span>&middot;</span>
                    <span>{exp.employmentType}</span>
                  </div>
                  <div 
                    className="text-[11px] sm:text-xs font-medium" 
                    style={{ color: mutedColor }}
                  >
                    {formatDateRange(exp)}
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span 
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${logoRadius}`}
                      style={{ 
                        backgroundColor: isBrutalist ? "transparent" : `${accentColor}1a`, 
                        color: isBrutalist ? "#000000" : accentColor,
                        border: isBrutalist ? "1px solid #000000" : "none"
                      }}
                    >
                      {exp.locationType}
                    </span>
                    {exp.location && (
                      <span 
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${logoRadius}`}
                        style={{ 
                          backgroundColor: isBrutalist ? "transparent" : `${mutedColor}1a`, 
                          color: isBrutalist ? "#000000" : mutedColor,
                          border: isBrutalist ? "1px solid #000000" : "none"
                        }}
                      >
                        {exp.location}
                      </span>
                    )}
                  </div>

                  <p 
                    className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap pt-2"
                    style={{ color: textColor, lineHeight: 1.6 }}
                  >
                    {exp.description}
                  </p>

                  {parsedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {parsedSkills.map((skill, sIdx) => (
                        <span 
                          key={sIdx} 
                          className={`text-[10px] px-2 py-0.5 font-semibold ${logoRadius}`}
                          style={{
                            backgroundColor: isBrutalist ? "transparent" : `${accentColor}1a`,
                            color: isBrutalist ? "#000000" : accentColor,
                            border: isBrutalist ? "1px solid #000000" : "none"
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          };

          if (useFramerMotion) {
            return (
              <motion.div
                key={exp.id}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                {renderDot()}
                {renderContent()}
              </motion.div>
            );
          } else {
            return (
              <div key={exp.id} className="relative transition-all duration-300">
                {renderDot()}
                {renderContent()}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
