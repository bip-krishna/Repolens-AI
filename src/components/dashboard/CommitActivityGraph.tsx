"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Activity } from "lucide-react";
import type { CommitActivity, GitCommit } from "@/types";

export function CommitActivityGraph({ commits, commitActivity }: { commits: GitCommit[]; commitActivity: CommitActivity[] }) {
  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of commits) {
      if (c.date) {
        const month = c.date.slice(0, 7);
        map[month] = (map[month] || 0) + 1;
      }
    }
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, count]) => ({
        name: new Date(month + "-01").toLocaleDateString("en", { month: "short", year: "2-digit" }),
        commits: count,
      }));
  }, [commits]);

  const weeklyData = useMemo(() => {
    return commitActivity
      .filter((w) => w.count > 0)
      .slice(-26)
      .map((w) => ({
        name: new Date(w.week).toLocaleDateString("en", { month: "short", day: "numeric" }),
        commits: w.count,
      }));
  }, [commitActivity]);

  const displayData = weeklyData.length > 0 ? weeklyData : monthlyData;

  if (displayData.length === 0) {
    return <div className="text-center py-12 text-white/40">No commit activity data available</div>;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    return (
      <div className="liquid-glass rounded-lg px-3 py-2 text-xs text-white">
        <div className="font-medium">{payload[0].payload.name}</div>
        <div className="text-white/60">{payload[0].value} commits</div>
      </div>
    );
  };

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-6 text-white flex items-center gap-2">
        <Activity className="h-4 w-4 text-white" />
        Commit Activity
      </h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" dataKey="commits"
              stroke="#8B5CF6" strokeWidth={2}
              fill="url(#commitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
