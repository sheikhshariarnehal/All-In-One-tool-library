"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  FileUp, 
  Download, 
  Trash2, 
  FileText, 
  Loader2,
  CheckCircle,
  Minimize2,
  Image,
  Settings
} from "lucide-react";

interface UploadedFile {
  file: File;
  id: string;
  status: "pending" | "compressing" | "done" | "error";
  originalSize: number;
  compressedSize?: number;
  progress?: number;
}

type CompressionLevel = "low" | "medium" | "high" | "extreme";

export default function PDFCompressor() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("medium");
  const [imageQuality, setImageQuality] = useState([80]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles
      .filter((f) => f.type === "application/pdf")
      .map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: "pending" as const,
        originalSize: file.size,
      }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getCompressionRatio = (original: number, compressed: number): number => {
    return Math.round((1 - compressed / original) * 100);
  };

  const handleCompress = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);

    // Simulate compression for each file
    for (const file of files) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: "compressing" as const, progress: 0 } : f
        )
      );

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, progress: i } : f
          )
        );
      }

      // Calculate simulated compressed size based on compression level
      const compressionRatios = {
        low: 0.85,
        medium: 0.6,
        high: 0.4,
        extreme: 0.25,
      };

      const compressedSize = Math.round(
        file.originalSize * compressionRatios[compressionLevel]
      );

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? { ...f, status: "done" as const, compressedSize, progress: 100 }
            : f
        )
      );
    }

    setIsProcessing(false);
  };

  const handleDownloadAll = () => {
    // In production, this would trigger actual downloads
    alert("In production, compressed PDFs would be downloaded here.");
  };

  const pendingFiles = files.filter((f) => f.status === "pending").length;
  const completedFiles = files.filter((f) => f.status === "done").length;
  const totalSaved = files
    .filter((f) => f.status === "done" && f.compressedSize)
    .reduce((acc, f) => acc + (f.originalSize - (f.compressedSize || 0)), 0);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200
              ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
            `}
          >
            <input {...getInputProps()} />
            <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? "Drop your PDFs here" : "Drag & drop PDF files here"}
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to browse from your computer
            </p>
            <Button variant="secondary">Select PDFs</Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Compression Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Compression Level</Label>
              <Select
                value={compressionLevel}
                onValueChange={(v) => setCompressionLevel(v as CompressionLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Faster, Larger File)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="high">High (Smaller File)</SelectItem>
                  <SelectItem value="extreme">Extreme (Smallest File)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image Quality: {imageQuality[0]}%
              </Label>
              <Slider
                value={imageQuality}
                onValueChange={setImageQuality}
                min={20}
                max={100}
                step={5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Files ({files.length})
              </CardTitle>
              {completedFiles > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Saved {formatSize(totalSaved)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30"
                >
                  <FileText className="h-8 w-8 text-red-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.file.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatSize(file.originalSize)}</span>
                      {file.status === "done" && file.compressedSize && (
                        <>
                          <span>→</span>
                          <span className="text-green-600 font-medium">
                            {formatSize(file.compressedSize)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            -{getCompressionRatio(file.originalSize, file.compressedSize)}%
                          </Badge>
                        </>
                      )}
                    </div>
                    {file.status === "compressing" && (
                      <Progress value={file.progress} className="h-1 mt-2" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === "pending" && (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                    {file.status === "compressing" && (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    )}
                    {file.status === "done" && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file.id)}
                      disabled={file.status === "compressing"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            size="lg"
            onClick={handleCompress}
            disabled={isProcessing || pendingFiles === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Compressing...
              </>
            ) : (
              <>
                <Minimize2 className="mr-2 h-4 w-4" />
                Compress {pendingFiles > 0 ? `${pendingFiles} PDF${pendingFiles > 1 ? "s" : ""}` : "PDFs"}
              </>
            )}
          </Button>
          {completedFiles > 0 && (
            <Button size="lg" variant="secondary" onClick={handleDownloadAll}>
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          )}
        </div>
      )}

      {/* Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Secure & Private</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">Free</div>
              <div className="text-sm text-muted-foreground">No Registration</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">Fast</div>
              <div className="text-sm text-muted-foreground">Cloud Processing</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
