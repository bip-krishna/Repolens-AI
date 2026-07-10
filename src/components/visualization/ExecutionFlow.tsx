"use client";

import { useMemo } from "react";
import {
  ReactFlow, Background, Controls,
  useNodesState, useEdgesState,
  type Node, type Edge, Handle, Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import type { ExecutionFlowData } from "@/types";

const typeColors: Record<string, string> = {
  entry: "#3B82F6", frontend: "#8B5CF6", middleware: "#F59E0B",
  backend: "#06B6D4", database: "#10B981", external: "#EC4899", response: "#22C55E",
};

function FlowStepNode({ data }: { data: any }) {
  const color = typeColors[data.nodeType] || "#6B7280";
  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} className="!bg-white/30 !w-2 !h-2 !border-0" />
      <div
        className="px-5 py-3 rounded-xl text-sm font-medium min-w-[140px] text-center transition-all group-hover:scale-105"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}30`,
          boxShadow: `0 0 15px ${color}10`,
        }}
      >
        <div className="text-white font-medium">{data.label}</div>
        {data.description && <div className="text-white/40 text-xs mt-1">{data.description}</div>}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-white/30 !w-2 !h-2 !border-0" />
    </div>
  );
}

const nodeTypes = { flowStep: FlowStepNode };

function layoutFlow(flowData: ExecutionFlowData) {
  const nodes: Node[] = flowData.nodes.map((n) => ({
    id: n.id, type: "flowStep",
    data: { label: n.label, nodeType: n.type, description: n.description },
    position: { x: 0, y: 0 },
  }));

  const edges: Edge[] = flowData.edges.map((e, i) => ({
    id: `flow-edge-${i}`, source: e.source, target: e.target,
    label: e.label, animated: true,
    style: { stroke: "rgba(139, 92, 246, 0.4)", strokeWidth: 2 },
    labelStyle: { fill: "rgba(255,255,255,0.5)", fontSize: 10 },
  }));

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 80 });
  nodes.forEach((n) => g.setNode(n.id, { width: 180, height: 60 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  nodes.forEach((n) => {
    const pos = g.node(n.id);
    n.position = { x: pos.x - 90, y: pos.y - 30 };
  });

  return { nodes, edges };
}

export function ExecutionFlow({ flowData }: { flowData: ExecutionFlowData }) {
  const { nodes: initial, edges: initialEdges } = useMemo(() => layoutFlow(flowData), [flowData]);
  const [nodes, , onNodesChange] = useNodesState(initial);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  if (!flowData.nodes.length) {
    return <div className="text-center py-12 text-white/40">No execution flow data available</div>;
  }

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
