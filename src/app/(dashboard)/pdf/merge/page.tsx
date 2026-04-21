"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/pdf/FileUploadZone";
import {
  ArrowRight,
  Download,
  Loader2,
  Combine,
  CheckCircle2,
  Info,
  File as FileIcon,
  X,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PDFMergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Drag and drop sorting state
  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles((prev) => {
      const combined = [...prev, ...newFiles];
      // FileUploadZone already limits maxFiles but if added via multiple selections:
      if (combined.length > 10) {
        toast.error("You can only merge up to 10 files at a time.");
        return combined.slice(0, 10);
      }
      return combined;
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // HTML5 Drag functions for sorting
  const handleDragStart = (index: number) => {
    dragItemIndex.current = index;
    setDraggedIndex(index);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverItemIndex.current = index;
    // Reorder array optimally during drag to provide live feedback
    if (
      dragItemIndex.current !== null &&
      dragItemIndex.current !== index
    ) {
      const newFiles = [...files];
      const draggedItem = newFiles[dragItemIndex.current];
      newFiles.splice(dragItemIndex.current, 1);
      newFiles.splice(index, 0, draggedItem);
      dragItemIndex.current = index;
      setFiles(newFiles);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error("Please add at least 2 files to merge.");
      return;
    }

    setIsMerging(true);
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/pdf/merge", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "Merge failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      toast.success("Files merged successfully!", {
        description: "Your combined PDF is ready for download.",
        action: {
          label: "Download",
          onClick: () => {
            const a = document.createElement("a");
            a.href = url;
            a.download = "merged-document.pdf";
            a.click();
          }
        }
      });
    } catch (err) {
      console.error(err);
      toast.error("Merge failed", { 
        description: err instanceof Error ? err.message : "An unknown error occurred during merge." 
      });
    } finally {
      setIsMerging(false);
    }
  };

  const triggerDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "merged-document.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetTool = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFiles([]);
    setDownloadUrl(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 max-w-4xl">
      <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-sora font-bold text-primary mb-3">
          Merge PDFs
        </h1>
        <p className="text-text-muted leading-relaxed">
          Combine multiple PDFs into a single, cohesive document. Drag to reorder
          files as needed before merging.
        </p>
      </div>

      <div className="bg-white border border-border rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-3 bg-slate-50 border border-border rounded-lg p-4 mb-6">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="text-sm text-text-muted leading-relaxed">
            <p>
              <span className="font-semibold text-primary">Merge details:</span>{" "}
              Up to 10 files. Drag files by the handle to change their position in the final output.
            </p>
          </div>
        </div>

        {!downloadUrl ? (
          <div className="space-y-6">
            {/* If UNDER 10 files limit, allow adding more */}
            {files.length < 10 && (
              <FileUploadZone
                acceptedFormats={[".pdf", "application/pdf"]}
                maxFiles={10 - files.length}
                maxSizeMB={10}
                hideFileList={true}
                onFilesSelected={handleFilesAdded}
              />
            )}

            {/* Render the Reorderable File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary mb-3">
                  Files to Merge ({files.length}/10)
                </h3>
                <div className="space-y-2">
                  {files.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragEnter={(e) => handleDragEnter(e, idx)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      className={cn(
                        "flex items-center justify-between p-3 bg-white border border-border rounded-lg shadow-sm group transition-opacity",
                        draggedIndex === idx && "opacity-50 border-accent border-dashed"
                      )}
                    >
                      <div className="flex items-center gap-3 overflow-hidden flex-1">
                        <button
                          type="button"
                          className="text-text-muted cursor-grab active:cursor-grabbing hover:text-primary shrink-0"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-5 h-5" />
                        </button>
                        <div className="w-6 h-6 rounded-md bg-teal-50 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-accent px-1.5">{idx + 1}</span>
                        </div>
                        <FileIcon className="w-4 h-4 text-text-muted shrink-0 ml-1" />
                        <div className="flex flex-col min-w-0 text-left flex-1 ml-1 cursor-default">
                          <span className="text-sm font-medium text-primary truncate max-w-[200px] sm:max-w-full">
                            {file.name}
                          </span>
                          <span className="text-xs text-text-muted mt-0.5">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="p-2 ml-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Merge Button */}
            {files.length > 0 && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleMerge}
                  disabled={isMerging || files.length < 2}
                  className="px-8 h-12 text-base font-semibold bg-accent text-white hover:bg-accent/90 shadow-md w-full sm:w-auto min-w-[220px]"
                >
                  {isMerging ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Merging...
                    </>
                  ) : (
                    <>
                      <Combine className="w-5 h-5 mr-2" />
                      Merge {files.length} Files
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {isMerging && (
              <div className="space-y-2 mt-4 max-w-sm mx-auto">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-accent rounded-full animate-progress-indeterminate" />
                </div>
                <p className="text-xs text-text-muted text-center">
                  Processing and uniting your files...
                </p>
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
                Merge Complete!
              </h3>
              <p className="text-sm text-text-muted max-w-md mx-auto">
                Your PDF files have been smoothly combined into a single document.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button
                onClick={triggerDownload}
                className="px-8 h-12 text-base font-semibold bg-accent text-white hover:bg-accent/90 shadow-md"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Merged PDF
              </Button>
              <Button variant="outline" onClick={resetTool} className="h-12">
                Merge More Files
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
