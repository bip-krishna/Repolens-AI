"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { FileTreeNode, FileImportance } from "@/types";

function computeFileImportance(tree: FileTreeNode): FileImportance[] {
  const files: FileImportance[] = [];

  function traverse(node: FileTreeNode, depth: number) {
    if (node.type === "file" && node.name.match(/\.(tsx?|jsx?|py|rs|go)$/)) {
      const isConfig = node.name.includes("config") || node.name.startsWith(".");
      const isTest = node.name.includes(".test.") || node.name.includes(".spec.") || node.path.includes("__tests__");
      const isIndex = node.name.startsWith("index") || node.name.startsWith("page") || node.name.startsWith("layout");
      const isRoute = node.path.includes("api/") || node.path.includes("routes/");
      const isComponent = node.path.includes("components/");

      // Heuristic scoring
      let score = 2; // base
      if (node.size && node.size > 5000) score += 1;
      if (node.size && node.size > 10000) score += 1;
      if (isIndex || isRoute) score += 1;
      if (isComponent && !isTest) score += 0.5;
      if (isConfig) score -= 0.5;
      if (isTest) score -= 1;
      if (depth <= 2) score += 0.5;

      score = Math.max(1, Math.min(5, Math.round(score)));

      files.push({
        path: node.path,
        name: node.name,
        loc: Math.round((node.size || 100) / 25), // rough estimate
        importCount: Math.max(1, Math.round(score * 2)),
        dependencyCount: Math.max(0, Math.round(score * 1.5)),
        complexity: Math.round(score * 18),
        score,
      });
    }

    if (node.children) {
      node.children.forEach((child) => traverse(child, depth + 1));
    }
  }

  traverse(tree, 0);
  return files.sort((a, b) => b.score - a.score);
}

function StarRating({ score }: { score: number }) {
  return (
    <span className="text-yellow-400 tracking-wider text-xs">
      {"★".repeat(score)}
      <span className="text-white/10">{"★".repeat(5 - score)}</span>
    </span>
  );
}

export function FileHeatmap({ tree }: { tree: FileTreeNode }) {
  const files = useMemo(() => computeFileImportance(tree), [tree]);

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-400" />
          File Importance Heatmap
        </h3>
        <span className="text-xs text-white/40">{files.length} files ranked</span>
      </div>
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {files.slice(0, 25).map((file, i) => {
          const bgOpacity = (file.score / 5) * 0.15;
          return (
            <motion.div
              key={file.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
              style={{ backgroundColor: `rgba(251, 146, 60, ${bgOpacity})` }}
            >
              <StarRating score={file.score} />
              <span className="text-sm text-white/80 font-mono truncate flex-1">{file.path}</span>
              <div className="hidden sm:flex items-center gap-4 text-xs text-white/40 shrink-0">
                <span title="Lines of code">~{file.loc} LOC</span>
                <span title="Complexity">{file.complexity}cx</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
