"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Wand2, BookOpen, ArrowRight, Menu, Hexagon, Search, Network, Users, MessageSquare, Activity, Heart, GitMerge, FileCode, Layers, Server, Monitor, Bot } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    const match = repoUrl.match(
      /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/\s#?]+)/
    );
    if (match) {
      const [, owner, repo] = match;
      setIsLoading(true);
      router.push(`/dashboard/${owner}/${repo.replace(/\.git$/, "")}`);
    } else {
      const parts = repoUrl.trim().split("/");
      if (parts.length === 2) {
        setIsLoading(true);
        router.push(`/dashboard/${parts[0]}/${parts[1]}`);
      }
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white selection:bg-white/20">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-90"
      >
        <source src="https://www.pexels.com/download/video/3129902/" type="video/mp4" />
      </video>

      {/* Background Grid Overlay */}
      <div className="fixed inset-0 bg-grid opacity-60 z-0 pointer-events-none" />

      {/* Scrollable Content Container */}
      <div className="relative z-10 flex flex-col w-full">
        
        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row min-h-screen p-4 lg:p-6 gap-6">
          {/* Left Panel */}
          <div className="relative flex-1 lg:w-[52%] lg:flex-none flex flex-col liquid-glass-strong rounded-3xl p-6 lg:p-10">
            {/* Nav */}
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Hexagon className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 drop-shadow-sm">
                repolens
              </span>
              </div>
              <button className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                <Menu className="w-4 h-4 text-white" />
              </button>
            </header>

            {/* Hero Center */}
            <div className="flex-1 flex flex-col items-center justify-center text-center mt-12 mb-12">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-8">
                <Hexagon className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-medium tracking-[-0.05em] text-white leading-tight mb-8 max-w-2xl">
                Innovating with <br />
                <span className="font-serif italic text-white/80">intelligence of</span> Repolens AI
              </h1>

              <form onSubmit={handleAnalyze} className="w-full max-w-md relative flex flex-col items-center">
                <div className="w-full relative flex items-center liquid-glass-strong rounded-full p-1 border border-white/10 group focus-within:border-white/30 transition-colors">
                  <div className="pl-5 pr-2">
                    <Search className="w-5 h-5 text-white/50" />
                  </div>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="Paste a GitHub URL or owner/repo..."
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40 h-10"
                  />
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-10 h-10 shrink-0 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs text-white/50 font-medium tracking-wide">
                  <span>TRY:</span>
                  <button type="button" onClick={() => setRepoUrl("facebook/react")} className="hover:text-white transition-colors">facebook/react</button>
                  <span className="w-1 h-1 rounded-full bg-white/20 mx-1"></span>
                  <button type="button" onClick={() => setRepoUrl("vercel/next.js")} className="hover:text-white transition-colors">vercel/next.js</button>
                  <span className="w-1 h-1 rounded-full bg-white/20 mx-1"></span>
                  <button type="button" onClick={() => setRepoUrl("microsoft/vscode")} className="hover:text-white transition-colors">microsoft/vscode</button>
                </div>
              </form>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 w-full max-w-md border-t border-white/10 pt-8">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white mb-1">10K+</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/50">Repos Analyzed</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white mb-1">50K+</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/50">AI Insights</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-white mb-1">1000h+</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/50">Time Saved</span>
                </div>
              </div>
            </div>

            {/* Bottom Quote */}
            <div className="flex flex-col items-center text-center mt-auto">
              <span className="text-xs tracking-widest uppercase text-white/50 mb-3">
                DEVELOPER FOCUS
              </span>
              <p className="text-lg text-white mb-4">
                "We imagined a <span className="font-serif italic text-white/90">codebase</span> with no secrets."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-white/20"></div>
                <span className="text-sm font-medium tracking-widest text-white/70">KRISHNA</span>
                <div className="w-12 h-[1px] bg-white/20"></div>
              </div>
            </div>
          </div>

          {/* Right Panel (Desktop Only) */}
          <div className="hidden lg:flex w-[48%] flex-col gap-6">
            {/* Top Bar */}
            <div className="flex items-center justify-end w-full">
              <Link href="/dashboard" className="liquid-glass rounded-full pl-5 pr-2 py-2 flex items-center gap-3 hover:scale-105 active:scale-95 transition-transform">
                <span className="text-sm font-medium text-white">Account</span>
                <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              </Link>
            </div>

          
            {/* Bottom Feature Section */}
            <div className="mt-auto liquid-glass rounded-[2.5rem] p-6 flex gap-4">
              <Link href="/dashboard" className="flex-1 liquid-glass rounded-3xl p-6 flex flex-col justify-between aspect-square group hover:scale-105 transition-transform cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-lg text-white mb-1">Analysis</h4>
                  <p className="text-xs text-white/60">Automated architecture mapping</p>
                </div>
              </Link>
              <Link href="/dashboard" className="flex-1 liquid-glass rounded-3xl p-6 flex flex-col justify-between aspect-square group hover:scale-105 transition-transform cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-lg text-white mb-1">Insights</h4>
                  <p className="text-xs text-white/60">Comprehensive codebase context</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-3 block">FEATURES</span>
            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight mb-4 text-white">
              Everything You Need to<br/><span className="font-serif italic text-white/80">Understand Any Codebase</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">From repository analysis to interactive chat — a complete toolkit for understanding unfamiliar codebases.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="liquid-glass rounded-3xl p-8 hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <GitMerge className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">Repository Analysis</h3>
              <p className="text-sm text-white/60 leading-relaxed">Parse any public GitHub repo. Detect frameworks, languages, and architecture patterns automatically.</p>
            </div>
            <div className="liquid-glass rounded-3xl p-8 hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <FileCode className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">AI Code Understanding</h3>
              <p className="text-sm text-white/60 leading-relaxed">Explain folders, files, and components. Simplify complex logic into human-readable explanations.</p>
            </div>
            <div className="liquid-glass rounded-3xl p-8 hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Network className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">Architecture Visualization</h3>
              <p className="text-sm text-white/60 leading-relaxed">Interactive dependency graphs, API flow diagrams, and component hierarchy visualization.</p>
            </div>
            <div className="liquid-glass rounded-3xl p-8 hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">Contributor Onboarding</h3>
              <p className="text-sm text-white/60 leading-relaxed">Auto-generated setup instructions, beginner-friendly file recommendations, and contribution guides.</p>
            </div>
            <div className="liquid-glass rounded-3xl p-8 hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">Chat With Your Repository</h3>
              <p className="text-sm text-white/60 leading-relaxed">Ask natural language questions about any codebase and get instant, contextual answers.</p>
            </div>
            <div className="liquid-glass rounded-3xl p-8 hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-white">Code Intelligence</h3>
              <p className="text-sm text-white/60 leading-relaxed">Complexity analysis, dependency heatmaps, dead code detection, and repo health insights.</p>
            </div>
          </div>
        </section>

        {/* ARCHITECTURE SECTION */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-3 block">ARCHITECTURE</span>
            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight mb-4 text-white">
              How <span className="font-serif italic text-white/80">RepoLens</span> Works
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">From GitHub URL to complete understanding — our pipeline processes your repo through multiple AI analysis stages.</p>
          </div>

          <div className="flex flex-col items-center gap-4 relative">
            <div className="liquid-glass px-8 py-4 rounded-full border border-white/10 text-white font-medium z-10">GitHub Repo</div>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-white/10"></div>
            <div className="liquid-glass px-8 py-4 rounded-full border border-white/10 text-white font-medium z-10">Repo Cloner</div>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-white/10"></div>
            <div className="liquid-glass px-8 py-4 rounded-full border border-white/10 text-white font-medium z-10">Code Parser</div>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-white/10"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full z-10 relative">
              <div className="md:hidden absolute w-px h-[calc(100%+32px)] bg-gradient-to-b from-white/30 to-white/10 z-0"></div>
              <div className="hidden md:block absolute w-[60%] h-px bg-white/10 z-0"></div>
              <div className="hidden md:block absolute w-px h-8 bg-gradient-to-t from-white/30 to-white/10 -top-8 left-[20%]"></div>
              <div className="hidden md:block absolute w-px h-8 bg-gradient-to-t from-white/30 to-white/10 -top-8 right-[20%]"></div>

              <div className="liquid-glass px-8 py-4 rounded-full border border-white/10 text-white/80 text-sm z-10 w-full md:w-auto text-center">AI Summaries</div>
              <div className="liquid-glass-strong px-8 py-4 rounded-full border border-white/20 text-white font-medium z-10 w-full md:w-auto text-center mx-4">Architecture</div>
              <div className="liquid-glass px-8 py-4 rounded-full border border-white/10 text-white/80 text-sm z-10 w-full md:w-auto text-center">Dependency Map</div>
            </div>
            
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-white/10"></div>
            <div className="liquid-glass-strong px-10 py-4 rounded-full border border-white/20 text-white font-medium z-10">Frontend UI</div>
          </div>
        </section>

        {/* TECH STACK SECTION */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-3 block">TECH STACK</span>
            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight mb-4 text-white">
              Built With <span className="font-serif italic text-white/80">Modern Tech</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="liquid-glass rounded-3xl p-8">
              <h3 className="text-sm font-medium tracking-widest text-white/50 mb-6 uppercase">Frontend</h3>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/80"></div> Next.js</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/80"></div> React</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/80"></div> Tailwind CSS</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/80"></div> Framer Motion</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/80"></div> React Flow</div>
              </div>
            </div>
            
            <div className="liquid-glass rounded-3xl p-8">
              <h3 className="text-sm font-medium tracking-widest text-white/50 mb-6 uppercase">Backend & AI</h3>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/60"></div> Node.js</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/60"></div> Groq server</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/60"></div> GitHub API</div>
              </div>
            </div>

            <div className="liquid-glass rounded-3xl p-8">
              <h3 className="text-sm font-medium tracking-widest text-white/50 mb-6 uppercase">Infrastructure</h3>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/40"></div> TypeScript</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/40"></div> Vercel</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-white/40"></div> Docker</div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 bg-black/50 backdrop-blur-md border-t border-white/10 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
                <Hexagon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold tracking-tight text-white text-sm">RepoLens</span>
            </div>
            
            <div className="text-white/50 text-sm flex items-center">
              © 2026 RepoLens AI. Built with <Heart className="w-3 h-3 text-white/80 mx-1" fill="currentColor" /> by Krishna.
            </div>

            <div className="flex gap-4 text-sm text-white/50">
              <Link href="https://github.com/bip-krishna" className="hover:text-white transition-colors">GitHub</Link>
              <Link href="#" className="hover:text-white transition-colors">Features</Link>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
