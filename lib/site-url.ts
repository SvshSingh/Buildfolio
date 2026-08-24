const FALLBACK_SITE_URL = "http://localhost:3000";

/**
 * Public origin of the app, with any trailing slash stripped.
 *
 * A trailing slash on NEXT_PUBLIC_APP_URL is easy to miss and produces broken
 * "//sitemap.xml" style URLs, and — worse — an emailRedirectTo that no longer
 * matches Supabase's redirect allowlist.
 */
export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || FALLBACK_SITE_URL).replace(/\/+$/, "");
}
