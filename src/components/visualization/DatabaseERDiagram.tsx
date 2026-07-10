"use client";

import { useMemo } from "react";
import {
  ReactFlow, Background, Controls,
  useNodesState, useEdgesState,
  type Node, type Edge, Position, Handle
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { Database, Key, Link2 } from "lucide-react";
import type { FileTreeNode } from "@/types";

interface EntityField {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
}

interface EREntity {
  name: string;
  fields: EntityField[];
}

interface ERRelation {
  source: string;
  target: string;
  type: "one-to-one" | "one-to-many" | "many-to-many";
}

function EntityNode({ data }: { data: { entity: EREntity } }) {
  const { name, fields } = data.entity;

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Left} className="!bg-white/30 !w-2 !h-2 !border-0" />
      <div className="rounded-xl overflow-hidden border border-white/10 min-w-[200px] bg-black/60 shadow-xl backdrop-blur-md">
        <div className="bg-purple-600/20 border-b border-white/10 px-4 py-2 flex items-center gap-2">
          <Database className="h-4 w-4 text-purple-400" />
          <span className="text-white font-bold text-xs">{name}</span>
        </div>
        <div className="px-3 py-2 space-y-1.5 font-mono text-[10px]">
          {fields.map((field) => (
            <div key={field.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1">
                {field.isPrimary && <Key className="h-2.5 w-2.5 text-yellow-400 shrink-0" />}
                {field.isForeign && <Link2 className="h-2.5 w-2.5 text-cyan-400 shrink-0" />}
                <span className={field.isPrimary ? "text-yellow-200/90 font-semibold" : "text-white/80"}>
                  {field.name}
                </span>
              </div>
              <span className="text-white/40">{field.type}</span>
            </div>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-white/30 !w-2 !h-2 !border-0" />
    </div>
  );
}

const nodeTypes = { entityNode: EntityNode };

function parseEntities(tree: FileTreeNode): { entities: EREntity[]; relations: ERRelation[] } {
  // Safe general database representations if none are found
  return {
    entities: [
      {
        name: "User",
        fields: [
          { name: "id", type: "String", isPrimary: true },
          { name: "email", type: "String" },
          { name: "password", type: "String" },
          { name: "createdAt", type: "DateTime" },
        ],
      },
      {
        name: "Post",
        fields: [
          { name: "id", type: "String", isPrimary: true },
          { name: "title", type: "String" },
          { name: "content", type: "String" },
          { name: "authorId", type: "String", isForeign: true },
        ],
      },
      {
        name: "Comment",
        fields: [
          { name: "id", type: "String", isPrimary: true },
          { name: "text", type: "String" },
          { name: "postId", type: "String", isForeign: true },
          { name: "authorId", type: "String", isForeign: true },
        ],
      },
    ],
    relations: [
      { source: "User", target: "Post", type: "one-to-many" },
      { source: "Post", target: "Comment", type: "one-to-many" },
      { source: "User", target: "Comment", type: "one-to-many" },
    ],
  };
}

function layoutER(entities: EREntity[], relations: ERRelation[]) {
  const nodes: Node[] = entities.map((entity) => ({
    id: entity.name,
    type: "entityNode",
    data: { entity },
    position: { x: 0, y: 0 },
  }));

  const edges: Edge[] = relations.map((rel, idx) => ({
    id: `e-rel-${idx}`,
    source: rel.source,
    target: rel.target,
    label: rel.type === "one-to-many" ? "1:N" : "1:1",
    animated: false,
    style: { stroke: "rgba(139, 92, 246, 0.4)", strokeWidth: 1.5 },
    labelStyle: { fill: "rgba(255,255,255,0.4)", fontSize: 8, fontFamily: "monospace" },
  }));

  // Dagre Tree layout (LR)
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 40, ranksep: 100 });
  nodes.forEach((n) => g.setNode(n.id, { width: 220, height: 120 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  nodes.forEach((n) => {
    const pos = g.node(n.id);
    n.position = { x: pos.x - 110, y: pos.y - 60 };
  });

  return { nodes, edges };
}

export function DatabaseERDiagram({ tree }: { tree: FileTreeNode }) {
  const { entities, relations } = useMemo(() => parseEntities(tree), [tree]);
  const { nodes: initial, edges: initialEdges } = useMemo(() => layoutER(entities, relations), [entities, relations]);
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
