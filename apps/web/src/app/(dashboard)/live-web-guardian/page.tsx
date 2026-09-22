"use client";

import { useEffect, useState } from "react";
import { GuardianStatus } from "@/features/live-web-guardian/GuardianStatus";
import { ActivityTimeline } from "@/features/live-web-guardian/ActivityTimeline";
import { ExtensionStatus } from "@/lib/services/extensionSyncStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings, Shield } from "lucide-react";

export default function LiveWebGuardianPage() {
  const [status, setStatus] = useState<ExtensionStatus | null>(null);

  useEffect(() => {
    // Poll the Next.js API layer for extension sync updates
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/extension/sync");
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error("Failed to fetch extension status", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary flex items-center">
            <Shield className="w-8 h-8 mr-3 text-indigo-500" />
            Live Web Guardian
          </h1>
          <p className="text-text-muted mt-2">
            Real-time deepfake detection directly in your browser.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border-muted bg-surface text-text-secondary" asChild>
            <Link href="/settings/extension">
              <Settings className="w-4 h-4 mr-2" />
              Extension Settings
            </Link>
          </Button>
        </div>
      </div>

      <GuardianStatus status={status} />
      
      <ActivityTimeline history={status?.history || []} />
    </div>
  );
}
