export const siteConfig = {
  name: "Tool Library",
  description: "A comprehensive collection of free online tools for students, teachers, and professionals. PDF editors, citation generators, image compressors, and 50+ productivity tools.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://toollib.com",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/toollibrary",
    github: "https://github.com/toollibrary",
  },
  keywords: [
    "online tools",
    "free tools",
    "pdf editor",
    "citation generator",
    "image compressor",
    "developer tools",
    "academic tools",
    "productivity tools",
    "json formatter",
    "qr code generator",
  ],
};

export type SiteConfig = typeof siteConfig;
