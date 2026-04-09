"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Loader2, Trash2, CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

// Configure worker using CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface DynamicPDFViewerProps {
  file: File | null;
  numPages: number;
  onLoadSuccess: (data: { numPages: number }) => void;
  selectedPages: Set<number>;
  togglePageSelection: (index: number) => void;
}

export default function DynamicPDFViewer({
  file,
  numPages,
  onLoadSuccess,
  selectedPages,
  togglePageSelection,
}: DynamicPDFViewerProps) {
  return (
    <div className="bg-slate-50 border border-border rounded-xl p-4 sm:p-6 min-h-[300px] max-h-[600px] overflow-y-auto">
      <Document
        file={file}
        onLoadSuccess={onLoadSuccess}
        className="w-full flex justify-center"
        loading={
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-sm font-medium">Processing document...</p>
          </div>
        }
        error={
          <div className="text-center py-10 text-red-500">
            <p className="font-semibold mb-2">Failed to load PDF.</p>
            <p className="text-sm">The file may be corrupted or password protected.</p>
          </div>
        }
      >
        {numPages > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-4 w-full">
            {Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_${index + 1}`}
                onClick={() => togglePageSelection(index)}
                className={cn(
                  "relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all shadow-sm flex flex-col bg-white",
                  selectedPages.has(index)
                    ? "border-red-500 ring-2 ring-red-500/20"
                    : "border-border hover:border-slate-300 hover:shadow-md"
                )}
              >
                {/* Page thumbnail container */}
                <div className="relative aspect-[1/1.4] w-full bg-white flex items-center justify-center overflow-hidden pointer-events-none">
                  <Page
                    pageNumber={index + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    width={180} // Explicit small width for thumbnail speed
                    className="!absolute origin-top transform-gpu scale-100"
                  />
                  
                  {/* Selection overlay */}
                  {selectedPages.has(index) && (
                    <div className="absolute inset-0 bg-red-500/20 z-10 flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg transform scale-110">
                        <Trash2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Footer block */}
                <div className={cn(
                  "py-2 px-3 border-t flex items-center justify-between transition-colors",
                  selectedPages.has(index) ? "bg-red-50/50 border-red-200" : "bg-slate-50 border-border group-hover:bg-slate-100"
                )}>
                  <span className={cn(
                    "text-xs font-semibold",
                    selectedPages.has(index) ? "text-red-700" : "text-text-muted"
                  )}>
                    Page {index + 1}
                  </span>
                  {selectedPages.has(index) ? (
                    <CheckSquare className="w-4 h-4 text-red-500" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Document>
    </div>
  );
}
