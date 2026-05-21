"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { FileCode, Folder, Settings, Database, Layout, Server, Puzzle } from "lucide-react";
import type { FileTreeNode } from "@/types";

// Custom node component
function ModuleNode({ data }: { data: any }) {
  const icons: Record<string, any> = {
    component: FileCode, directory: Folder, config: Settings,
    database: Database, page: Layout, api: Server, other: Puzzle,
  };
  const Icon = icons[data.nodeType] || Puzzle;
  const colors: Record<string, string> = {
    component: "#8B5CF6", directory: "#3B82F6", config: "#F59E0B",
    database: "#10B981", page: "#EC4899", api: "#06B6D4", other: "#6B7280",
  };
  const color = colors[data.nodeType] || "#6B7280";

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} className="!bg-purple-500 !w-2 !h-2 !border-0" />
      <div
        className="px-4 py-3 rounded-xl glass text-xs font-medium flex items-center gap-2 min-w-[120px] transition-all duration-200 group-hover:scale-105"
        style={{ borderColor: `${color}33`, boxShadow: `0 0 15px ${color}15` }}
      >
        <Icon className="h-4 w-4 shrink-0" style={{ color }} />
        <span className="truncate">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-2 !h-2 !border-0" />
    </div>
  );
}

const nodeTypes = { module: ModuleNode };

function categorizeNode(name: string, path: string): string {
  if (path.includes("api/") || path.includes("routes/")) return "api";
  if (path.includes("components/") || name.endsWith(".tsx") || name.endsWith(".jsx")) return "component";
  if (path.includes("config") || name.includes("config") || name.startsWith(".")) return "config";
  if (path.includes("prisma") || path.includes("models/") || path.includes("schema")) return "database";
  if (path.includes("pages/") || path.includes("app/") && name === "page.tsx") return "page";
  return "directory";
}

function buildGraphFromTree(tree: FileTreeNode): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeId = 0;

  function traverse(node: FileTreeNode, parentId: string | null, depth: number) {
    if (depth > 3) return; // Limit depth
    if (node.name.startsWith(".") && depth > 0) return;
    if (node.type === "file" && !node.name.match(/\.(tsx?|jsx?|py|rs|go)$/)) return;

    const id = `node-${nodeId++}`;
    const nodeType = node.type === "directory" ? "directory" : categorizeNode(node.name, node.path);

    nodes.push({
      id,
      type: "module",
      data: { label: node.name, nodeType, path: node.path },
      position: { x: 0, y: 0 }, // Will be set by dagre
    });

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${id}`,
        source: parentId,
        target: id,
        style: { stroke: "oklch(0.5 0.1 270 / 40%)", strokeWidth: 1.5 },
        animated: true,
      });
    }

    if (node.children) {
      // Only show important directories
      const important = node.children.filter((c) => {
        if (c.type === "directory") {
          const skip = ["node_modules", ".git", ".next", "dist", "build", "__pycache__", ".cache"];
          return !skip.includes(c.name);
        }
        return c.name.match(/\.(tsx?|jsx?|py|rs|go)$/);
      });
      important.slice(0, 8).forEach((child) => traverse(child, id, depth + 1));
    }
  }

  if (tree.children) {
    tree.children
      .filter((c) => !["node_modules", ".git", ".next"].includes(c.name))
      .slice(0, 10)
      .forEach((child) => traverse(child, null, 0));
  }

  // Apply dagre layout
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 80 });

  nodes.forEach((node) => g.setNode(node.id, { width: 160, height: 50 }));
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  dagre.layout(g);

  nodes.forEach((node) => {
    const pos = g.node(node.id);
    node.position = { x: pos.x - 80, y: pos.y - 25 };
  });

  return { nodes, edges };
}

export function DependencyGraph({ tree }: { tree: FileTreeNode }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => buildGraphFromTree(tree), [tree]);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[500px] rounded-xl overflow-hidden glass">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} color="oklch(1 0 0 / 5%)" />
        <Controls />
        <MiniMap
          nodeColor={(n) => {
            const colors: Record<string, string> = {
              component: "#8B5CF6", directory: "#3B82F6", config: "#F59E0B",
              database: "#10B981", page: "#EC4899", api: "#06B6D4",
            };
            return colors[n.data?.nodeType as string] || "#6B7280";
          }}
          maskColor="oklch(0 0 0 / 70%)"
        />
      </ReactFlow>
    </div>
  );
}
