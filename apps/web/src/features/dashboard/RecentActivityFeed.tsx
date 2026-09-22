import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link2, Image as ImageIcon, Video, ShieldAlert, CheckCircle2, type LucideIcon } from "lucide-react";

type RiskLevel = "High" | "Medium" | "Low";

interface ActivityItem {
  id: number;
  type: string;
  target: string;
  time: string;
  risk: RiskLevel;
  result: string;
  icon: LucideIcon;
}

const activities: ActivityItem[] = [
  {
    id: 1,
    type: "url",
    target: "login-verify-account.com",
    time: "2 mins ago",
    risk: "High",
    result: "Blocked",
    icon: Link2,
  },
  {
    id: 2,
    type: "image",
    target: "ceo-speech-frame.jpg",
    time: "15 mins ago",
    risk: "Medium",
    result: "Flagged",
    icon: ImageIcon,
  },
  {
    id: 3,
    type: "video",
    target: "interview_raw.mp4",
    time: "1 hour ago",
    risk: "Low",
    result: "Clean",
    icon: Video,
  },
  {
    id: 4,
    type: "url",
    target: "api-v2-auth.net",
    time: "3 hours ago",
    risk: "High",
    result: "Blocked",
    icon: Link2,
  },
];

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case "High": return "text-danger-text";
    case "Medium": return "text-warning-text";
    case "Low": return "text-success-text";
    default: return "text-text-muted";
  }
};

export function RecentActivityFeed() {
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
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 group cursor-pointer">
              <div className="mt-0.5 rounded-full bg-muted p-2 text-text-muted group-hover:bg-surface-hover group-hover:text-text-primary transition-colors">
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text-primary truncate pr-2">
                    {activity.target}
                  </p>
                  <span className="text-xs text-text-muted whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${getRiskColor(activity.risk)}`}>
                    {activity.risk} Risk
                  </span>
                  <span className="text-slate-600 text-xs">•</span>
                  <span className="text-xs text-text-muted flex items-center">
                    {activity.result === 'Clean' ? (
                      <CheckCircle2 className="w-3 h-3 mr-1 text-success-text" />
                    ) : (
                      <ShieldAlert className="w-3 h-3 mr-1 text-danger-text" />
                    )}
                    {activity.result}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
