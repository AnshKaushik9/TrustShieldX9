"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileType, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
}

const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function UploadZone({ onFileSelected }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setError(null);
    if (!SUPPORTED_TYPES.includes(file.type)) {
      setError("Unsupported file format. Please upload PNG, JPG, WEBP, MP4, MOV, AVI, or MKV.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File exceeds maximum size of 50MB.");
      return;
    }
    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-[400px] border-2 border-dashed rounded-xl transition-all duration-200 ${
          isDragging 
            ? "border-blue-500 bg-blue-500/10" 
            : "border-border-muted bg-surface/50 hover:border-slate-500 hover:bg-surface"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.avi,.mkv"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center px-4 text-center cursor-pointer">
          <div className="p-4 rounded-full bg-muted/50 text-text-muted mb-4">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Drag and drop your media here
          </h3>
          <p className="text-sm text-text-muted mb-6 max-w-sm">
            Upload images or videos to run deepfake detection and integrity analysis.
          </p>
          <Button variant="secondary" className="px-8" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
            Browse Files
          </Button>
        </div>

        <div className="absolute bottom-6 left-0 w-full flex justify-center gap-4 text-xs font-medium text-text-muted uppercase tracking-wider">
          <span className="flex items-center"><FileType className="w-3 h-3 mr-1" /> PNG</span>
          <span className="flex items-center"><FileType className="w-3 h-3 mr-1" /> JPG</span>
          <span className="flex items-center"><FileType className="w-3 h-3 mr-1" /> MP4</span>
          <span className="flex items-center"><FileType className="w-3 h-3 mr-1" /> MOV</span>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 rounded-lg bg-danger-bg border border-danger-border flex items-center text-danger-text text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
}
