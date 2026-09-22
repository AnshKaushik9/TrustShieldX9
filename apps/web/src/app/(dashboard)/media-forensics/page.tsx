"use client";

import { useState } from "react";
import { UploadZone } from "@/features/media-forensics/UploadZone";
import { MediaPreview } from "@/features/media-forensics/MediaPreview";
import { AnalysisSettings } from "@/features/media-forensics/AnalysisSettings";
import { AnalysisProgress } from "@/features/media-forensics/AnalysisProgress";
import { ResultHeader } from "@/features/media-forensics/ResultHeader";
import { ConfidenceBreakdown } from "@/features/media-forensics/ConfidenceBreakdown";
import { ArtifactCard } from "@/features/media-forensics/ArtifactCard";
import { MetadataPanel } from "@/features/media-forensics/MetadataPanel";
import { AnalysisExplanation } from "@/features/media-forensics/AnalysisExplanation";
import { ReportPanel } from "@/features/media-forensics/ReportPanel";
import { mediaForensicsService, ForensicsReport } from "@/lib/services/mediaForensicsService";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

import { HumanValidationPrompt } from "@/features/media-forensics/HumanValidationPrompt";
import { ReviewPanel } from "@/features/media-forensics/ReviewPanel";
import { HumanValidation } from "@/lib/services/reviewSyncStore";

type WorkflowState = "IDLE" | "FILE_SELECTED" | "ANALYZING" | "HUMAN_VALIDATION_PROMPT" | "REVIEW_PANEL" | "RESULTS_READY" | "ERROR";

export default function MediaForensicsPage() {
  const [state, setState] = useState<WorkflowState>("IDLE");
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [report, setReport] = useState<ForensicsReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelected = async (selectedFile: File) => {
    try {
      setFile(selectedFile);
      setState("FILE_SELECTED");
      const res = await mediaForensicsService.uploadMedia(selectedFile);
      setJobId(res.jobId);
    } catch (e) {
      const err = e as Error;
      setErrorMessage(err?.message || "Upload failed. Please try again.");
      setState("ERROR");
    }
  };

  const handleReplaceFile = () => {
    setFile(null);
    setJobId(null);
    setReport(null);
    setErrorMessage(null);
    setState("IDLE");
  };

  const handleAnalyze = async (config: { mode: string; threshold: number }) => {
    if (!jobId) return;
    try {
      setState("ANALYZING");
      await mediaForensicsService.analyzeMedia(jobId, config);
    } catch (e) {
      const err = e as Error;
      setErrorMessage(err?.message || "Analysis failed. Please try again.");
      setState("ERROR");
    }
  };

  const handleAnalysisComplete = async () => {
    if (!jobId || !file) return;
    try {
      const result = await mediaForensicsService.getResults(jobId, file);
      setReport(result);
      setState("HUMAN_VALIDATION_PROMPT");
    } catch (e) {
      const err = e as Error;
      setErrorMessage(err?.message || "Failed to retrieve results. Please try again.");
      setState("ERROR");
    }
  };

  const handleSkipValidation = () => {
    if (!report) return;
    const finalReport = {
      ...report,
      humanValidation: {
        isReviewed: false,
        reviewer: "Auto Review",
        reviewTime: new Date().toISOString(),
        originalAiDecision: report.riskBadge,
        finalDecision: report.riskBadge,
        decisionAction: "Auto" as const
      }
    };
    setReport(finalReport);
    setState("RESULTS_READY");
  };

  const handleValidationSubmit = async (validation: HumanValidation) => {
    if (!report) return;
    
    // Create task in queue
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "Media Forensics",
          aiDecision: report.riskBadge,
          confidence: report.confidence,
          priority: validation.finalDecision !== report.riskBadge ? "High" : "Medium",
          payload: { jobId }
        })
      });
    } catch (e) {
      console.error("Failed to post to review queue", e);
    }

    const finalReport = { ...report, humanValidation: validation };
    setReport(finalReport);
    setState("RESULTS_READY");
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Media Forensics</h1>
        <p className="text-text-muted mt-2">Analyze images and videos for AI-generated or manipulated content.</p>
      </div>

      <AnimatePresence mode="wait">
        {state === "IDLE" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UploadZone onFileSelected={handleFileSelected} />
          </motion.div>
        )}

        {state === "FILE_SELECTED" && file && (
          <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <MediaPreview file={file} onReplace={handleReplaceFile} />
            <AnalysisSettings onAnalyze={handleAnalyze} onReset={handleReplaceFile} />
          </motion.div>
        )}

        {state === "ANALYZING" && (
          <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <AnalysisProgress onComplete={handleAnalysisComplete} />
          </motion.div>
        )}

        {state === "HUMAN_VALIDATION_PROMPT" && report && (
          <motion.div key="validation-prompt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
            <HumanValidationPrompt 
              onSkip={handleSkipValidation} 
              onReviewRequired={() => setState("REVIEW_PANEL")} 
            />
          </motion.div>
        )}

        {state === "REVIEW_PANEL" && report && (
          <motion.div key="review-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto">
            <ReviewPanel 
              report={report} 
              onSubmit={handleValidationSubmit} 
            />
          </motion.div>
        )}

        {state === "RESULTS_READY" && report && file && jobId && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <ResultHeader 
              score={report.authenticityScore} 
              confidence={report.confidence} 
              riskBadge={report.riskBadge} 
              recommendation={report.recommendation} 
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-6">
                <ConfidenceBreakdown breakdown={report.breakdown} />
              </div>
              <div className="md:col-span-2 space-y-6">
                <ArtifactCard artifacts={report.artifacts} />
                <AnalysisExplanation 
                  explanation={report.explanation} 
                  isManipulated={report.riskBadge !== "Authentic"} 
                />
              </div>
            </div>

            <MetadataPanel metadata={report.metadata} />
            <ReportPanel report={report} file={file} />
            
            <div className="flex justify-center pt-8">
              <button onClick={handleReplaceFile} className="text-text-muted hover:text-text-secondary transition-colors text-sm font-medium underline underline-offset-4">
                Analyze Another File
              </button>
            </div>
          </motion.div>
        )}

        {state === "ERROR" && (
          <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-danger-bg text-danger-text rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Something went wrong</h2>
            <p className="text-text-muted mb-8 max-w-md">{errorMessage}</p>
            <button 
              onClick={handleReplaceFile}
              className="bg-muted hover:bg-surface-hover text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
