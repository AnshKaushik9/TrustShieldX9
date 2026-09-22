export interface ForensicsArtifact {
  id: string;
  type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  confidence: number;
  explanation: string;
}

export interface ForensicsMetadata {
  resolution?: string;
  duration?: string;
  fps?: number;
  fileSize: string;
  format: string;
  creationDate?: string;
}

export interface ForensicsBreakdown {
  facialAnalysis: number;
  metadataIntegrity: number;
  compressionAnalysis: number;
  temporalConsistency: number;
  ganArtifacts: number;
}

export interface ForensicsExplanation {
  summary: string;
  keyFindings: string[];
  evidence: string;
  verdict: string;
}

import { HumanValidation } from "./reviewSyncStore";

export interface ForensicsReport {
  jobId: string;
  fileName: string;
  authenticityScore: number;
  confidence: number;
  riskBadge: "Authentic" | "Suspicious" | "AI Generated";
  recommendation: string;
  breakdown: ForensicsBreakdown;
  artifacts: ForensicsArtifact[];
  metadata: ForensicsMetadata;
  explanation: ForensicsExplanation;
  timestamp: string;
  humanValidation?: HumanValidation;
}

const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mediaForensicsService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uploadMedia: async (_file: File): Promise<{ jobId: string }> => {
    await mockDelay(800);
    return { jobId: `job_${Math.random().toString(36).substr(2, 9)}` };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  analyzeMedia: async (_jobId: string, _config: { mode: string; threshold: number }): Promise<void> => {
    // Simulated multi-step delay managed by the UI via setTimeout, here we just mock the request
    await mockDelay(1000);
  },

  getResults: async (jobId: string, file: File): Promise<ForensicsReport> => {
    await mockDelay(500);

    // Mock logic based on file type to show variation
    const isVideo = file.type.startsWith('video');
    const isManipulated = Math.random() > 0.5;

    return {
      jobId,
      fileName: file.name,
      authenticityScore: isManipulated ? 18 : 94,
      confidence: 96,
      riskBadge: isManipulated ? "AI Generated" : "Authentic",
      recommendation: isManipulated ? "Quarantine file and restrict sharing." : "File appears authentic. Safe to process.",
      breakdown: {
        facialAnalysis: isManipulated ? 12 : 98,
        metadataIntegrity: isManipulated ? 45 : 99,
        compressionAnalysis: 88,
        temporalConsistency: isVideo ? (isManipulated ? 34 : 95) : 100,
        ganArtifacts: isManipulated ? 99 : 2,
      },
      artifacts: isManipulated ? [
        {
          id: "1",
          type: "Lighting Inconsistency",
          severity: "High",
          confidence: 94,
          explanation: "Shadow trajectories on the subject's face do not align with the global light source."
        },
        {
          id: "2",
          type: "GAN Fingerprints",
          severity: "Critical",
          confidence: 98,
          explanation: "High-frequency noise patterns consistent with StyleGAN2 generation detected."
        }
      ] : [],
      metadata: {
        resolution: "1920x1080",
        duration: isVideo ? "00:02:14" : undefined,
        fps: isVideo ? 30 : undefined,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        format: file.type.toUpperCase(),
        creationDate: new Date().toISOString().split('T')[0],
      },
      explanation: {
        summary: isManipulated 
          ? "The provided media exhibits strong indications of algorithmic synthesis and manipulation." 
          : "The provided media passed all integrity checks and shows no signs of AI manipulation.",
        keyFindings: isManipulated 
          ? ["Facial blending anomalies detected.", "Inconsistent environmental lighting.", "Missing original EXIF data."]
          : ["Natural sensor noise profile confirmed.", "No structural warping detected.", "Metadata is consistent with device defaults."],
        evidence: isManipulated
          ? "Spectral analysis revealed deepfake signatures primarily localized around the facial region. Temporal frame-by-frame analysis showed unnatural eye-blink cadence."
          : "The error level analysis and discrete cosine transform coefficients align perfectly with a standard camera sensor pipeline without subsequent manipulation.",
        verdict: isManipulated ? "High Risk. Deepfake Confirmed." : "Safe. Authentic Media."
      },
      timestamp: new Date().toISOString()
    };
  }
};
