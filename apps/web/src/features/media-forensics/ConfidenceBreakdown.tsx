"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";
import { ForensicsBreakdown } from "@/lib/services/mediaForensicsService";

interface ConfidenceBreakdownProps {
  breakdown: ForensicsBreakdown;
}

export function ConfidenceBreakdown({ breakdown }: ConfidenceBreakdownProps) {
  const metrics = [
    { label: "Facial Analysis", value: breakdown.facialAnalysis },
    { label: "Metadata Integrity", value: breakdown.metadataIntegrity },
    { label: "Compression Analysis", value: breakdown.compressionAnalysis },
    { label: "Temporal Consistency", value: breakdown.temporalConsistency },
    { label: "GAN Artifact Detection", value: breakdown.ganArtifacts },
  ];

  return (
    <Card className="bg-surface/50 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium flex items-center text-text-primary">
          <Activity className="w-4 h-4 mr-2 text-indigo-400" />
          Confidence Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {metrics.map((metric, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">{metric.label}</span>
                <span className="font-semibold text-text-primary">{metric.value}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className={`h-full rounded-full ${
                    metric.value < 40 ? "bg-red-500" : 
                    metric.value < 75 ? "bg-amber-500" : 
                    "bg-indigo-500"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
