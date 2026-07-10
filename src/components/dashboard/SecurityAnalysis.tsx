"use client";

import { motion } from "framer-motion";
import { Shield, AlertTriangle, Lock, Globe, KeyRound } from "lucide-react";
import type { SecurityReport } from "@/types";

function SecurityGauge({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : score >= 40 ? "#f97316" : "#ef4444";
  const radius = 50;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-20 mx-auto">
      <svg width="128" height="80" viewBox="0 0 128 80">
        <path
          d="M 8 72 A 50 50 0 0 1 120 72"
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round"
        />
        <motion.path
          d="M 8 72 A 50 50 0 0 1 120 72"
          fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center">
        <span className="text-2xl font-bold text-white">{score}%</span>
      </div>
    </div>
  );
}

export function SecurityAnalysis({ report }: { report: SecurityReport }) {
  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-6 text-white flex items-center gap-2">
        <Shield className="h-4 w-4 text-green-400" />
        Security Analysis
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-8 mb-6">
        <SecurityGauge score={report.overallScore} />
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div className="liquid-glass rounded-xl p-3 text-center">
            <Lock className="h-4 w-4 text-white/40 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{report.secretsDetected}</div>
            <div className="text-xs text-white/40">Secrets Detected</div>
          </div>
          <div className="liquid-glass rounded-xl p-3 text-center">
            <AlertTriangle className="h-4 w-4 text-white/40 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{report.vulnerabilities.length}</div>
            <div className="text-xs text-white/40">Vulnerabilities</div>
          </div>
          <div className="liquid-glass rounded-xl p-3 text-center">
            <Globe className="h-4 w-4 text-white/40 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{report.exposedAPIs.length}</div>
            <div className="text-xs text-white/40">Exposed APIs</div>
          </div>
          <div className="liquid-glass rounded-xl p-3 text-center">
            <KeyRound className="h-4 w-4 text-white/40 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{report.dangerousPermissions.length}</div>
            <div className="text-xs text-white/40">Risky Patterns</div>
          </div>
        </div>
      </div>

      {report.vulnerabilities.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">Vulnerabilities</h4>
          {report.vulnerabilities.slice(0, 5).map((v, i) => {
            const colors: Record<string, string> = {
              low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
              medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
              high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
              critical: "bg-red-500/10 text-red-400 border-red-500/20",
            };
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-lg p-3 border ${colors[v.severity] || colors.medium}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{v.name}</span>
                  <span className="text-xs uppercase">{v.severity}</span>
                </div>
                <p className="text-xs opacity-60">{v.description}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
