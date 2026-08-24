import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import TemplateGallery from "@/components/template-gallery";

export default async function TemplatesPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/auth");
  }

  // Fetch portfolio template setting
  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("template")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <TemplateGallery
      userId={user.id}
      initialTemplate={portfolio?.template || "minimal-clean"}
    />
  );
}
