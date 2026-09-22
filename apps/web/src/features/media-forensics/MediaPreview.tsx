"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileVideo, Image as ImageIcon } from "lucide-react";

interface MediaPreviewProps {
  file: File;
  onReplace: () => void;
}

export function MediaPreview({ file, onReplace }: MediaPreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const isVideo = file.type.startsWith('video/');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!objectUrl) return null;

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 bg-surface/30 p-6 rounded-xl border border-border">
      <div className="w-full md:w-2/3 bg-black rounded-lg overflow-hidden flex items-center justify-center border border-border min-h-[300px] relative group">
        {isVideo ? (
          <video 
            src={objectUrl} 
            controls 
            className="w-full h-full max-h-[500px] object-contain"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={objectUrl} 
            alt="Preview" 
            className="w-full h-full max-h-[500px] object-contain transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className="w-full md:w-1/3 flex flex-col justify-center space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            {isVideo ? <FileVideo className="w-5 h-5 mr-2 text-blue-400" /> : <ImageIcon className="w-5 h-5 mr-2 text-indigo-400" />}
            File Details
          </h3>
          <p className="text-sm text-text-muted mt-2 truncate pr-4" title={file.name}>
            {file.name}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-muted">Size</span>
            <span className="text-text-secondary font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-muted">Format</span>
            <span className="text-text-secondary font-medium uppercase">{file.name.split('.').pop()}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-text-muted">Type</span>
            <span className="text-text-secondary font-medium capitalize">{isVideo ? 'Video' : 'Image'}</span>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-4" onClick={onReplace}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Replace File
        </Button>
      </div>
    </div>
  );
}
