"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ArrowUpRight, ArrowRight } from "lucide-react";

interface UpgradeStep {
  date: string;
  name: string;
  from: string;
  to: string;
  severity: "major" | "minor" | "patch";
}

const severityColors = {
  major: "bg-red-500/10 text-red-400 border-red-500/20",
  minor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  patch: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export function DependencyUpdateTimeline() {
  const updates: UpgradeStep[] = useMemo(() => [
    { date: "May 2026", name: "next", from: "14.2.0", to: "15.1.0", severity: "major" },
    { date: "May 2026", name: "react", from: "18.3.0", to: "19.0.0", severity: "major" },
    { date: "Apr 2026", name: "tailwindcss", from: "3.4.0", to: "4.0.0", severity: "major" },
    { date: "Mar 2026", name: "recharts", from: "2.12.0", to: "2.15.0", severity: "minor" },
    { date: "Feb 2026", name: "lucide-react", from: "0.450.0", to: "0.468.0", severity: "minor" },
  ], []);

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-6 text-white flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-purple-400" />
        Dependency Upgrade Timeline
      </h3>

      <div className="relative pl-6 border-l border-white/10 space-y-6">
        {updates.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="relative"
          >
            {/* Timeline bullet */}
            <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 border border-black shadow" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-white/40 font-mono block mb-0.5">{item.date}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm font-mono">{item.name}</span>
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border font-mono font-bold ${severityColors[item.severity]}`}>
                    {item.severity}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-white/50 bg-white/5 px-2.5 py-1 rounded-lg w-fit">
                <span>v{item.from}</span>
                <ArrowRight className="h-3 w-3 text-purple-400" />
                <span className="text-white font-medium">v{item.to}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
