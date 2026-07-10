"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Flame } from "lucide-react";

interface TestModule {
  name: string;
  coverage: number;
  testCount: number;
}

export function TestCoverage({ modules }: { modules?: TestModule[] }) {
  const data = useMemo(() => modules || [
    { name: "Authentication / Security", coverage: 95, testCount: 24 },
    { name: "Dashboard Visualizations", coverage: 82, testCount: 16 },
    { name: "API Request Handlers", coverage: 68, testCount: 12 },
    { name: "Common Utilities & Parsers", coverage: 100, testCount: 32 },
  ], [modules]);

  const overall = useMemo(() => {
    return Math.round(data.reduce((sum, m) => sum + m.coverage, 0) / data.length);
  }, [data]);

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-emerald-400" />
          Test Coverage
        </h3>
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold text-white font-mono">
          <Flame className="h-3.5 w-3.5 text-emerald-400" />
          <span>{overall}% Suite</span>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, idx) => {
          const color = item.coverage >= 80 ? "bg-emerald-500" : item.coverage >= 50 ? "bg-amber-500" : "bg-red-500";
          return (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60 font-medium truncate max-w-[180px]">{item.name}</span>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-white/30">{item.testCount} tests</span>
                  <span className="text-white font-bold">{item.coverage}%</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.coverage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${color}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
