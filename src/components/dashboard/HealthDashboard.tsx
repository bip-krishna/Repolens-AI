"use client";

import { motion } from "framer-motion";
import { Shield, FileCode, Bug, TestTube, Cpu, Zap } from "lucide-react";
import type { HealthMetrics } from "@/types";

const metrics = [
  { key: "architecture", label: "Architecture", icon: FileCode, gradient: "from-purple-500 to-blue-500" },
  { key: "documentation", label: "Documentation", icon: FileCode, gradient: "from-blue-500 to-cyan-500" },
  { key: "security", label: "Security", icon: Shield, gradient: "from-green-500 to-emerald-500" },
  { key: "testing", label: "Testing", icon: TestTube, gradient: "from-yellow-500 to-orange-500" },
  { key: "maintainability", label: "Maintainability", icon: Cpu, gradient: "from-pink-500 to-rose-500" },
  { key: "performance", label: "Performance", icon: Zap, gradient: "from-orange-500 to-red-500" },
] as const;

function GaugeCard({ label, value, icon: Icon, gradient }: { label: string; value: number; icon: any; gradient: string }) {
  const color = value >= 80 ? "#22c55e" : value >= 60 ? "#eab308" : value >= 40 ? "#f97316" : "#ef4444";
  const radius = 36;
  const circumference = Math.PI * radius; // half-circle
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="liquid-glass rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
    >
      <div className="relative w-20 h-12">
        <svg width="80" height="48" viewBox="0 0 80 48">
          <path
            d="M 4 44 A 36 36 0 0 1 76 44"
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round"
          />
          <motion.path
            d="M 4 44 A 36 36 0 0 1 76 44"
            fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1">
          <span className="text-lg font-bold text-white">{value}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-white/60">
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </div>
    </motion.div>
  );
}

export function HealthDashboard({ health }: { health: HealthMetrics }) {
  const avg = Math.round(
    Object.values(health).reduce((a, b) => a + b, 0) / Object.values(health).length
  );

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Bug className="h-4 w-4 text-white" />
          Repository Health Dashboard
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Overall</span>
          <span className={`text-lg font-bold ${avg >= 80 ? "text-green-400" : avg >= 60 ? "text-yellow-400" : "text-orange-400"}`}>
            {avg}%
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m) => (
          <GaugeCard
            key={m.key}
            label={m.label}
            value={health[m.key]}
            icon={m.icon}
            gradient={m.gradient}
          />
        ))}
      </div>
    </div>
  );
}
