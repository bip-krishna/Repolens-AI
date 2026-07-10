"use client";

import { useMemo } from "react";
import {
  ReactFlow, Background, Controls,
  useNodesState, useEdgesState,
  type Node, type Edge, Position, Handle
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { Link, ArrowRightLeft, Layout, Globe } from "lucide-react";
import type { FileTreeNode } from "@/types";

interface PageNodeData {
  id: string;
  label: string;
  path: string;
  isEntry?: boolean;
}

function PageNavNode({ data }: { data: { page: PageNodeData } }) {
  const { label, path, isEntry } = data.page;

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Left} className="!bg-white/30 !w-2 !h-2 !border-0" />
      <div
        className="px-4 py-2.5 rounded-xl border min-w-[150px] transition-all group-hover:scale-105"
        style={{
          background: isEntry ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.03)",
          borderColor: isEntry ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.1)",
          boxShadow: isEntry ? "0 0 15px rgba(59, 130, 246, 0.15)" : "none",
        }}
      >
        <div className="flex items-center gap-1.5 justify-center mb-1">
          {isEntry ? (
            <Globe className="h-3.5 w-3.5 text-blue-400" />
          ) : (
            <Layout className="h-3.5 w-3.5 text-purple-400" />
          )}
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">
            {isEntry ? "Entry View" : "View Route"}
          </span>
        </div>
        <div className="text-white font-medium text-xs truncate text-center">{label}</div>
        <div className="text-white/40 text-[9px] font-mono truncate text-center mt-0.5">{path}</div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-white/30 !w-2 !h-2 !border-0" />
    </div>
  );
}

const nodeTypes = { pageNavNode: PageNavNode };

function detectPages(tree: FileTreeNode): { pages: PageNodeData[]; edges: { source: string; target: string }[] } {
  // Infer page routes from app/ directory structure
  const pages: PageNodeData[] = [];
  const edges: { source: string; target: string }[] = [];

  function traverse(node: FileTreeNode) {
    if (node.type === "file" && (node.name === "page.tsx" || node.name === "page.jsx")) {
      let routePath = "/" + node.path.replace(/\\/g, "/");
      if (routePath.includes("/app/")) {
        routePath = routePath.substring(routePath.indexOf("/app/") + 4);
        routePath = routePath.replace("/page.tsx", "").replace("/page.jsx", "");
        if (routePath === "") routePath = "/";
      }

      const name = routePath === "/" ? "Home" : routePath.split("/").pop() || "Page";
      pages.push({
        id: routePath,
        label: name.charAt(0).toUpperCase() + name.slice(1),
        path: routePath,
        isEntry: routePath === "/",
      });
    }
    node.children?.forEach(traverse);
  }

  traverse(tree);

  // Fallback defaults
  if (pages.length === 0) {
    pages.push(
      { id: "/", label: "Landing", path: "/", isEntry: true },
      { id: "/login", label: "Login / Signup", path: "/login" },
      { id: "/dashboard", label: "Dashboard Dashboard", path: "/dashboard" },
      { id: "/settings", label: "Settings Panel", path: "/settings" }
    );
  }

  // Connect them sequentially or to dashboard
  const home = pages.find((p) => p.isEntry) || pages[0];
  const login = pages.find((p) => p.id.includes("login") || p.id.includes("auth"));
  const dashboard = pages.find((p) => p.id.includes("dashboard"));

  if (login && home) edges.push({ source: home.id, target: login.id });
  if (dashboard && login) edges.push({ source: login.id, target: dashboard.id });
  
  pages.forEach((p) => {
    if (p.id !== home.id && p.id !== login?.id && p.id !== dashboard?.id) {
      edges.push({ source: dashboard ? dashboard.id : home.id, target: p.id });
    }
  });

  return { pages, edges };
}

function layoutNav(pages: PageNodeData[], rawEdges: { source: string; target: string }[]) {
  const nodes: Node[] = pages.map((page) => ({
    id: page.id,
    type: "pageNavNode",
    data: { page },
    position: { x: 0, y: 0 },
  }));

  const edges: Edge[] = rawEdges.map((e, idx) => ({
    id: `e-nav-${idx}`,
    source: e.source,
    target: e.target,
    animated: true,
    style: { stroke: "rgba(139, 92, 246, 0.4)", strokeWidth: 1.5 },
  }));

  // Dagre Tree layout (LR)
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 40, ranksep: 100 });
  nodes.forEach((n) => g.setNode(n.id, { width: 170, height: 60 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  nodes.forEach((n) => {
    const pos = g.node(n.id);
    n.position = { x: pos.x - 85, y: pos.y - 30 };
  });

  return { nodes, edges };
}

export function PageNavigationGraph({ tree }: { tree: FileTreeNode }) {
  const { pages, edges: rawEdges } = useMemo(() => detectPages(tree), [tree]);
  const { nodes: initial, edges: initialEdges } = useMemo(() => layoutNav(pages, rawEdges), [pages, rawEdges]);
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
