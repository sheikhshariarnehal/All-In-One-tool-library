"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";

type SourceType = "book" | "journal" | "website";
type CitationStyle = "apa" | "mla" | "chicago" | "harvard";

interface BookSource {
  authors: string;
  title: string;
  publisher: string;
  year: string;
  edition?: string;
  location?: string;
}

interface JournalSource {
  authors: string;
  articleTitle: string;
  journalName: string;
  year: string;
  volume: string;
  issue?: string;
  pages: string;
  doi?: string;
}

interface WebsiteSource {
  authors: string;
  pageTitle: string;
  websiteName: string;
  url: string;
  accessDate: string;
  publishDate?: string;
}

function formatAuthorsAPA(authors: string): string {
  const authorList = authors.split(",").map((a) => a.trim());
  if (authorList.length === 0) return "";
  if (authorList.length === 1) return authorList[0];
  if (authorList.length === 2) return `${authorList[0]} & ${authorList[1]}`;
  return `${authorList.slice(0, -1).join(", ")}, & ${authorList[authorList.length - 1]}`;
}

function generateBookCitation(source: BookSource, style: CitationStyle): string {
  const authors = formatAuthorsAPA(source.authors);
  
  switch (style) {
    case "apa":
      return `${authors} (${source.year}). *${source.title}*${source.edition ? ` (${source.edition} ed.)` : ""}. ${source.publisher}.`;
    case "mla":
      return `${source.authors}. *${source.title}*. ${source.publisher}, ${source.year}.`;
    case "chicago":
      return `${source.authors}. *${source.title}*. ${source.location ? `${source.location}: ` : ""}${source.publisher}, ${source.year}.`;
    case "harvard":
      return `${authors} (${source.year}) *${source.title}*${source.edition ? `, ${source.edition} edn` : ""}. ${source.location ? `${source.location}: ` : ""}${source.publisher}.`;
    default:
      return "";
  }
}

function generateJournalCitation(source: JournalSource, style: CitationStyle): string {
  const authors = formatAuthorsAPA(source.authors);
  
  switch (style) {
    case "apa":
      return `${authors} (${source.year}). ${source.articleTitle}. *${source.journalName}*, *${source.volume}*${source.issue ? `(${source.issue})` : ""}, ${source.pages}.${source.doi ? ` https://doi.org/${source.doi}` : ""}`;
    case "mla":
      return `${source.authors}. "${source.articleTitle}." *${source.journalName}*, vol. ${source.volume}, no. ${source.issue || "1"}, ${source.year}, pp. ${source.pages}.`;
    case "chicago":
      return `${source.authors}. "${source.articleTitle}." *${source.journalName}* ${source.volume}, no. ${source.issue || "1"} (${source.year}): ${source.pages}.`;
    case "harvard":
      return `${authors} (${source.year}) '${source.articleTitle}', *${source.journalName}*, ${source.volume}(${source.issue || "1"}), pp. ${source.pages}.`;
    default:
      return "";
  }
}

function generateWebsiteCitation(source: WebsiteSource, style: CitationStyle): string {
  const authors = source.authors ? formatAuthorsAPA(source.authors) : source.websiteName;
  
  switch (style) {
    case "apa":
      return `${authors}. (${source.publishDate || "n.d."}). *${source.pageTitle}*. ${source.websiteName}. Retrieved ${source.accessDate}, from ${source.url}`;
    case "mla":
      return `"${source.pageTitle}." *${source.websiteName}*, ${source.url}. Accessed ${source.accessDate}.`;
    case "chicago":
      return `${authors}. "${source.pageTitle}." ${source.websiteName}. Accessed ${source.accessDate}. ${source.url}.`;
    case "harvard":
      return `${authors} (${source.publishDate || "n.d."}) *${source.pageTitle}*. Available at: ${source.url} (Accessed: ${source.accessDate}).`;
    default:
      return "";
  }
}

