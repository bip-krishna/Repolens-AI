"use client";

import { useMemo } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Cpu } from "lucide-react";
import type { ComplexityMetrics } from "@/types";

export function CodeComplexityRadar({ metrics }: { metrics: ComplexityMetrics }) {
  const data = useMemo(() => [
    { axis: "Maintainability", value: metrics.maintainability },
    { axis: "Readability", value: metrics.readability },
    { axis: "Coupling", value: metrics.coupling },
    { axis: "Documentation", value: metrics.documentation },
    { axis: "Test Coverage", value: metrics.testCoverage },
    { axis: "Scalability", value: metrics.scalability },
  ], [metrics]);

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-4 text-white flex items-center gap-2">
        <Cpu className="h-4 w-4 text-white" />
        Code Complexity
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            />
            <Radar
              dataKey="value"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
