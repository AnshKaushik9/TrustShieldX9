"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fingerprint, ShieldAlert, ScanLine, Activity } from "lucide-react";
import { motion } from "framer-motion";

const kpiData = [
  {
    title: "Media Scanned",
    value: "24,592",
    trend: "+12.5%",
    trendUp: true,
    icon: Fingerprint,
    color: "text-blue-500",
  },
  {
    title: "Deepfakes Detected",
    value: "1,843",
    trend: "+4.2%",
    trendUp: false,
    icon: ScanLine,
    color: "text-warning-text",
  },
  {
    title: "Threats Blocked",
    value: "8,901",
    trend: "+18.1%",
    trendUp: true,
    icon: ShieldAlert,
    color: "text-success-text",
  },
  {
    title: "Avg. Authenticity",
    value: "94.2%",
    trend: "+1.2%",
    trendUp: true,
    icon: Activity,
    color: "text-indigo-500",
  },
];

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
              <p className={`text-xs mt-1 font-medium ${kpi.trendUp ? 'text-success-text' : 'text-danger-text'}`}>
                {kpi.trend} <span className="text-text-muted font-normal">from last month</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
