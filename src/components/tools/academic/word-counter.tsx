"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface Stats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  speakingTime: string;
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState<Stats>({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: "0 min",
    speakingTime: "0 min",
  });

  useEffect(() => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setStats({
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: "0 min",
        speakingTime: "0 min",
      });
      return;
    }

    // Word count
    const words = trimmedText.split(/\s+/).filter((word) => word.length > 0).length;

    // Character counts
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;

    // Sentence count (rough estimate)
    const sentences = trimmedText.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    // Paragraph count
    const paragraphs = trimmedText.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

    // Reading time (average 200 words per minute)
    const readingMinutes = Math.ceil(words / 200);
    const readingTime = readingMinutes < 1 ? "< 1 min" : `${readingMinutes} min`;

    // Speaking time (average 150 words per minute)
    const speakingMinutes = Math.ceil(words / 150);
    const speakingTime = speakingMinutes < 1 ? "< 1 min" : `${speakingMinutes} min`;

    setStats({
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
    });
  }, [text]);

  const statCards = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading Time", value: stats.readingTime },
    { label: "Speaking Time", value: stats.speakingTime },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Enter your text</Label>
        <Textarea
          id="text"
          placeholder="Start typing or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[300px]"
        />
      </div>
    </div>
  );
}
