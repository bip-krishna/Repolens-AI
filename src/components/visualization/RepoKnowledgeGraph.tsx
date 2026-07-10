"use client";

import { useMemo } from "react";
import {
  ReactFlow, Background, Controls,
  useNodesState, useEdgesState,
  type Node, type Edge, Position, Handle
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Network, Database, Users, Server, Globe } from "lucide-react";
import type { FileTreeNode } from "@/types";

interface KnowledgeNode {
  id: string;
  label: string;
  type: "user" | "feature" | "service" | "data" | "external";
}

const typeStyles = {
  user: { bg: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.4)", color: "#3B82F6", icon: Users },
  feature: { bg: "rgba(139, 92, 246, 0.15)", border: "rgba(139, 92, 246, 0.4)", color: "#8B5CF6", icon: Network },
  service: { bg: "rgba(6, 182, 212, 0.15)", border: "rgba(6, 182, 212, 0.4)", color: "#06B6D4", icon: Server },
  data: { bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.4)", color: "#10B981", icon: Database },
  external: { bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)", color: "#F59E0B", icon: Globe },
};

function CustomKnowledgeNode({ data }: { data: { node: KnowledgeNode } }) {
  const { label, type } = data.node;
  const style = typeStyles[type] || typeStyles.feature;
  const Icon = style.icon;

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Left} className="!opacity-0" />
      <div
        className="px-4 py-3 rounded-full border flex items-center gap-2.5 transition-all group-hover:scale-105"
        style={{
          background: style.bg,
          borderColor: style.border,
          boxShadow: `0 0 20px ${style.color}15`,
        }}
      >
        <Icon className="h-4 w-4 shrink-0" style={{ color: style.color }} />
        <span className="text-white font-bold text-xs truncate max-w-[120px]">{label}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!opacity-0" />
    </div>
  );
}

const nodeTypes = { knowledgeNode: CustomKnowledgeNode };

function getSampleKnowledgeGraph(): { nodes: Node[]; edges: Edge[] } {
  // Setup standard force-directed visual ring coordinates
  const rawNodes: KnowledgeNode[] = [
    { id: "users", label: "End Users", type: "user" },
    { id: "dashboard", label: "Dashboard Hub", type: "feature" },
    { id: "auth", label: "Auth Middleware", type: "service" },
    { id: "api", label: "API Gateway", type: "service" },
    { id: "db", label: "Database Store", type: "data" },
    { id: "openai", label: "Groq LLM API", type: "external" },
  ];

  // Circle coordinates mapping
  const centerX = 250;
  const centerY = 180;
  const radius = 140;

  const nodes: Node[] = rawNodes.map((n, idx) => {
    // Distribute nodes evenly in a circle, with root/users in center
    if (n.id === "dashboard") {
      return {
        id: n.id,
        type: "knowledgeNode",
        data: { node: n },
        position: { x: centerX - 60, y: centerY - 20 },
      };
    }

    const angle = (idx / (rawNodes.length - 1)) * 2 * Math.PI;
    return {
      id: n.id,
      type: "knowledgeNode",
      data: { node: n },
      position: {
        x: centerX + radius * Math.cos(angle) - 60,
        y: centerY + radius * Math.sin(angle) - 20,
      },
    };
  });

  const edges: Edge[] = [
    { id: "e1", source: "users", target: "dashboard", animated: true, style: { stroke: "#3B82F660", strokeWidth: 2 } },
    { id: "e2", source: "dashboard", target: "auth", style: { stroke: "#8B5CF640" } },
    { id: "e3", source: "dashboard", target: "api", style: { stroke: "#8B5CF640" } },
    { id: "e4", source: "api", target: "db", style: { stroke: "#10B98140" } },
    { id: "e5", source: "api", target: "openai", animated: true, style: { stroke: "#F59E0B60" } },
  ];

  return { nodes, edges };
}

export function RepoKnowledgeGraph() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => getSampleKnowledgeGraph(), []);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
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
