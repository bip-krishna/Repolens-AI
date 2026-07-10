"use client";

import { motion } from "framer-motion";
import { Lock, CreditCard, LayoutDashboard, Brain, MessageSquare, Shield, BarChart3, Bell, Key, Database, Wifi, Globe, Search, Palette, Server, Cog, TestTube, GitBranch, FileText, Zap } from "lucide-react";
import type { DetectedFeature } from "@/types";

const featureIcons: Record<string, any> = {
  Authentication: Lock, Payments: CreditCard, Dashboard: LayoutDashboard,
  "AI/ML": Brain, AI: Brain, Chatbot: MessageSquare, "Admin Panel": Shield,
  Analytics: BarChart3, Notifications: Bell, OAuth: Key, CRUD: Database,
  Realtime: Wifi, "REST API": Globe, GraphQL: Globe, Database: Database,
  Search: Search, "Dark Mode": Palette, SSR: Server, PWA: Cog,
  Testing: TestTube, "CI/CD": GitBranch, Logging: FileText,
  "Rate Limiting": Zap, WebSocket: Wifi, Caching: Zap,
  "File Upload": FileText, Email: MessageSquare, Internationalization: Globe,
};

const categoryColors: Record<string, string> = {
  auth: "from-blue-500/20 to-cyan-500/20 border-blue-500/20",
  payments: "from-green-500/20 to-emerald-500/20 border-green-500/20",
  ui: "from-purple-500/20 to-pink-500/20 border-purple-500/20",
  data: "from-orange-500/20 to-amber-500/20 border-orange-500/20",
  infra: "from-gray-500/20 to-slate-500/20 border-gray-500/20",
  ai: "from-violet-500/20 to-fuchsia-500/20 border-violet-500/20",
  communication: "from-rose-500/20 to-red-500/20 border-rose-500/20",
  other: "from-white/5 to-white/10 border-white/10",
};

function ConfidenceDots({ confidence }: { confidence: number }) {
  const filled = Math.round(confidence * 5);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={`w-1.5 h-1.5 rounded-full ${n <= filled ? "bg-green-400" : "bg-white/10"}`}
        />
      ))}
    </div>
  );
}

export function FeatureExtraction({ features }: { features: DetectedFeature[] }) {
  if (!features || features.length === 0) return null;

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Brain className="h-4 w-4 text-white" />
          AI Feature Detection
        </h3>
        <span className="text-xs text-white/40">{features.length} features detected</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((feature, i) => {
          const Icon = featureIcons[feature.name] || Cog;
          const colorClass = categoryColors[feature.category] || categoryColors.other;

          return (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`liquid-glass rounded-xl p-4 bg-gradient-to-br ${colorClass} border hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-white/80" />
                  <span className="text-sm font-medium text-white">{feature.name}</span>
                </div>
                <ConfidenceDots confidence={feature.confidence} />
              </div>
              {feature.files && feature.files.length > 0 && (
                <div className="mt-2 space-y-0.5">
                  {feature.files.slice(0, 3).map((f, j) => (
                    <div key={j} className="text-xs text-white/40 font-mono truncate">
                      {f}
                    </div>
                  ))}
                  {feature.files.length > 3 && (
                    <div className="text-xs text-white/30">+{feature.files.length - 3} more</div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
