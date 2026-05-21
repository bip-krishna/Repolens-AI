"use client";

import { motion } from "framer-motion";
import {
  GitBranch, Brain, Network, Users, MessageSquare, BarChart3,
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: GitBranch, title: "Repository Analysis",
    description: "Parse any public GitHub repo. Detect frameworks, languages, and architecture patterns automatically.",
    gradient: "linear-gradient(135deg, #8B5CF6, #6366F1)", glowColor: "oklch(0.7 0.18 270 / 25%)",
  },
  {
    icon: Brain, title: "AI Code Understanding",
    description: "Explain folders, files, and components. Simplify complex logic into human-readable explanations.",
    gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)", glowColor: "oklch(0.7 0.2 200 / 25%)",
  },
  {
    icon: Network, title: "Architecture Visualization",
    description: "Interactive dependency graphs, API flow diagrams, and component hierarchy visualization.",
    gradient: "linear-gradient(135deg, #EC4899, #8B5CF6)", glowColor: "oklch(0.7 0.18 330 / 25%)",
  },
  {
    icon: Users, title: "Contributor Onboarding",
    description: "Auto-generated setup instructions, beginner-friendly file recommendations, and contribution guides.",
    gradient: "linear-gradient(135deg, #10B981, #3B82F6)", glowColor: "oklch(0.7 0.15 160 / 25%)",
  },
  {
    icon: MessageSquare, title: "Chat With Your Repository",
    description: "Ask natural language questions about any codebase and get instant, contextual answers.",
    gradient: "linear-gradient(135deg, #F59E0B, #EC4899)", glowColor: "oklch(0.7 0.18 50 / 25%)",
  },
  {
    icon: BarChart3, title: "Code Intelligence",
    description: "Complexity analysis, dependency heatmaps, dead code detection, and repo health insights.",
    gradient: "linear-gradient(135deg, #06B6D4, #10B981)", glowColor: "oklch(0.7 0.15 180 / 25%)",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-medium text-purple-400 mb-3 tracking-wide uppercase">Features</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything You Need to<br /><span className="gradient-text">Understand Any Codebase</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            From repository analysis to interactive chat — a complete toolkit for understanding unfamiliar codebases.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
        </div>
      </div>
    </section>
  );
}
