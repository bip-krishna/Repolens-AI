"use client";

import { useMemo } from "react";
import {
  ReactFlow, Background, Controls,
  useNodesState, useEdgesState,
  type Node, type Edge, Position, Handle
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { Package, GitCommit } from "lucide-react";
import type { FileTreeNode } from "@/types";

interface DependencyItem {
  name: string;
  version: string;
  category: "core" | "ui" | "tooling" | "dev";
}

const catStyles = {
  core: { bg: "rgba(139, 92, 246, 0.1)", border: "rgba(139, 92, 246, 0.3)", color: "#8B5CF6" },
  ui: { bg: "rgba(6, 182, 212, 0.1)", border: "rgba(6, 182, 212, 0.3)", color: "#06B6D4" },
  tooling: { bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.3)", color: "#F59E0B" },
  dev: { bg: "rgba(107, 114, 128, 0.1)", border: "rgba(107, 114, 128, 0.3)", color: "#6B7280" },
};

function DependencyNode({ data }: { data: { dep: DependencyItem } }) {
  const { name, version, category } = data.dep;
  const style = catStyles[category] || catStyles.core;

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Left} className="!bg-white/30 !w-2 !h-2 !border-0" />
      <div
        className="px-4 py-2.5 rounded-xl min-w-[170px] border flex items-center gap-2.5 transition-all group-hover:scale-105"
        style={{
          background: style.bg,
          borderColor: style.border,
          boxShadow: `0 0 15px ${style.color}08`,
        }}
      >
        <div className="p-1.5 rounded bg-white/5">
          <Package className="h-3.5 w-3.5" style={{ color: style.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-white font-medium text-xs truncate">{name}</div>
          <div className="text-white/40 text-[9px] font-mono truncate">{version}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-white/30 !w-2 !h-2 !border-0" />
    </div>
  );
}

const nodeTypes = { depNode: DependencyNode };

function getSampleDependencies(tree: FileTreeNode): DependencyItem[] {
  // Safe sample dependencies representing typical Next.js apps
  return [
    { name: "next", version: "^15.1.0", category: "core" },
    { name: "react", version: "^19.0.0", category: "core" },
    { name: "react-dom", version: "^19.0.0", category: "core" },
    { name: "tailwindcss", version: "^4.0.0", category: "ui" },
    { name: "recharts", version: "^2.15.0", category: "ui" },
    { name: "framer-motion", version: "^11.15.0", category: "ui" },
    { name: "lucide-react", version: "^0.468.0", category: "ui" },
    { name: "typescript", version: "^5.0.0", category: "dev" },
  ];
}

function layoutDeps(deps: DependencyItem[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Central Framework Root (next)
  nodes.push({
    id: "app-root",
    type: "default",
    data: {
      label: (
        <div className="flex items-center gap-2 text-white">
          <GitCommit className="h-4 w-4 text-purple-400" />
          <span>App Entry</span>
        </div>
      ),
    },
    position: { x: 0, y: 0 },
    style: { background: "rgba(139, 92, 246, 0.15)", border: "1px solid rgba(139, 92, 246, 0.4)", borderRadius: "12px" },
  });

  deps.forEach((dep) => {
    nodes.push({
      id: dep.name,
      type: "depNode",
      data: { dep },
      position: { x: 0, y: 0 },
    });

    edges.push({
      id: `e-root-${dep.name}`,
      source: "app-root",
      target: dep.name,
      animated: true,
      style: { stroke: "rgba(255, 255, 255, 0.15)", strokeWidth: 1.5 },
    });
  });

  // Dagre Left-to-Right layout
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 30, ranksep: 80 });
  nodes.forEach((n) => g.setNode(n.id, { width: 180, height: 60 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  nodes.forEach((n) => {
    const pos = g.node(n.id);
    n.position = { x: pos.x - 90, y: pos.y - 30 };
  });

  return { nodes, edges };
}

export function PackageRelationship({ tree }: { tree: FileTreeNode }) {
  const deps = useMemo(() => getSampleDependencies(tree), [tree]);
  const { nodes: initial, edges: initialEdges } = useMemo(() => layoutDeps(deps), [deps]);
  const [nodes, , onNodesChange] = useNodesState(initial);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[400px] rounded-xl overflow-hidden liquid-glass">
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView minZoom={0.3} maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} color="oklch(1 0 0 / 5%)" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
