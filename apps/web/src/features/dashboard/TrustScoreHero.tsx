"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CircularGauge } from "@/components/ui/circular-gauge";
import { motion } from "framer-motion";

export function TrustScoreHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden relative bg-gradient-to-br from-surface to-base border-border">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">System Environment</h2>
            <p className="text-text-muted max-w-md leading-relaxed">
              Real-time analysis of your active endpoints, incoming media, and monitored streams indicates a healthy security posture.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-success-text tracking-wide uppercase">Secure</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <CircularGauge value={91} size={180} strokeWidth={14} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
