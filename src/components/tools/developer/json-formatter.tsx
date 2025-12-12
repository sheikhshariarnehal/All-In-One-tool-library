"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Check, Trash2 } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="input">Input JSON</Label>
          <Textarea
            id="input"
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="output">Output</Label>
            {output && (
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </div>
          <Textarea
            id="output"
            value={output}
            readOnly
            className="min-h-[300px] font-mono text-sm"
            placeholder="Formatted JSON will appear here..."
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          Error: {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={formatJson}>Format (Beautify)</Button>
        <Button variant="secondary" onClick={minifyJson}>
          Minify
        </Button>
        <Button variant="outline" onClick={clear}>
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
    </div>
  );
}
