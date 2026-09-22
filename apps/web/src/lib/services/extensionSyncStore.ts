// Simple in-memory store for development/hackathon purposes to sync Extension with Dashboard

export interface ExtensionScanEvent {
  id: string;
  url: string;
  website: string;
  timestamp: string;
  authenticityScore: number;
  confidence: number;
  prediction: "Authentic" | "Suspicious" | "AI Generated";
  status?: "COMPLETED" | "PENDING_REVIEW";
}

export interface ExtensionStatus {
  isConnected: boolean;
  lastHeartbeat: string | null;
  currentUrl: string | null;
  history: ExtensionScanEvent[];
}

// Global variable to persist across hot reloads in dev mode
const globalForStore = global as unknown as { extensionStore: ExtensionStatus };

export const extensionStore: ExtensionStatus = globalForStore.extensionStore || {
  isConnected: false,
  lastHeartbeat: null,
  currentUrl: null,
  history: []
};

if (process.env.NODE_ENV !== "production") {
  globalForStore.extensionStore = extensionStore;
}
