"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploadZone } from "@/components/pdf/FileUploadZone";
import {
  ArrowRight,
  Download,
  Loader2,
  Scissors,
  CheckCircle2,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export default function PDFSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState("");
  const [isSplitting, setIsSplitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("");

  const handleFilesAdded = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    
    if (!ranges.trim()) {
      toast.error("Please enter the pages you want to extract.");
      return;
    }

    setIsSplitting(true);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ranges", ranges);

      const response = await fetch("/api/pdf/split", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "Split failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, "");

      setDownloadUrl(url);
      setDownloadName(`${baseName}-split.pdf`);
      toast.success("PDF split successfully!", {
        description: "Your extracted PDF is ready for download.",
        action: {
          label: "Download",
          onClick: () => {
            const a = document.createElement("a");
            a.href = url;
            a.download = `${baseName}-split.pdf`;
            a.click();
          }
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("Split failed", { 
        description: err instanceof Error ? err.message : "An unknown error occurred during split." 
      });
    } finally {
      setIsSplitting(false);
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
    setRanges("");
    setDownloadUrl(null);
    setDownloadName("");
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-sora font-bold text-primary mb-3">
          Extract PDF Pages
        </h1>
        <p className="text-text-muted leading-relaxed">
          Split a large PDF file by extracting only the specific pages or page ranges you need.
        </p>
      </div>

      <div className="bg-white border border-border rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-4 bg-slate-50 border border-border rounded-lg p-5 mb-8">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5 hidden sm:block" />
          <div className="text-sm text-text-muted leading-relaxed w-full">
            <h4 className="font-semibold text-primary mb-1 flex items-center gap-2">
              <Info className="w-4 h-4 text-accent sm:hidden" />
              How to write page ranges
            </h4>
            <p className="mb-2">
              Use commas to separate page numbers and hyphens for ranges.
            </p>
            <ul className="space-y-1 bg-white border border-border p-3 rounded-md font-mono text-xs text-primary">
              <li><span className="font-semibold">1, 3, 5</span> &rarr; Extracts pages 1, 3, and 5</li>
              <li><span className="font-semibold">1-5</span> &rarr; Extracts pages 1 through 5</li>
              <li><span className="font-semibold">1-3, 5, 7-9</span> &rarr; Extracts 1-3, 5, and 7-9</li>
            </ul>
          </div>
        </div>

        {!downloadUrl ? (
          <div className="space-y-6">
            {!file ? (
              <FileUploadZone
                acceptedFormats={[".pdf", "application/pdf"]}
                maxFiles={1}
                maxSizeMB={10}
                onFilesSelected={handleFilesAdded}
              />
            ) : (
              <div className="space-y-6">
                {/* Uploaded file preview (reusing FileUploadZone in list mode essentially, or just keeping it active to allow replacement) */}
                <FileUploadZone
                  acceptedFormats={[".pdf", "application/pdf"]}
                  maxFiles={1}
                  maxSizeMB={10}
                  onFilesSelected={handleFilesAdded}
                />

                <div className="bg-white p-5 rounded-lg border-2 border-slate-100 shadow-sm space-y-3">
                  <label htmlFor="pages-input" className="block text-sm font-semibold text-primary">
                    Pages to Extract
                  </label>
                  <Input
                    id="pages-input"
                    type="text"
                    placeholder="e.g. 1-3, 5, 7-9"
                    value={ranges}
                    onChange={(e) => setRanges(e.target.value)}
                    autoComplete="off"
                    className="h-12 font-mono"
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleSplit}
                    disabled={isSplitting || !ranges.trim()}
                    className="px-8 h-12 text-base font-semibold bg-accent text-white hover:bg-accent/90 shadow-md w-full sm:w-auto min-w-[220px]"
                  >
                    {isSplitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Extracting Pages...
                      </>
                    ) : (
                      <>
                        <Scissors className="w-5 h-5 mr-2" />
                        Extract Pages
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                {isSplitting && (
                  <div className="space-y-2 mt-4 max-w-sm mx-auto">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-accent rounded-full animate-progress-indeterminate" />
                    </div>
                    <p className="text-xs text-text-muted text-center">
                      Extracting specified pages...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ── SUCCESS STATE ── */
          <div className="text-center space-y-6 py-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-sora font-semibold text-primary">
                Extraction Complete!
              </h3>
              <p className="text-sm text-text-muted max-w-md mx-auto">
                Your new PDF containing the selected pages is ready.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button
                onClick={triggerDownload}
                className="px-8 h-12 text-base font-semibold bg-accent text-white hover:bg-accent/90 shadow-md"
              >
                <Download className="w-5 h-5 mr-2" />
                Download {downloadName}
              </Button>
              <Button variant="outline" onClick={resetTool} className="h-12">
                Extract Another File
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
