"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import type { IssueAnalytics as IssueAnalyticsType } from "@/types";

const COLORS = ["#EF4444", "#3B82F6", "#10B981"];

export function IssueAnalytics({ data }: { data?: IssueAnalyticsType }) {
  const stats = useMemo(() => data || {
    total: 45,
    open: 12,
    closed: 33,
    bugs: 18,
    features: 27,
    avgResponseTime: "14 hours",
    timeline: [
      { date: "Mon", opened: 4, closed: 2 },
      { date: "Tue", opened: 2, closed: 5 },
      { date: "Wed", opened: 5, closed: 3 },
      { date: "Thu", opened: 3, closed: 6 },
      { date: "Fri", opened: 6, closed: 4 },
      { date: "Sat", opened: 1, closed: 2 },
      { date: "Sun", opened: 2, closed: 3 },
    ],
  }, [data]);

  const pieData = useMemo(() => [
    { name: "Bugs", value: stats.bugs },
    { name: "Features", value: stats.features },
  ], [stats]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="liquid-glass rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{stats.open}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Open Issues</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="liquid-glass rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{stats.closed}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Closed Issues</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="liquid-glass rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">{stats.avgResponseTime}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">Avg Response Time</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Area Chart */}
        <div className="lg:col-span-2 liquid-glass rounded-2xl p-5">
          <h4 className="text-sm font-semibold mb-4 text-white">Weekly Issue Activity</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeline}>
                <defs>
                  <linearGradient id="openColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="closedColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", borderColor: "rgba(255,255,255,0.1)", fontSize: 11 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="opened" stroke="#EF4444" fillOpacity={1} fill="url(#openColor)" name="Opened" />
                <Area type="monotone" dataKey="closed" stroke="#10B981" fillOpacity={1} fill="url(#closedColor)" name="Closed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bugs vs Features Donut */}
        <div className="liquid-glass rounded-2xl p-5 flex flex-col justify-between">
          <h4 className="text-sm font-semibold mb-2 text-white">Types Breakdown</h4>
          <div className="h-[180px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", borderColor: "rgba(255,255,255,0.1)", fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs text-white/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span>Bugs ({stats.bugs})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
              <span>Features ({stats.features})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
