"use client";

import React, { useRef, useState } from "react";
import { Upload, Loader2, FileText, AlertCircle } from "lucide-react";
import { mapResumeToPortfolioData } from "@/lib/resume-parser/map-to-portfolio-schema";

interface ResumeUploadButtonProps {
  onImportSuccess: (mappedData: any) => void;
  triggerToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function ResumeUploadButton({
  onImportSuccess,
  triggerToast,
}: ResumeUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      return "Please upload a PDF or DOCX file.";
    }
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      return "File too large. Please upload a resume under 5MB.";
    }
    return null;
  };

  const handleUpload = async (file: File) => {
    setError(null);
    const fileError = validateFile(file);
    if (fileError) {
      setError(fileError);
      triggerToast(fileError, "error");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/resume-import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errMsg = "Could not process resume data. Please fill the form manually.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errMsg = errData.error;
          }
        } catch {
          // ignore parsing error
        }
        throw new Error(errMsg);
      }

      const extractedData = await response.json();
      const mappedData = mapResumeToPortfolioData(extractedData);

      triggerToast("Resume successfully processed and filled!", "success");
      onImportSuccess(mappedData);
    } catch (err: any) {
      console.error("Resume upload failed:", err);
      const msg = err.message || "Could not process resume data. Please fill the form manually.";
      setError(msg);
      triggerToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      e.target.value = "";
      handleUpload(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`w-full h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none transition-all ${
          dragActive
            ? "border-indigo-500 bg-indigo-500/5"
            : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-950/80"
        } ${loading ? "pointer-events-none opacity-80" : ""}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          disabled={loading}
        />

        {loading ? (
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Reading your resume...</p>
              <p className="text-xs text-zinc-500">Parsing text and extracting portfolio data</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-zinc-400">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-200">
                Import from Resume (PDF/DOCX)
              </p>
              <p className="text-xs text-zinc-550">
                Drag and drop your file here, or click to browse (Max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="space-y-0.5">
            <p className="font-semibold">Import Error</p>
            <p className="opacity-90">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
