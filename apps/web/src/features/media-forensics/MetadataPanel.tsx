"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileCode2 } from "lucide-react";
import { ForensicsMetadata } from "@/lib/services/mediaForensicsService";

interface MetadataPanelProps {
  metadata: ForensicsMetadata;
}

export function MetadataPanel({ metadata }: MetadataPanelProps) {
  const fields = [
    { label: "File Size", value: metadata.fileSize },
    { label: "Format", value: metadata.format },
    { label: "Resolution", value: metadata.resolution || "Unavailable" },
    { label: "Duration", value: metadata.duration || "N/A" },
    { label: "FPS", value: metadata.fps ? `${metadata.fps} fps` : "N/A" },
    { label: "Creation Date", value: metadata.creationDate || "Stripped" },
  ];

  return (
    <Card className="bg-surface/50 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium flex items-center text-text-primary">
          <FileCode2 className="w-4 h-4 mr-2 text-indigo-400" />
          Extracted Metadata
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field, i) => (
            <div key={i} className="space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                {field.label}
              </div>
              <div className={`text-sm break-words ${field.value === 'Unavailable' || field.value === 'N/A' || field.value === 'Stripped' ? 'text-text-muted italic' : 'text-text-primary font-medium'}`}>
                {field.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
