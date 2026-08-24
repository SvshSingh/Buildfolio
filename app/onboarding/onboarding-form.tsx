"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Sparkles, Loader, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface OnboardingFormProps {
  userId: string;
}

export default function OnboardingForm({ userId }: OnboardingFormProps) {
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Validate username client-side format
  const validateUsernameFormat = (val: string) => {
    return /^[a-z0-9_-]{3,20}$/.test(val);
  };

  useEffect(() => {
    if (!username) {
      setAvailable(null);
      setChecking(false);
      setError(null);
      return;
    }

    if (!validateUsernameFormat(username)) {
      setAvailable(false);
      setError("Use 3-20 chars, lowercase, numbers, '-' or '_' only");
      return;
    }

    setError(null);
    setChecking(true);

    const debounceId = setTimeout(async () => {
      try {
        const { data, error: selectError } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username)
          .maybeSingle();

        if (selectError) {
          console.error("Error checking username:", selectError);
          setError("Error checking availability. Please try again.");
          setAvailable(null);
        } else if (data) {
          setAvailable(false);
          setError("Username is already taken");
        } else {
          setAvailable(true);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        setError("Network error occurred");
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(debounceId);
  }, [username, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUsernameFormat(username) || !available || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      // 1. Insert into profiles table
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          username: username,
        });

      if (insertError) {
        setError(insertError.message);
        setSubmitting(false);
        return;
      }

      // 2. Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-100 antialiased font-sans relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-xs uppercase font-bold tracking-widest text-slate-300">Onboarding</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
            Choose your username
          </h1>
          <p className="text-sm text-slate-400 mt-2 text-center">
            This will be your public URL, e.g. foliofast.com/p/username
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-850/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                  placeholder="e.g. alexj"
                  className={`w-full rounded-xl border bg-slate-950 pl-4 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all ${
                    available === true
                      ? "border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      : available === false
                      ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                      : "border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  }`}
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {checking && <Loader className="w-4 h-4 animate-spin text-indigo-400" />}
                  {!checking && available === true && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  {!checking && available === false && <XCircle className="w-4 h-4 text-rose-400" />}
                </span>
              </div>
            </div>

            {error && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            {available === true && !checking && !error && (
              <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 rounded-lg">
                @{username} is available!
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || checking || available !== true}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] hover:opacity-90 disabled:opacity-50 text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-200 active:scale-98 cursor-pointer disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin text-white" />
                  <span>Claiming Username...</span>
                </>
              ) : (
                <span>Claim Username</span>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
