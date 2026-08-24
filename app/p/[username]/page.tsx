import { createClient } from "@/utils/supabase/server";
import PortfolioPreview from "@/components/portfolio-preview";
import { Lock } from "lucide-react";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username.toLowerCase())
    .single();

  if (!profile) {
    return {
      title: "Not Found",
      description: "This portfolio could not be found.",
    };
  }

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("data, is_published")
    .eq("user_id", profile.id)
    .single();

  if (!portfolio) {
    return {
      title: "Not Found",
      description: "This portfolio could not be found.",
    };
  }

  if (!portfolio.is_published) {
    return {
      title: "Private Portfolio",
      robots: { index: false, follow: false },
    };
  }

  const data = portfolio.data as any;

  return {
    title: `${data.name || username} - Portfolio`,
    description: data.bio || data.headline || `Portfolio of ${data.name || username}`,
    openGraph: {
      title: `${data.name || username} - Portfolio`,
      description: data.bio || data.headline || `Portfolio of ${data.name || username}`,
      images: data.photo ? [{ url: data.photo }] : [],
    },
  };
}

export default async function PublicPortfolio({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  // Fetch using the exact specified queries
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('username', username.toLowerCase())
    .single();

  if (profileError || !profile) {
    return <PortfolioNotFound />;
  }

  const { data: portfolio, error: portfolioError } = await supabase
    .from('portfolios')
    .select('data, template, is_published')
    .eq('user_id', profile.id)
    .single();

  if (portfolioError || !portfolio) {
    return <PortfolioNotFound />;
  }

  // Handle private portfolio — do NOT show 404
  if (!portfolio.is_published) {
    return (
      <div className="min-h-screen bg-[#07070f] flex flex-col items-center justify-center text-center px-6 antialiased font-sans">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <Lock className="h-7 w-7 text-white/40" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">This portfolio is private</h1>
        <p className="text-white/50 text-base max-w-sm">
          {profile.username} has set their portfolio to private. Check back later or reach out to them directly.
        </p>
        <a
          href="/"
          className="mt-8 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          ← Build your own portfolio
        </a>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <PortfolioPreview portfolio={portfolio.data as any} template={portfolio.template} />
    </main>
  );
}

function PortfolioNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Portfolio Not Found</h1>
        <p className="text-slate-500 text-sm mb-6 max-w-xs leading-relaxed">
          The portfolio you are looking for doesn&apos;t exist or is not published yet.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors select-none cursor-pointer"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
