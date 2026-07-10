"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { GitCommit, Calendar, Milestone } from "lucide-react";
import type { GitCommit as GitCommitType } from "@/types";

interface MilestoneItem {
  date: string;
  title: string;
  description: string;
}

function getSampleMilestones(commits: GitCommitType[]): MilestoneItem[] {
  const milestones: MilestoneItem[] = [];

  if (commits && commits.length > 0) {
    // Sort oldest first
    const sorted = [...commits].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Initial Commit
    milestones.push({
      date: new Date(sorted[0].date).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      title: "Repository Initialization",
      description: sorted[0].message || "Initial repository setup & package configurations.",
    });

    // Middle commit (milestone helper)
    if (sorted.length > 2) {
      const midIdx = Math.floor(sorted.length / 2);
      milestones.push({
        date: new Date(sorted[midIdx].date).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        title: "Feature Core Implementation",
        description: sorted[midIdx].message || "Integrating core components & business routing.",
      });
    }

    // Latest Commit
    if (sorted.length > 1) {
      const lastIdx = sorted.length - 1;
      milestones.push({
        date: new Date(sorted[lastIdx].date).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        title: "Latest Release & Updates",
        description: sorted[lastIdx].message || "Performance optimization and documentation additions.",
      });
    }
  } else {
    // Standard mock milestones
    milestones.push(
      { date: "Jan 2026", title: "Project Start", description: "Initial setup, structure initialization." },
      { date: "Mar 2026", title: "Authentication Flow", description: "Secured handlers, user session verification." },
      { date: "May 2026", title: "Analytics Hub", description: "Implemented Recharts dashboards." }
    );
  }

  return milestones;
}

export function RepoTimeline({ commits }: { commits: GitCommitType[] }) {
  const milestones = useMemo(() => getSampleMilestones(commits), [commits]);

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-8 text-white flex items-center gap-2">
        <Milestone className="h-4 w-4 text-cyan-400" />
        Repository Evolution Timeline
      </h3>

      <div className="relative">
        {/* Horizontal Line */}
        <div className="absolute top-[38px] left-4 right-4 h-0.5 bg-white/10 hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
          {milestones.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="flex md:flex-col items-start gap-4 md:gap-0"
            >
              {/* Bullet Node */}
              <div className="flex md:flex-col items-center justify-center shrink-0">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center z-10 hover:scale-110 transition-transform">
                  <GitCommit className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="text-[10px] text-cyan-400 font-bold font-mono tracking-wider mt-2 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/10">
                  {item.date}
                </div>
              </div>

              {/* Text Info */}
              <div className="mt-1 md:mt-4 text-left">
                <h4 className="text-sm font-semibold text-white mb-1.5">{item.title}</h4>
                <p className="text-white/50 text-xs leading-relaxed max-w-sm md:max-w-none">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
