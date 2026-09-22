import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/reviews - Get all reviews
export async function GET() {
  const tasks = await db.reviewTask.findMany({
    orderBy: { createdAt: "desc" },
  });
  
  const parsedTasks = tasks.map(task => ({
    ...task,
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
  }));

  return NextResponse.json(parsedTasks);
}

// POST /api/reviews - Create a new review
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.source || !body.aiDecision) {
       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const newTask = await db.reviewTask.create({
      data: {
        id: body.id || crypto.randomUUID(),
        source: body.source,
        aiDecision: body.aiDecision,
        confidence: body.confidence || 0,
        priority: body.priority || "Medium",
        thumbnail: body.thumbnail,
        status: "PENDING",
        payload: body.payload ? JSON.stringify(body.payload) : null,
      }
    });

    return NextResponse.json({ ...newTask, payload: body.payload }, { status: 201 });
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// PUT /api/reviews - Complete a review
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
       return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const task = await db.reviewTask.findUnique({ where: { id: body.id } });
    
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updatedTask = await db.reviewTask.update({
      where: { id: body.id },
      data: {
        status: "COMPLETED",
        isReviewed: true,
        reviewer: body.reviewer || "Admin",
        reviewTime: new Date(),
        originalAiDecision: task.aiDecision,
        reviewerNotes: body.reviewerNotes,
        finalDecision: body.finalDecision,
        decisionAction: body.decisionAction
      }
    });

    return NextResponse.json(updatedTask);
  } catch (err) {
    console.error("PUT /api/reviews error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
