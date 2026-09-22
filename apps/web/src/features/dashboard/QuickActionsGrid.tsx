"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint, Search, Shield, FileText, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const actions = [
  {
    title: "Analyze Media",
    href: "/media-forensics",
    icon: Fingerprint,
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    title: "Scan URL",
    href: "/safescan",
    icon: Search,
    color: "bg-indigo-600 hover:bg-indigo-700",
  },
  {
    title: "Live Web Guardian",
    href: "/live-web-guardian",
    icon: Shield,
    color: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    title: "Generate Report",
    href: "/reports",
    icon: FileText,
    color: "bg-slate-700 hover:bg-slate-600",
  },
];

export function QuickActionsGrid() {
  return (
    <Card className="bg-surface/50 h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium flex items-center text-text-primary">
          <Zap className="w-4 h-4 mr-2 text-yellow-400" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <motion.div key={action.title} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                asChild 
                className={`w-full h-auto py-4 flex flex-col items-center justify-center gap-2 border-0 text-white shadow-sm transition-all ${action.color}`}
              >
                <Link href={action.href}>
                  <action.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-semibold whitespace-nowrap">{action.title}</span>
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
