"use client";

import { useMemo } from "react";
import {
  ReactFlow, Background, Controls,
  useNodesState, useEdgesState,
  type Node, type Edge, Position, Handle
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { Activity, Layers, RefreshCw } from "lucide-react";
import type { FileTreeNode } from "@/types";

interface StateFlowStep {
  id: string;
  label: string;
  type: "action" | "store" | "view" | "reducer";
  description: string;
}

const typeStyles = {
  action: { bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.3)", color: "#F59E0B" },
  store: { bg: "rgba(139, 92, 246, 0.1)", border: "rgba(139, 92, 246, 0.3)", color: "#8B5CF6" },
  view: { bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.3)", color: "#3B82F6" },
  reducer: { bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.3)", color: "#10B981" },
};

function StateNode({ data }: { data: { step: StateFlowStep } }) {
  const { label, type, description } = data.step;
  const style = typeStyles[type] || typeStyles.view;

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Top} className="!bg-white/30 !w-2 !h-2 !border-0" />
      <div
        className="px-4 py-3 rounded-xl text-center min-w-[165px] border transition-all group-hover:scale-105"
        style={{
          background: style.bg,
          borderColor: style.border,
          boxShadow: `0 0 15px ${style.color}08`,
        }}
      >
        <div className="text-[10px] uppercase font-bold tracking-wider mb-0.5" style={{ color: style.color }}>
          {type}
        </div>
        <div className="text-white font-medium text-xs truncate">{label}</div>
        <div className="text-white/40 text-[9px] mt-1 leading-normal">{description}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-white/30 !w-2 !h-2 !border-0" />
    </div>
  );
}

const nodeTypes = { stateNode: StateNode };

function detectStateSteps(tree: FileTreeNode): StateFlowStep[] {
  // Try to find if Zustand or Redux or Context is used by searching folder structures
  let isZustand = false;
  let isRedux = false;
  let isContext = false;

  function scan(node: FileTreeNode) {
    const name = node.name.toLowerCase();
    if (name.includes("store")) {
      isZustand = true;
    }
    if (name.includes("redux") || name.includes("slice") || name.includes("reducer")) {
      isRedux = true;
    }
    if (name.includes("context") || name.includes("provider")) {
      isContext = true;
    }
    node.children?.forEach(scan);
  }
  scan(tree);

  if (isRedux) {
    return [
      { id: "action", label: "Dispatch Action", type: "action", description: "UI dispatches a Redux Action (e.g. loginRequest)" },
      { id: "reducer", label: "Reducer Update", type: "reducer", description: "Reducer processes Action and calculates new state" },
      { id: "store", label: "Redux Store", type: "store", description: "Central Redux Store updates with new immutable state slice" },
      { id: "view", label: "UI View Render", type: "view", description: "Components subbed via useSelector re-render with new data" }
    ];
  }

  if (isZustand) {
    return [
      { id: "action", label: "Call Store Action", type: "action", description: "UI calls setter function (e.g. useStore.getState().setUser)" },
      { id: "store", label: "Zustand Store", type: "store", description: "Zustand store updates reactive state fields directly" },
      { id: "view", label: "UI View Render", type: "view", description: "Components using the store hook trigger re-render on selection" }
    ];
  }

  // Default: React Context/State flow
  return [
    { id: "action", label: "Update State Handler", type: "action", description: "User interacts and calls state setters (setState/dispatch)" },
    { id: "store", label: "React Context Provider", type: "store", description: "Provider updates its value prop & triggers context updates" },
    { id: "view", label: "Consumer Component", type: "view", description: "Components reading the Context update and refresh UI" }
  ];
}

function layoutFlow(steps: StateFlowStep[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  steps.forEach((step, idx) => {
    nodes.push({
      id: step.id,
      type: "stateNode",
      data: { step },
      position: { x: 0, y: 0 },
    });

    if (idx > 0) {
      edges.push({
        id: `e-${steps[idx - 1].id}-${step.id}`,
        source: steps[idx - 1].id,
        target: step.id,
        animated: true,
        style: { stroke: "rgba(139, 92, 246, 0.4)", strokeWidth: 1.5 },
      });
    }
  });

  // Cyclic edge from last back to first to show loop
  if (steps.length > 1) {
    edges.push({
      id: `e-loopback`,
      source: steps[steps.length - 1].id,
      target: steps[0].id,
      animated: true,
      style: { stroke: "rgba(255, 255, 255, 0.15)", strokeWidth: 1.5, strokeDasharray: "4 4" },
    });
  }

  // Dagre layout (Top-Bottom)
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 35, ranksep: 60 });
  nodes.forEach((n) => g.setNode(n.id, { width: 180, height: 70 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  nodes.forEach((n) => {
    const pos = g.node(n.id);
    n.position = { x: pos.x - 90, y: pos.y - 35 };
  });

  return { nodes, edges };
}

export function StateManagementFlow({ tree }: { tree: FileTreeNode }) {
  const steps = useMemo(() => detectStateSteps(tree), [tree]);
  const { nodes: initial, edges: initialEdges } = useMemo(() => layoutFlow(steps), [steps]);
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
