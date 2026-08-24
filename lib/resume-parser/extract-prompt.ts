export function buildExtractionPrompt(resumeText: string): string {
  return `You are a resume parsing engine. Extract structured data from the resume text below and return ONLY valid JSON — no preamble, no explanation, no markdown code fences, no trailing commentary. Your entire response must be a single parseable JSON object.

Return the data in EXACTLY this shape:

{
  "name": string,
  "email": string,
  "phone": string,
  "location": string,
  "summary": string,
  "experience": [
    {
      "company": string,
      "role": string,
      "duration": string,
      "description": string
    }
  ],
  "projects": [
    {
      "title": string,
      "description": string,
      "tech": string[]
    }
  ],
  "skills": string[],
  "education": [
    {
      "institution": string,
      "degree": string,
      "year": string
    }
  ]
}

RULES:
1. If a field is not present in the resume, use an empty string "" (for string fields) or an empty array [] (for array fields). NEVER invent, guess, or hallucinate data that isn't in the source text.
2. "duration" should preserve the date range as written in the resume (e.g. "Jan 2022 - Present"), not reformatted.
3. "summary" should be a short professional summary if the resume has one (objective/summary section). If none exists, leave it as an empty string — do not generate one from the rest of the resume.
4. "tech" arrays should only include technologies explicitly mentioned for that specific project, not the candidate's full skill list.
5. "skills" should be a flat deduplicated array of individual skills/technologies mentioned anywhere in the resume (skills section, tech stacks, tools).
6. Preserve the resume's own wording for descriptions — do not rewrite, embellish, or summarize achievements into different language.
7. If the resume text is garbled, incomplete, or clearly not a resume, still return the JSON shape with whatever fields can be confidently extracted and empty values for the rest. Do not return an error message in place of JSON.
8. Do not wrap the JSON in \`\`\`json or any other code fence. Do not add any text before or after the JSON object.

Resume text to parse:
"""
${resumeText}
"""`;
}
