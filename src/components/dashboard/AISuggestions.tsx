"use client";

import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, AlertCircle, Info, Code, TestTube, Trash2, FolderTree, Package, Shield, Zap } from "lucide-react";
import type { AISuggestion } from "@/types";

const typeIcons: Record<string, any> = {
  refactor: Code, test: TestTube, "dead-code": Trash2,
  structure: FolderTree, dependency: Package, security: Shield, performance: Zap,
};

const severityConfig: Record<string, { color: string; bg: string; icon: any }> = {
  info: { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: Info },
  warning: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: AlertTriangle },
  error: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: AlertCircle },
};

export function AISuggestions({ suggestions }: { suggestions: AISuggestion[] }) {
  if (!suggestions || suggestions.length === 0) {
    return <div className="text-center py-12 text-white/40">No suggestions available</div>;
  }

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-6 text-white flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-yellow-400" />
        AI Suggestions
        <span className="text-xs text-white/40 ml-auto">{suggestions.length} suggestions</span>
      </h3>
      <div className="space-y-3">
        {suggestions.map((suggestion, i) => {
          const TypeIcon = typeIcons[suggestion.type] || Code;
          const severity = severityConfig[suggestion.severity] || severityConfig.info;
          const SeverityIcon = severity.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl p-4 border ${severity.bg}`}
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-white/5 shrink-0 mt-0.5">
                  <TypeIcon className="h-4 w-4 text-white/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{suggestion.title}</span>
                    <SeverityIcon className={`h-3.5 w-3.5 ${severity.color} shrink-0`} />
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">{suggestion.description}</p>
                  {suggestion.files && suggestion.files.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {suggestion.files.slice(0, 3).map((f, j) => (
                        <span key={j} className="text-xs font-mono text-white/30 bg-white/5 px-1.5 py-0.5 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  {suggestion.fix && (
                    <div className="mt-2 text-xs text-green-400/60 flex items-center gap-1">
                      <span>💡</span> {suggestion.fix}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
