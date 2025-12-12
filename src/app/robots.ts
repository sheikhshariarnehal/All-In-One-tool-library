import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://toollib.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/callback", "/dashboard/", "/settings/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
