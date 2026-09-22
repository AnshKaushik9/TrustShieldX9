"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

import { useEffect, useState } from "react";
import { ReviewTask } from "@/lib/services/reviewSyncStore";
import { format, subDays } from "date-fns";

export function ThreatTrendChart() {
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data: ReviewTask[] = await res.json();
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

  const generateChartData = () => {
    // Generate last 7 days including today
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const count = tasks.filter(t => t.createdAt.startsWith(dateStr) && (t.aiDecision === "Deepfake" || t.aiDecision === "High Risk")).length;
      chartData.push({ name: format(d, 'EEE'), threats: count });
    }
    return chartData;
  };

  const hasData = tasks.length > 0;
  const chartData = hasData ? generateChartData() : [];

  return (
    <Card className="bg-surface/50 col-span-1 md:col-span-2 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center text-text-primary">
          <Activity className="w-4 h-4 mr-2 text-indigo-400" />
          Threat Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <div className="h-[250px] w-full mt-4 flex items-center justify-center">
          {loading ? (
            <p className="text-text-muted text-sm">Loading trend data...</p>
          ) : !hasData ? (
            <p className="text-text-muted text-sm">Insufficient Data for Trend Analysis</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-muted)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-default)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: '#8B5CF6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="threats" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorThreats)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
