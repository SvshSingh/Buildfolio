import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardSettings from "@/components/dashboard-settings";

export default async function SettingsPage() {
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

  // Fetch portfolio status and last updated date
  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("is_published, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <DashboardSettings
      userId={user.id}
      initialUsername={profile.username}
      initialPublishStatus={portfolio?.is_published || false}
      email={user.email || ""}
      updatedAt={portfolio?.updated_at || null}
    />
  );
}
