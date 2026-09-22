import { NextResponse } from "next/server";
import { reviewStore, ReviewTask } from "@/lib/services/reviewSyncStore";

// GET /api/reviews - Get all reviews
export async function GET() {
  return NextResponse.json(reviewStore.tasks);
}

// POST /api/reviews - Create a new review
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const newTask: ReviewTask = {
      id: body.id || crypto.randomUUID(),
      source: body.source,
      aiDecision: body.aiDecision,
      confidence: body.confidence,
      priority: body.priority || "Medium",
      thumbnail: body.thumbnail,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      payload: body.payload
    };

    reviewStore.tasks.push(newTask);
    
    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// PUT /api/reviews - Complete a review
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const taskIndex = reviewStore.tasks.findIndex(t => t.id === body.id);
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    reviewStore.tasks[taskIndex] = {
      ...reviewStore.tasks[taskIndex],
      status: "COMPLETED",
      humanValidation: {
        isReviewed: true,
        reviewer: body.reviewer || "Admin",
        reviewTime: new Date().toISOString(),
        originalAiDecision: reviewStore.tasks[taskIndex].aiDecision,
        reviewerNotes: body.reviewerNotes,
        finalDecision: body.finalDecision,
        decisionAction: body.decisionAction
      }
    };

    return NextResponse.json(reviewStore.tasks[taskIndex]);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
