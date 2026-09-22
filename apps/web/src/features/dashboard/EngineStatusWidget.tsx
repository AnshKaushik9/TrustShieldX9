import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Server } from "lucide-react";

type EngineStatus = "GREEN" | "YELLOW" | "RED";

interface EngineItem {
  name: string;
  status: EngineStatus;
}

const statuses: EngineItem[] = [
  { name: "Media Model", status: "GREEN" },
  { name: "URL Scanner", status: "GREEN" },
  { name: "Extension", status: "YELLOW" },
  { name: "Database", status: "GREEN" },
  { name: "Backend", status: "GREEN" },
];

const STATUS_CONFIG: Record<EngineStatus, { dot: string; bg: string; label: string }> = {
  GREEN: { dot: "bg-emerald-500", bg: "bg-success-bg", label: "Ready" },
  YELLOW: { dot: "bg-amber-500", bg: "bg-warning-bg", label: "Syncing" },
  RED: { dot: "bg-red-500", bg: "bg-danger-bg", label: "Offline" },
};

export function EngineStatusWidget() {
  return (
    <Card className="bg-surface/50 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center text-text-primary">
            <Server className="w-4 h-4 mr-2 text-blue-400" />
            AI Engine Status
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4" role="list" aria-label="Engine status list">
          {statuses.map((item) => {
            const config = STATUS_CONFIG[item.status];
            return (
              <div key={item.name} className="flex items-center justify-between group" role="listitem">
                <span className="text-sm text-text-muted group-hover:text-text-primary transition-colors">
                  {item.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-text-muted group-hover:text-text-muted transition-colors">
                    {config.label}
                  </span>
                  <span className={`relative flex h-2.5 w-2.5 rounded-full ${config.bg} items-center justify-center`}>
                    {item.status === "GREEN" && (
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-40`} />
                    )}
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
