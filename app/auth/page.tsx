"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Mail, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { signInUser } from "@/services/authentication/auth.service";

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}

function AuthForm() {
  const callbackError = useSearchParams().get("error");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(callbackError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    try {
      await signInUser(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
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
            <span className="text-xs uppercase font-bold tracking-widest text-slate-300">FolioFast</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
            Welcome to FolioFast
          </h1>
          <p className="text-sm text-slate-400 mt-2 text-center">
            Create and publish your professional portfolio in seconds.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-850/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {success ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6 space-y-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-3xl mb-2">
                ✉️
              </div>
              <h2 className="text-xl font-bold text-slate-100">Check your email</h2>
              <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed font-sans">
                We sent a magic link to <span className="font-semibold text-slate-200">{email}</span>. Check your email for a magic link ✉️
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] hover:opacity-90 disabled:opacity-50 text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-200 active:scale-98 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin text-white" />
                    <span>Sending Magic Link...</span>
                  </>
                ) : (
                  <span>Send me a magic link →</span>
                )}
              </button>

              <p className="text-[11px] text-slate-550 text-center leading-relaxed mt-4">
                We&apos;ll email you a magic link — no password needed. Works for new and returning users.
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
