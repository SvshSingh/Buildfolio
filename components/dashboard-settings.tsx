"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Globe, Mail, Info, Loader, CheckCircle, XCircle, Settings, Sparkles, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/ui/toast";
import ConfirmModal from "@/components/ui/confirm-modal";

interface DashboardSettingsProps {
  userId: string;
  initialUsername: string;
  initialPublishStatus: boolean;
  email: string;
  updatedAt: string | null;
}

export default function DashboardSettings({
  userId,
  initialUsername,
  initialPublishStatus,
  email,
  updatedAt,
}: DashboardSettingsProps) {
  const router = useRouter();

  const [username, setUsername] = useState(initialUsername);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [submittingUsername, setSubmittingUsername] = useState(false);

  const [isPublished, setIsPublished] = useState(initialPublishStatus);
  const [togglingPublish, setTogglingPublish] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setToastVisible(true);
  };

  const validateUsernameFormat = (val: string) => {
    return /^[a-z0-9_-]{3,20}$/.test(val);
  };

  useEffect(() => {
    if (username === initialUsername) {
      setAvailable(null);
      setChecking(false);
      setUsernameError(null);
      return;
    }

    if (!username) {
      setAvailable(null);
      setChecking(false);
      setUsernameError(null);
      return;
    }

    if (!validateUsernameFormat(username)) {
      setAvailable(false);
      setUsernameError("Use 3-20 chars, lowercase, numbers, '-' or '_' only");
      return;
    }

    setUsernameError(null);
    setChecking(true);

    const debounceId = setTimeout(async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username)
          .maybeSingle();

        if (error) {
          console.error("Error checking username:", error);
          setUsernameError("Error checking availability.");
          setAvailable(null);
        } else if (data) {
          setAvailable(false);
          setUsernameError("Username is already taken");
        } else {
          setAvailable(true);
          setUsernameError(null);
        }
      } catch (err) {
        console.error(err);
        setUsernameError("Network error occurred.");
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(debounceId);
  }, [username, initialUsername]);

  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === initialUsername) return;
    if (!validateUsernameFormat(username) || !available || submittingUsername) return;

    setSubmittingUsername(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ username: username })
        .eq("id", userId);

      if (error) {
        triggerToast("Failed to update username: " + error.message);
      } else {
        triggerToast("Username updated successfully");
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      triggerToast(err?.message || "An unexpected error occurred.");
    } finally {
      setSubmittingUsername(false);
      setAvailable(null);
    }
  };

  const handleTogglePublish = async () => {
    if (togglingPublish) return;
    setTogglingPublish(true);

    const newPublishState = !isPublished;
    try {
      const supabase = createClient();

      const { data: existing } = await supabase
        .from("portfolios")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      let error;
      if (existing) {
        const { error: updateError } = await supabase
          .from("portfolios")
          .update({ is_published: newPublishState })
          .eq("user_id", userId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("portfolios")
          .insert({
            user_id: userId,
            is_published: newPublishState,
            data: {},
            template: "minimal-clean",
          });
        error = insertError;
      }

      if (error) throw error;

      setIsPublished(newPublishState);
      triggerToast(
        newPublishState
          ? "Portfolio published"
          : "Portfolio unpublished"
      );
      router.refresh();
    } catch (err: any) {
      console.error(err);
      triggerToast("Error toggling publishing status");
    } finally {
      setTogglingPublish(false);
    }
  };

  const handleSignOutAllDevices = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: "global" });
      router.push("/auth");
    } catch (err: any) {
      console.error("Sign out error:", err);
      triggerToast("Error signing out. Please try again.", "error");
    }
  };

  const handleDeletePortfolio = async () => {
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("portfolios")
        .update({
          data: {},
          is_published: false,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId);

      if (error) throw error;
      triggerToast("Portfolio deleted successfully.", "success");
      setShowDeleteConfirm(false);
      setIsPublished(false);
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err: any) {
      console.error("Delete portfolio error:", err);
      triggerToast("Failed to delete portfolio. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const hasUsernameChanged = username !== initialUsername;
  const isUsernameSaveDisabled = !hasUsernameChanged || checking || available !== true || submittingUsername;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 select-none text-zinc-100">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Settings</span>
        </h1>
        <p className="text-zinc-550 text-xs mt-0.5">
          Customize your custom URL and visibility preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* CARD 1: USERNAME SETTINGS */}
        <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
            <User className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-200">Custom URL Path</h2>
          </div>

          <form onSubmit={handleSaveUsername} className="space-y-4">
            <div>
              <label htmlFor="settings-username" className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                Username path
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-550 font-mono text-xs select-none">
                    foliofast.com/p/
                  </span>
                  <input
                    id="settings-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                    placeholder="username"
                    className="w-full rounded-lg border border-zinc-900 bg-black pl-[110px] pr-10 py-2 text-xs text-zinc-100 placeholder-zinc-700 focus:border-zinc-650 focus:ring-0 outline-none transition-colors font-mono"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {checking && <Loader className="w-3.5 h-3.5 text-zinc-550 animate-spin" />}
                    {!checking && available === true && username !== initialUsername && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    {!checking && available === false && username !== initialUsername && (
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isUsernameSaveDisabled}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-100 disabled:bg-zinc-900 disabled:text-zinc-600 text-black text-xs font-semibold transition-colors select-none cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                >
                  {submittingUsername ? "Saving..." : "Save Username"}
                </button>
              </div>
              {usernameError && (
                <p className="text-rose-500 text-xs mt-1.5 pl-0.5">{usernameError}</p>
              )}
              {available === true && username !== initialUsername && (
                <p className="text-emerald-500 text-xs mt-1.5 pl-0.5">Username is available</p>
              )}
            </div>
          </form>
        </section>

        {/* CARD 2: PUBLISHING SETTINGS */}
        <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
            <Globe className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-200">Public Page Visibility</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="text-xs font-semibold text-zinc-200">Make Portfolio Live</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed max-w-md">
                Toggle your profile availability. Toggling off restricts view access, placing it in draft state.
              </p>
            </div>
            
            {/* Apple-style dark toggle */}
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-semibold text-zinc-550 uppercase tracking-wider">
                {isPublished ? "Live" : "Draft"}
              </span>
              <button
                onClick={handleTogglePublish}
                disabled={togglingPublish}
                role="switch"
                aria-checked={isPublished}
                aria-label="Toggle portfolio visibility"
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out outline-none ${
                  isPublished ? "bg-white" : "bg-zinc-900"
                } ${togglingPublish ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-md ring-0 transition duration-150 ease-in-out ${
                    isPublished ? "translate-x-4 bg-black" : "translate-x-0 bg-zinc-500"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* CARD 3: PORTFOLIO SETUP */}
        <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-200">Portfolio Setup</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="text-xs font-semibold text-zinc-200">Re-launch Setup Wizard</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed max-w-md">
                Take the 6-step guided setup again to configure your profile, experience, projects, skills and contact details.
              </p>
              {updatedAt && (
                <p className="text-[10px] text-zinc-500 mt-1">
                  Last edited: {new Date(updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
            
            <button
              onClick={() => router.push("/editor/wizard?step=1&mode=wizard")}
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Re-launch setup wizard →</span>
            </button>
          </div>
        </section>

        {/* CARD 4: ACCOUNT INFORMATION */}
        <section className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
            <Mail className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-200">Account Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                Email Address
              </span>
              <div className="bg-black border border-zinc-900 px-3 py-2 rounded-lg text-zinc-400">
                {email}
              </div>
            </div>
            <div>
              <span className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                User ID
              </span>
              <div className="bg-black border border-zinc-900 px-3 py-2 rounded-lg text-zinc-400 font-mono text-[10px] truncate" title={userId}>
                {userId}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-black border border-zinc-900 rounded-lg p-3 text-[10px] text-zinc-500">
            <Info className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              These details are verified and fetched from your active Supabase session.
            </p>
          </div>
        </section>

        {/* DANGER ZONE */}
        <section className="border border-red-500/30 rounded-xl p-6 mt-8 bg-red-950/5">
          <h3 className="text-red-400 font-semibold text-sm uppercase tracking-wider mb-1">Danger Zone</h3>
          <p className="text-zinc-500 text-xs mb-6">These actions are irreversible. Please proceed carefully.</p>

          {/* Sign out of all devices */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-zinc-900 gap-4">
            <div>
              <p className="text-sm font-medium text-white">Sign out of all devices</p>
              <p className="text-xs text-zinc-400 mt-0.5">Revokes all active sessions including this one.</p>
            </div>
            <button
              onClick={handleSignOutAllDevices}
              className="text-xs px-4 py-2 rounded-lg border border-zinc-800 text-zinc-300 hover:border-red-500/50 hover:text-red-400 transition-colors font-semibold bg-zinc-900 cursor-pointer select-none active:scale-98"
            >
              Sign out everywhere
            </button>
          </div>

          {/* Delete portfolio */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
            <div>
              <p className="text-sm font-medium text-white">Delete my portfolio</p>
              <p className="text-xs text-zinc-450 mt-0.5">Clears all your portfolio content. Your account remains active.</p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-semibold cursor-pointer select-none active:scale-98"
            >
              Delete portfolio
            </button>
          </div>
        </section>
      </div>

      {/* Delete Confirm Dialog */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete your portfolio?"
        description="This will permanently clear all your portfolio content including projects, experience, and settings. Your account will remain active. This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete Portfolio"}
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeletePortfolio}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* TOAST */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
