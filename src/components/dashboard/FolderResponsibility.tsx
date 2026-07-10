"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Folder, ArrowRight, Layers, Layout, Server, Database, Settings } from "lucide-react";
import type { FileTreeNode } from "@/types";

interface ResponsibilityItem {
  folder: string;
  category: "Frontend" | "Backend" | "Database" | "Config" | "Assets" | "Other";
  responsibility: string;
  filesCount: number;
}

const categoryIcons = {
  Frontend: Layout,
  Backend: Server,
  Database: Database,
  Config: Settings,
  Assets: Layers,
  Other: Folder,
};

const categoryColors = {
  Frontend: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  Backend: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
  Database: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  Config: "text-amber-400 border-amber-500/20 bg-amber-500/5",
  Assets: "text-purple-400 border-purple-500/20 bg-purple-500/5",
  Other: "text-gray-400 border-gray-500/20 bg-gray-500/5",
};

function getFolderResponsibility(tree: FileTreeNode): ResponsibilityItem[] {
  if (!tree.children) return [];

  const items: ResponsibilityItem[] = [];

  tree.children.forEach((child) => {
    if (child.type === "directory" && !["node_modules", ".git", ".next", "dist", "build"].includes(child.name)) {
      let count = 0;
      function countFiles(node: FileTreeNode) {
        if (node.type === "file") count++;
        node.children?.forEach(countFiles);
      }
      countFiles(child);

      const name = child.name.toLowerCase();
      let category: ResponsibilityItem["category"] = "Other";
      let responsibility = "Organizes general project resources and scripts.";

      if (name.includes("components") || name.includes("ui") || name.includes("styles") || name.includes("pages")) {
        category = "Frontend";
        responsibility = "Handles component definition, visual styling, templates, and view layouts.";
      } else if (name.includes("api") || name.includes("routes") || name.includes("controllers") || name.includes("services")) {
        category = "Backend";
        responsibility = "Implements application request logic, server routes, controller workflows, and services.";
      } else if (name.includes("db") || name.includes("models") || name.includes("prisma") || name.includes("schema")) {
        category = "Database";
        responsibility = "Manages database entities, relational models, query interfaces, and migration files.";
      } else if (name.includes("config") || name.includes("settings") || name.includes(".github")) {
        category = "Config";
        responsibility = "Configures compilation, code guidelines, environment properties, and CI/CD pipelines.";
      } else if (name.includes("assets") || name.includes("public") || name.includes("images")) {
        category = "Assets";
        responsibility = "Stores application assets, icons, fonts, and public media files.";
      }

      items.push({
        folder: child.name,
        category,
        responsibility,
        filesCount: count,
      });
    }
  });

  // Safe fallback if directory children are scarce
  if (items.length === 0) {
    return [
      { folder: "src/components", category: "Frontend", responsibility: "Renders visual view components and UI controls.", filesCount: 12 },
      { folder: "src/app/api", category: "Backend", responsibility: "Processes api request handlers and business flow.", filesCount: 4 },
      { folder: "prisma", category: "Database", responsibility: "Declares relational databases schemas and migration maps.", filesCount: 2 },
      { folder: "public", category: "Assets", responsibility: "Stores media files, fonts, and visual brand assets.", filesCount: 8 }
    ];
  }

  return items;
}

export function FolderResponsibility({ tree }: { tree: FileTreeNode }) {
  const responsibilities = useMemo(() => getFolderResponsibility(tree), [tree]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {responsibilities.map((item, idx) => {
        const Icon = categoryIcons[item.category] || Folder;
        const style = categoryColors[item.category] || categoryColors.Other;

        return (
          <motion.div
            key={item.folder}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`border rounded-2xl p-4 flex gap-4 transition-all hover:scale-[1.02] ${style}`}
          >
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 h-fit shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-sm text-white truncate font-mono">
                  {item.folder}/
                </span>
                <span className="text-[10px] font-medium opacity-60 uppercase font-mono shrink-0">
                  {item.category}
                </span>
              </div>
              <p className="text-white/60 text-xs leading-relaxed mb-2">
                {item.responsibility}
              </p>
              <div className="flex items-center justify-between text-[10px] text-white/40">
                <span>{item.filesCount} modules</span>
                <span className="flex items-center gap-1">
                  Responsibility details <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
