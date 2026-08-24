# FolioFast

Build and publish a developer portfolio in minutes. Next.js 16 + Supabase, with
a guided wizard, 12 templates, and a public page at `/p/<username>`.

## Requirements

- Node.js **20.9 or newer** (Next.js 16 refuses to build on Node 18)
- A Supabase project

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` from **Supabase > Project Settings > API**, then create the
tables by running [`supabase/schema.sql`](supabase/schema.sql) in the Supabase
SQL editor.

Confirm the setup before starting the app — this catches a deleted Supabase
project, a missing schema, and a malformed `NEXT_PUBLIC_APP_URL`:

```bash
npm run doctor
```

```bash
npm run dev
```

## Configuring magic-link sign-in

Sign-in is passwordless. Three things must line up or no email arrives:

1. **Redirect URLs** — under *Authentication > URL Configuration*, add every
   origin you sign in from (`http://localhost:3000`, your production URL).
   Supabase rejects a magic link whose `emailRedirectTo` is not on this list.
2. **Email provider enabled** — under *Authentication > Providers > Email*, keep
   the email provider and signups on. With signups disabled, `signInWithOtp`
   sends nothing to addresses that don't already exist.
3. **SMTP** — the built-in Supabase mailer sends **2 emails per hour** and only
   to addresses on your project's team. Anything beyond that is dropped. Set up
   a custom SMTP provider under *Authentication > SMTP Settings* before testing
   with real users. This is the most common cause of "the link never arrives".

`/auth/callback` accepts both link formats: PKCE links (`?code=`) and the
default email-template links (`?token_hash=&type=`). Failures redirect back to
`/auth?error=…` so the reason is visible instead of a silent bounce.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run doctor` | Check env vars, Supabase reachability, and schema |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check, no emit |
| `npm run lint` | ESLint |

## Structure

```
app/            routes — landing, auth, onboarding, dashboard, editor, /p/[username]
components/     UI, landing sections, and the 12 portfolio templates
services/       auth service + provider
utils/supabase/ browser and server Supabase clients
supabase/       schema.sql
proxy.ts        route protection (Next 16's middleware)
```
