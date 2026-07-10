"use client";

import { motion } from "framer-motion";
import type { CodeQualityScore } from "@/types";

function CircularProgress({ score, size = 140 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : score >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-white/40">/100</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : score >= 40 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="text-white/50 tabular-nums">{score}</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </div>
  );
}

export function CodeQualityCard({ quality }: { quality: CodeQualityScore }) {
  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-6 text-white flex items-center gap-2">
        <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        Code Quality Score
      </h3>
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <CircularProgress score={quality.overall} />
        <div className="flex-1 space-y-4 w-full">
          <ScoreBar label="Documentation" score={quality.breakdown.documentation} />
          <ScoreBar label="Testing" score={quality.breakdown.testing} />
          <ScoreBar label="Naming Conventions" score={quality.breakdown.naming} />
          <ScoreBar label="Architecture" score={quality.breakdown.architecture} />
          <ScoreBar label="Maintainability" score={quality.breakdown.maintainability} />
        </div>
      </div>
      {quality.suggestions && quality.suggestions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider mb-3">Suggestions</h4>
          <div className="space-y-2">
            {quality.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-white/60">
                <span className="text-yellow-400 mt-0.5 shrink-0">→</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
