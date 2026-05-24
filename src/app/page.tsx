import {
  Sparkles,
  Download,
  Wand2,
  BookOpen,
  ArrowRight,
  Menu,
  Hexagon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon
} from "lucide-react";

export default function HomePage() {
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
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-10">
              <Hexagon className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-medium tracking-[-0.05em] text-white leading-tight mb-10 max-w-2xl">
              Innovating the <br />
              <span className="font-serif italic text-white/80">intelligence of</span> Repolens AI
            </h1>

            <button className="liquid-glass-strong rounded-full pl-6 pr-2 py-2.5 flex items-center gap-4 hover:scale-105 active:scale-95 transition-transform group">
              <span className="font-medium text-white text-sm">Explore Now</span>
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <Download className="w-3.5 h-3.5 text-white" />
              </div>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-14">
              <span className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80">
                Architecture Visualization
              </span>
              <span className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80">
                Code Explanation
              </span>
              <span className="liquid-glass rounded-full px-4 py-2 text-xs text-white/80">
                Dependency Maps
              </span>
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
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform text-white hover:text-white/80">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform text-white hover:text-white/80">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform text-white hover:text-white/80">
                <Instagram className="w-4 h-4" />
              </a>
              <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
              <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform group">
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            
            <button className="liquid-glass rounded-full pl-5 pr-2 py-2 flex items-center gap-3 hover:scale-105 active:scale-95 transition-transform">
              <span className="text-sm font-medium text-white">Account</span>
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            </button>
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
            <div className="flex-1 liquid-glass rounded-3xl p-6 flex flex-col justify-between aspect-square group hover:scale-105 transition-transform cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-lg text-white mb-1">Analysis</h4>
                <p className="text-xs text-white/60">Automated architecture mapping</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex-1 liquid-glass rounded-3xl p-6 flex flex-col justify-between aspect-square group hover:scale-105 transition-transform cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-lg text-white mb-1">Insights</h4>
                <p className="text-xs text-white/60">Comprehensive codebase context</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
