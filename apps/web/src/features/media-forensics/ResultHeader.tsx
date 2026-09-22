"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CircularGauge } from "@/components/ui/circular-gauge";
import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface ResultHeaderProps {
  score: number;
  confidence: number;
  riskBadge: "Authentic" | "Suspicious" | "AI Generated";
  recommendation: string;
}

export function ResultHeader({ score, confidence, riskBadge, recommendation }: ResultHeaderProps) {
  const getBadgeConfig = () => {
    switch (riskBadge) {
      case "Authentic":
        return { color: "text-success-text", bg: "bg-success-bg", border: "border-success-border", icon: ShieldCheck };
      case "Suspicious":
        return { color: "text-warning-text", bg: "bg-warning-bg", border: "border-warning-border", icon: AlertTriangle };
      case "AI Generated":
        return { color: "text-danger-text", bg: "bg-danger-bg", border: "border-danger-border", icon: ShieldAlert };
    }
  };

  const badge = getBadgeConfig();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden relative bg-surface/80 border-border">
        <div className={`absolute top-0 left-0 w-full h-1 ${badge.bg.replace('/10', '')}`} />
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <CircularGauge value={score} size={160} strokeWidth={12} />
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <h2 className="text-3xl font-bold tracking-tight text-text-primary">Authenticity Analysis</h2>
              <div className={`flex items-center px-3 py-1 rounded-full border ${badge.bg} ${badge.border} ${badge.color}`}>
                <badge.icon className="w-4 h-4 mr-2" />
                <span className="text-sm font-bold uppercase tracking-wider">{riskBadge}</span>
              </div>
            </div>
            <p className="text-text-muted max-w-2xl text-lg">
              {recommendation}
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-text-muted text-sm">
              <span>Model Confidence:</span>
              <span className="font-semibold text-text-secondary">{confidence}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
