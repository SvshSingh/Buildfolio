import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourapp.co";

  // Fetch all profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, created_at")
    .not("username", "is", null);

  // Fetch only published portfolios to cross-reference
  const { data: publishedPortfolios } = await supabase
    .from("portfolios")
    .select("user_id, updated_at")
    .eq("is_published", true);

  const publishedUserIds = new Set(publishedPortfolios?.map((p) => p.user_id) || []);

  const portfolioUrls: MetadataRoute.Sitemap = (profiles || [])
    .filter((profile) => publishedUserIds.has(profile.id))
    .map((profile) => ({
      url: `${baseUrl}/p/${profile.username}`,
      lastModified: new Date(profile.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    ...portfolioUrls,
  ];
}
