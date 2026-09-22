"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Globe, Server, Activity } from "lucide-react";
import { ExtensionStatus } from "@/lib/services/extensionSyncStore";

interface GuardianStatusProps {
  status: ExtensionStatus | null;
}

export function GuardianStatus({ status }: GuardianStatusProps) {
  const isConnected = status?.isConnected ?? false;
  
  const getSafeHostname = (urlStr: string | undefined | null) => {
    if (!urlStr) return "Waiting for media...";
    try {
      return new URL(urlStr).hostname;
    } catch {
      return urlStr;
    }
  };
  
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="bg-surface/50 border-border">
        <CardContent className="p-6 flex items-center gap-4">
          <div className={`p-4 rounded-full ${isConnected ? 'bg-success-bg text-success-text' : 'bg-muted text-text-muted'}`}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">Extension Status</p>
            <h3 className="text-xl font-bold text-text-primary">
              {isConnected ? "Connected & Active" : "Disconnected"}
            </h3>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface/50 border-border">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-4 rounded-full bg-blue-500/20 text-blue-400">
            <Globe className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-text-muted">Current Target</p>
            <h3 className="text-xl font-bold text-text-primary truncate" title={status?.currentUrl || "None"}>
              {getSafeHostname(status?.currentUrl)}
            </h3>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface/50 border-border">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-4 rounded-full bg-indigo-500/20 text-indigo-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-muted">API Sync</p>
            <h3 className="text-xl font-bold text-text-primary">
              Active Sync
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
