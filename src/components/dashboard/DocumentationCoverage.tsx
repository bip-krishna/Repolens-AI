"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, Award } from "lucide-react";
import type { DocumentationCoverage } from "@/types";

function CoverageBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-white/60">{label}</span>
        <span className="text-white font-medium">{score}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export function DocumentationCoverageComponent({ coverage }: { coverage?: DocumentationCoverage }) {
  const data = useMemo(() => coverage || {
    readme: 85,
    comments: 60,
    functions: 75,
    examples: 40,
  }, [coverage]);

  const overall = useMemo(() => {
    return Math.round((data.readme + data.comments + data.functions + data.examples) / 4);
  }, [data]);

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-cyan-400" />
          Documentation Coverage
        </h3>
        <div className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
          <Award className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-xs font-bold text-white font-mono">{overall}% Score</span>
        </div>
      </div>

      <div className="space-y-4">
        <CoverageBar label="README Explanation" score={data.readme} />
        <CoverageBar label="Inline Comments" score={data.comments} />
        <CoverageBar label="Exported Functions API Docs" score={data.functions} />
        <CoverageBar label="Code Examples & Usage" score={data.examples} />
      </div>
    </div>
  );
}
