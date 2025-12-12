"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";

interface HashResult {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

async function generateHash(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<HashResult | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateHashes = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const [sha1, sha256, sha512] = await Promise.all([
        generateHash(input, "SHA-1"),
        generateHash(input, "SHA-256"),
        generateHash(input, "SHA-512"),
      ]);

      // MD5 is not supported by Web Crypto API, using a placeholder message
      setHashes({
        md5: "MD5 not available in browser (use server-side)",
        sha1,
        sha256,
        sha512,
      });
    } catch (e) {
      console.error("Hash generation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (hash: string, name: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(name);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const hashTypes = [
    { name: "SHA-1", key: "sha1" as keyof HashResult },
    { name: "SHA-256", key: "sha256" as keyof HashResult },
    { name: "SHA-512", key: "sha512" as keyof HashResult },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="input">Input Text</Label>
        <Textarea
          id="input"
          placeholder="Enter text to generate hashes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[150px]"
        />
      </div>

      <Button onClick={generateHashes} disabled={loading || !input.trim()}>
        {loading ? "Generating..." : "Generate Hashes"}
      </Button>

      {hashes && (
        <div className="space-y-4">
          {hashTypes.map(({ name, key }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{name}</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(hashes[key], key)}
                >
                  {copiedHash === key ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copiedHash === key ? "Copied!" : "Copy"}
                </Button>
              </div>
              <div className="p-3 bg-muted rounded-md font-mono text-sm break-all">
                {hashes[key]}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
