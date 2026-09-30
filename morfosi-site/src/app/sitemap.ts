import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";

const BASE_URL = "https://morfosi.edu.gr";

// Static routes with their change frequency and priority
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE_URL}/plano`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE_URL}/calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
  { url: `${BASE_URL}/exams`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/schedule-exams`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
  { url: `${BASE_URL}/teachers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
  { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.75 },
  { url: `${BASE_URL}/epityxontes`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
  { url: `${BASE_URL}/prosanatolismos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/books`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.65 },
  { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
  { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic news post slugs from Sanity
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await client.fetch<{ slug: string; _updatedAt: string }[]>(`
      *[_type == "post" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt
      }
    `);
    postRoutes = posts.map((post) => ({
      url: `${BASE_URL}/news/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Sanity unavailable at build time — skip dynamic routes
  }

  return [...STATIC_ROUTES, ...postRoutes];
}
