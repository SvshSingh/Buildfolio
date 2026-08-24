import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import PortfolioBuilder from '@/components/portfolio-builder';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditorPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const mode = resolvedSearchParams.mode;

  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    redirect('/auth');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    redirect('/onboarding');
  }

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('data, template, wizard_completed, wizard_step')
    .eq('user_id', user.id)
    .maybeSingle();

  // Exception: if URL has ?mode=wizard -> redirect to wizard setup
  if (mode === 'wizard') {
    redirect('/editor/wizard?step=1&mode=wizard');
  }

  // If wizard is not completed, redirect to setup wizard (using saved step or 1)
  if (!portfolio || !portfolio.wizard_completed) {
    const step = portfolio?.wizard_step || 1;
    redirect(`/editor/wizard?step=${step}`);
  }

  return (
    <main className="flex flex-col min-h-screen">
      <PortfolioBuilder
        initialData={portfolio?.data}
        initialTemplate={portfolio?.template || 'minimal-clean'}
        userId={user.id}
        username={profile.username}
        email={user.email || ''}
      />
    </main>
  );
}

