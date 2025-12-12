"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface Match {
  match: string;
  index: number;
  groups?: string[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pattern || !testString) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      const flagStr = Object.entries(flags)
        .filter(([, enabled]) => enabled)
        .map(([flag]) => flag)
        .join("");

      const regex = new RegExp(pattern, flagStr);
      const results: Match[] = [];

      if (flags.g) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      setMatches(results);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid regex pattern");
      setMatches([]);
    }
  }, [pattern, flags, testString]);

  const highlightMatches = () => {
    if (!matches.length || !testString) return testString;

    let result = testString;
    let offset = 0;

    matches.forEach((m) => {
      const start = m.index + offset;
      const end = start + m.match.length;
      const before = result.slice(0, start);
      const match = result.slice(start, end);
      const after = result.slice(end);
      result = `${before}【${match}】${after}`;
      offset += 2; // Account for added brackets
    });

    return result;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pattern">Regular Expression</Label>
        <div className="flex gap-2">
          <span className="flex items-center text-muted-foreground">/</span>
          <Input
            id="pattern"
            placeholder="Enter regex pattern..."
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="font-mono"
          />
          <span className="flex items-center text-muted-foreground">/</span>
          <span className="flex items-center font-mono text-sm">
            {Object.entries(flags)
              .filter(([, enabled]) => enabled)
              .map(([flag]) => flag)
              .join("")}
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        {Object.entries(flags).map(([flag, enabled]) => (
          <div key={flag} className="flex items-center gap-2">
            <Switch
              id={`flag-${flag}`}
              checked={enabled}
              onCheckedChange={(checked) =>
                setFlags((prev) => ({ ...prev, [flag]: checked }))
              }
            />
            <Label htmlFor={`flag-${flag}`} className="font-mono">
              {flag} ({flag === "g" ? "global" : flag === "i" ? "case-insensitive" : "multiline"})
            </Label>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="test-string">Test String</Label>
        <Textarea
          id="test-string"
          placeholder="Enter text to test against..."
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="min-h-[150px]"
        />
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          Error: {error}
        </div>
      )}

      <div className="space-y-2">
        <Label>Results</Label>
        <div className="p-4 bg-muted rounded-md">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{matches.length} matches</Badge>
          </div>

          {matches.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-mono whitespace-pre-wrap">
                {highlightMatches()}
              </p>
              <div className="mt-4 space-y-2">
                {matches.map((m, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-muted-foreground">Match {i + 1}:</span>{" "}
                    <span className="font-mono bg-primary/20 px-1 rounded">
                      {m.match}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      at index {m.index}
                    </span>
                    {m.groups && m.groups.length > 0 && (
                      <span className="text-muted-foreground ml-2">
                        groups: [{m.groups.join(", ")}]
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
