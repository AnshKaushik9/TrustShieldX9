"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bug, AlertTriangle, AlertCircle } from "lucide-react";
import { ForensicsArtifact } from "@/lib/services/mediaForensicsService";

interface ArtifactCardProps {
  artifacts: ForensicsArtifact[];
}

export function ArtifactCard({ artifacts }: ArtifactCardProps) {
  if (artifacts.length === 0) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical": return <AlertTriangle className="w-4 h-4 text-danger-text" />;
      case "High": return <AlertCircle className="w-4 h-4 text-warning-text" />;
      default: return <Bug className="w-4 h-4 text-text-muted" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "text-danger-text border-danger-border bg-danger-bg";
      case "High": return "text-warning-text border-warning-border bg-warning-bg";
      default: return "text-text-muted border-border-muted bg-muted";
    }
  };

  return (
    <Card className="bg-surface/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium flex items-center text-text-primary">
          <Bug className="w-4 h-4 mr-2 text-rose-400" />
          Detected Anomalies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {artifacts.map((artifact) => (
            <div key={artifact.id} className="p-4 rounded-lg border border-border bg-base flex gap-4">
              <div className="mt-1 flex-shrink-0">
                {getSeverityIcon(artifact.severity)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-text-primary leading-tight">{artifact.type}</h4>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getSeverityColor(artifact.severity)}`}>
                    {artifact.severity}
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  {artifact.explanation}
                </p>
                <div className="text-[10px] text-text-muted pt-1">
                  Confidence: <span className="font-medium text-text-secondary">{artifact.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
