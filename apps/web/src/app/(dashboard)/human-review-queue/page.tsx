"use client";

import { useEffect, useState } from "react";
import { ReviewTask } from "@/lib/services/reviewSyncStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, User, Video, Globe } from "lucide-react";
import { ReviewModal } from "@/features/human-review-queue/ReviewModal";
import { motion, AnimatePresence } from "framer-motion";

export default function HumanReviewQueuePage() {
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<ReviewTask | null>(null);

  const fetchTasks = () => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => {
        setTasks(data);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const pendingTasks = tasks.filter(t => t.status === "PENDING");

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Human Review Queue</h1>
        <p className="text-text-muted mt-2">Manage and review flagged cases requiring human validation.</p>
      </div>

      {pendingTasks.length === 0 ? (
        <Card className="bg-surface border-border">
          <CardContent className="h-48 flex flex-col items-center justify-center text-text-muted">
            <User className="w-12 h-12 mb-4 text-slate-700" />
            <p>No pending review tasks in the queue.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {pendingTasks.map((task) => {
              const isManipulated = task.aiDecision !== "Authentic";
              const SourceIcon = task.source === "Media Forensics" ? Video : Globe;
              
              return (
                <motion.div key={task.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <Card className="bg-surface border-border overflow-hidden hover:border-indigo-500/50 transition-colors">
                    <CardHeader className="bg-base border-b border-border pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <SourceIcon className="w-4 h-4 text-indigo-400" />
                          <CardTitle className="text-sm font-semibold text-text-primary">{task.source}</CardTitle>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${task.priority === "High" ? "bg-danger-bg text-danger-text" : "bg-warning-bg text-warning-text"}`}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-text-muted">Case ID</span>
                        <span className="text-text-primary font-mono text-xs">{task.id.split("-")[0]}</span>
                      </div>
                      
                      {task.thumbnail && (
                        <div className="h-32 bg-black rounded-lg overflow-hidden border border-border relative">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={`data:image/jpeg;base64,${task.thumbnail}`} alt="Thumbnail" className="w-full h-full object-cover opacity-80" />
                        </div>
                      )}

                      <div className="flex items-center justify-between p-3 rounded-lg bg-base border border-border/50">
                        <div className="flex items-center gap-2">
                          {isManipulated ? <ShieldAlert className="w-5 h-5 text-danger-text" /> : <ShieldCheck className="w-5 h-5 text-success-text" />}
                          <span className={`font-bold ${isManipulated ? "text-danger-text" : "text-success-text"}`}>
                            {task.aiDecision}
                          </span>
                        </div>
                        <span className="text-text-muted text-sm">{task.confidence}% Conf.</span>
                      </div>

                      <button 
                        onClick={() => setSelectedTask(task)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition-colors mt-2"
                      >
                        Review Case
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {selectedTask && (
        <ReviewModal 
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onComplete={fetchTasks}
        />
      )}
    </div>
  );
}
