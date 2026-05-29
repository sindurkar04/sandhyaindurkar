import type { MetadataRoute } from "next";
import { MATH_POSTS } from "@/lib/math-applied-posts";
import { SITE_URL } from "@/lib/site";

const STATIC_PATHS = [
  { path: "", priority: 1 },
  { path: "/math-applied", priority: 0.9 },
  { path: "/learning-through-food", priority: 0.9 },
  { path: "/learning-through-food/rasmalai", priority: 0.7 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = STATIC_PATHS.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));

  const mathEntries = MATH_POSTS.map((post) => ({
    url: `${SITE_URL}${post.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...mathEntries];
}
