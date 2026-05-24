"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Wand2, BookOpen, ArrowRight, Menu, Hexagon, Search } from "lucide-react";
import Link from "next/link";

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
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-white/20">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4" type="video/mp4" />
      </video>

      {/* Main Content Overlay */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen p-4 lg:p-6 gap-6">
        
        {/* Left Panel */}
        <div className="relative flex-1 lg:w-[52%] lg:flex-none flex flex-col liquid-glass-strong rounded-3xl p-6 lg:p-10">
          
          {/* Nav */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Hexagon className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-2xl tracking-tighter text-white">
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
              Innovating the <br />
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
              <span className="text-sm font-medium tracking-widest text-white/70">MAR</span>
              <div className="w-12 h-[1px] bg-white/20"></div>
            </div>
          </div>
        </div>

        {/* Right Panel (Desktop Only) */}
        <div className="hidden lg:flex w-[48%] flex-col gap-6">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="liquid-glass rounded-full px-4 py-2 flex items-center gap-3">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform text-white hover:text-white/80">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/120px-X_logo_2023.svg.png" alt="Twitter" className="w-4 h-4 object-contain brightness-0 invert" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform text-white hover:text-white/80">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/120px-LinkedIn_logo_initials.png" alt="LinkedIn" className="w-4 h-4 object-contain brightness-0 invert" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform text-white hover:text-white/80">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/120px-Instagram_logo_2016.svg.png" alt="Instagram" className="w-4 h-4 object-contain brightness-0 invert" />
              </Link>
              <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
              <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform group">
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            
            <Link href="/dashboard" className="liquid-glass rounded-full pl-5 pr-2 py-2 flex items-center gap-3 hover:scale-105 active:scale-95 transition-transform">
              <span className="text-sm font-medium text-white">Account</span>
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </Link>
          </div>

          {/* Community Card */}
          <div className="liquid-glass w-64 rounded-3xl p-6 mt-4">
            <h3 className="font-serif italic text-xl text-white mb-3">Explore our dashboard</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Connect your repositories and let the AI unravel the complexity in seconds.
            </p>
          </div>

          {/* Bottom Feature Section */}
          <div className="mt-auto liquid-glass rounded-[2.5rem] p-6 flex gap-4">
            {/* Card 1 */}
            <Link href="/dashboard" className="flex-1 liquid-glass rounded-3xl p-6 flex flex-col justify-between aspect-square group hover:scale-105 transition-transform cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-lg text-white mb-1">Analysis</h4>
                <p className="text-xs text-white/60">Automated architecture mapping</p>
              </div>
            </Link>

            {/* Card 2 */}
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
    </main>
  );
}
