import { describe, expect, it } from "vitest";
import {
  mapResumeToPortfolioData,
  parseDuration,
  type ExtractedResumeData,
} from "./map-to-portfolio-schema";

describe("parseDuration", () => {
  // The original separator was the character class /[-–—to]/i, which matched
  // the letters "t" and "o". Every case below failed before that was fixed.
  it("keeps the start year when the month begins with O", () => {
    const r = parseDuration("Oct 2020 - Dec 2021");
    expect(r.startMonth).toBe("Oct");
    expect(r.startYear).toBe("2020");
    expect(r.endMonth).toBe("Dec");
    expect(r.endYear).toBe("2021");
  });

  it('splits on the word "to"', () => {
    const r = parseDuration("March 2021 to June 2023");
    expect(r.startMonth).toBe("Mar");
    expect(r.startYear).toBe("2021");
    expect(r.endMonth).toBe("Jun");
    expect(r.endYear).toBe("2023");
  });

  it('handles "Present" without leaking the t into the split', () => {
    const r = parseDuration("Jan 2020 - Present");
    expect(r.startMonth).toBe("Jan");
    expect(r.startYear).toBe("2020");
    expect(r.isCurrent).toBe(true);
  });

  it("handles en and em dashes", () => {
    expect(parseDuration("Feb 2019 – Aug 2021").startYear).toBe("2019");
    expect(parseDuration("Feb 2019 — Aug 2021").endYear).toBe("2021");
  });

  it("handles bare years", () => {
    const r = parseDuration("2019 - 2022");
    expect(r.startYear).toBe("2019");
    expect(r.endYear).toBe("2022");
  });

  it("marks current roles from several wordings", () => {
    expect(parseDuration("Jan 2020 - Present").isCurrent).toBe(true);
    expect(parseDuration("Jan 2020 - Current").isCurrent).toBe(true);
    expect(parseDuration("Jan 2020 - Now").isCurrent).toBe(true);
  });

  it("returns defaults for empty input rather than throwing", () => {
    const r = parseDuration("");
    expect(r.isCurrent).toBe(false);
    expect(r.endYear).toBe("");
  });
});

describe("mapResumeToPortfolioData", () => {
  const base: ExtractedResumeData = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    phone: "555-0100",
    location: "London",
    summary: "Mathematician and first programmer.",
    experience: [
      {
        company: "Analytical Engine Co",
        role: "Lead Analyst",
        duration: "Oct 2020 - Present",
        description: "Designed the first algorithm.",
      },
    ],
    projects: [
      { title: "Note G", description: "Bernoulli numbers.", tech: ["Ada", "Math"] },
    ],
    skills: ["Algorithms", "Analysis"],
    education: [{ institution: "Home", degree: "Private tuition", year: "1835" }],
  };

  it("derives the headline from the most recent role", () => {
    const r = mapResumeToPortfolioData(base);
    expect(r.headline).toBe("Lead Analyst at Analytical Engine Co");
  });

  it("carries the corrected duration through to the mapped experience", () => {
    const r = mapResumeToPortfolioData(base);
    expect(r.experience?.[0].startYear).toBe("2020");
    expect(r.experience?.[0].isCurrent).toBe(true);
  });

  it("joins skills and project tech into comma-separated strings", () => {
    const r = mapResumeToPortfolioData(base);
    expect(r.skills).toBe("Algorithms, Analysis");
    expect(r.projects?.[0].tags).toBe("Ada, Math");
  });

  it("truncates the bio to 160 characters but keeps the full about text", () => {
    const long = "x".repeat(400);
    const r = mapResumeToPortfolioData({ ...base, summary: long });
    expect(r.bio).toHaveLength(160);
    expect(r.about).toHaveLength(400);
  });

  it("survives a resume with no experience, projects or skills", () => {
    const r = mapResumeToPortfolioData({
      ...base,
      experience: [],
      projects: [],
      skills: [],
    });
    expect(r.headline).toBe("");
    expect(r.experience).toEqual([]);
    expect(r.skills).toBe("");
  });

  it("gives every mapped item a unique id", () => {
    const r = mapResumeToPortfolioData({
      ...base,
      experience: [base.experience[0], base.experience[0]],
    });
    const ids = r.experience?.map((e) => e.id) ?? [];
    expect(new Set(ids).size).toBe(ids.length);
  });
});
