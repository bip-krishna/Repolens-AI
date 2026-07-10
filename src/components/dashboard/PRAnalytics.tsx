"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie } from "recharts";
import { GitPullRequest, Clock, Check } from "lucide-react";
import type { PRAnalytics as PRAnalyticsType } from "@/types";

const COLORS = ["#10B981", "#EF4444", "#3B82F6"];

export function PRAnalytics({ data }: { data?: PRAnalyticsType }) {
  const stats = useMemo(() => data || {
    total: 82,
    merged: 68,
    rejected: 8,
    open: 6,
    avgReviewTime: "8.5 hours",
    reviewDistribution: [
      { reviewer: "Alice", count: 24 },
      { reviewer: "Bob", count: 18 },
      { reviewer: "Charlie", count: 12 },
      { reviewer: "David", count: 8 },
    ],
  }, [data]);

  const statusData = useMemo(() => [
    { name: "Merged", value: stats.merged },
    { name: "Rejected", value: stats.rejected },
    { name: "Open", value: stats.open },
  ], [stats]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="liquid-glass rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <GitPullRequest className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{stats.merged}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Merged PRs</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="liquid-glass rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <GitPullRequest className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{stats.rejected}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Rejected PRs</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="liquid-glass rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <Clock className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{stats.avgReviewTime}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Avg Review Cycle</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Review Distribution */}
        <div className="lg:col-span-2 liquid-glass rounded-2xl p-5">
          <h4 className="text-sm font-semibold mb-4 text-white">Review Load Distribution</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.reviewDistribution} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="reviewer" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", borderColor: "rgba(255,255,255,0.1)", fontSize: 11 }} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Reviews Completed">
                  {stats.reviewDistribution.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={`rgba(139, 92, 246, ${1 - idx * 0.15})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: PR Status */}
        <div className="liquid-glass rounded-2xl p-5 flex flex-col justify-between">
          <h4 className="text-sm font-semibold mb-2 text-white">PR Status Outcomes</h4>
          <div className="h-[180px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", borderColor: "rgba(255,255,255,0.1)", fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] text-white/50 text-center font-mono">
            <div className="bg-white/2 p-1.5 rounded border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block mr-1" />
              <span>Merged ({stats.merged})</span>
            </div>
            <div className="bg-white/2 p-1.5 rounded border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] inline-block mr-1" />
              <span>Rejected ({stats.rejected})</span>
            </div>
            <div className="bg-white/2 p-1.5 rounded border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] inline-block mr-1" />
              <span>Open ({stats.open})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
