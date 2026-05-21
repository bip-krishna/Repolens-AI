"use client";

import { useMemo } from "react";
import type { LanguageBreakdown } from "@/types";

const languageColors: Record<string, string> = {
  TypeScript: "#3178C6", JavaScript: "#F7DF1E", Python: "#3776AB",
  Rust: "#DEA584", Go: "#00ADD8", Java: "#B07219", Ruby: "#CC342D",
  "C++": "#F34B7D", C: "#555555", "C#": "#178600", PHP: "#4F5D95",
  Swift: "#FFAC45", Kotlin: "#A97BFF", Dart: "#00B4AB", Shell: "#89E051",
  HTML: "#E34C26", CSS: "#563D7C", SCSS: "#C6538C", Vue: "#41B883",
  Svelte: "#FF3E00", MDX: "#FCB32C", Dockerfile: "#384D54",
};

export function LanguageBar({ languages }: { languages: LanguageBreakdown }) {
  const sorted = useMemo(() => {
    const total = Object.values(languages).reduce((a, b) => a + b, 0);
    return Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .map(([lang, bytes]) => ({
        name: lang,
        bytes,
        percentage: total > 0 ? (bytes / total) * 100 : 0,
        color: languageColors[lang] || "#8B8B8B",
      }));
  }, [languages]);

  if (sorted.length === 0) return null;

  return (
    <div>
      {/* Bar */}
      <div className="h-2.5 rounded-full overflow-hidden flex bg-white/5">
        {sorted.map((lang) => (
          <div
            key={lang.name}
            className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
            style={{ width: `${Math.max(lang.percentage, 0.5)}%`, backgroundColor: lang.color }}
            title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
        {sorted.slice(0, 8).map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
            <span className="text-muted-foreground">{lang.name}</span>
            <span className="text-muted-foreground/60">{lang.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
