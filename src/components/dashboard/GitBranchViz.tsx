"use client";

import { motion } from "framer-motion";
import { GitBranch as GitBranchIcon } from "lucide-react";
import type { GitBranch } from "@/types";

export function GitBranchViz({ branches }: { branches: GitBranch[] }) {
  if (!branches || branches.length === 0) {
    return <div className="text-center py-12 text-white/40">No branch data available</div>;
  }

  const defaultBranch = branches.find((b) => b.isDefault);
  const otherBranches = branches.filter((b) => !b.isDefault);

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-6 text-white flex items-center gap-2">
        <GitBranchIcon className="h-4 w-4 text-white" />
        Git Branches
        <span className="text-xs text-white/40 ml-auto">{branches.length} branches</span>
      </h3>
      <div className="relative pl-6">
        {/* Main branch line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-green-500/20" />

        {/* Default branch */}
        {defaultBranch && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative mb-4"
          >
            <div className="absolute -left-[13px] top-3 w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-500/20" />
            <div className="liquid-glass rounded-xl p-4 ml-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{defaultBranch.name}</span>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">default</span>
                {defaultBranch.isProtected && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">protected</span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Other branches */}
        {otherBranches.slice(0, 15).map((branch, i) => {
          const isFeature = branch.name.includes("feature") || branch.name.includes("feat");
          const isBugfix = branch.name.includes("bug") || branch.name.includes("fix") || branch.name.includes("hotfix");
          const color = isFeature ? "blue" : isBugfix ? "red" : "purple";
          const dotColor = `bg-${color}-500`;
          const ringColor = `ring-${color}-500/20`;

          return (
            <motion.div
              key={branch.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative mb-2"
            >
              <div className="absolute -left-[13px] top-3 flex items-center">
                <div className={`w-3 h-3 rounded-full ${dotColor} ${ringColor} ring-2`}
                  style={{
                    backgroundColor: isFeature ? "#3B82F6" : isBugfix ? "#EF4444" : "#8B5CF6",
                    boxShadow: `0 0 8px ${isFeature ? "#3B82F6" : isBugfix ? "#EF4444" : "#8B5CF6"}40`,
                  }}
                />
                <div className="w-4 h-px" style={{ backgroundColor: isFeature ? "#3B82F640" : isBugfix ? "#EF444440" : "#8B5CF640" }} />
              </div>
              <div className="flex items-center gap-2 ml-4 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
                <span className="text-sm text-white/70 font-mono truncate">{branch.name}</span>
                {branch.isProtected && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full shrink-0">🔒</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
