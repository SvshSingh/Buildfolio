import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardHome from "@/components/dashboard-home";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/auth");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  // Fetch user's portfolio
  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("data, is_published, template")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <DashboardHome
      username={profile.username}
      portfolio={portfolio}
    />
  );
}
