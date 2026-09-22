import { NextResponse } from "next/server";
import { extensionStore, ExtensionScanEvent } from "@/lib/services/extensionSyncStore";

const DASHBOARD_URL = process.env.VITE_DASHBOARD_URL || "http://localhost:3000";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Get current state for the Dashboard
export async function GET() {
  // Auto-disconnect if heartbeat is too old (> 15 seconds)
  const now = new Date().getTime();
  if (extensionStore.lastHeartbeat) {
    const last = new Date(extensionStore.lastHeartbeat).getTime();
    if (now - last > 15000) {
      extensionStore.isConnected = false;
      extensionStore.currentUrl = null;
    }
  }

  return NextResponse.json(extensionStore, { headers: corsHeaders });
}

// Update state from the Extension
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.type === "HEARTBEAT") {
      extensionStore.isConnected = true;
      extensionStore.lastHeartbeat = new Date().toISOString();
      extensionStore.currentUrl = body.url || null;
    } 
    else if (body.type === "SCAN_RESULT") {
      extensionStore.isConnected = true;
      extensionStore.lastHeartbeat = new Date().toISOString();
      extensionStore.currentUrl = body.url || null;

      let safeHostname = "Unknown";
      try {
        if (body.url) {
          safeHostname = new URL(body.url).hostname;
        }
      } catch {
        safeHostname = body.url || "Unknown";
      }

      const event: ExtensionScanEvent = {
        id: crypto.randomUUID(),
        url: body.url,
        website: body.website || safeHostname,
        timestamp: new Date().toISOString(),
        authenticityScore: body.authenticityScore,
        confidence: body.confidence,
        prediction: body.prediction,
        status: body.reviewRequired ? "PENDING_REVIEW" : "COMPLETED"
      };

      if (body.reviewRequired) {
        fetch(`${DASHBOARD_URL}/api/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: event.id,
            source: "Live Web Guardian",
            aiDecision: event.prediction,
            confidence: event.confidence,
            priority: "High",
            thumbnail: body.thumbnail,
            payload: event
          })
        }).catch(() => {});
      } else {
        // Log auto-approved LWG scans in the real data flow
        fetch(`${DASHBOARD_URL}/api/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: event.id,
            source: "Live Web Guardian",
            aiDecision: event.prediction,
            confidence: event.confidence,
            priority: "Low",
            thumbnail: body.thumbnail,
            payload: event
          })
        }).then(() => {
          fetch(`${DASHBOARD_URL}/api/reviews`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: event.id,
              reviewer: "Auto Review",
              finalDecision: event.prediction,
              decisionAction: "Auto"
            })
          });
        }).catch(() => {});
      }

      // Keep only last 50
      extensionStore.history.unshift(event);
      if (extensionStore.history.length > 50) {
        extensionStore.history.pop();
      }
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: corsHeaders });
  }
}

// Allow CORS for the extension
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
