"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fingerprint, ShieldAlert, ScanLine, Activity } from "lucide-react";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import { ReviewTask } from "@/lib/services/reviewSyncStore";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export function KpiCards() {
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const totalScanned = tasks.length;
  const deepfakesDetected = tasks.filter(t => t.aiDecision === "Deepfake" || t.aiDecision === "High Risk").length;
  const avgConfidence = totalScanned > 0 
    ? (tasks.reduce((sum, t) => sum + (t.confidence || 0), 0) / totalScanned).toFixed(1) 
    : "0.0";

  const kpiData = [
    {
      title: "Media Scanned",
      value: loading ? "..." : totalScanned.toString(),
      trend: totalScanned > 0 ? "Real data" : "No data",
      trendUp: totalScanned > 0,
      icon: Fingerprint,
      color: "text-blue-500",
    },
    {
      title: "Deepfakes Detected",
      value: loading ? "..." : deepfakesDetected.toString(),
      trend: deepfakesDetected > 0 ? "Real data" : "No data",
      trendUp: false,
      icon: ScanLine,
      color: "text-warning-text",
    },
    {
      title: "Threats Blocked",
      value: "0",
      trend: "Not Configured",
      trendUp: true,
      icon: ShieldAlert,
      color: "text-text-muted",
    },
    {
      title: "Avg. AI Confidence",
      value: loading ? "..." : `${avgConfidence}%`,
      trend: totalScanned > 0 ? "Real data" : "No data",
      trendUp: true,
      icon: Activity,
      color: "text-indigo-500",
    },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
    >
      {kpiData.map((kpi) => (
        <motion.div key={kpi.title} variants={item}>
          <Card className="group hover:border-border-muted transition-colors bg-surface/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-text-secondary">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">{kpi.value}</div>
              <p className={`text-xs mt-1 font-medium ${kpi.trendUp ? 'text-success-text' : 'text-text-muted'}`}>
                {kpi.trend}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