export default function CitationGenerator() {
  const [sourceType, setSourceType] = useState<SourceType>("book");
  const [style, setStyle] = useState<CitationStyle>("apa");
  const [citation, setCitation] = useState("");
  const [copied, setCopied] = useState(false);

  // Book source state
  const [book, setBook] = useState<BookSource>({
    authors: "",
    title: "",
    publisher: "",
    year: "",
    edition: "",
    location: "",
  });

  // Journal source state
  const [journal, setJournal] = useState<JournalSource>({
    authors: "",
    articleTitle: "",
    journalName: "",
    year: "",
    volume: "",
    issue: "",
    pages: "",
    doi: "",
  });

  // Website source state
  const [website, setWebsite] = useState<WebsiteSource>({
    authors: "",
    pageTitle: "",
    websiteName: "",
    url: "",
    accessDate: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    publishDate: "",
  });

  const generateCitation = () => {
    let result = "";
    switch (sourceType) {
      case "book":
        result = generateBookCitation(book, style);
        break;
      case "journal":
        result = generateJournalCitation(journal, style);
        break;
      case "website":
        result = generateWebsiteCitation(website, style);
        break;
    }
    setCitation(result);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <Label>Source Type</Label>
          <Select value={sourceType} onValueChange={(v) => setSourceType(v as SourceType)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="journal">Journal Article</SelectItem>
              <SelectItem value="website">Website</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Citation Style</Label>
          <Select value={style} onValueChange={(v) => setStyle(v as CitationStyle)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apa">APA 7th</SelectItem>
              <SelectItem value="mla">MLA 9th</SelectItem>
              <SelectItem value="chicago">Chicago</SelectItem>
              <SelectItem value="harvard">Harvard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={sourceType} onValueChange={(v) => setSourceType(v as SourceType)}>
        <TabsList>
          <TabsTrigger value="book">Book</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Author(s)</Label>
              <Input
                placeholder="Last, First (separate multiple with commas)"
                value={book.authors}
                onChange={(e) => setBook({ ...book, authors: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Book Title"
                value={book.title}
                onChange={(e) => setBook({ ...book, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Publisher</Label>
              <Input
                placeholder="Publisher Name"
                value={book.publisher}
                onChange={(e) => setBook({ ...book, publisher: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input
                placeholder="2024"
                value={book.year}
                onChange={(e) => setBook({ ...book, year: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Edition (optional)</Label>
              <Input
                placeholder="2nd"
                value={book.edition}
                onChange={(e) => setBook({ ...book, edition: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Location (optional)</Label>
              <Input
                placeholder="New York, NY"
                value={book.location}
                onChange={(e) => setBook({ ...book, location: e.target.value })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Author(s)</Label>
              <Input
                placeholder="Last, First (separate multiple with commas)"
                value={journal.authors}
                onChange={(e) => setJournal({ ...journal, authors: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Article Title</Label>
              <Input
                placeholder="Article Title"
                value={journal.articleTitle}
                onChange={(e) => setJournal({ ...journal, articleTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Journal Name</Label>
              <Input
                placeholder="Journal of..."
                value={journal.journalName}
                onChange={(e) => setJournal({ ...journal, journalName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Input
                placeholder="2024"
                value={journal.year}
                onChange={(e) => setJournal({ ...journal, year: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Volume</Label>
              <Input
                placeholder="12"
                value={journal.volume}
                onChange={(e) => setJournal({ ...journal, volume: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Issue (optional)</Label>
              <Input
                placeholder="3"
                value={journal.issue}
                onChange={(e) => setJournal({ ...journal, issue: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Pages</Label>
              <Input
                placeholder="45-67"
                value={journal.pages}
                onChange={(e) => setJournal({ ...journal, pages: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>DOI (optional)</Label>
              <Input
                placeholder="10.1000/xyz123"
                value={journal.doi}
                onChange={(e) => setJournal({ ...journal, doi: e.target.value })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="website" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Author(s) (optional)</Label>
              <Input
                placeholder="Last, First"
                value={website.authors}
                onChange={(e) => setWebsite({ ...website, authors: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                placeholder="Article or Page Title"
                value={website.pageTitle}
                onChange={(e) => setWebsite({ ...website, pageTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Website Name</Label>
              <Input
                placeholder="Example.com"
                value={website.websiteName}
                onChange={(e) => setWebsite({ ...website, websiteName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                placeholder="https://example.com/page"
                value={website.url}
                onChange={(e) => setWebsite({ ...website, url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Access Date</Label>
              <Input
                placeholder="December 12, 2025"
                value={website.accessDate}
                onChange={(e) => setWebsite({ ...website, accessDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Publish Date (optional)</Label>
              <Input
                placeholder="2024"
                value={website.publishDate}
                onChange={(e) => setWebsite({ ...website, publishDate: e.target.value })}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={generateCitation}>Generate Citation</Button>

      {citation && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Generated Citation ({style.toUpperCase()})</Label>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              {copied ? (
                <Check className="h-4 w-4 mr-1" />
              ) : (
                <Copy className="h-4 w-4 mr-1" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <Textarea
            value={citation}
            readOnly
            className="min-h-[100px]"
          />
        </div>
      )}
    </div>
  );
}
