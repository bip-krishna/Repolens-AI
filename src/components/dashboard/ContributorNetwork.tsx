"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import type { GitContributor } from "@/types";

export function ContributorNetwork({ contributors }: { contributors: GitContributor[] }) {
  if (!contributors || contributors.length === 0) {
    return <div className="text-center py-12 text-white/40">No contributor data available</div>;
  }

  const maxContributions = Math.max(...contributors.map((c) => c.contributions));

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-6 text-white flex items-center gap-2">
        <Users className="h-4 w-4 text-white" />
        Contributor Network
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {contributors.slice(0, 12).map((contributor, i) => {
          const barWidth = (contributor.contributions / maxContributions) * 100;
          return (
            <motion.div
              key={contributor.login}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="liquid-glass rounded-xl p-4 hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={contributor.avatar}
                  alt={contributor.login}
                  className="w-8 h-8 rounded-full ring-1 ring-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{contributor.login}</div>
                  <div className="text-xs text-white/40">{contributor.contributions} commits</div>
                </div>
                {contributor.ownership !== undefined && (
                  <span className="text-xs text-white/50 tabular-nums">{contributor.ownership}%</span>
                )}
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
