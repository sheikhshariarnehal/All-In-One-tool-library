"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const encode = () => {
    try {
      setOutput(encodeURIComponent(input));
    } catch (e) {
      setOutput("Error: Could not encode the input");
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      setOutput("Error: Invalid URL-encoded string");
    }
  };

  const handleProcess = () => {
    if (mode === "encode") {
      encode();
    } else {
      decode();
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(v) => setMode(v as "encode" | "decode")}>
        <TabsList>
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="encode-input">Text to URL Encode</Label>
            <Textarea
              id="encode-input"
              placeholder="Enter text with special characters..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="decode" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="decode-input">URL to Decode</Label>
            <Textarea
              id="decode-input"
              placeholder="Enter URL-encoded string..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={handleProcess}>
        {mode === "encode" ? "URL Encode" : "URL Decode"}
      </Button>

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Result</Label>
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
            className="min-h-[150px] font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}
