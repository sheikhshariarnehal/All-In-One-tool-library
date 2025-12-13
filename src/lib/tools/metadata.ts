// Tool metadata without React components - safe for Server Components

export interface ToolMetadata {
  slug: string;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  keywords: string[];
}

// Tool metadata registry - no React components, safe for RSC
export const toolsMetadata: ToolMetadata[] = [
  // Document Tools
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    description: "Compress PDF files to reduce size while maintaining quality. Perfect for email attachments.",
    category: "document",
    isPremium: false,
    keywords: ["pdf", "compress", "reduce size", "optimize", "shrink"],
  },
  {
    slug: "pdf-merger",
    name: "PDF Merger",
    description: "Combine multiple PDF files into a single document. Drag and drop to reorder pages.",
    category: "document",
    isPremium: false,
    keywords: ["pdf", "merge", "combine", "join", "concatenate"],
  },
  {
    slug: "pdf-splitter",
    name: "PDF Splitter",
    description: "Split PDF documents into separate pages or extract specific page ranges.",
    category: "document",
    isPremium: false,
    keywords: ["pdf", "split", "separate", "extract", "pages"],
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word Converter",
    description: "Convert PDF documents to editable Word files while preserving formatting.",
    category: "document",
    isPremium: false,
    keywords: ["pdf", "word", "convert", "docx", "doc"],
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF Converter",
    description: "Convert Word documents to PDF format for easy sharing and printing.",
    category: "document",
    isPremium: false,
    keywords: ["word", "pdf", "convert", "docx", "doc"],
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    description: "Convert images (JPG, PNG) to PDF. Combine multiple images into a single PDF.",
    category: "document",
    isPremium: false,
    keywords: ["image", "pdf", "convert", "jpg", "png", "photo"],
  },
  {
    slug: "pdf-editor",
    name: "PDF Editor",
    description: "Annotate, highlight, and add text to PDF documents directly in your browser.",
    category: "document",
    isPremium: true,
    keywords: ["pdf", "edit", "annotate", "highlight", "markup"],
  },
  {
    slug: "document-converter",
    name: "Universal Document Converter",
    description: "Convert between document formats: Word, PDF, Excel, PowerPoint, and more.",
    category: "document",
    isPremium: false,
    keywords: ["convert", "document", "format", "word", "excel", "powerpoint"],
  },

  // Academic Tools
  {
    slug: "word-counter",
    name: "Word Counter & Analyzer",
    description: "Count words, characters, sentences, and analyze readability metrics.",
    category: "academic",
    isPremium: false,
    keywords: ["word count", "character count", "readability", "analyze", "essay"],
  },
  {
    slug: "citation-generator",
    name: "Citation Generator",
    description: "Generate citations in APA, MLA, Chicago, and Harvard formats.",
    category: "academic",
    isPremium: false,
    keywords: ["citation", "apa", "mla", "chicago", "harvard", "bibliography", "reference"],
  },
  {
    slug: "plagiarism-checker",
    name: "Plagiarism Checker",
    description: "Check your content for plagiarism and get a detailed originality report.",
    category: "academic",
    isPremium: true,
    keywords: ["plagiarism", "originality", "check", "duplicate", "copy"],
  },
  {
    slug: "grammar-checker",
    name: "Grammar Checker",
    description: "Check and correct grammar, spelling, and punctuation errors in your writing.",
    category: "academic",
    isPremium: false,
    keywords: ["grammar", "spelling", "punctuation", "check", "proofread"],
  },
  {
    slug: "paraphrasing-tool",
    name: "Paraphrasing Tool",
    description: "Rewrite text while maintaining the original meaning. Multiple paraphrasing modes.",
    category: "academic",
    isPremium: false,
    keywords: ["paraphrase", "rewrite", "rephrase", "reword", "synonym"],
  },
  {
    slug: "assignment-tracker",
    name: "Assignment Tracker",
    description: "Track assignments, deadlines, and grades. Never miss a due date again.",
    category: "academic",
    isPremium: false,
    keywords: ["assignment", "tracker", "deadline", "homework", "grades"],
  },
  {
    slug: "bibliography-manager",
    name: "Bibliography Manager",
    description: "Organize and manage your research sources. Export to multiple citation formats.",
    category: "academic",
    isPremium: false,
    keywords: ["bibliography", "sources", "research", "references", "organize"],
  },
  {
    slug: "essay-outline-generator",
    name: "Essay Outline Generator",
    description: "Generate structured essay outlines for any topic and essay type.",
    category: "academic",
    isPremium: false,
    keywords: ["essay", "outline", "structure", "planning", "writing"],
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    description: "Upload multiple images and create a PDF. Drag & drop to reorder, adjust size, and rotate images.",
    category: "academic",
    isPremium: false,
    keywords: ["image", "pdf", "convert", "jpg", "png", "photo", "combine", "merge"],
  },
  {
    slug: "readability-analyzer",
    name: "Readability Analyzer",
    description: "Analyze text readability with Flesch-Kincaid, Gunning Fog, and other metrics.",
    category: "academic",
    isPremium: false,
    keywords: ["readability", "flesch", "analyze", "grade level", "complexity"],
  },
  {
    slug: "thesis-generator",
    name: "Thesis Statement Generator",
    description: "Create strong thesis statements for your essays and research papers.",
    category: "academic",
    isPremium: false,
    keywords: ["thesis", "statement", "essay", "argument", "generate"],
  },
  {
    slug: "note-organizer",
    name: "Research Note Organizer",
    description: "Organize research notes, quotes, and sources in one place.",
    category: "academic",
    isPremium: true,
    keywords: ["notes", "organize", "research", "quotes", "sources"],
  },

  // Developer Tools
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    description: "Format, validate, and beautify JSON data with syntax highlighting and error detection.",
    category: "developer",
    isPremium: false,
    keywords: ["json", "format", "beautify", "validate", "pretty print", "minify"],
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder/Decoder",
    description: "Encode text to Base64 or decode Base64 strings back to plain text.",
    category: "developer",
    isPremium: false,
    keywords: ["base64", "encode", "decode", "convert", "binary"],
  },
  {
    slug: "url-encoder",
    name: "URL Encoder/Decoder",
    description: "Encode special characters for URLs or decode URL-encoded strings.",
    category: "developer",
    isPremium: false,
    keywords: ["url", "encode", "decode", "percent encoding", "uri"],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text input.",
    category: "developer",
    isPremium: false,
    keywords: ["hash", "md5", "sha1", "sha256", "sha512", "checksum", "crypto"],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test and debug regular expressions with real-time matching and highlighting.",
    category: "developer",
    isPremium: false,
    keywords: ["regex", "regular expression", "pattern", "match", "test"],
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text in paragraphs, sentences, or words for design mockups.",
    category: "developer",
    isPremium: false,
    keywords: ["lorem ipsum", "placeholder", "dummy text", "filler text"],
  },
  {
    slug: "code-formatter",
    name: "Code Formatter",
    description: "Format and beautify code in JavaScript, TypeScript, HTML, CSS, and more.",
    category: "developer",
    isPremium: false,
    keywords: ["code", "format", "beautify", "prettier", "indent"],
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    description: "Convert between HEX, RGB, HSL, and other color formats.",
    category: "developer",
    isPremium: false,
    keywords: ["color", "convert", "hex", "rgb", "hsl", "picker"],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate random UUIDs (v4) and other unique identifiers.",
    category: "developer",
    isPremium: false,
    keywords: ["uuid", "guid", "unique", "identifier", "random"],
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens (JWT) without validation.",
    category: "developer",
    isPremium: false,
    keywords: ["jwt", "token", "decode", "json", "web token"],
  },

  // Utilities
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description: "Create QR codes for URLs, text, WiFi, and contact information.",
    category: "utilities",
    isPremium: false,
    keywords: ["qr code", "barcode", "scan", "generate", "wifi", "url"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate strong, secure passwords with customizable options.",
    category: "utilities",
    isPremium: false,
    keywords: ["password", "generate", "secure", "random", "strong"],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description: "Convert between units of length, weight, temperature, and more.",
    category: "utilities",
    isPremium: false,
    keywords: ["convert", "unit", "length", "weight", "temperature"],
  },
  {
    slug: "calculator",
    name: "Scientific Calculator",
    description: "Perform complex calculations with a full-featured scientific calculator.",
    category: "utilities",
    isPremium: false,
    keywords: ["calculator", "math", "scientific", "compute"],
  },
  {
    slug: "timezone-converter",
    name: "Timezone Converter",
    description: "Convert time between different timezones around the world.",
    category: "utilities",
    isPremium: false,
    keywords: ["timezone", "time", "convert", "world", "clock"],
  },
  {
    slug: "text-diff",
    name: "Text Diff Checker",
    description: "Compare two texts and highlight the differences between them.",
    category: "utilities",
    isPremium: false,
    keywords: ["diff", "compare", "text", "difference", "changes"],
  },
  {
    slug: "countdown-timer",
    name: "Countdown Timer",
    description: "Create countdown timers for events, deadlines, and more.",
    category: "utilities",
    isPremium: false,
    keywords: ["countdown", "timer", "event", "deadline"],
  },

  // AI Image Tools
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Compress images to reduce file size while maintaining quality.",
    category: "ai-image",
    isPremium: false,
    keywords: ["image", "compress", "optimize", "reduce size", "png", "jpg", "webp"],
  },
  {
    slug: "background-remover",
    name: "Background Remover",
    description: "Remove backgrounds from images automatically with AI.",
    category: "ai-image",
    isPremium: true,
    keywords: ["background", "remove", "transparent", "ai", "image"],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Resize images to specific dimensions or percentages.",
    category: "ai-image",
    isPremium: false,
    keywords: ["image", "resize", "dimensions", "scale", "crop"],
  },
  {
    slug: "image-converter",
    name: "Image Format Converter",
    description: "Convert images between formats: PNG, JPG, WebP, GIF, and more.",
    category: "ai-image",
    isPremium: false,
    keywords: ["image", "convert", "format", "png", "jpg", "webp"],
  },
  {
    slug: "image-enhancer",
    name: "AI Image Enhancer",
    description: "Enhance image quality, upscale resolution, and fix blurry photos.",
    category: "ai-image",
    isPremium: true,
    keywords: ["image", "enhance", "upscale", "quality", "ai"],
  },
  {
    slug: "watermark-remover",
    name: "Watermark Remover",
    description: "Remove watermarks from images using AI technology.",
    category: "ai-image",
    isPremium: true,
    keywords: ["watermark", "remove", "image", "ai", "clean"],
  },

  // Professional Tools
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    description: "Create professional invoices with customizable templates.",
    category: "professional",
    isPremium: false,
    keywords: ["invoice", "bill", "generate", "business", "payment"],
  },
  {
    slug: "contract-templates",
    name: "Contract Templates",
    description: "Access and customize legal contract templates for various needs.",
    category: "professional",
    isPremium: true,
    keywords: ["contract", "legal", "template", "agreement", "document"],
  },
  {
    slug: "meeting-scheduler",
    name: "Meeting Scheduler",
    description: "Schedule meetings and find the best time for all participants.",
    category: "professional",
    isPremium: false,
    keywords: ["meeting", "schedule", "calendar", "time", "booking"],
  },
  {
    slug: "email-signature",
    name: "Email Signature Generator",
    description: "Create professional email signatures with custom designs.",
    category: "professional",
    isPremium: false,
    keywords: ["email", "signature", "professional", "design", "business"],
  },
];

export function getToolMetadataBySlug(slug: string): ToolMetadata | undefined {
  return toolsMetadata.find((tool) => tool.slug === slug);
}

export function getToolsMetadataByCategory(category: string): ToolMetadata[] {
  return toolsMetadata.filter((tool) => tool.category === category);
}

export function searchToolsMetadata(query: string): ToolMetadata[] {
  const lowerQuery = query.toLowerCase();
  return toolsMetadata.filter(
    (tool) =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.keywords.some((keyword) => keyword.includes(lowerQuery))
  );
}

export function getAllToolSlugs(): { category: string; slug: string }[] {
  return toolsMetadata.map((tool) => ({
    category: tool.category,
    slug: tool.slug,
  }));
}
