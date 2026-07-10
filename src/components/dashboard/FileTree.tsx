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

function TreeItem({ node, depth = 0, selectedPath, onSelect }: { node: FileTreeNode; depth?: number; selectedPath?: string; onSelect: (node: FileTreeNode) => void }) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const isDir = node.type === "directory";
  const Icon = isDir ? (isOpen ? FolderOpen : Folder) : getFileIcon(node.name);
  const color = isDir ? "text-blue-400" : getFileColor(node.name);
  const isSelected = selectedPath === node.path;

  return (
    <div>
      <button
        onClick={() => {
          onSelect(node);
          if (isDir) {
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          "w-full flex items-center gap-2 py-1 px-2 rounded-md text-sm hover:bg-white/5 transition-colors text-left",
          isSelected ? "bg-white/10 text-white font-medium" : "text-white/70"
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
              <TreeItem key={child.path} node={child} depth={depth + 1} selectedPath={selectedPath} onSelect={onSelect} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FileTree({ tree }: { tree: FileTreeNode }) {
  const [selectedNode, setSelectedNode] = useState<FileTreeNode | null>(null);

  const stats = useMemo(() => {
    if (!selectedNode) return null;
    const isDir = selectedNode.type === "directory";
    const name = selectedNode.name;
    const path = selectedNode.path || "/";
    const sizeStr = selectedNode.size 
      ? (selectedNode.size > 1024 ? `${(selectedNode.size / 1024).toFixed(1)}KB` : `${selectedNode.size}B`)
      : "N/A";
    
    // Heuristic/Dynamic purpose extraction
    let purpose = "";
    if (isDir) {
      if (name.includes("api") || name.includes("routes")) purpose = "Hosts backend API routes and request handlers.";
      else if (name.includes("components")) purpose = "Contains reusable UI elements and layouts.";
      else if (name.includes("lib") || name.includes("utils")) purpose = "Common utility helper functions and shared clients.";
      else if (name.includes("context") || name.includes("store")) purpose = "State management stores or provider modules.";
      else purpose = "Organizes project directories and subsystem modules.";
    } else {
      if (name.includes("route")) purpose = "Defines api router endpoints.";
      else if (name.includes("layout")) purpose = "Core frame and template wrap for the page layout.";
      else if (name.includes("page")) purpose = "Client page routing view component.";
      else if (name.includes("config")) purpose = "Configuration settings and system options.";
      else purpose = "Standard codebase module logic file.";
    }

    return { isDir, name, path, sizeStr, purpose };
  }, [selectedNode]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px]">
      <div className="font-mono text-sm border-r border-white/5 pr-4">
        {tree.children?.map((child) => (
          <TreeItem 
            key={child.path} 
            node={child} 
            depth={0} 
            selectedPath={selectedNode?.path}
            onSelect={setSelectedNode} 
          />
        ))}
      </div>
      <div>
        {stats ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="liquid-glass rounded-xl p-5 space-y-4"
          >
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-400 mb-0.5">
                {stats.isDir ? "Folder Details" : "File Details"}
              </div>
              <h4 className="text-white font-bold text-lg truncate">{stats.name}</h4>
              <div className="text-[10px] font-mono text-white/40 truncate mt-0.5">{stats.path}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white/5 rounded-lg p-2.5">
                <span className="text-white/40 block mb-1">Type</span>
                <span className="text-white font-medium capitalize">{selectedNode?.type}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5">
                <span className="text-white/40 block mb-1">Size</span>
                <span className="text-white font-medium">{stats.sizeStr}</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-3 text-xs leading-relaxed">
              <span className="text-white/40 block mb-1.5 font-semibold">Purpose</span>
              <span className="text-white/80">{stats.purpose}</span>
            </div>

            {!stats.isDir && selectedNode?.extension && (
              <div className="text-xs text-white/40 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Language extension: <code className="text-white/60">.{selectedNode.extension}</code>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center text-white/30 text-xs italic p-12 text-center">
            Click on any file or folder in the explorer to view its properties and details.
          </div>
        )}
      </div>
    </div>
  );
}

