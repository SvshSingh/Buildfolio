import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import { buildExtractionPrompt } from "@/lib/resume-parser/extract-prompt";

export const dynamic = "force-dynamic";

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  // Strip starting code block indicator e.g. ```json or ```
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, "");
    cleaned = cleaned.replace(/\n?```$/, "");
  }
  return cleaned.trim();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Please upload a PDF or DOCX file." },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Please upload a PDF or DOCX file." },
        { status: 400 }
      );
    }

    // Validate size (5MB max)
    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: "File too large. Please upload a resume under 5MB." },
        { status: 413 }
      );
    }

    // Extract raw text based on file type
    let extractedText = "";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (file.type === "application/pdf") {
      try {
        const parsedPdf = await pdf(buffer);
        extractedText = parsedPdf.text || "";
      } catch (pdfErr) {
        console.error("PDF extraction error:", pdfErr);
        return NextResponse.json(
          { error: "Could not read text from this PDF file. It may be corrupted or encrypted." },
          { status: 422 }
        );
      }
    } else {
      try {
        const parsedDocx = await mammoth.extractRawText({ buffer });
        extractedText = parsedDocx.value || "";
      } catch (docxErr) {
        console.error("DOCX extraction error:", docxErr);
        return NextResponse.json(
          { error: "Could not read text from this DOCX file. It may be corrupted." },
          { status: 422 }
        );
      }
    }

    // Validate extracted text length
    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            "Could not read text from this file. It may be a scanned image — please fill the form manually.",
        },
        { status: 422 }
      );
    }

    // Truncate to 15,000 characters
    const truncatedText = extractedText.slice(0, 15000);

    // Build the LLM prompt
    const prompt = buildExtractionPrompt(truncatedText);

    // Call OpenRouter API with fallbacks for rate limits (429) & unavailable models
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENROUTER_API_KEY environment variable");
      return NextResponse.json(
        { error: "OpenRouter API key is not configured. Please fill the form manually." },
        { status: 500 }
      );
    }

    const headers: Record<string, string> = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://foliofast.app",
      "X-Title": "FolioFast Resume Parser",
    };

    // Ordered by quality — first model that succeeds wins.
    // Paid models are tried first with a max_tokens cap to stay within free-tier credit limits.
    // Free-tier models are used as fallback when paid models hit 402 / rate-limits.
    const CANDIDATE_MODELS = [
      { id: "google/gemini-2.5-flash",                                  maxTokens: 4000 },
      { id: "google/gemma-4-31b-it:free",                               maxTokens: 4000 },
      { id: "meta-llama/llama-3.3-70b-instruct:free",                   maxTokens: 4000 },
      { id: "qwen/qwen3-coder:free",                                    maxTokens: 4000 },
      { id: "nvidia/nemotron-3-ultra-550b-a55b:free",                   maxTokens: 4000 },
      { id: "google/gemma-4-26b-a4b-it:free",                           maxTokens: 4000 },
    ];

    let rawContent: string | null = null;
    let lastErrorStatus = 500;
    let lastErrorMessage = "";

    for (const { id: modelToTry, maxTokens } of CANDIDATE_MODELS) {
      try {
        const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: modelToTry,
            temperature: 0,
            max_tokens: maxTokens,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (openRouterRes.ok) {
          const data = await openRouterRes.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content && typeof content === "string" && content.trim().length > 0) {
            rawContent = content;
            console.log(`Successfully extracted resume using model: ${modelToTry}`);
            break;
          }
        } else {
          lastErrorStatus = openRouterRes.status;
          lastErrorMessage = await openRouterRes.text();
          console.warn(`OpenRouter model '${modelToTry}' failed with status ${lastErrorStatus}: ${lastErrorMessage}`);

          // If rate limited, payment required, or server temporary error, wait briefly before next candidate
          if ([429, 402, 502, 503, 529].includes(lastErrorStatus)) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
      } catch (err: any) {
        console.error(`Fetch error for model '${modelToTry}':`, err);
      }
    }

    if (!rawContent) {
      console.error("All candidate OpenRouter models failed to return valid content.");
      const isRateLimit = lastErrorStatus === 429;
      return NextResponse.json(
        {
          error: isRateLimit
            ? "The resume parsing service is currently rate-limited due to high demand. Please wait a few seconds and try again, or fill the form manually."
            : "Failed to connect to the resume parsing service. Please fill the form manually.",
        },
        { status: isRateLimit ? 429 : 500 }
      );
    }

    // Clean and parse JSON
    try {
      const cleanedJson = cleanJsonString(rawContent);
      const parsedData = JSON.parse(cleanedJson);
      return NextResponse.json(parsedData, { status: 200 });
    } catch (parseErr) {
      console.error("JSON parse failure on LLM response. Raw response was:", rawContent);
      return NextResponse.json(
        { error: "Could not process resume data. Please fill the form manually." },
        { status: 500 }
      );
    }
  } catch (globalErr: any) {
    console.error("Global error in resume import route:", globalErr);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please fill the form manually." },
      { status: 500 }
    );
  }
}
