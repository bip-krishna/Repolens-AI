"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold">
              Repo<span className="gradient-text">Lens</span> AI
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RepoLens AI. Built with ❤️ by krishna.
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              GitHub
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
