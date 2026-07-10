"use client";

import { useMemo } from "react";
import {
  ReactFlow, Background, Controls,
  useNodesState, useEdgesState,
  type Node, type Edge, Position, Handle
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { Layout, FileCode, PlaySquare } from "lucide-react";
import type { FileTreeNode } from "@/types";

interface ComponentNodeData {
  name: string;
  type: "layout" | "page" | "component" | "provider";
  path: string;
}

const typeStyles = {
  layout: { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.3)", color: "#3B82F6" },
  page: { bg: "rgba(139, 92, 246, 0.1)", border: "rgba(139, 92, 246, 0.3)", color: "#8B5CF6" },
  component: { bg: "rgba(6, 182, 212, 0.1)", border: "rgba(6, 182, 212, 0.3)", color: "#06B6D4" },
  provider: { bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.3)", color: "#F59E0B" },
};

function HierarchyNode({ data }: { data: { node: ComponentNodeData } }) {
  const { name, type, path } = data.node;
  const style = typeStyles[type] || typeStyles.component;

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} className="!bg-white/30 !w-2 !h-2 !border-0" />
      <div
        className="px-4 py-2.5 rounded-xl min-w-[150px] border transition-all group-hover:scale-105"
        style={{
          background: style.bg,
          borderColor: style.border,
          boxShadow: `0 0 15px ${style.color}08`,
        }}
      >
        <div className="flex items-center gap-1.5 justify-center mb-1">
          {type === "layout" && <Layout className="h-3 w-3" style={{ color: style.color }} />}
          {type === "page" && <PlaySquare className="h-3 w-3" style={{ color: style.color }} />}
          {type === "component" && <FileCode className="h-3 w-3" style={{ color: style.color }} />}
          <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: style.color }}>
            {type}
          </span>
        </div>
        <div className="text-white font-medium text-xs truncate text-center">{name}</div>
        <div className="text-white/30 text-[8px] truncate mt-0.5 text-center">{path}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-white/30 !w-2 !h-2 !border-0" />
    </div>
  );
}

const nodeTypes = { hierarchyNode: HierarchyNode };

function buildHierarchyFromTree(tree: FileTreeNode): ComponentNodeData[] {
  const nodes: ComponentNodeData[] = [];

  function traverse(node: FileTreeNode) {
    if (node.type === "file" && node.extension && ["tsx", "jsx"].includes(node.extension)) {
      let type: ComponentNodeData["type"] = "component";
      if (node.name.toLowerCase().includes("layout")) type = "layout";
      else if (node.name.toLowerCase().includes("page")) type = "page";
      else if (node.name.toLowerCase().includes("provider") || node.name.toLowerCase().includes("context")) type = "provider";

      nodes.push({
        name: node.name.replace(".tsx", "").replace(".jsx", ""),
        type,
        path: node.path,
      });
    }
    node.children?.forEach(traverse);
  }

  traverse(tree);

  // Fallback defaults if no UI components found
  if (nodes.length === 0) {
    nodes.push(
      { name: "RootLayout", type: "layout", path: "app/layout.tsx" },
      { name: "HomePage", type: "page", path: "app/page.tsx" },
      { name: "Navbar", type: "component", path: "components/Navbar.tsx" },
      { name: "HeroSection", type: "component", path: "components/HeroSection.tsx" },
      { name: "Footer", type: "component", path: "components/Footer.tsx" }
    );
  }

  return nodes;
}

function layoutHierarchy(nodesList: ComponentNodeData[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Find root/parent nodes (Layouts usually, or Pages)
  const layouts = nodesList.filter((n) => n.type === "layout");
  const pages = nodesList.filter((n) => n.type === "page");
  const components = nodesList.filter((n) => n.type === "component");
  const providers = nodesList.filter((n) => n.type === "provider");

  // Establish a clean tree hierarchy
  // Layouts -> Pages -> Components
  // If multiple, link them systematically
  const parentNode = layouts[0] || pages[0] || nodesList[0];

  nodesList.forEach((node) => {
    nodes.push({
      id: node.path,
      type: "hierarchyNode",
      data: { node },
      position: { x: 0, y: 0 },
    });

    if (node.path !== parentNode.path) {
      // Connect to parent
      // Pages connect to Layout. Components connect to Page. Providers connect to Layout.
      let sourcePath = parentNode.path;
      if (node.type === "component" && pages.length > 0) {
        sourcePath = pages[0].path; // default link to first page
      }

      edges.push({
        id: `e-${sourcePath}-${node.path}`,
        source: sourcePath,
        target: node.path,
        style: { stroke: "rgba(255, 255, 255, 0.15)", strokeWidth: 1.5 },
      });
    }
  });

  // Dagre Tree layout (TB)
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 40, ranksep: 80 });
  nodes.forEach((n) => g.setNode(n.id, { width: 170, height: 60 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  nodes.forEach((n) => {
    const pos = g.node(n.id);
    n.position = { x: pos.x - 85, y: pos.y - 30 };
  });

  return { nodes, edges };
}

export function ComponentHierarchy({ tree }: { tree: FileTreeNode }) {
  const nodesList = useMemo(() => buildHierarchyFromTree(tree), [tree]);
  const { nodes: initial, edges: initialEdges } = useMemo(() => layoutHierarchy(nodesList), [nodesList]);
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
