export interface HumanValidation {
  isReviewed: boolean;
  reviewer: string;
  reviewTime: string;
  originalAiDecision: string;
  reviewerNotes?: string;
  finalDecision: string;
  decisionAction?: "Approve" | "Reject" | "Override" | "Auto";
}

export interface ReviewTask {
  id: string;
  source: "Media Forensics" | "Live Web Guardian";
  aiDecision: string;
  confidence: number;
  priority: "High" | "Medium" | "Low";
  thumbnail?: string;
  status: "PENDING" | "COMPLETED";
  createdAt: string;
  humanValidation?: HumanValidation;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapPrismaToReviewTask(task: any): ReviewTask {
  return {
    id: task.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source: task.source as any,
    aiDecision: task.aiDecision,
    confidence: task.confidence,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    priority: task.priority as any,
    thumbnail: task.thumbnail || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    status: task.status as any,
    createdAt: task.createdAt.toISOString(),
    payload: task.payload ? JSON.parse(task.payload) : undefined,
    humanValidation: task.isReviewed
      ? {
          isReviewed: true,
          reviewer: task.reviewer || "",
          reviewTime: task.reviewTime ? task.reviewTime.toISOString() : "",
          originalAiDecision: task.originalAiDecision || "",
          reviewerNotes: task.reviewerNotes || undefined,
          finalDecision: task.finalDecision || "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          decisionAction: task.decisionAction as any,
        }
      : undefined,
  };
}
