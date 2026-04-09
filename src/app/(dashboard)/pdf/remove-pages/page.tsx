"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/pdf/FileUploadZone";
import {
  ArrowRight,
  Download,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react";
import { toast } from "sonner";

import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("@/components/pdf/DynamicPDFViewer"), {
  ssr: false,
});

export default function PDFRemovePagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("");

  const handleFilesAdded = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setNumPages(0);
      setSelectedPages(new Set());
      setDownloadUrl(null);
    } else {
      setFile(null);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const togglePageSelection = (pageIndex: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageIndex)) {
        next.delete(pageIndex);
      } else {
        next.add(pageIndex);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedPages.size === numPages) {
      setSelectedPages(new Set());
    } else {
      const all = new Set<number>();
      for (let i = 0; i < numPages; i++) {
        all.add(i);
      }
      setSelectedPages(all);
    }
  };

  const handleRemovePages = async () => {
    if (!file) return;

    if (selectedPages.size === 0) {
      toast.error("Please explicitly select at least one page to remove.");
      return;
    }

    if (selectedPages.size === numPages) {
      toast.error("You cannot remove every page from the document.");
      return;
    }

    setIsProcessing(true);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      // Send array of 0-indexed page indices
      formData.append("pages", JSON.stringify(Array.from(selectedPages)));

      const response = await fetch("/api/pdf/remove-pages", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "Processing failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, "");

      setDownloadUrl(url);
      setDownloadName(`${baseName}-edited.pdf`);
      toast.success("Pages removed successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
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
    setSelectedPages(new Set());
    setNumPages(0);
    setDownloadUrl(null);
    setDownloadName("");
  };

  // Convert File object to proper renderable type for react-pdf
  const fileToRender = useMemo(() => file ? file : null, [file]);

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-sora font-bold text-primary mb-3">
          Delete PDF Pages
        </h1>
        <p className="text-text-muted leading-relaxed">
          Remove unnecessary pages from your document. Click on the pages you want to delete.
        </p>
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        {!downloadUrl ? (
          <div className="p-6 sm:p-8 space-y-8">
            {!file ? (
              <FileUploadZone
                acceptedFormats={[".pdf", "application/pdf"]}
                maxFiles={1}
                maxSizeMB={20}
                onFilesSelected={handleFilesAdded}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <FileUploadZone
                      acceptedFormats={[".pdf", "application/pdf"]}
                      maxFiles={1}
                      maxSizeMB={20}
                      hideFileList
                      onFilesSelected={handleFilesAdded}
                    />
                    <div>
                      <h3 className="text-base font-semibold text-primary truncate max-w-[200px] sm:max-w-[300px]">
                        {file.name}
                      </h3>
                      <p className="text-xs text-text-muted">
                        {numPages > 0 ? `${numPages} Pages total` : "Loading pages..."}
                      </p>
                    </div>
                  </div>
                  
                  {numPages > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={handleSelectAll}
                      className="text-sm shrink-0"
                    >
                      {selectedPages.size === numPages ? "Deselect All" : "Select All"}
                    </Button>
                  )}
                </div>

                {/* Info banner */}
                <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg p-4">
                  <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-red-900 leading-relaxed">
                    <p>
                      <span className="font-semibold">Select pages to delete.</span>{" "}
                      Selected pages will be highlighted in red and removed from the final document.
                    </p>
                  </div>
                </div>

                {/* PDF Viewer Grid */}
                <PDFViewer
                  file={fileToRender}
                  numPages={numPages}
                  onLoadSuccess={onDocumentLoadSuccess}
                  selectedPages={selectedPages}
                  togglePageSelection={togglePageSelection}
                />

                {/* Footer Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border mt-8">
                  <div className="text-sm text-text-muted">
                    <span className="font-semibold text-primary">{selectedPages.size}</span> pages selected for deletion
                  </div>
                  <Button
                    onClick={handleRemovePages}
                    disabled={isProcessing || selectedPages.size === 0 || selectedPages.size === numPages}
                    className="px-8 h-12 text-base font-semibold bg-red-600 text-white hover:bg-red-700 shadow-md w-full sm:w-auto"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Remove {selectedPages.size} Pages
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── SUCCESS STATE ── */
          <div className="p-10 text-center space-y-6 bg-slate-50">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-sora font-bold text-primary">
                Pages Removed Successfully!
              </h3>
              <p className="text-sm text-text-muted max-w-md mx-auto">
                Your new document has been generated minus the selected pages.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
              <Button
                onClick={triggerDownload}
                className="px-8 h-12 text-base font-semibold bg-accent text-white hover:bg-accent/90 shadow-md"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Document
              </Button>
              <Button variant="outline" onClick={resetTool} className="h-12 border-border hover:bg-slate-100 bg-white">
                Edit Another File
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
