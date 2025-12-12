"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check } from "lucide-react";

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
];

function generateWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
  }
  // Capitalize first word
  if (words.length > 0) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }
  return words.join(" ");
}

function generateSentence(): string {
  const wordCount = Math.floor(Math.random() * 10) + 8; // 8-17 words
  return generateWords(wordCount) + ".";
}

function generateParagraph(): string {
  const sentenceCount = Math.floor(Math.random() * 4) + 4; // 4-7 sentences
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
}

export default function LoremIpsum() {
  const [count, setCount] = useState("3");
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const num = parseInt(count) || 1;
    let result = "";

    switch (type) {
      case "paragraphs":
        const paragraphs: string[] = [];
        for (let i = 0; i < num; i++) {
          paragraphs.push(generateParagraph());
        }
        result = paragraphs.join("\n\n");
        break;
      case "sentences":
        const sentences: string[] = [];
        for (let i = 0; i < num; i++) {
          sentences.push(generateSentence());
        }
        result = sentences.join(" ");
        break;
      case "words":
        result = generateWords(num);
        break;
    }

    setOutput(result);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <Label htmlFor="count">Count</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-24"
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraphs">Paragraphs</SelectItem>
              <SelectItem value="sentences">Sentences</SelectItem>
              <SelectItem value="words">Words</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button onClick={generate}>Generate</Button>
        </div>
      </div>

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Generated Text</Label>
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
            value={output}
            readOnly
            className="min-h-[300px]"
          />
        </div>
      )}
    </div>
  );
}
