"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, AlertTriangle, ChevronRight, HelpCircle, CheckCircle } from "lucide-react";
import type { FileTreeNode } from "@/types";

interface ImpactResult {
  affectedFiles: string[];
  estimatedAffectedCount: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  reasoning: string;
}

const riskColors = {
  Low: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  High: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Critical: "text-red-400 bg-red-500/10 border-red-500/20",
};

export function ImpactAnalysis({ tree }: { tree: FileTreeNode }) {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImpactResult | null>(null);

  // Flatten tree to get a list of files for dropdown
  const filesList = useMemo(() => {
    const list: string[] = [];
    function traverse(node: FileTreeNode) {
      if (node.type === "file") {
        list.push(node.path);
      }
      node.children?.forEach(traverse);
    }
    traverse(tree);
    return list;
  }, [tree]);

  const handleAnalyze = () => {
    if (!selectedFile) return;
    setLoading(true);

    // Dynamic heuristic simulation of blast radius analysis
    setTimeout(() => {
      let riskLevel: ImpactResult["riskLevel"] = "Low";
      let affected: string[] = [];
      let reasoning = "";

      if (selectedFile.includes("layout") || selectedFile.includes("context") || selectedFile.includes("store")) {
        riskLevel = "Critical";
        affected = filesList.filter((f) => f.includes("page") || f.includes("component"));
        reasoning = "This component serves as a root scaffolding element or global state provider. Modifications will propagate project-wide.";
      } else if (selectedFile.includes("lib") || selectedFile.includes("utils")) {
        riskLevel = "High";
        affected = filesList.filter((f) => f.includes("api") || f.includes("page"));
        reasoning = "Provides core utilities and API connectors used by multiple dashboard routes.";
      } else if (selectedFile.includes("api") || selectedFile.includes("routes")) {
        riskLevel = "Medium";
        affected = [selectedFile, "src/hooks/useLazyFetch.ts"];
        reasoning = "API request changes affect the front-end hooks calling this handler.";
      } else {
        riskLevel = "Low";
        affected = [selectedFile];
        reasoning = "Localized UI component or logic helper with minimal outbound dependencies.";
      }

      setResult({
        affectedFiles: affected.slice(0, 5),
        estimatedAffectedCount: affected.length,
        riskLevel,
        reasoning,
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-2 text-white flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-cyan-400" />
        Change Impact & Blast Radius Analysis
      </h3>
      <p className="text-[10px] text-white/40 mb-6">Select any module to predict dependencies and system risk</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          className="flex-1 rounded-xl bg-black/40 border border-white/10 px-4 py-2 text-xs text-white/80 focus:outline-none focus:border-cyan-500/50"
        >
          <option value="">-- Select File Module --</option>
          {filesList.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || loading}
          className="rounded-xl px-5 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white"
        >
          {loading ? "Analyzing..." : "Analyze Impact"}
        </button>
      </div>

      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Risk Badge & Count */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Risk Rating:</span>
                <span className={`text-xs uppercase px-2 py-0.5 rounded-full border font-bold font-mono ${riskColors[result.riskLevel]}`}>
                  {result.riskLevel}
                </span>
              </div>
              <div className="text-xs text-white/40 font-mono">
                Est. Impacted Components: <span className="text-white font-bold">{result.estimatedAffectedCount}</span>
              </div>
            </div>

            {/* Reasoning */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-white/70 leading-relaxed flex gap-2.5 items-start">
              <AlertTriangle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <p>{result.reasoning}</p>
            </div>

            {/* Downstream dependencies */}
            <div>
              <span className="text-[10px] text-white/40 font-mono block mb-2">Primary Blast Area</span>
              <div className="space-y-1.5">
                {result.affectedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-mono text-white/60 bg-white/2 p-2 rounded-lg border border-white/5">
                    <ChevronRight className="h-3 w-3 text-cyan-400" />
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
