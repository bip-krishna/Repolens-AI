"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, Zap, Star, Target, Layers, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RepoOverview } from "@/types";

const maturityColors: Record<string, string> = {
  Prototype: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  MVP: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Production: "bg-green-500/20 text-green-400 border-green-500/30",
  Enterprise: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const complexityColors: Record<string, string> = {
  Low: "text-green-400",
  Medium: "text-yellow-400",
  High: "text-orange-400",
  "Very High": "text-red-400",
};

export function AIOverviewCard({ overview }: { overview: RepoOverview }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="liquid-glass rounded-2xl p-6 space-y-5"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20">
          <Sparkles className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white text-lg">AI Repository Overview</h3>
          <p className="text-xs text-white/40">Powered by AI analysis</p>
        </div>
        <Badge className={`ml-auto ${maturityColors[overview.maturityLevel] || maturityColors.Prototype} border text-xs font-medium`}>
          {overview.maturityLevel}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-white/70 leading-relaxed">{overview.description}</p>

      {/* Problem Solved */}
      <div className="liquid-glass rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Problem Solved</span>
        </div>
        <p className="text-sm text-white/80">{overview.problemSolved}</p>
      </div>

      {/* Grid of meta info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Target Users */}
        <div className="liquid-glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Target Users</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {overview.targetUsers.map((user, i) => (
              <Badge key={i} variant="secondary" className="text-xs bg-white/5 text-white/70 border-white/10">
                {user}
              </Badge>
            ))}
          </div>
        </div>

        {/* Complexity */}
        <div className="liquid-glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-orange-400" />
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Complexity</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-2xl font-bold ${complexityColors[overview.complexity] || "text-white"}`}>
              {overview.complexity}
            </span>
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-yellow-400" />
          <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Technologies</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {overview.technologies.map((tech, i) => (
            <Badge key={i} variant="outline" className="text-xs liquid-glass border-white/10 text-white/80">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Best Suited For */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-4 w-4 text-green-400" />
          <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Best Suited For</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {overview.bestSuitedFor.map((item, i) => (
            <Badge key={i} variant="secondary" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      {/* Highlights */}
      {overview.highlights && overview.highlights.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Highlights</span>
          </div>
          <div className="space-y-2">
            {overview.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                <span className="text-purple-400 mt-0.5 shrink-0">•</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
