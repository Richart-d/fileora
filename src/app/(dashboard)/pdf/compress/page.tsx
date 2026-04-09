"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/pdf/FileUploadZone";
import {
  ArrowRight,
  Download,
  Loader2,
  FileArchive,
  CheckCircle2,
  Info,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type CompressionLevel = "low" | "medium" | "high";

export default function PDFCompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [isCompressing, setIsCompressing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("");
  
  // Stats
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const handleFilesAdded = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsCompressing(true);
    setDownloadUrl(null);
    setOriginalSize(file.size);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("level", level);

      const response = await fetch("/api/pdf/compress", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "Compression failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, "");

      setCompressedSize(blob.size);
      setDownloadUrl(url);
      setDownloadName(`${baseName}-compressed.pdf`);
      
      // If the file actually grew (which can happen on already highly compressed PDFs using object streams), warn them
      if (blob.size >= file.size) {
        toast.info("Your file is already highly optimized! We couldn't reduce the size further.");
      } else {
        toast.success("PDF compressed successfully!");
      }

    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Compression failed. Please try again.");
    } finally {
      setIsCompressing(false);
    }
  };

  const triggerDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetTool = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setDownloadUrl(null);
    setDownloadName("");
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const calculateSavings = () => {
    if (!originalSize || !compressedSize || compressedSize >= originalSize) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-sora font-bold text-primary mb-3">
          Compress PDF
        </h1>
        <p className="text-text-muted leading-relaxed">
          Reduce the file size of your PDF documents quickly and securely without losing visible quality.
        </p>
      </div>

      <div className="bg-white border border-border rounded-xl p-6 sm:p-8 shadow-sm">
        {!downloadUrl ? (
          <div className="space-y-8">
            <div className="flex items-start gap-3 bg-slate-50 border border-border rounded-lg p-4">
              <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="text-sm text-text-muted leading-relaxed">
                <p>
                  <span className="font-semibold text-primary">How optimization works:</span>{" "}
                  We safely trim unused PDF metadata, flatten interactive forms to static layers, and compress internal object streams to save bytes. Images themselves are safely preserved entirely!
                </p>
              </div>
            </div>

            {!file ? (
              <FileUploadZone
                acceptedFormats={[".pdf", "application/pdf"]}
                maxFiles={1}
                maxSizeMB={20}
                onFilesSelected={handleFilesAdded}
              />
            ) : (
              <div className="space-y-8">
                {/* File Preview */}
                <FileUploadZone
                  acceptedFormats={[".pdf", "application/pdf"]}
                  maxFiles={1}
                  maxSizeMB={20}
                  onFilesSelected={handleFilesAdded}
                />

                {/* Compression Level Selector */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-primary">
                    Compression Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setLevel("low")}
                      className={cn(
                        "p-4 rounded-lg border-2 text-left transition-all",
                        level === "low"
                          ? "border-accent bg-teal-50/50 shadow-sm"
                          : "border-border hover:border-accent/50 bg-white"
                      )}
                    >
                      <span className={cn("text-sm font-bold block mb-1", level === "low" ? "text-accent" : "text-primary")}>
                        Standard
                      </span>
                      <span className="text-[11px] text-text-muted block leading-snug">
                        Fastest. Object stream compression. Good for clean layout files.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLevel("medium")}
                      className={cn(
                        "p-4 rounded-lg border-2 text-left transition-all",
                        level === "medium"
                          ? "border-accent bg-teal-50/50 shadow-sm"
                          : "border-border hover:border-accent/50 bg-white"
                      )}
                    >
                      <span className={cn("text-sm font-bold block mb-1", level === "medium" ? "text-accent" : "text-primary")}>
                        Recommended
                      </span>
                      <span className="text-[11px] text-text-muted block leading-snug">
                        Flattens forms + object streams. Balance of speed and savings.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLevel("high")}
                      className={cn(
                        "p-4 rounded-lg border-2 text-left transition-all",
                        level === "high"
                          ? "border-accent bg-teal-50/50 shadow-sm"
                          : "border-border hover:border-accent/50 bg-white"
                      )}
                    >
                      <span className={cn("text-sm font-bold block mb-1 relative", level === "high" ? "text-accent" : "text-primary")}>
                        Maximum Check
                      </span>
                      <span className="text-[11px] text-text-muted block leading-snug">
                        Strips all metadata and purges orphaned objects safely. Highly effective for edited files!
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <Button
                    onClick={handleCompress}
                    disabled={isCompressing}
                    className="px-8 h-12 text-base font-semibold bg-accent text-white hover:bg-accent/90 shadow-md w-full sm:w-auto min-w-[220px]"
                  >
                    {isCompressing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Crunching PDF...
                      </>
                    ) : (
                      <>
                        <FileArchive className="w-5 h-5 mr-2" />
                        Compress PDF
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                {isCompressing && (
                  <div className="space-y-2 mt-4 max-w-sm mx-auto">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-accent rounded-full animate-progress-indeterminate" />
                    </div>
                    <p className="text-xs text-text-muted text-center">
                      Optimizing and rebuilding file vectors...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ── SUCCESS STATE ── */
          <div className="text-center space-y-6 py-6">
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-sora font-semibold text-primary">
                Optimization Complete!
              </h3>
            </div>

            {/* Savings Display */}
            <div className="bg-slate-50 rounded-xl p-6 border border-border inline-block min-w-[280px]">
              <div className="grid grid-cols-2 gap-8 divide-x divide-border">
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Original</p>
                  <p className="text-xl font-sora font-bold text-primary">{formatSize(originalSize)}</p>
                </div>
                <div className="pl-8">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Compressed</p>
                  <p className="text-xl font-sora font-bold text-accent">{formatSize(compressedSize)}</p>
                </div>
              </div>
              
              {calculateSavings() > 0 ? (
                <div className="mt-5 pt-5 border-t border-border flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <p className="text-sm font-semibold text-primary">
                    You saved <span className="text-accent">{calculateSavings()}%</span>!
                  </p>
                </div>
              ) : (
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="text-sm text-text-muted font-medium">
                    This file was already highly optimized.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
              <Button
                onClick={triggerDownload}
                className="px-8 h-12 text-base font-semibold bg-accent text-white hover:bg-accent/90 shadow-md"
              >
                <Download className="w-5 h-5 mr-2" />
                Download {downloadName}
              </Button>
              <Button variant="outline" onClick={resetTool} className="h-12">
                Compress Another File
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
