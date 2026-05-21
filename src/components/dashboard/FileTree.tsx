"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Folder, FolderOpen, FileText, FileCode, FileJson, Image, FileType, Settings, Database, TestTube } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileTreeNode } from "@/types";

const fileIconMap: Record<string, typeof FileText> = {
  ".ts": FileCode, ".tsx": FileCode, ".js": FileCode, ".jsx": FileCode,
  ".py": FileCode, ".rs": FileCode, ".go": FileCode, ".rb": FileCode,
  ".json": FileJson, ".yaml": FileJson, ".yml": FileJson, ".toml": FileJson,
  ".png": Image, ".jpg": Image, ".svg": Image, ".gif": Image, ".webp": Image,
  ".md": FileType, ".txt": FileType, ".css": FileCode, ".scss": FileCode,
  ".sql": Database, ".prisma": Database,
  ".test.ts": TestTube, ".test.tsx": TestTube, ".spec.ts": TestTube,
  ".config.js": Settings, ".config.ts": Settings,
};

function getFileIcon(name: string) {
  for (const [ext, icon] of Object.entries(fileIconMap)) {
    if (name.endsWith(ext)) return icon;
  }
  return FileText;
}

function getFileColor(name: string): string {
  if (name.match(/\.(ts|tsx)$/)) return "text-blue-400";
  if (name.match(/\.(js|jsx)$/)) return "text-yellow-400";
  if (name.match(/\.(py)$/)) return "text-green-400";
  if (name.match(/\.(json|yaml|yml)$/)) return "text-amber-400";
  if (name.match(/\.(css|scss)$/)) return "text-pink-400";
  if (name.match(/\.(md|txt)$/)) return "text-gray-400";
  if (name.match(/\.(png|jpg|svg)$/)) return "text-purple-400";
  return "text-muted-foreground";
}

function TreeItem({ node, depth = 0 }: { node: FileTreeNode; depth?: number }) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const isDir = node.type === "directory";
  const Icon = isDir ? (isOpen ? FolderOpen : Folder) : getFileIcon(node.name);
  const color = isDir ? "text-blue-400" : getFileColor(node.name);

  return (
    <div>
      <button
        onClick={() => isDir && setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-2 py-1 px-2 rounded-md text-sm hover:bg-white/5 transition-colors text-left",
          isDir && "cursor-pointer",
          !isDir && "cursor-default"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isDir && (
          <ChevronRight className={cn("h-3 w-3 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-90")} />
        )}
        {!isDir && <span className="w-3" />}
        <Icon className={cn("h-4 w-4 shrink-0", color)} />
        <span className="truncate">{node.name}</span>
        {node.size && !isDir && (
          <span className="ml-auto text-xs text-muted-foreground/50 shrink-0">
            {node.size > 1024 ? `${(node.size / 1024).toFixed(1)}KB` : `${node.size}B`}
          </span>
        )}
      </button>
      <AnimatePresence>
        {isDir && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <TreeItem key={child.path} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FileTree({ tree }: { tree: FileTreeNode }) {
  return (
    <div className="font-mono text-sm">
      {tree.children?.map((child) => (
        <TreeItem key={child.path} node={child} depth={0} />
      ))}
    </div>
  );
}
