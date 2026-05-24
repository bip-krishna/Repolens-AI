"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutDashboard, Search, Settings, ArrowLeft, Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-white/20">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col liquid-glass-strong m-4 mr-0 rounded-3xl">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <Hexagon className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tighter">
              repolens
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors",
              pathname === "/dashboard" ? "bg-white/10 text-white font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors px-4 py-3 rounded-xl hover:bg-white/5">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden p-4 lg:p-4">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 p-4 mb-4 liquid-glass-strong rounded-2xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <Hexagon className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tighter">repolens</span>
          </Link>
        </div>

        {/* Dashboard Area */}
        <div className="flex-1 overflow-auto liquid-glass-strong rounded-3xl p-6 lg:p-10 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
