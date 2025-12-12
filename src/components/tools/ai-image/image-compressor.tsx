"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, Image as ImageIcon } from "lucide-react";

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState([80]);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [fileName, setFileName] = useState("");

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setCompressedImage(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const compressImage = useCallback(() => {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const compressed = canvas.toDataURL("image/jpeg", quality[0] / 100);
      setCompressedImage(compressed);

      // Calculate compressed size
      const base64Length = compressed.length - "data:image/jpeg;base64,".length;
      const bytes = Math.ceil((base64Length * 3) / 4);
      setCompressedSize(bytes);
    };
    img.src = originalImage;
  }, [originalImage, quality]);

  const downloadCompressed = () => {
    if (!compressedImage) return;

    const link = document.createElement("a");
    link.href = compressedImage;
    link.download = `compressed-${fileName}`;
    link.click();
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const savings = originalSize > 0 && compressedSize > 0
    ? ((1 - compressedSize / originalSize) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP up to 10MB
            </p>
          </div>
        </label>
      </div>

      {originalImage && (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Quality: {quality[0]}%</Label>
                <span className="text-sm text-muted-foreground">
                  Lower = smaller file
                </span>
              </div>
              <Slider
                value={quality}
                onValueChange={setQuality}
                min={10}
                max={100}
                step={5}
              />
            </div>

            <Button onClick={compressImage} className="w-full">
              <ImageIcon className="h-4 w-4 mr-2" />
              Compress Image
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Original ({formatSize(originalSize)})</Label>
              <div className="border rounded-lg p-2 bg-muted/30">
                <img
                  src={originalImage}
                  alt="Original"
                  className="max-w-full h-auto max-h-[300px] mx-auto object-contain"
                />
              </div>
            </div>

            {compressedImage && (
              <div className="space-y-2">
                <Label>
                  Compressed ({formatSize(compressedSize)}) -{" "}
                  <span className="text-green-600">{savings}% smaller</span>
                </Label>
                <div className="border rounded-lg p-2 bg-muted/30">
                  <img
                    src={compressedImage}
                    alt="Compressed"
                    className="max-w-full h-auto max-h-[300px] mx-auto object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {compressedImage && (
            <Button onClick={downloadCompressed} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Compressed Image
            </Button>
          )}
        </>
      )}
    </div>
  );
}
