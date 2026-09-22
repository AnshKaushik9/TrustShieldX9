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

const globalForReviewStore = global as unknown as { reviewStore: { tasks: ReviewTask[] } };

export const reviewStore = globalForReviewStore.reviewStore || {
  tasks: []
};

if (process.env.NODE_ENV !== "production") {
  globalForReviewStore.reviewStore = reviewStore;
}
