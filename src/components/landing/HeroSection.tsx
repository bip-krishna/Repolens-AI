"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, GitBranch, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function FloatingParticle({
  delay,
  duration,
  x,
  y,
  size,
}: {
  delay: number;
  duration: number;
  x: string;
  y: string;
  size: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle, oklch(0.7 0.18 270 / 30%), transparent)`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function HeroSection() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    // Parse GitHub URL
    const match = repoUrl.match(
      /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/\s#?]+)/
    );
    if (match) {
      const [, owner, repo] = match;
      setIsLoading(true);
      router.push(`/dashboard/${owner}/${repo.replace(/\.git$/, "")}`);
    } else {
      // Try owner/repo format
      const parts = repoUrl.trim().split("/");
      if (parts.length === 2) {
        setIsLoading(true);
        router.push(`/dashboard/${parts[0]}/${parts[1]}`);
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "oklch(0.6 0.2 270)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "oklch(0.6 0.2 200)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[150px]"
        style={{ background: "oklch(0.6 0.15 330)" }}
      />

      {/* Floating particles */}
      <FloatingParticle delay={0} duration={6} x="10%" y="20%" size={8} />
      <FloatingParticle delay={1} duration={8} x="80%" y="30%" size={6} />
      <FloatingParticle delay={2} duration={7} x="20%" y="70%" size={10} />
      <FloatingParticle delay={3} duration={9} x="70%" y="60%" size={7} />
      <FloatingParticle delay={0.5} duration={5} x="50%" y="15%" size={5} />
      <FloatingParticle delay={1.5} duration={6.5} x="90%" y="80%" size={8} />
      <FloatingParticle delay={2.5} duration={7.5} x="5%" y="50%" size={6} />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm"
        >
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-muted-foreground">
            AI-Powered Repository Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-balance"
        >
          Understand Any GitHub
          <br />
          <span className="gradient-text-hero">Repository in Minutes</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 text-balance"
        >
          Analyze architecture, generate onboarding guides, visualize
          dependencies, and chat with any codebase — all powered by AI.
        </motion.p>

        {/* Repo Input */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          onSubmit={handleAnalyze}
          className="mx-auto max-w-2xl"
        >
          <div className="relative flex items-center gap-2 p-2 rounded-2xl glass-strong glow-purple">
            <div className="flex items-center gap-2 flex-1 pl-3">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <Input
                type="text"
                placeholder="Paste a GitHub URL or owner/repo..."
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="border-0 bg-transparent text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all shrink-0"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Analyze
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground/60">
            Try:{" "}
            <button
              type="button"
              onClick={() => setRepoUrl("facebook/react")}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              facebook/react
            </button>
            {" · "}
            <button
              type="button"
              onClick={() => setRepoUrl("vercel/next.js")}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              vercel/next.js
            </button>
            {" · "}
            <button
              type="button"
              onClick={() => setRepoUrl("microsoft/vscode")}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              microsoft/vscode
            </button>
          </p>
        </motion.form>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-8 mx-auto max-w-lg"
        >
          {[
            { icon: GitBranch, label: "Repos Analyzed", value: "10K+" },
            { icon: Zap, label: "AI Insights", value: "50K+" },
            { icon: Sparkles, label: "Time Saved", value: "1000h+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
