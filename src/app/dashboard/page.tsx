"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowRight, GitBranch, Star } from "lucide-react";

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
    <div className="max-w-4xl mx-auto text-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <h1 className="text-4xl lg:text-5xl font-medium tracking-tight mb-4">Dashboard</h1>
        <p className="text-white/60 text-lg">Analyze any GitHub repository with AI</p>
      </motion.div>

      {/* Search */}
      <motion.form
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="mb-16 max-w-2xl mx-auto"
      >
        <div className="relative flex items-center liquid-glass-strong rounded-full p-1.5 border border-white/10 focus-within:border-white/30 transition-colors">
          <div className="pl-5 pr-2">
            <Search className="h-5 w-5 text-white/50" />
          </div>
          <input
            type="text" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Paste a GitHub URL or owner/repo..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40 h-12"
          />
          <button type="submit" className="liquid-glass rounded-full px-6 h-11 flex items-center gap-2 hover:bg-white/10 transition-colors shrink-0 font-medium text-sm">
            Analyze <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.form>

      {/* Popular repos */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-medium mb-6 flex items-center gap-3 text-white/80">
          <GitBranch className="h-5 w-5" />
          Popular Repositories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {popularRepos.map((r) => (
            <button
              key={`${r.owner}/${r.repo}`}
              onClick={() => router.push(`/dashboard/${r.owner}/${r.repo}`)}
              className="flex flex-col gap-3 p-6 rounded-3xl liquid-glass hover:scale-[1.02] active:scale-[0.98] transition-transform text-left group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base text-white/80 group-hover:text-white transition-colors">
                  {r.owner}/<span className="font-semibold text-white">{r.repo}</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/60 bg-white/5 px-2.5 py-1 rounded-full">
                  <Star className="h-3 w-3" /> {r.stars}
                </span>
              </div>
              <span className="text-sm text-white/50 leading-relaxed">{r.desc}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
