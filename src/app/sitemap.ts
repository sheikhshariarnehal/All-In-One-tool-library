import { MetadataRoute } from "next";
import { toolsMetadata } from "@/lib/tools/metadata";
import { categories } from "@/lib/tools/categories";
import { aiTools } from "@/lib/ai-tools";
import { templateCategories } from "@/lib/templates";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://toollib.com";

  // Static pages
  const staticPages = [
    "",
    "/tools",
    "/templates",
    "/ai-tools",
    "/pricing",
    "/blog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/tools/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Tool pages
  const toolPages = toolsMetadata.map((tool) => ({
    url: `${baseUrl}/tools/${tool.category}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Template category pages
  const templateCategoryPages = templateCategories.map((category) => ({
    url: `${baseUrl}/templates/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // AI Tool pages
  const aiToolPages = aiTools.map((tool) => ({
    url: `${baseUrl}/ai-tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, ...templateCategoryPages, ...aiToolPages];
}
