"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/pdf/FileUploadZone";
import {
  ArrowRight,
  Download,
  Loader2,
  FileOutput,
  FileInput,
  CheckCircle2,
  Info,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

const ACCEPTED_TO_PDF = [".docx", ".xlsx", ".xls", ".jpg", ".jpeg", ".png", ".html", ".htm"];

const FROM_PDF_FORMATS = [
  { id: "html", label: "HTML", description: "Web page with extracted text" },
  { id: "docx", label: "DOCX", description: "Word document (text only)" },
  { id: "jpg", label: "JPG", description: "Image snapshot of text" },
  { id: "png", label: "PNG", description: "Image snapshot of text" },
] as const;

type FromPdfFormat = (typeof FROM_PDF_FORMATS)[number]["id"];

export default function PDFConvertPage() {
  /* ── Convert TO PDF state ── */
  const [toPdfFiles, setToPdfFiles] = useState<File[]>([]);
  const [isToPdfConverting, setIsToPdfConverting] = useState(false);
  const [toPdfDownloadUrl, setToPdfDownloadUrl] = useState<string | null>(null);
  const [toPdfDownloadName, setToPdfDownloadName] = useState("");

  /* ── Convert FROM PDF state ── */
  const [fromPdfFiles, setFromPdfFiles] = useState<File[]>([]);
  const [fromPdfFormat, setFromPdfFormat] = useState<FromPdfFormat>("html");
  const [isFromPdfConverting, setIsFromPdfConverting] = useState(false);
  const [fromPdfDownloadUrl, setFromPdfDownloadUrl] = useState<string | null>(null);
  const [fromPdfDownloadName, setFromPdfDownloadName] = useState("");

  /* ═══════════════════════════════════════════
     CONVERT TO PDF
     ═══════════════════════════════════════════ */

  const handleConvertToPdf = async () => {
    if (!toPdfFiles.length) return;
    const file = toPdfFiles[0];
    setIsToPdfConverting(true);
    setToPdfDownloadUrl(null);

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
      setToPdfDownloadUrl(url);
      setToPdfDownloadName(outputName);
      toast.success("File converted successfully!", {
        description: "Your PDF is ready for download.",
        action: {
          label: "Download",
          onClick: () => triggerDownload(url, outputName)
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("Conversion failed", { 
        description: err instanceof Error ? err.message : "An unknown error occurred during conversion." 
      });
    } finally {
      setIsToPdfConverting(false);
    }
  };

  const resetToPdf = () => {
    if (toPdfDownloadUrl) URL.revokeObjectURL(toPdfDownloadUrl);
    setToPdfFiles([]);
    setToPdfDownloadUrl(null);
    setToPdfDownloadName("");
  };

  /* ═══════════════════════════════════════════
     CONVERT FROM PDF
     ═══════════════════════════════════════════ */

  const renderTextToCanvas = useCallback(
    (text: string, format: "jpg" | "png"): string => {
      const DPR = 2;
      const PAGE_W = 794 * DPR;
      const PAGE_H = 1123 * DPR;
      const MARGIN = 60 * DPR;
      const LINE_H = 18 * DPR;
      const FONT_SIZE = 12 * DPR;

      const canvas = document.createElement("canvas");
      canvas.width = PAGE_W;
      canvas.height = PAGE_H;
      const ctx = canvas.getContext("2d")!;

      // White background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, PAGE_W, PAGE_H);

      // Brand header stripe
      ctx.fillStyle = "#1E3A5F";
      ctx.fillRect(0, 0, PAGE_W, 6 * DPR);

      // Text
      ctx.fillStyle = "#1E293B";
      ctx.font = `${FONT_SIZE}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;

      const maxWidth = PAGE_W - 2 * MARGIN;
      let y = MARGIN + LINE_H;
      const lines = text.split("\n");

      for (const line of lines) {
        if (y > PAGE_H - MARGIN) break;

        if (line.trim() === "") {
          y += LINE_H * 0.5;
          continue;
        }

        // Word wrap
        const words = line.split(/\s+/);
        let currentLine = "";
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && currentLine) {
            ctx.fillText(currentLine, MARGIN, y);
            y += LINE_H;
            currentLine = word;
            if (y > PAGE_H - MARGIN) break;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine && y <= PAGE_H - MARGIN) {
          ctx.fillText(currentLine, MARGIN, y);
          y += LINE_H;
        }
      }

      // Watermark-style note at the bottom
      ctx.fillStyle = "#94A3B8";
      ctx.font = `${9 * DPR}px sans-serif`;
      ctx.fillText("Extracted from PDF by Fileora", MARGIN, PAGE_H - MARGIN * 0.5);

      return canvas.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 0.95);
    },
    []
  );

  const handleConvertFromPdf = async () => {
    if (!fromPdfFiles.length) return;
    const file = fromPdfFiles[0];
    setIsFromPdfConverting(true);
    setFromPdfDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", fromPdfFormat);

      const response = await fetch("/api/pdf/convert-from", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "Conversion failed");
      }

      const baseName = file.name.replace(/\.pdf$/i, "");
      let finalUrl = "";

      if (fromPdfFormat === "jpg" || fromPdfFormat === "png") {
        // Image format: server returns JSON with text, client renders to canvas
        const data = await response.json();
        const dataUrl = renderTextToCanvas(data.text, fromPdfFormat);

        // Convert data URL to blob URL
        const blob = await fetch(dataUrl).then((r) => r.blob());
        finalUrl = URL.createObjectURL(blob);
        setFromPdfDownloadUrl(finalUrl);
        setFromPdfDownloadName(`${baseName}.${fromPdfFormat}`);
      } else {
        // HTML / DOCX: server returns the file directly
        const blob = await response.blob();
        finalUrl = URL.createObjectURL(blob);
        setFromPdfDownloadUrl(finalUrl);
        setFromPdfDownloadName(`${baseName}.${fromPdfFormat}`);
      }

      toast.success("PDF converted successfully!", {
        description: `Your file has been extracted to ${fromPdfFormat.toUpperCase()}.`,
        action: {
          label: "Download",
          onClick: () => triggerDownload(finalUrl, `${baseName}.${fromPdfFormat}`)
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("Conversion failed", { 
        description: err instanceof Error ? err.message : "An unknown error occurred during conversion." 
      });
    } finally {
      setIsFromPdfConverting(false);
    }
  };

  const resetFromPdf = () => {
    if (fromPdfDownloadUrl) URL.revokeObjectURL(fromPdfDownloadUrl);
    setFromPdfFiles([]);
    setFromPdfDownloadUrl(null);
    setFromPdfDownloadName("");
  };

  /* ═══════════════════════════════════════════
     SHARED HELPERS
     ═══════════════════════════════════════════ */

  const triggerDownload = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-sora font-bold text-primary mb-3">
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
          >
            <FileInput className="w-4 h-4" />
            Convert FROM PDF
          </TabsTrigger>
        </TabsList>

        {/* ════════════════════════════════════
           CONVERT TO PDF TAB
           ════════════════════════════════════ */}
        <TabsContent value="to-pdf">
          <div className="bg-white border border-border rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-3 bg-slate-50 border border-border rounded-lg p-4 mb-6">
              <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="text-sm text-text-muted leading-relaxed">
                <p>
                  <span className="font-semibold text-primary">Supported formats:</span>{" "}
                  DOCX, XLSX, JPG, PNG, HTML
                </p>
                <p className="mt-1">
                  Files are processed in memory and never stored on our servers.
                  Maximum file size: 10MB.
                </p>
              </div>
            </div>

            {!toPdfDownloadUrl ? (
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
                      disabled={isToPdfConverting}
                      className="px-8 h-12 text-base font-semibold bg-accent text-white hover:bg-accent/90 shadow-md"
                    >
                      {isToPdfConverting ? (
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

                {isToPdfConverting && (
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
              <div className="text-center space-y-6 py-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-sora font-semibold text-primary">
                    Conversion Complete!
                  </h3>
                  <p className="text-sm text-text-muted max-w-sm">
                    Your file has been converted to PDF successfully.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    onClick={() => triggerDownload(toPdfDownloadUrl!, toPdfDownloadName)}
                    className="px-8 h-12 text-base font-semibold bg-accent text-white hover:bg-accent/90 shadow-md"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download {toPdfDownloadName}
                  </Button>
                  <Button variant="outline" onClick={resetToPdf} className="h-12">
                    Convert Another File
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ════════════════════════════════════
           CONVERT FROM PDF TAB
           ════════════════════════════════════ */}
        <TabsContent value="from-pdf">
          <div className="bg-white border border-border rounded-xl p-6 sm:p-8 shadow-sm">
            {/* Info banner */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900 leading-relaxed">
                <p className="font-semibold">Text-based extraction</p>
                <p className="mt-1">
                  This tool extracts text content from your PDF. Original formatting,
                  images, tables, and layout may not be fully preserved. Works best
                  with text-heavy documents.
                </p>
              </div>
            </div>

            {!fromPdfDownloadUrl ? (
              <div className="space-y-6">
                {/* Output format selector */}
                <div>
                  <label className="text-sm font-semibold text-primary block mb-3">
                    Output Format
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {FROM_PDF_FORMATS.map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setFromPdfFormat(fmt.id)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          fromPdfFormat === fmt.id
                            ? "border-accent bg-teal-50 shadow-sm"
                            : "border-border hover:border-accent/50 bg-white"
                        }`}
                      >
                        <span
                          className={`text-sm font-bold block ${
                            fromPdfFormat === fmt.id
                              ? "text-accent"
                              : "text-primary"
                          }`}
                        >
                          .{fmt.label}
                        </span>
                        <span className="text-[11px] text-text-muted block mt-0.5">
                          {fmt.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* File upload */}
                <FileUploadZone
                  acceptedFormats={[".pdf", "application/pdf"]}
                  maxFiles={1}
                  maxSizeMB={10}
                  onFilesSelected={setFromPdfFiles}
                />

                {fromPdfFiles.length > 0 && (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleConvertFromPdf}
                      disabled={isFromPdfConverting}
                      className="px-8 h-12 text-base font-semibold bg-accent text-white hover:bg-accent/90 shadow-md"
                    >
                      {isFromPdfConverting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Converting...
                        </>
                      ) : (
                        <>
                          Convert to .{fromPdfFormat.toUpperCase()}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {isFromPdfConverting && (
                  <div className="space-y-2">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-accent rounded-full animate-progress-indeterminate" />
                    </div>
                    <p className="text-xs text-text-muted text-center">
                      Extracting content from your PDF...
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
                    Extraction Complete!
                  </h3>
                  <p className="text-sm text-text-muted max-w-sm">
                    Your PDF has been converted to {fromPdfFormat.toUpperCase()} successfully.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    onClick={() => triggerDownload(fromPdfDownloadUrl!, fromPdfDownloadName)}
                    className="px-8 h-12 text-base font-semibold bg-accent text-white hover:bg-accent/90 shadow-md"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download {fromPdfDownloadName}
                  </Button>
                  <Button variant="outline" onClick={resetFromPdf} className="h-12">
                    Convert Another File
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
