"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { Star, GitFork, Eye, AlertCircle, ExternalLink, Calendar, Code, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAnalysis } from "@/hooks/useAnalysis";
import { FileTree } from "@/components/dashboard/FileTree";
import { LanguageBar } from "@/components/dashboard/LanguageBar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { DependencyGraph } from "@/components/visualization/DependencyGraph";

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="liquid-glass rounded-xl p-4 flex items-center gap-3 hover:scale-105 transition-transform">
      <div className="p-2 rounded-lg bg-white/10">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div>
        <div className="text-lg font-bold text-white">{typeof value === "number" ? value.toLocaleString() : value}</div>
        <div className="text-xs text-white/50">{label}</div>
      </div>
    </div>
  );
}

export default function RepoAnalysisPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const { owner, repo } = use(params);
  const { analysis, loading, error } = useAnalysis(owner, repo);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl liquid-glass flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="font-semibold mb-1 text-white">Analyzing Repository</h2>
          <p className="text-sm text-white/50">Fetching data and generating AI insights for {owner}/{repo}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-2xl liquid-glass flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-white" />
        </div>
        <div className="text-center">
          <h2 className="font-semibold mb-1 text-white">Analysis Failed</h2>
          <p className="text-sm text-white/50 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const { metadata, tree, languages, frameworks, summary, stats } = analysis;
  const treeStr = JSON.stringify(tree).slice(0, 3000);
  const summaryStr = summary ? JSON.stringify(summary) : "";

  return (
    <div className="max-w-6xl mx-auto text-white">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <span className="text-white/50 font-normal">{metadata.owner}/</span>
              <span className="text-white">{metadata.name}</span>
            </h1>
            {metadata.description && (
              <p className="text-white/60 mt-1 max-w-2xl">{metadata.description}</p>
            )}
          </div>
          <a
            href={`https://github.com/${metadata.fullName}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors liquid-glass px-4 py-2 rounded-lg"
          >
            View on GitHub <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Topics */}
        {metadata.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {metadata.topics.slice(0, 10).map((t) => (
              <Badge key={t} variant="secondary" className="text-xs bg-white/5 text-white/70 border-white/10 hover:bg-white/10">
                {t}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Star} label="Stars" value={metadata.stars} />
          <StatCard icon={GitFork} label="Forks" value={metadata.forks} />
          <StatCard icon={Eye} label="Watchers" value={metadata.watchers} />
          <StatCard icon={AlertCircle} label="Issues" value={metadata.openIssues} />
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="liquid-glass h-auto p-1.5 flex flex-wrap gap-1 rounded-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg text-xs sm:text-sm text-white/60 hover:text-white">Overview</TabsTrigger>
            <TabsTrigger value="structure" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg text-xs sm:text-sm text-white/60 hover:text-white">File Structure</TabsTrigger>
            <TabsTrigger value="architecture" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg text-xs sm:text-sm text-white/60 hover:text-white">Architecture</TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg text-xs sm:text-sm text-white/60 hover:text-white">Chat</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Languages */}
            <div className="liquid-glass rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
                <Code className="h-4 w-4 text-white" /> Languages
              </h3>
              <LanguageBar languages={languages} />
            </div>

            {/* AI Summary */}
            {summary && (
              <div className="liquid-glass rounded-xl p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-white">
                  <FileText className="h-4 w-4 text-white" /> AI Summary
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">{summary.overview}</p>
                {summary.architecture && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-white">Architecture</h4>
                    <p className="text-sm text-white/60 leading-relaxed">{summary.architecture}</p>
                  </div>
                )}
                {summary.keyComponents?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-white">Key Components</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {summary.keyComponents.slice(0, 6).map((c, i) => (
                        <div key={i} className="p-4 rounded-xl liquid-glass text-sm">
                          <div className="font-medium text-white">{c.name}</div>
                          <div className="text-xs text-white/60 mt-1">{c.description}</div>
                          <div className="text-xs text-white/40 mt-2 font-mono break-all">{c.path}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Frameworks */}
            {frameworks.length > 0 && (
              <div className="liquid-glass rounded-xl p-6">
                <h3 className="font-semibold mb-4 text-white">Detected Frameworks & Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {frameworks.map((f) => (
                    <Badge key={f.name} variant="outline" className="text-xs liquid-glass border-white/10 text-white/80">
                      {f.name}
                      <span className="ml-1 text-white/40">{f.category}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="liquid-glass rounded-xl p-6">
              <h3 className="font-semibold mb-4 text-white">Repository Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div className="liquid-glass rounded-xl p-4 text-center">
                  <div className="text-xs text-white/50 mb-1">Total Files</div> 
                  <div className="font-medium text-white text-xl">{stats.totalFiles.toLocaleString()}</div>
                </div>
                <div className="liquid-glass rounded-xl p-4 text-center">
                  <div className="text-xs text-white/50 mb-1">Directories</div> 
                  <div className="font-medium text-white text-xl">{stats.totalDirectories.toLocaleString()}</div>
                </div>
                <div className="liquid-glass rounded-xl p-4 text-center">
                  <div className="text-xs text-white/50 mb-1">Total Size</div> 
                  <div className="font-medium text-white text-xl">{(stats.totalSize / 1024 / 1024).toFixed(1)} MB</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* File Structure Tab */}
          <TabsContent value="structure">
            <div className="liquid-glass rounded-xl p-6">
              <h3 className="font-semibold mb-4 text-white">File Structure</h3>
              <ScrollArea className="h-[600px] liquid-glass rounded-xl p-4">
                <FileTree tree={tree} />
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture">
            <div className="space-y-4 liquid-glass rounded-xl p-6">
              <h3 className="font-semibold text-white">Dependency Graph</h3>
              <div className="h-[600px] rounded-xl liquid-glass overflow-hidden relative">
                 <DependencyGraph tree={tree} />
              </div>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <div className="liquid-glass rounded-xl overflow-hidden min-h-[600px]">
               <ChatInterface repoName={`${owner}/${repo}`} treeStr={treeStr} summary={summaryStr} />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
