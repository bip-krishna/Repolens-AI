"use client";

import { useMemo } from "react";
import {
  ReactFlow, Background, Controls,
  useNodesState, useEdgesState,
  type Node, type Edge, Handle, Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { Monitor, Server, Database, Cloud, Shield, Globe } from "lucide-react";
import type { FileTreeNode, Framework } from "@/types";

const layerConfig: Record<string, { color: string; icon: any; order: number }> = {
  "Client / Browser": { color: "#3B82F6", icon: Globe, order: 0 },
  "Frontend": { color: "#8B5CF6", icon: Monitor, order: 1 },
  "Middleware": { color: "#F59E0B", icon: Shield, order: 2 },
  "Backend / API": { color: "#06B6D4", icon: Server, order: 3 },
  "Database": { color: "#10B981", icon: Database, order: 4 },
  "External Services": { color: "#EC4899", icon: Cloud, order: 5 },
};

function LayerNode({ data }: { data: any }) {
  const config = layerConfig[data.layer] || layerConfig["Frontend"];
  const Icon = config.icon;
  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} className="!bg-white/30 !w-2 !h-2 !border-0" />
      <div
        className="px-6 py-4 rounded-2xl text-sm font-medium flex items-center gap-3 min-w-[180px] transition-all group-hover:scale-105"
        style={{
          background: `${config.color}15`,
          border: `1px solid ${config.color}30`,
          boxShadow: `0 0 20px ${config.color}10`,
        }}
      >
        <div className="p-2 rounded-lg" style={{ background: `${config.color}20` }}>
          <Icon className="h-4 w-4" style={{ color: config.color }} />
        </div>
        <div>
          <div className="text-white font-medium">{data.label}</div>
          {data.sublabel && <div className="text-white/40 text-xs mt-0.5">{data.sublabel}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-white/30 !w-2 !h-2 !border-0" />
    </div>
  );
}

const nodeTypes = { layer: LayerNode };

function detectArchitecture(tree: FileTreeNode, frameworks: Framework[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const topDirs = tree.children?.map((c) => c.name.toLowerCase()) || [];
  const fwNames = frameworks.map((f) => f.name.toLowerCase());

  // Detect architecture type
  const hasNext = fwNames.includes("next.js");
  const hasReact = fwNames.includes("react");
  const hasExpress = fwNames.includes("express.js");
  const hasPrisma = fwNames.includes("prisma");
  const hasDocker = fwNames.includes("docker");
  const hasPython = fwNames.some((f) => f.includes("python") || f.includes("flask") || f.includes("django"));

  let id = 0;
  const addNode = (label: string, sublabel: string, layer: string) => {
    const nid = `arch-${id++}`;
    nodes.push({ id: nid, type: "layer", data: { label, sublabel, layer }, position: { x: 0, y: 0 } });
    return nid;
  };

  const n1 = addNode("Client / Browser", "User Interface", "Client / Browser");

  if (hasNext) {
    const n2 = addNode("Next.js Frontend", "React + SSR", "Frontend");
    const n3 = addNode("Route Handlers", "API Routes", "Backend / API");
    edges.push({ id: `e-${n1}-${n2}`, source: n1, target: n2, animated: true, style: { stroke: "#8B5CF640" } });
    edges.push({ id: `e-${n2}-${n3}`, source: n2, target: n3, animated: true, style: { stroke: "#06B6D440" } });

    if (hasPrisma) {
      const n4 = addNode("Prisma ORM", "Database Layer", "Database");
      const n5 = addNode("Database", "SQLite / PostgreSQL", "Database");
      edges.push({ id: `e-${n3}-${n4}`, source: n3, target: n4, animated: true, style: { stroke: "#10B98140" } });
      edges.push({ id: `e-${n4}-${n5}`, source: n4, target: n5, animated: true, style: { stroke: "#10B98140" } });
    } else {
      const n4 = addNode("Data Layer", "API / Database", "Database");
      edges.push({ id: `e-${n3}-${n4}`, source: n3, target: n4, animated: true, style: { stroke: "#10B98140" } });
    }
  } else if (hasPython) {
    const n2 = addNode("Flask / Django", "Python Backend", "Backend / API");
    const n3 = addNode("Controllers", "Business Logic", "Middleware");
    const n4 = addNode("Models", "Data Models", "Database");
    const n5 = addNode("Database", "SQL / NoSQL", "Database");
    edges.push({ id: `e-${n1}-${n2}`, source: n1, target: n2, animated: true, style: { stroke: "#06B6D440" } });
    edges.push({ id: `e-${n2}-${n3}`, source: n2, target: n3, animated: true, style: { stroke: "#F59E0B40" } });
    edges.push({ id: `e-${n3}-${n4}`, source: n3, target: n4, animated: true, style: { stroke: "#10B98140" } });
    edges.push({ id: `e-${n4}-${n5}`, source: n4, target: n5, animated: true, style: { stroke: "#10B98140" } });
  } else {
    // Generic
    const n2 = addNode("Frontend", hasReact ? "React" : "UI Layer", "Frontend");
    const n3 = addNode("Backend", hasExpress ? "Express.js" : "Server", "Backend / API");
    const n4 = addNode("Data Store", "Database", "Database");
    edges.push({ id: `e-${n1}-${n2}`, source: n1, target: n2, animated: true, style: { stroke: "#8B5CF640" } });
    edges.push({ id: `e-${n2}-${n3}`, source: n2, target: n3, animated: true, style: { stroke: "#06B6D440" } });
    edges.push({ id: `e-${n3}-${n4}`, source: n3, target: n4, animated: true, style: { stroke: "#10B98140" } });
  }

  // External services
  if (fwNames.some((f) => f.includes("openai") || f.includes("groq"))) {
    const extId = addNode("AI Service", "OpenAI / Groq", "External Services");
    const apiNode = nodes.find((n) => n.data.layer === "Backend / API");
    if (apiNode) {
      edges.push({ id: `e-${apiNode.id}-${extId}`, source: apiNode.id, target: extId, animated: true, style: { stroke: "#EC489940" } });
    }
  }

  // Layout with dagre
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 80, ranksep: 100 });
  nodes.forEach((n) => g.setNode(n.id, { width: 220, height: 70 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  nodes.forEach((n) => {
    const pos = g.node(n.id);
    n.position = { x: pos.x - 110, y: pos.y - 35 };
  });

  return { nodes, edges };
}

export function ArchitectureDiagram({ tree, frameworks }: { tree: FileTreeNode; frameworks: Framework[] }) {
  const { nodes: initial, edges: initialEdges } = useMemo(() => detectArchitecture(tree, frameworks), [tree, frameworks]);
  const [nodes, , onNodesChange] = useNodesState(initial);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[500px] rounded-xl overflow-hidden liquid-glass">
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView minZoom={0.3} maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} color="oklch(1 0 0 / 5%)" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
