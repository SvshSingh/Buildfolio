#!/usr/bin/env node
/**
 * Setup checker for FolioFast.
 *
 * Verifies the things that silently break magic-link sign-in: missing env
 * vars, a Supabase project that no longer exists, a disabled email provider,
 * a missing schema, and a trailing slash on NEXT_PUBLIC_APP_URL.
 *
 *   npm run doctor
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve as resolveDns } from "node:dns/promises";

const CHECKS = [];
let failed = 0;

function record(ok, title, detail, fix) {
  CHECKS.push({ ok, title, detail, fix });
  if (!ok) failed++;
}

/** Minimal .env parser — avoids a dependency just for this script. */
function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const fileEnv = { ...loadEnvFile(".env"), ...loadEnvFile(".env.local") };
const env = (name) => process.env[name] || fileEnv[name] || "";

const supabaseUrl = env("NEXT_PUBLIC_SUPABASE_URL");
const anonKey = env("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const appUrl = env("NEXT_PUBLIC_APP_URL");

// ---------------------------------------------------------------- env vars

record(
  Boolean(supabaseUrl),
  "NEXT_PUBLIC_SUPABASE_URL is set",
  supabaseUrl || "missing",
  "Copy .env.example to .env.local and fill it in from Supabase > Project Settings > API."
);

record(
  Boolean(anonKey),
  "NEXT_PUBLIC_SUPABASE_ANON_KEY is set",
  anonKey ? `${anonKey.slice(0, 12)}…` : "missing",
  "Copy the anon/public key from Supabase > Project Settings > API."
);

if (appUrl) {
  record(
    !appUrl.endsWith("/"),
    "NEXT_PUBLIC_APP_URL has no trailing slash",
    appUrl,
    "Remove the trailing slash. It breaks sitemap URLs and stops emailRedirectTo " +
      "from matching Supabase's redirect allowlist."
  );
}

// ------------------------------------------------------- project liveness

let host = "";
try {
  host = new URL(supabaseUrl).hostname;
} catch {
  if (supabaseUrl) {
    record(false, "NEXT_PUBLIC_SUPABASE_URL is a valid URL", supabaseUrl, "Expected https://<ref>.supabase.co");
  }
}

if (host) {
  let resolves = false;
  try {
    await resolveDns(host);
    resolves = true;
  } catch {
    resolves = false;
  }

  record(
    resolves,
    `${host} resolves in DNS`,
    resolves ? "ok" : "NXDOMAIN — this hostname does not exist",
    "The Supabase project was deleted, or the ref in the URL is wrong. A paused " +
      "project still resolves, so this means gone. Create a project and update the URL and anon key."
  );

  // Only worth probing HTTP if the name resolves at all.
  if (resolves && anonKey) {
    let settings = null;
    let reachErr = "";
    try {
      const res = await fetch(`${supabaseUrl.replace(/\/+$/, "")}/auth/v1/settings`, {
        headers: { apikey: anonKey },
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) settings = await res.json();
      else reachErr = `HTTP ${res.status}`;
    } catch (e) {
      reachErr = e.message;
    }

    record(
      Boolean(settings),
      "Supabase auth API is reachable",
      settings ? "ok" : reachErr,
      "Check that the anon key belongs to this project and the project is not paused."
    );

    if (settings) {
      const emailEnabled = settings.external?.email !== false;
      record(
        emailEnabled,
        "Email auth provider is enabled",
        emailEnabled ? "enabled" : "disabled",
        "Enable it under Authentication > Providers > Email, or no magic link will send."
      );
    }

    // Schema presence: a missing table returns PGRST205 / 404.
    for (const table of ["profiles", "portfolios"]) {
      let ok = false;
      let detail = "";
      try {
        const res = await fetch(
          `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/${table}?select=*&limit=0`,
          { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` }, signal: AbortSignal.timeout(10000) }
        );
        ok = res.ok;
        if (!ok) detail = `HTTP ${res.status}`;
      } catch (e) {
        detail = e.message;
      }
      record(
        ok,
        `Table "${table}" exists`,
        ok ? "ok" : detail,
        "Run supabase/schema.sql in the Supabase SQL editor."
      );
    }
  }
}

// -------------------------------------------------------------- reporting

console.log("");
for (const c of CHECKS) {
  console.log(`${c.ok ? "PASS" : "FAIL"}  ${c.title}`);
  console.log(`      ${c.detail}`);
  if (!c.ok) console.log(`      -> ${c.fix}`);
}
console.log("");
console.log(failed === 0 ? "All checks passed." : `${failed} check(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
