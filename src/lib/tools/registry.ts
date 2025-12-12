"use client";

import { ComponentType, lazy } from "react";
import { ToolMetadata, toolsMetadata, getToolMetadataBySlug } from "./metadata";

export interface Tool extends ToolMetadata {
  component: ComponentType;
}

// Lazy load tool components for better performance
// Developer Tools
const JsonFormatter = lazy(() => import("@/components/tools/developer/json-formatter"));
const Base64Encoder = lazy(() => import("@/components/tools/developer/base64-encoder"));
const UrlEncoder = lazy(() => import("@/components/tools/developer/url-encoder"));
const HashGenerator = lazy(() => import("@/components/tools/developer/hash-generator"));
const RegexTester = lazy(() => import("@/components/tools/developer/regex-tester"));
const LoremIpsum = lazy(() => import("@/components/tools/developer/lorem-ipsum"));

// Academic Tools
const WordCounter = lazy(() => import("@/components/tools/academic/word-counter"));
const CitationGenerator = lazy(() => import("@/components/tools/academic/citation-generator"));
const AssignmentTracker = lazy(() => import("@/components/tools/academic/assignment-tracker"));
const EssayOutlineGenerator = lazy(() => import("@/components/tools/academic/essay-outline-generator"));

// Document Tools
const PDFCompressor = lazy(() => import("@/components/tools/document/pdf-compressor"));

// Utilities
const QrCodeGenerator = lazy(() => import("@/components/tools/utilities/qr-code-generator"));

// AI Image Tools
const ImageCompressor = lazy(() => import("@/components/tools/ai-image/image-compressor"));

// Component map for dynamic loading
const componentMap: Record<string, ComponentType> = {
  // Developer
  "json-formatter": JsonFormatter,
  "base64-encoder": Base64Encoder,
  "url-encoder": UrlEncoder,
  "hash-generator": HashGenerator,
  "regex-tester": RegexTester,
  "lorem-ipsum": LoremIpsum,
  // Academic
  "word-counter": WordCounter,
  "citation-generator": CitationGenerator,
  "assignment-tracker": AssignmentTracker,
  "essay-outline-generator": EssayOutlineGenerator,
  // Document
  "pdf-compressor": PDFCompressor,
  // Utilities
  "qr-code-generator": QrCodeGenerator,
  // AI Image
  "image-compressor": ImageCompressor,
};

// Get tool with component by slug - use this on client-side only
export function getToolWithComponent(slug: string): Tool | undefined {
  const metadata = getToolMetadataBySlug(slug);
  if (!metadata) return undefined;
  
  const component = componentMap[slug];
  if (!component) return undefined;
  
  return { ...metadata, component };
}

// Re-export metadata functions for convenience
export { toolsMetadata as tools } from "./metadata";
export { getToolMetadataBySlug as getToolBySlug } from "./metadata";
export { getToolsMetadataByCategory as getToolsByCategory } from "./metadata";
export { searchToolsMetadata as searchTools } from "./metadata";
export { getAllToolSlugs } from "./metadata";
