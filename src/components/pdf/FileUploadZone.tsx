"use client";

import React, { useState, useRef, useCallback } from "react";
import { UploadCloud, File as FileIcon, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  acceptedFormats?: string[];
  maxFiles?: number;
  maxSizeMB?: number;
  hideFileList?: boolean;
  onFilesSelected: (files: File[]) => void;
}

export function FileUploadZone({
  acceptedFormats = [],
  maxFiles = 1,
  maxSizeMB = 10,
  hideFileList = false,
  onFilesSelected,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      setError(null);
      let validFiles = [...newFiles];

      // Validate max files
      if (maxFiles === 1 && validFiles.length > 0) {
        validFiles = [validFiles[0]];
      }

      // Check size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      const oversizedFiles = validFiles.filter((f) => f.size > maxSizeBytes);
      if (oversizedFiles.length > 0) {
        setError(`Some files exceed the ${maxSizeMB}MB size limit.`);
        validFiles = validFiles.filter((f) => f.size <= maxSizeBytes);
      }

      // Check format
      if (acceptedFormats.length > 0) {
        const invalidFiles = validFiles.filter((file) => {
          return !acceptedFormats.some((format) => {
            if (format.startsWith(".")) {
              return file.name.toLowerCase().endsWith(format.toLowerCase());
            }
            if (format.endsWith("/*")) {
              return file.type.startsWith(format.replace("/*", ""));
            }
            return file.type === format;
          });
        });

        if (invalidFiles.length > 0) {
          setError("Some files have an invalid format.");
          validFiles = validFiles.filter((file) => !invalidFiles.includes(file));
        }
      }

      let updatedFiles = [...selectedFiles, ...validFiles];
      if (maxFiles === 1) {
        updatedFiles = validFiles;
      } else if (updatedFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files.`);
        updatedFiles = updatedFiles.slice(0, maxFiles);
      }

      setSelectedFiles(updatedFiles);
      onFilesSelected(updatedFiles);
    },
    [maxFiles, maxSizeMB, acceptedFormats, selectedFiles, onFilesSelected]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
    // reset input
    e.target.value = "";
  };

  const removeFile = (indexToRemove: number) => {
    const updated = selectedFiles.filter((_, i) => i !== indexToRemove);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "w-full p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center",
          isDragging
            ? "border-accent bg-teal-50"
            : "border-border hover:border-accent hover:bg-slate-50",
          selectedFiles.length > 0 && maxFiles === 1 ? "hidden" : "flex"
        )}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <UploadCloud
          className={cn(
            "w-10 h-10 mb-4 transition-colors",
            isDragging ? "text-accent" : "text-text-muted"
          )}
        />
        <h3 className="text-sm font-semibold text-primary mb-1">
          Click or drag files here
        </h3>
        <p className="text-xs text-text-muted mb-4 max-w-[250px] mx-auto leading-relaxed">
          Maximum file size: {maxSizeMB}MB
          {maxFiles > 1 && ` • Up to ${maxFiles} files`}
          <br />
          {acceptedFormats.length > 0 &&
            `Accepted formats: ${acceptedFormats.join(", ")}`}
        </p>

        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={handleChange}
          multiple={maxFiles > 1}
          accept={acceptedFormats.join(",")}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-3 text-red-500 text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {!hideFileList && selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-white border border-border rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileIcon className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-sm font-medium text-primary truncate max-w-[200px] sm:max-w-[400px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-text-muted">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {maxFiles === 1 && (
            <div className="mt-2 text-center">
              <button 
                type="button" 
                className="text-xs text-accent hover:underline font-medium"
                onClick={() => inputRef.current?.click()}
              >
                Replace file
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
