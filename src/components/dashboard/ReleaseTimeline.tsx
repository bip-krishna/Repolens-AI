"use client";

import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import type { GitRelease } from "@/types";

export function ReleaseTimeline({ releases }: { releases: GitRelease[] }) {
  if (!releases || releases.length === 0) {
    return <div className="text-center py-12 text-white/40">No release data available</div>;
  }

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-6 text-white flex items-center gap-2">
        <Tag className="h-4 w-4 text-white" />
        Release Timeline
      </h3>
      <div className="relative pl-6 space-y-4">
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-cyan-500/10" />

        {releases.slice(0, 10).map((release, i) => (
          <motion.div
            key={release.tagName}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative"
          >
            <div
              className="absolute -left-[13px] top-4 w-3 h-3 rounded-full ring-4 ring-cyan-500/20"
              style={{
                backgroundColor: release.isPrerelease ? "#F59E0B" : "#06B6D4",
                boxShadow: `0 0 8px ${release.isPrerelease ? "#F59E0B" : "#06B6D4"}40`,
              }}
            />
            <div className="liquid-glass rounded-xl p-4 ml-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-white">{release.tagName}</span>
                {release.isPrerelease && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">pre-release</span>
                )}
              </div>
              {release.name !== release.tagName && (
                <div className="text-sm text-white/60 mb-1">{release.name}</div>
              )}
              <div className="text-xs text-white/40">
                {new Date(release.date).toLocaleDateString("en", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </div>
              {release.body && (
                <div className="text-xs text-white/40 mt-2 line-clamp-2">{release.body.slice(0, 200)}</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
