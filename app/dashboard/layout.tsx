import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardSidebar from "@/components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/auth");
  }

  // Check if profile exists (otherwise send to onboarding)
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col md:flex-row antialiased">
      <DashboardSidebar email={user.email || ""} />
      
      {/* Main Content Container with responsive offsets */}
      <main className="flex-1 md:pl-60 pt-14 pb-14 md:pt-0 md:pb-0 min-h-screen bg-black">
        {children}
      </main>
    </div>
  );
}
