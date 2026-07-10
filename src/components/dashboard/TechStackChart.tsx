"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { LanguageBreakdown } from "@/types";

const languageColors: Record<string, string> = {
  TypeScript: "#3178C6", JavaScript: "#F7DF1E", Python: "#3776AB",
  Rust: "#DEA584", Go: "#00ADD8", Java: "#B07219", Ruby: "#CC342D",
  "C++": "#F34B7D", C: "#555555", "C#": "#178600", PHP: "#4F5D95",
  Swift: "#FFAC45", Kotlin: "#A97BFF", Dart: "#00B4AB", Shell: "#89E051",
  HTML: "#E34C26", CSS: "#563D7C", SCSS: "#C6538C", Vue: "#41B883",
  Svelte: "#FF3E00", MDX: "#FCB32C", Dockerfile: "#384D54",
};

export function TechStackChart({ languages }: { languages: LanguageBreakdown }) {
  const data = useMemo(() => {
    const total = Object.values(languages).reduce((a, b) => a + b, 0);
    return Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([lang, bytes]) => ({
        name: lang,
        value: bytes,
        percentage: total > 0 ? ((bytes / total) * 100).toFixed(1) : "0",
        color: languageColors[lang] || `hsl(${Math.random() * 360}, 60%, 55%)`,
      }));
  }, [languages]);

  if (data.length === 0) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div className="liquid-glass rounded-lg px-3 py-2 text-xs text-white">
        <div className="font-medium">{d.name}</div>
        <div className="text-white/60">{d.percentage}%</div>
      </div>
    );
  };

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-4 text-white flex items-center gap-2">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 0 20" />
        </svg>
        Tech Stack Distribution
      </h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-48 h-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2">
          {data.map((lang) => (
            <div key={lang.name} className="flex items-center gap-2 text-sm py-1">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
              <span className="text-white/80 truncate">{lang.name}</span>
              <span className="ml-auto text-white/40 tabular-nums text-xs">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
