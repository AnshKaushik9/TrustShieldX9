"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, Clock } from "lucide-react";
import { ExtensionScanEvent } from "@/lib/services/extensionSyncStore";
import { motion, AnimatePresence } from "framer-motion";

interface ActivityTimelineProps {
  history: ExtensionScanEvent[];
}

export function ActivityTimeline({ history }: ActivityTimelineProps) {
  if (history.length === 0) {
    return (
      <Card className="bg-surface/50 border-border">
        <CardContent className="flex flex-col items-center justify-center h-48 text-text-muted">
          <Clock className="w-8 h-8 mb-2" />
          <p>No recent activity. Open a video to start scanning.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface/50 border-border overflow-hidden">
      <CardHeader className="bg-base border-b border-border pb-4">
        <CardTitle className="text-lg font-semibold text-text-primary flex items-center">
          <Clock className="w-5 h-5 mr-2 text-indigo-400" />
          Live Scanning History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-800/50 max-h-[500px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {history.map((event) => {
              const isManipulated = event.prediction !== "Authentic";
              
              return (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, y: -20, backgroundColor: "rgba(99, 102, 241, 0.2)" }}
                  animate={{ opacity: 1, y: 0, backgroundColor: "transparent" }}
                  className="p-4 hover:bg-base/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${isManipulated ? 'bg-danger-bg text-danger-text' : 'bg-success-bg text-success-text'}`}>
                      {isManipulated ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">{event.website}</h4>
                      <p className="text-xs text-text-muted truncate max-w-xs md:max-w-md" title={event.url}>{event.url}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-bold uppercase tracking-wider ${isManipulated ? 'text-danger-text' : 'text-success-text'}`}>
                      {event.prediction}
                    </div>
                    <div className="text-xs text-text-muted">
                      Score: {event.authenticityScore} • Conf: {event.confidence}%
                    </div>
                    <div className="text-[10px] text-slate-600 mt-1 flex justify-end gap-2 items-center">
                      <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                      {event.status === "PENDING_REVIEW" && (
                        <span className="bg-warning-bg text-warning-text px-1.5 py-0.5 rounded text-[9px] font-bold">
                          Pending Review
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
