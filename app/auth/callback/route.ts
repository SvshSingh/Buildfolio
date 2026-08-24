import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';

function authError(origin: string, message: string) {
  const url = new URL('/auth', origin);
  url.searchParams.set('error', message);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const providerError = searchParams.get('error_description') ?? searchParams.get('error');
  if (providerError) {
    return authError(origin, providerError);
  }

  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;

  const supabase = await createClient();

  // PKCE links arrive as ?code=, while Supabase's default email templates send
  // ?token_hash=&type=. Both land here, so handle whichever one is present.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return authError(origin, error.message);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) return authError(origin, error.message);
  } else {
    return authError(origin, 'This sign-in link is invalid or has already been used.');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return authError(origin, 'Could not start a session. Please request a new link.');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  return NextResponse.redirect(new URL(profile ? '/dashboard' : '/onboarding', origin));
}
