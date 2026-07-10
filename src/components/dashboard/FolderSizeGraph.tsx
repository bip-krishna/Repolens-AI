"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { HardDrive } from "lucide-react";
import type { FileTreeNode } from "@/types";

interface FolderSize {
  name: string;
  path: string;
  size: number;
  fileCount: number;
  percentage: number;
}

function computeFolderSizes(tree: FileTreeNode): FolderSize[] {
  if (!tree.children) return [];

  const folders: FolderSize[] = [];

  for (const child of tree.children) {
    if (child.type === "directory" && !["node_modules", ".git", ".next", "dist", "build"].includes(child.name)) {
      let totalSize = 0;
      let fileCount = 0;

      function countFiles(node: FileTreeNode) {
        if (node.type === "file") {
          totalSize += node.size || 0;
          fileCount++;
        }
        node.children?.forEach(countFiles);
      }

      countFiles(child);
      folders.push({ name: child.name, path: child.path, size: totalSize, fileCount, percentage: 0 });
    }
  }

  const totalAllFolders = folders.reduce((sum, f) => sum + f.size, 0);
  folders.forEach((f) => {
    f.percentage = totalAllFolders > 0 ? (f.size / totalAllFolders) * 100 : 0;
  });

  return folders.sort((a, b) => b.size - a.size);
}

const categoryColors = [
  "#8B5CF6", "#3B82F6", "#06B6D4", "#10B981", "#F59E0B",
  "#EC4899", "#EF4444", "#6B7280", "#A855F7", "#14B8A6",
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function FolderSizeGraph({ tree }: { tree: FileTreeNode }) {
  const folders = useMemo(() => computeFolderSizes(tree), [tree]);

  if (folders.length === 0) return null;

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-6 text-white flex items-center gap-2">
        <HardDrive className="h-4 w-4 text-white" />
        Folder Size Distribution
      </h3>

      {/* Treemap-style visualization */}
      <div className="flex flex-wrap gap-1 mb-6">
        {folders.map((folder, i) => {
          const minWidth = Math.max(folder.percentage * 2, 60);
          return (
            <motion.div
              key={folder.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg p-3 flex flex-col justify-end cursor-default hover:scale-105 transition-transform"
              style={{
                backgroundColor: `${categoryColors[i % categoryColors.length]}15`,
                border: `1px solid ${categoryColors[i % categoryColors.length]}25`,
                minWidth: `${minWidth}px`,
                flex: `${Math.max(folder.percentage, 5)} 0`,
                minHeight: `${Math.max(60, folder.percentage * 2)}px`,
              }}
              title={`${folder.name}: ${formatSize(folder.size)} (${folder.fileCount} files)`}
            >
              <div className="text-xs font-medium text-white truncate">{folder.name}</div>
              <div className="text-xs text-white/40">{formatSize(folder.size)}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {folders.slice(0, 10).map((folder, i) => (
          <div key={folder.name} className="flex items-center gap-3 text-sm">
            <div
              className="w-3 h-3 rounded shrink-0"
              style={{ backgroundColor: categoryColors[i % categoryColors.length] }}
            />
            <span className="text-white/70 flex-1 truncate">{folder.name}</span>
            <span className="text-white/40 text-xs tabular-nums">{folder.fileCount} files</span>
            <span className="text-white/40 text-xs tabular-nums w-16 text-right">{formatSize(folder.size)}</span>
            <span className="text-white/30 text-xs tabular-nums w-12 text-right">{folder.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
