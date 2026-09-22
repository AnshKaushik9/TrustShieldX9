import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link2, Image as ImageIcon, ShieldAlert, CheckCircle2 } from "lucide-react";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ReviewTask } from "@/lib/services/reviewSyncStore";

type RiskLevel = "High" | "Medium" | "Low";

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case "High": return "text-danger-text";
    case "Medium": return "text-warning-text";
    case "Low": return "text-success-text";
    default: return "text-text-muted";
  }
};

export function RecentActivityFeed() {
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data: ReviewTask[] = await res.json();
          // Sort by newest first
          const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setTasks(sorted.slice(0, 5)); // show last 5
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <Card className="bg-surface/50 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium flex items-center text-text-primary">
          <ShieldAlert className="w-4 h-4 mr-2 text-rose-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {loading ? (
            <p className="text-sm text-text-muted text-center py-4">Loading activity...</p>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">No recent activity found.</p>
          ) : (
            tasks.map((task) => {
              const Icon = task.source === "Live Web Guardian" ? Link2 : ImageIcon;
              const isDeepfake = task.aiDecision === "Deepfake" || task.aiDecision === "High Risk";
              const resultText = isDeepfake ? "Flagged" : "Clean";
              
              return (
                <div key={task.id} className="flex items-start gap-4 group cursor-pointer">
                  <div className="mt-0.5 rounded-full bg-muted p-2 text-text-muted group-hover:bg-surface-hover group-hover:text-text-primary transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-text-primary truncate pr-2">
                        {task.payload?.jobId ? `Analysis Job ${task.payload.jobId.slice(0, 8)}` : task.source}
                      </p>
                      <span className="text-xs text-text-muted whitespace-nowrap">
                        {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${getRiskColor(task.priority)}`}>
                        {task.priority} Risk
                      </span>
                      <span className="text-slate-600 text-xs">•</span>
                      <span className="text-xs text-text-muted flex items-center">
                        {!isDeepfake ? (
                          <CheckCircle2 className="w-3 h-3 mr-1 text-success-text" />
                        ) : (
                          <ShieldAlert className="w-3 h-3 mr-1 text-danger-text" />
                        )}
                        {resultText}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
