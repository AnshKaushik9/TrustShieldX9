"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, UserCheck, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { ForensicsReport } from "@/lib/services/mediaForensicsService";
import { pdfGeneratorService } from "@/lib/services/pdfGeneratorService";

interface ReportPanelProps {
  report: ForensicsReport;
  file: File;
}

export function ReportPanel({ report, file }: ReportPanelProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    await pdfGeneratorService.generateAndDownloadReport(report, file);
    setIsDownloading(false);
  };

  return (
    <Card className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-500/20">
      <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-3">
              TrustShield AI Report
              {report.humanValidation?.isReviewed ? (
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                  <UserCheck className="w-3 h-3" /> AI + Human Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold bg-slate-500/20 text-text-secondary px-2 py-0.5 rounded border border-slate-500/30">
                  <CheckCircle2 className="w-3 h-3" /> AI Reviewed
                </span>
              )}
            </h3>
            <p className="text-sm text-text-muted">
              {file.name} • Job ID: {report.jobId}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleDownload} 
          disabled={isDownloading}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className={`w-4 h-4 mr-2 ${isDownloading ? 'animate-bounce' : ''}`} />
          {isDownloading ? 'Generating PDF...' : 'Download Full Report'}
        </Button>
      </CardContent>
    </Card>
  );
}
