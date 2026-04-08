"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileUploadZone } from "@/components/pdf/FileUploadZone";
import {
  ArrowRight,
  Download,
  Loader2,
  FileOutput,
  FileInput,
  CheckCircle2,
  Info,
} from "lucide-react";
import { toast } from "sonner";

const ACCEPTED_TO_PDF = [".docx", ".xlsx", ".xls", ".jpg", ".jpeg", ".png", ".html", ".htm"];

export default function PDFConvertPage() {
  /* ── Convert TO PDF state ── */
  const [toPdfFiles, setToPdfFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>("");

  const handleConvertToPdf = async () => {
    if (!toPdfFiles.length) return;

    const file = toPdfFiles[0];
    setIsConverting(true);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/pdf/convert-to", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "Conversion failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const outputName = file.name.replace(/\.[^/.]+$/, "") + ".pdf";

      setDownloadUrl(url);
      setDownloadName(outputName);
      toast.success("File converted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Conversion failed. Please try again."
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetToPdf = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setToPdfFiles([]);
    setDownloadUrl(null);
    setDownloadName("");
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Page Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-sora font-bold text-primary mb-3">
          PDF Converter
        </h1>
        <p className="text-text-muted leading-relaxed">
          Convert your documents, spreadsheets, images, and web pages to PDF — or
          extract content from existing PDFs.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="to-pdf" className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-12 mb-8">
          <TabsTrigger
            value="to-pdf"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <FileOutput className="w-4 h-4" />
            Convert TO PDF
          </TabsTrigger>
          <TabsTrigger
            value="from-pdf"
            className="flex items-center gap-2 text-sm font-medium"
            disabled
          >
            <FileInput className="w-4 h-4" />
            Convert FROM PDF
            <Badge
              variant="secondary"
              className="ml-1 text-[10px] px-1.5 py-0"
            >
              Soon
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ── CONVERT TO PDF TAB ── */}
        <TabsContent value="to-pdf">
          <div className="bg-white border border-border rounded-xl p-6 sm:p-8 shadow-sm">
            {/* Info banner */}
            <div className="flex items-start gap-3 bg-slate-50 border border-border rounded-lg p-4 mb-6">
              <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="text-sm text-text-muted leading-relaxed">
                <p>
                  <span className="font-semibold text-primary">
                    Supported formats:
                  </span>{" "}
                  DOCX, XLSX, JPG, PNG, HTML
                </p>
                <p className="mt-1">
                  Files are processed in memory and never stored on our servers.
                  Maximum file size: 10MB.
                </p>
              </div>
            </div>

            {/* Upload zone, Convert button, or Result */}
            {!downloadUrl ? (
              <div className="space-y-6">
                <FileUploadZone
                  acceptedFormats={ACCEPTED_TO_PDF}
                  maxFiles={1}
                  maxSizeMB={10}
                  onFilesSelected={setToPdfFiles}
                />

                {toPdfFiles.length > 0 && (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleConvertToPdf}
                      disabled={isConverting}
                      className="px-8 h-12 text-base font-semibold bg-accent text-white hover:bg-accent/90 shadow-md"
                    >
                      {isConverting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Converting...
                        </>
                      ) : (
                        <>
                          Convert to PDF
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Conversion progress bar */}
                {isConverting && (
                  <div className="space-y-2">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-accent rounded-full animate-progress-indeterminate" />
                    </div>
                    <p className="text-xs text-text-muted text-center">
                      Processing your file...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* ── SUCCESS STATE ── */
              <div className="text-center space-y-6 py-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-sora font-semibold text-primary">
                    Conversion Complete!
                  </h3>
                  <p className="text-sm text-text-muted max-w-sm">
                    Your file has been converted to PDF successfully. Click below
                    to download.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    onClick={handleDownload}
                    className="px-8 h-12 text-base font-semibold bg-accent text-white hover:bg-accent/90 shadow-md"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download {downloadName}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetToPdf}
                    className="h-12"
                  >
                    Convert Another File
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── CONVERT FROM PDF TAB (placeholder) ── */}
        <TabsContent value="from-pdf">
          <div className="bg-white border border-border rounded-xl p-8 shadow-sm text-center">
            <p className="text-text-muted">
              Convert FROM PDF is coming soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
