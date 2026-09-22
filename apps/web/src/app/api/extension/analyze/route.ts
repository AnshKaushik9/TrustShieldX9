import { NextResponse } from "next/server";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST() {
  // Mock logic to simulate analyzing a video frame
  // The extension sends a base64 JPEG, we return a mock forensic result
  
  // Fake processing delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const isManipulated = Math.random() > 0.6; // 40% chance of detecting fake

  return NextResponse.json({
    authenticityScore: isManipulated ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 10) + 90,
    confidence: Math.floor(Math.random() * 15) + 85,
    prediction: isManipulated ? "AI Generated" : "Authentic",
    message: isManipulated ? "Deepfake patterns detected in temporal flow." : "Frame appears authentic."
  }, { headers: corsHeaders });
}

// Allow CORS for the extension
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
