import { createClient } from "@/utils/supabase/client";

// Supabase rejects any emailRedirectTo that is not on the project's redirect
// allowlist, so this must match a URL under Auth > URL Configuration.
function getRedirectOrigin() {
    return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || window.location.origin;
}

export async function signInWithMagicLink(email: string) {
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
            emailRedirectTo: `${getRedirectOrigin()}/auth/callback`,
        },
    });

    if (signInError) {
        // A bad NEXT_PUBLIC_SUPABASE_URL surfaces only as "Failed to fetch",
        // which reads like a user network problem rather than a config error.
        if (signInError.message === "Failed to fetch") {
            throw new Error(
                "Could not reach the authentication server. Check NEXT_PUBLIC_SUPABASE_URL and your connection."
            );
        }
        throw new Error(signInError.message);
    }
}
