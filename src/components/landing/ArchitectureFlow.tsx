"use client";

import { motion } from "framer-motion";

const steps = [
  { id: "repo", label: "GitHub Repo", color: "#8B5CF6" },
  { id: "clone", label: "Repo Cloner", color: "#6366F1" },
  { id: "parse", label: "Code Parser", color: "#3B82F6" },
  { id: "summary", label: "AI Summaries", color: "#8B5CF6" },
  { id: "arch", label: "Architecture", color: "#EC4899" },
  { id: "deps", label: "Dependency Map", color: "#06B6D4" },
  { id: "ui", label: "Frontend UI", color: "#10B981" },
];

function FlowNode({ label, color, delay }: { label: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <div
        className="px-5 py-3 rounded-xl glass text-sm font-medium text-center whitespace-nowrap transition-all duration-300 group-hover:scale-105"
        style={{ borderColor: `${color}33`, boxShadow: `0 0 20px ${color}15` }}
      >
        {label}
      </div>
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
        style={{ background: `${color}20` }}
      />
    </motion.div>
  );
}

function FlowArrow({ delay, direction = "down" }: { delay: number; direction?: "down" | "right" }) {
  const isDown = direction === "down";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className={`flex ${isDown ? "flex-col items-center py-1" : "flex-row items-center px-1"}`}
    >
      <div className={`${isDown ? "w-px h-6" : "h-px w-6"} bg-gradient-to-b from-purple-500/40 to-blue-500/40`} />
      <div className={`${isDown ? "border-l-[5px] border-r-[5px] border-t-[6px]" : "border-t-[5px] border-b-[5px] border-l-[6px]"} border-l-transparent border-r-transparent border-t-purple-400/60 border-b-transparent`}
        style={!isDown ? { borderLeftColor: "oklch(0.7 0.18 270 / 60%)", borderTopColor: "transparent" } : {}}
      />
    </motion.div>
  );
}

export function ArchitectureFlow() {
  return (
    <section id="architecture" className="relative py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-medium text-purple-400 mb-3 tracking-wide uppercase">Architecture</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            How <span className="gradient-text">RepoLens</span> Works
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            From GitHub URL to complete understanding — our pipeline processes your repo through multiple AI analysis stages.
          </p>
        </motion.div>

        {/* Flow Diagram */}
        <div className="flex flex-col items-center gap-0">
          <FlowNode label="GitHub Repo" color="#8B5CF6" delay={0} />
          <FlowArrow delay={0.1} />
          <FlowNode label="Repo Cloner" color="#6366F1" delay={0.15} />
          <FlowArrow delay={0.25} />
          <FlowNode label="Code Parser" color="#3B82F6" delay={0.3} />
          <FlowArrow delay={0.4} />

          {/* Three parallel outputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-2xl">
            <FlowNode label="AI Summaries" color="#8B5CF6" delay={0.45} />
            <FlowNode label="Architecture" color="#EC4899" delay={0.5} />
            <FlowNode label="Dependency Map" color="#06B6D4" delay={0.55} />
          </div>

          <FlowArrow delay={0.65} />
          <FlowNode label="Frontend UI" color="#10B981" delay={0.7} />
        </div>
      </div>
    </section>
  );
}
