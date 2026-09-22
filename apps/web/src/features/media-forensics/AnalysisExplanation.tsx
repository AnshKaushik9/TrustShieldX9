"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlignLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { ForensicsExplanation } from "@/lib/services/mediaForensicsService";

interface AnalysisExplanationProps {
  explanation: ForensicsExplanation;
  isManipulated: boolean;
}

export function AnalysisExplanation({ explanation, isManipulated }: AnalysisExplanationProps) {
  return (
    <Card className="bg-surface/50">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle className="text-sm font-medium flex items-center text-text-primary">
          <AlignLeft className="w-4 h-4 mr-2 text-blue-400" />
          AI Forensic Explanation
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Executive Summary</h4>
          <p className="text-sm text-text-secondary leading-relaxed">{explanation.summary}</p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Key Findings</h4>
          <ul className="space-y-2">
            {explanation.keyFindings.map((finding, i) => (
              <li key={i} className="flex items-start text-sm text-text-secondary">
                <span className="mr-2 mt-0.5 text-slate-600">•</span>
                {finding}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Technical Evidence</h4>
          <div className="p-3 bg-base border border-border rounded-lg">
            <p className="text-sm font-mono text-text-muted leading-relaxed break-words whitespace-pre-wrap">
              {explanation.evidence}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <h4 className="text-sm font-bold text-text-primary">Final Verdict</h4>
          <div className={`flex items-center text-sm font-semibold ${isManipulated ? 'text-danger-text' : 'text-success-text'}`}>
            {isManipulated ? <ShieldAlert className="w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            {explanation.verdict}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
