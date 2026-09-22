"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

const data = [
  { name: "Mon", threats: 120 },
  { name: "Tue", threats: 210 },
  { name: "Wed", threats: 180 },
  { name: "Thu", threats: 290 },
  { name: "Fri", threats: 250 },
  { name: "Sat", threats: 140 },
  { name: "Sun", threats: 320 },
];

export function ThreatTrendChart() {
  return (
    <Card className="bg-surface/50 col-span-1 md:col-span-2 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center text-text-primary">
          <Activity className="w-4 h-4 mr-2 text-indigo-400" />
          Threat Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6 sm:pt-0">
        <div className="h-[250px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
        </div>
      </CardContent>
    </Card>
  );
}
