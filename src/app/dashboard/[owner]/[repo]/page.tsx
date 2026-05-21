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

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-3">
      <div className="p-2 rounded-lg" style={{ background: `${color}20` }}>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <div>
        <div className="text-lg font-bold">{typeof value === "number" ? value.toLocaleString() : value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
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
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="font-semibold mb-1">Analyzing Repository</h2>
          <p className="text-sm text-muted-foreground">Fetching data and generating AI insights for {owner}/{repo}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <div className="text-center">
          <h2 className="font-semibold mb-1">Analysis Failed</h2>
          <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const { metadata, tree, languages, frameworks, summary, stats } = analysis;
  const treeStr = JSON.stringify(tree).slice(0, 3000);
  const summaryStr = summary ? JSON.stringify(summary) : "";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <span className="text-muted-foreground font-normal">{metadata.owner}/</span>
              <span className="gradient-text">{metadata.name}</span>
            </h1>
            {metadata.description && (
              <p className="text-muted-foreground mt-1 max-w-2xl">{metadata.description}</p>
            )}
          </div>
          <a
            href={`https://github.com/${metadata.fullName}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors glass px-3 py-1.5 rounded-lg"
          >
            View on GitHub <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Topics */}
        {metadata.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {metadata.topics.slice(0, 10).map((t) => (
              <Badge key={t} variant="secondary" className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/20">
                {t}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={Star} label="Stars" value={metadata.stars} color="#F59E0B" />
          <StatCard icon={GitFork} label="Forks" value={metadata.forks} color="#8B5CF6" />
          <StatCard icon={Eye} label="Watchers" value={metadata.watchers} color="#3B82F6" />
          <StatCard icon={AlertCircle} label="Issues" value={metadata.openIssues} color="#EF4444" />
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="glass h-auto p-1 flex flex-wrap gap-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 rounded-lg text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="structure" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 rounded-lg text-xs sm:text-sm">File Structure</TabsTrigger>
            <TabsTrigger value="architecture" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 rounded-lg text-xs sm:text-sm">Architecture</TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 rounded-lg text-xs sm:text-sm">Chat</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Languages */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Code className="h-4 w-4 text-purple-400" /> Languages
              </h3>
              <LanguageBar languages={languages} />
            </div>

            {/* AI Summary */}
            {summary && (
              <div className="glass rounded-xl p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-400" /> AI Summary
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{summary.overview}</p>
                {summary.architecture && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Architecture</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{summary.architecture}</p>
                  </div>
                )}
                {summary.keyComponents?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Components</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {summary.keyComponents.slice(0, 6).map((c, i) => (
                        <div key={i} className="p-3 rounded-lg bg-white/5 text-sm">
                          <div className="font-medium text-purple-300">{c.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{c.description}</div>
                          <div className="text-xs text-muted-foreground/50 mt-1 font-mono">{c.path}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Frameworks */}
            {frameworks.length > 0 && (
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-4">Detected Frameworks & Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {frameworks.map((f) => (
                    <Badge key={f.name} variant="outline" className="text-xs border-purple-500/20">
                      {f.name}
                      <span className="ml-1 text-muted-foreground/50">{f.category}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-4">Repository Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div><span className="text-muted-foreground">Total Files:</span> <span className="font-medium">{stats.totalFiles.toLocaleString()}</span></div>
                <div><span className="text-muted-foreground">Directories:</span> <span className="font-medium">{stats.totalDirectories.toLocaleString()}</span></div>
                <div><span className="text-muted-foreground">Total Size:</span> <span className="font-medium">{(stats.totalSize / 1024 / 1024).toFixed(1)} MB</span></div>
              </div>
            </div>
          </TabsContent>

          {/* File Structure Tab */}
          <TabsContent value="structure">
            <div className="glass rounded-xl p-6">
              <h3 className="font-semibold mb-4">File Structure</h3>
              <ScrollArea className="h-[600px]">
                <FileTree tree={tree} />
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture">
            <div className="space-y-4">
              <h3 className="font-semibold">Dependency Graph</h3>
              <DependencyGraph tree={tree} />
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <ChatInterface repoName={`${owner}/${repo}`} treeStr={treeStr} summary={summaryStr} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
