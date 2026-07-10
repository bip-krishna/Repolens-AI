"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { GitFork, Sparkles, Check, Bookmark } from "lucide-react";
import type { RepoSimilarityResult } from "@/types";

export function RepoSimilarity({ similarities }: { similarities?: RepoSimilarityResult[] }) {
  const data = useMemo(() => similarities || [
    {
      name: "CarbonWise-AI",
      similarity: 92,
      matchingTech: ["Next.js", "TailwindCSS", "Prisma", "Groq AI"],
      matchingFeatures: ["Dashboard analytics", "AI recommendations", "Relational database schema"],
    },
    {
      name: "Sustainability-Platform",
      similarity: 78,
      matchingTech: ["React", "Express.js", "MongoDB", "OpenAI"],
      matchingFeatures: ["User profiles", "Authentication flows", "REST APIs"],
    },
    {
      name: "GreenLog-Tracker",
      similarity: 64,
      matchingTech: ["Next.js", "TailwindCSS", "SQLite"],
      matchingFeatures: ["CRUD state actions", "Markdown documentation guides"],
    },
  ], [similarities]);

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
        <div>
          <h3 className="font-semibold text-white">AI Repo Similarity Analysis</h3>
          <p className="text-[10px] text-white/40 mt-0.5">Identified matches with similar architecture & stacks</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 rounded-xl border border-white/5 bg-white/2 space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-cyan-400" />
                <span className="font-bold text-sm text-white font-mono">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40">Similarity:</span>
                <span className="text-xs font-bold text-cyan-400 font-mono">{item.similarity}%</span>
              </div>
            </div>

            {/* Tech Stack Match */}
            <div>
              <span className="text-[9px] text-white/30 uppercase font-bold tracking-wider font-mono block mb-1.5">Matching Tech Stack</span>
              <div className="flex flex-wrap gap-1">
                {item.matchingTech.map((tech) => (
                  <span key={tech} className="text-[9px] font-mono bg-white/5 border border-white/5 text-white/70 px-1.5 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Features Match */}
            <div>
              <span className="text-[9px] text-white/30 uppercase font-bold tracking-wider font-mono block mb-1.5">Common Architecture Patterns</span>
              <div className="space-y-1">
                {item.matchingFeatures.map((feat, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-white/60">
                    <Check className="h-3 w-3 text-cyan-400 shrink-0" />
                    <span className="text-[10px]">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
