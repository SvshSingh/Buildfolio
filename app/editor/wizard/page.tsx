import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import WizardContainer from '@/components/wizard-container';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function WizardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const stepStr = resolvedSearchParams.step;
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

  // If already completed and mode is not wizard, redirect back to /editor
  if (portfolio?.wizard_completed && mode !== 'wizard') {
    redirect('/editor');
  }

  // If no step param is present, redirect to the saved wizard_step (or 1)
  if (!stepStr) {
    const savedStep = portfolio?.wizard_step || 1;
    const modeParam = mode ? `&mode=${mode}` : '';
    redirect(`/editor/wizard?step=${savedStep}${modeParam}`);
  }

  return (
    <WizardContainer
      userId={user.id}
      username={profile.username}
      email={user.email || ''}
      initialData={portfolio?.data}
      initialTemplate={portfolio?.template || 'minimal-clean'}
      wizardStep={portfolio?.wizard_step || 1}
      wizardCompleted={portfolio?.wizard_completed || false}
    />
  );
}
