"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowRight, GitBranch, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const popularRepos = [
  { owner: "facebook", repo: "react", desc: "A JavaScript library for building user interfaces", stars: "224k" },
  { owner: "vercel", repo: "next.js", desc: "The React Framework for the Web", stars: "127k" },
  { owner: "microsoft", repo: "vscode", desc: "Visual Studio Code", stars: "165k" },
  { owner: "denoland", repo: "deno", desc: "A modern runtime for JavaScript and TypeScript", stars: "96k" },
  { owner: "tailwindlabs", repo: "tailwindcss", desc: "A utility-first CSS framework", stars: "83k" },
  { owner: "sveltejs", repo: "svelte", desc: "Cybernetically enhanced web apps", stars: "80k" },
];

export default function DashboardHome() {
  const [repoUrl, setRepoUrl] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    const match = repoUrl.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/\s#?]+)/);
    if (match) {
      router.push(`/dashboard/${match[1]}/${match[2].replace(/\.git$/, "")}`);
    } else {
      const parts = repoUrl.trim().split("/");
      if (parts.length === 2) router.push(`/dashboard/${parts[0]}/${parts[1]}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Analyze any GitHub repository with AI</p>
      </motion.div>

      {/* Search */}
      <motion.form
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="mb-12"
      >
        <div className="flex gap-2 p-2 rounded-2xl glass-strong glow-purple">
          <div className="flex items-center gap-2 flex-1 pl-3">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="Paste a GitHub URL or owner/repo..."
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none h-10"
            />
          </div>
          <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl px-6">
            Analyze <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.form>

      {/* Popular repos */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-purple-400" />
          Popular Repositories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popularRepos.map((r) => (
            <button
              key={`${r.owner}/${r.repo}`}
              onClick={() => router.push(`/dashboard/${r.owner}/${r.repo}`)}
              className="flex flex-col gap-1 p-4 rounded-xl glass hover:bg-white/5 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium group-hover:text-purple-400 transition-colors">
                  {r.owner}/<span className="font-bold">{r.repo}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3" /> {r.stars}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{r.desc}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
