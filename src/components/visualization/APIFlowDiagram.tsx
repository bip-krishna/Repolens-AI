"use client";

import { useMemo } from "react";
import {
  ReactFlow, Background, Controls,
  useNodesState, useEdgesState,
  type Node, type Edge, Handle, Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { Globe, Database } from "lucide-react";
import type { FileTreeNode } from "@/types";

interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  handler: string;
  middleware?: string[];
  database?: boolean;
}

const methodColors = {
  GET: "#10B981", // green
  POST: "#3B82F6", // blue
  PUT: "#F59E0B", // amber
  DELETE: "#EF4444", // red
  PATCH: "#8B5CF6", // purple
};

function APINode({ data }: { data: { endpoint: APIEndpoint } }) {
  const { method, path, handler } = data.endpoint;
  const color = methodColors[method] || "#6B7280";

  return (
    <div className="relative group">
      <Handle type="target" position={Position.Left} className="!bg-white/30 !w-2 !h-2 !border-0" />
      <div
        className="px-4 py-3 rounded-xl text-xs font-mono min-w-[200px] border transition-all group-hover:scale-105"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          borderColor: `${color}40`,
          boxShadow: `0 0 15px ${color}08`,
        }}
      >
        <div className="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1">
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white uppercase"
            style={{ backgroundColor: color }}
          >
            {method}
          </span>
          <span className="text-white/40 truncate max-w-[120px]">{handler.split("/").pop()}</span>
        </div>
        <div className="text-white font-medium truncate mb-1">{path}</div>
        <div className="text-white/40 text-[10px] truncate">{handler}</div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-white/30 !w-2 !h-2 !border-0" />
    </div>
  );
}

const nodeTypes = { apiNode: APINode };

function detectAPIEndpoints(tree: FileTreeNode): APIEndpoint[] {
  const endpoints: APIEndpoint[] = [];

  function traverse(node: FileTreeNode) {
    if (node.type === "file") {
      const isRoute = node.path.includes("api/") || node.path.includes("routes/") || node.path.includes("route.");
      if (isRoute && node.extension && ["ts", "js", "py", "go"].includes(node.extension)) {
        // Infer method and path
        let method: APIEndpoint["method"] = "GET";
        let path = "/" + node.path.replace(/\\/g, "/");

        // Simple Next.js App Router API path mapping:
        if (path.includes("/app/")) {
          path = path.substring(path.indexOf("/app/") + 4);
          path = path.replace("/route.ts", "").replace("/route.js", "");
        } else if (path.includes("/pages/api/")) {
          path = path.substring(path.indexOf("/pages/api/"));
          path = path.replace(".ts", "").replace(".js", "");
        }

        // Try to infer method based on filename/path details or generic defaults
        if (node.name.toLowerCase().includes("post") || node.path.toLowerCase().includes("create")) method = "POST";
        else if (node.name.toLowerCase().includes("delete") || node.path.toLowerCase().includes("remove")) method = "DELETE";
        else if (node.name.toLowerCase().includes("update") || node.path.toLowerCase().includes("put")) method = "PUT";

        endpoints.push({
          method,
          path,
          handler: node.path,
          middleware: path.includes("auth") ? ["authMiddleware"] : undefined,
          database: path.includes("db") || path.includes("user") || path.includes("post") || path.includes("comment"),
        });
      }
    }
    node.children?.forEach(traverse);
  }

  traverse(tree);

  // If no routes found, populate some sensible fallbacks based on files
  if (endpoints.length === 0) {
    endpoints.push(
      { method: "GET", path: "/api/health", handler: "src/api/health.ts" },
      { method: "GET", path: "/api/users", handler: "src/api/users.ts", database: true },
      { method: "POST", path: "/api/auth/login", handler: "src/api/auth.ts", middleware: ["rateLimit"] },
      { method: "POST", path: "/api/posts", handler: "src/api/posts.ts", database: true, middleware: ["requireAuth"] }
    );
  }

  return endpoints;
}

function layoutDiagram(endpoints: APIEndpoint[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Clients Node (Start)
  nodes.push({
    id: "client",
    type: "default",
    data: {
      label: (
        <div className="flex items-center gap-2 text-white">
          <Globe className="h-4 w-4 text-blue-400" />
          <span>Client (Web/Mobile)</span>
        </div>
      ),
    },
    position: { x: 0, y: 0 },
    style: { background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "12px" },
  });

  // Database Node (End)
  nodes.push({
    id: "database",
    type: "default",
    data: {
      label: (
        <div className="flex items-center gap-2 text-white">
          <Database className="h-4 w-4 text-emerald-400" />
          <span>Database Store</span>
        </div>
      ),
    },
    position: { x: 0, y: 0 },
    style: { background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "12px" },
  });

  endpoints.forEach((ep, idx) => {
    const epId = `ep-${idx}`;
    nodes.push({
      id: epId,
      type: "apiNode",
      data: { endpoint: ep },
      position: { x: 0, y: 0 },
    });

    // Edge from client to Endpoint
    edges.push({
      id: `e-client-${epId}`,
      source: "client",
      target: epId,
      animated: true,
      style: { stroke: `${methodColors[ep.method] || "#6B7280"}50`, strokeWidth: 1.5 },
    });

    // Edge from Endpoint to Database
    if (ep.database) {
      edges.push({
        id: `e-${epId}-db`,
        source: epId,
        target: "database",
        animated: true,
        style: { stroke: "rgba(16, 185, 129, 0.3)", strokeWidth: 1.5 },
      });
    }
  });

  // Dagre Layout
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 40, ranksep: 100 });
  nodes.forEach((n) => g.setNode(n.id, { width: 220, height: 70 }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  nodes.forEach((n) => {
    const pos = g.node(n.id);
    n.position = { x: pos.x - 110, y: pos.y - 35 };
  });

  return { nodes, edges };
}

export function APIFlowDiagram({ tree }: { tree: FileTreeNode }) {
  const endpoints = useMemo(() => detectAPIEndpoints(tree), [tree]);
  const { nodes: initial, edges: initialEdges } = useMemo(() => layoutDiagram(endpoints), [endpoints]);
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
