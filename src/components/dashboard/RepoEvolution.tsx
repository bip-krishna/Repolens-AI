"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, GitBranch, Terminal, Calendar } from "lucide-react";
import type { GitCommit } from "@/types";

interface EvolutionStep {
  commit: string;
  date: string;
  message: string;
  filesChanged: string[];
  impact: string;
}

export function RepoEvolution({ commits }: { commits: GitCommit[] }) {
  const steps: EvolutionStep[] = useMemo(() => {
    if (commits && commits.length > 0) {
      return commits.slice(0, 10).reverse().map((c) => ({
        commit: c.sha.substring(0, 7),
        date: new Date(c.date).toLocaleDateString(),
        message: c.message,
        filesChanged: ["src/app/page.tsx", "package.json"],
        impact: "Core codebase evolution progress.",
      }));
    }
    return [
      { commit: "1a2b3c4", date: "01/10/2026", message: "Initial commit, repo config structures", filesChanged: ["package.json", "tsconfig.json", "src/app/layout.tsx"], impact: "Structure scaffolding" },
      { commit: "5d6e7f8", date: "01/18/2026", message: "Build layout and base dashboard styling", filesChanged: ["src/app/page.tsx", "src/app/globals.css"], impact: "Interface design foundation" },
      { commit: "9g8h7i6", date: "02/05/2026", message: "Add AI analysis backend & API router", filesChanged: ["src/lib/ai.ts", "src/app/api/analyze/route.ts"], impact: "Server operations & intelligence integration" },
      { commit: "2j3k4l5", date: "02/25/2026", message: "ReactFlow architecture diagram generation", filesChanged: ["src/components/visualization/ArchitectureDiagram.tsx"], impact: "Advanced interactive visualization" },
      { commit: "6m7n8o9", date: "03/10/2026", message: "Polish layout with liquid-glass design system", filesChanged: ["src/app/globals.css", "src/app/dashboard/layout.tsx"], impact: "Premium visuals & layout optimization" },
    ];
  }, [commits]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % steps.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const current = steps[activeIndex];

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-white flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-cyan-400" />
            Repository Evolution Player
          </h3>
          <p className="text-[10px] text-white/40 mt-0.5">Replay step-by-step development history</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 bg-white/5 rounded-xl p-1 border border-white/5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => {
              setActiveIndex(0);
              setIsPlaying(false);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Timeline Slider */}
        <div className="md:col-span-1 space-y-2">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveIndex(idx);
                setIsPlaying(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                idx === activeIndex
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "text-white/40 hover:bg-white/5 hover:text-white/60 border border-transparent"
              }`}
            >
              <span className="font-mono text-[10px] bg-white/5 px-1.5 py-0.5 rounded shrink-0">
                {step.commit}
              </span>
              <span className="text-xs truncate flex-1">{step.message}</span>
            </button>
          ))}
        </div>

        {/* Status Window */}
        <div className="md:col-span-2 min-h-[220px] flex flex-col justify-between p-6 rounded-xl border border-white/5 bg-black/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-4 flex-1"
            >
              <div>
                <div className="flex items-center gap-2 text-white/30 text-[10px] mb-1 font-mono">
                  <Calendar className="h-3 w-3" />
                  <span>{current.date}</span>
                  <span>•</span>
                  <span>Commit {current.commit}</span>
                </div>
                <h4 className="text-sm font-bold text-white leading-normal">
                  {current.message}
                </h4>
              </div>

              <div>
                <span className="text-[10px] text-white/40 font-mono block mb-1">Impact Summary</span>
                <p className="text-xs text-white/60 leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">
                  {current.impact}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-white/40 font-mono block mb-1.5">Modified Modules</span>
                <div className="flex flex-wrap gap-1.5">
                  {current.filesChanged.map((f, i) => (
                    <span key={i} className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 text-white/60">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
// Import fix helper
import { useMemo } from "react";
