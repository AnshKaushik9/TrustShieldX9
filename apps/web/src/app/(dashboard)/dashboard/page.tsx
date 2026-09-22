"use client";

import { TrustScoreHero } from "@/features/dashboard/TrustScoreHero";
import { KpiCards } from "@/features/dashboard/KpiCards";
import { EngineStatusWidget } from "@/features/dashboard/EngineStatusWidget";
import { ThreatTrendChart } from "@/features/dashboard/ThreatTrendChart";
import { RecentActivityFeed } from "@/features/dashboard/RecentActivityFeed";
import { QuickActionsGrid } from "@/features/dashboard/QuickActionsGrid";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function DashboardPage() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      <motion.div variants={item}>
        <TrustScoreHero />
      </motion.div>

      <motion.div variants={item}>
        <KpiCards />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div variants={item} className="md:col-span-2">
          <ThreatTrendChart />
        </motion.div>
        
        <motion.div variants={item} className="md:col-span-1">
          <EngineStatusWidget />
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div variants={item} className="md:col-span-2">
          <RecentActivityFeed />
        </motion.div>
        
        <motion.div variants={item} className="md:col-span-1">
          <QuickActionsGrid />
        </motion.div>
      </div>
    </motion.div>
  );
}
