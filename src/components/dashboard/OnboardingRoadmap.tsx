"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, CheckCircle2, Circle, ChevronDown, ChevronUp, Terminal, BookOpen, Layers } from "lucide-react";

interface RoadmapStep {
  title: string;
  category: "Read" | "Config" | "Explore" | "Run";
  description: string;
  details: string;
}

export function OnboardingRoadmap() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<number | null>(0);

  const steps: RoadmapStep[] = [
    {
      title: "Review README & Documentation",
      category: "Read",
      description: "Understand project goals, dependencies, installation steps, and overall contribution guidelines.",
      details: "Start by reading standard markdown documentations in the root directory like README.md and CONTRIBUTING.md.",
    },
    {
      title: "Check Environment Configurations",
      category: "Config",
      description: "Setup your environment keys, inspect local settings, and confirm correct configurations.",
      details: "Check .env.example templates, customize local configuration flags, and ensure all system utilities are mapped.",
    },
    {
      title: "Explore Core File Architecture",
      category: "Explore",
      description: "Familiarize yourself with project layout folders (frontend layout templates, backend handlers, schemas).",
      details: "Traverse the directory tree to inspect layouts inside src/app/ or controllers inside src/lib/ to map execution flows.",
    },
    {
      title: "Boot Application & Tests",
      category: "Run",
      description: "Execute setup builds, boot the developer application server, and run existing unit tests.",
      details: "Run `npm install`, then execute `npm run dev` and check the local instance. Execute `npm run test` to verify compliance.",
    },
  ];

  const toggleComplete = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-6 text-white flex items-center gap-2">
        <Map className="h-4 w-4 text-cyan-400" />
        Developer Onboarding Roadmap
        <span className="text-xs text-white/40 ml-auto">{completed.size}/{steps.length} completed</span>
      </h3>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isDone = completed.has(idx);
          const isExpanded = expanded === idx;

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all cursor-pointer ${
                isExpanded ? "bg-white/5 border-white/20" : "bg-white/2 border-white/5 hover:bg-white/5"
              }`}
              onClick={() => setExpanded(isExpanded ? null : idx)}
            >
              <div className="p-4 flex items-center gap-3">
                <button
                  onClick={(e) => toggleComplete(idx, e)}
                  className="shrink-0 transition-colors"
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-white/20 hover:text-white/40" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 text-white/50">
                      {step.category}
                    </span>
                    <h4 className={`text-sm font-semibold truncate ${isDone ? "text-white/40 line-through" : "text-white"}`}>
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-white/50 text-xs truncate mt-0.5">{step.description}</p>
                </div>

                <div className="text-white/40 shrink-0">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/5 bg-black/20"
                  >
                    <div className="p-4 text-xs text-white/70 leading-relaxed space-y-3">
                      <p>{step.details}</p>
                      <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                        {step.category === "Run" && (
                          <>
                            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                            <span>Run `npm run dev` to boot</span>
                          </>
                        )}
                        {step.category === "Read" && (
                          <>
                            <BookOpen className="h-3.5 w-3.5 text-purple-400" />
                            <span>Read README.md doc</span>
                          </>
                        )}
                        {step.category === "Explore" && (
                          <>
                            <Layers className="h-3.5 w-3.5 text-amber-400" />
                            <span>Map visual folder layout</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
