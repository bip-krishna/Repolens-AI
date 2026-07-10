"use client";

import { use, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, GitFork, Eye, AlertCircle, ExternalLink, Code, FileText, Loader2, Sparkles, LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useLazyFetch } from "@/hooks/useLazyFetch";
import { useGitData } from "@/hooks/useGitData";

// Dashboard components
import { FileTree } from "@/components/dashboard/FileTree";
import { LanguageBar } from "@/components/dashboard/LanguageBar";
import { AIOverviewCard } from "@/components/dashboard/AIOverviewCard";
import { TechStackChart } from "@/components/dashboard/TechStackChart";
import { CodeQualityCard } from "@/components/dashboard/CodeQualityCard";
import { HealthDashboard } from "@/components/dashboard/HealthDashboard";
import { FeatureExtraction } from "@/components/dashboard/FeatureExtraction";
import { FileHeatmap } from "@/components/dashboard/FileHeatmap";
import { FolderSizeGraph } from "@/components/dashboard/FolderSizeGraph";
import { CommitActivityGraph } from "@/components/dashboard/CommitActivityGraph";
import { ContributorNetwork } from "@/components/dashboard/ContributorNetwork";
import { GitBranchViz } from "@/components/dashboard/GitBranchViz";
import { ReleaseTimeline } from "@/components/dashboard/ReleaseTimeline";
import { CodeComplexityRadar } from "@/components/dashboard/CodeComplexityRadar";
import { AISuggestions } from "@/components/dashboard/AISuggestions";
import { SecurityAnalysis } from "@/components/dashboard/SecurityAnalysis";
import { LearningMode } from "@/components/dashboard/LearningMode";

// Phase 2-7 components
import { APIFlowDiagram } from "@/components/visualization/APIFlowDiagram";
import { StateManagementFlow } from "@/components/visualization/StateManagementFlow";
import { ComponentHierarchy } from "@/components/visualization/ComponentHierarchy";
import { CallGraph } from "@/components/visualization/CallGraph";
import { PackageRelationship } from "@/components/visualization/PackageRelationship";
import { DatabaseERDiagram } from "@/components/visualization/DatabaseERDiagram";
import { PageNavigationGraph } from "@/components/visualization/PageNavigationGraph";
import { FolderResponsibility } from "@/components/dashboard/FolderResponsibility";
import { RepoTimeline } from "@/components/dashboard/RepoTimeline";
import { DependencyUpdateTimeline } from "@/components/dashboard/DependencyUpdateTimeline";
import { RepoEvolution } from "@/components/dashboard/RepoEvolution";
import { DocumentationCoverageComponent } from "@/components/dashboard/DocumentationCoverage";
import { TestCoverage } from "@/components/dashboard/TestCoverage";
import { OnboardingRoadmap } from "@/components/dashboard/OnboardingRoadmap";
import { ImpactAnalysis } from "@/components/dashboard/ImpactAnalysis";
import { RepoKnowledgeGraph } from "@/components/visualization/RepoKnowledgeGraph";
import { IssueAnalytics } from "@/components/dashboard/IssueAnalytics";
import { PRAnalytics } from "@/components/dashboard/PRAnalytics";
import { RepoSimilarity } from "@/components/dashboard/RepoSimilarity";

// Visualization components
import { DependencyGraph } from "@/components/visualization/DependencyGraph";
import { ArchitectureDiagram } from "@/components/visualization/ArchitectureDiagram";
import { ExecutionFlow } from "@/components/visualization/ExecutionFlow";
import { ChatInterface } from "@/components/chat/ChatInterface";

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

function LoadingCard({ label }: { label: string }) {
  return (
    <div className="liquid-glass rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-6 w-6 text-white/40 animate-spin" />
      <span className="text-sm text-white/40">{label}</span>
    </div>
  );
}

function LazySection({ title, loading, error, fetched, onLoad, children }: {
  title: string; loading: boolean; error: string | null; fetched: boolean; onLoad: () => void; children: React.ReactNode;
}) {
  if (!fetched) {
    return (
      <div className="liquid-glass rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
        <button
          onClick={onLoad}
          className="liquid-glass rounded-xl px-6 py-3 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Load {title}
        </button>
        <span className="text-xs text-white/30">Click to generate AI analysis</span>
      </div>
    );
  }
  if (loading) return <LoadingCard label={`Generating ${title}...`} />;
  if (error) return (
    <div className="liquid-glass rounded-2xl p-6 text-center">
      <p className="text-sm text-red-400/60">{error}</p>
    </div>
  );
  return <>{children}</>;
}

export default function RepoAnalysisPage({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const { owner, repo } = use(params);
  const { analysis, loading, error } = useAnalysis(owner, repo);

  // Lazy-loaded AI features
  const overview = useLazyFetch<any>(`/api/ai/overview?owner=${owner}&repo=${repo}`);
  const quality = useLazyFetch<any>(`/api/ai/quality?owner=${owner}&repo=${repo}`);
  const health = useLazyFetch<any>(`/api/ai/health?owner=${owner}&repo=${repo}`);
  const features = useLazyFetch<any>(`/api/ai/features?owner=${owner}&repo=${repo}`);
  const suggestions = useLazyFetch<any>(`/api/ai/suggestions?owner=${owner}&repo=${repo}`);
  const security = useLazyFetch<any>(`/api/ai/security?owner=${owner}&repo=${repo}`);
  const complexity = useLazyFetch<any>(`/api/ai/architecture?owner=${owner}&repo=${repo}&type=complexity`);
  const executionFlow = useLazyFetch<any>(`/api/ai/architecture?owner=${owner}&repo=${repo}&type=execution-flow`);
  const learning = useLazyFetch<any>(`/api/ai/onboarding?owner=${owner}&repo=${repo}&type=learning`);

  // Phase 7 fetches
  const issues = useLazyFetch<any>(`/api/git/issues?owner=${owner}&repo=${repo}`);
  const pulls = useLazyFetch<any>(`/api/git/pulls?owner=${owner}&repo=${repo}`);

  // Git data (loads automatically)
  const { gitData, loading: gitLoading } = useGitData(owner, repo);

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

        {metadata.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {metadata.topics.slice(0, 10).map((t) => (
              <Badge key={t} variant="secondary" className="text-xs bg-white/5 text-white/70 border-white/10 hover:bg-white/10">
                {t}
              </Badge>
            ))}
          </div>
        )}

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
            <TabsTrigger value="structure" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg text-xs sm:text-sm text-white/60 hover:text-white">Structure</TabsTrigger>
            <TabsTrigger value="architecture" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg text-xs sm:text-sm text-white/60 hover:text-white">Architecture</TabsTrigger>
            <TabsTrigger value="git" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg text-xs sm:text-sm text-white/60 hover:text-white">Git & History</TabsTrigger>
            <TabsTrigger value="quality" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg text-xs sm:text-sm text-white/60 hover:text-white">Quality & Security</TabsTrigger>
            <TabsTrigger value="onboarding" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg text-xs sm:text-sm text-white/60 hover:text-white">Onboarding</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg text-xs sm:text-sm text-white/60 hover:text-white">Insights</TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg text-xs sm:text-sm text-white/60 hover:text-white">Chat</TabsTrigger>
          </TabsList>

          {/* ===== OVERVIEW TAB ===== */}
          <TabsContent value="overview" className="space-y-6">
            {/* AI Overview */}
            <LazySection title="AI Overview" {...overview} onLoad={overview.fetch}>
              {overview.data && <AIOverviewCard overview={overview.data} />}
            </LazySection>

            {/* Tech Stack */}
            <TechStackChart languages={languages} />

            {/* Languages */}
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
                <Code className="h-4 w-4 text-white" /> Languages
              </h3>
              <LanguageBar languages={languages} />
            </div>

            {/* AI Summary */}
            {summary && (
              <div className="liquid-glass rounded-2xl p-6 space-y-4">
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
                      {summary.keyComponents.slice(0, 6).map((c: any, i: number) => (
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

            {/* Health Dashboard */}
            <LazySection title="Health Dashboard" {...health} onLoad={health.fetch}>
              {health.data && <HealthDashboard health={health.data} />}
            </LazySection>

            {/* Feature Extraction */}
            <LazySection title="Feature Detection" {...features} onLoad={features.fetch}>
              {features.data?.features && <FeatureExtraction features={features.data.features} />}
            </LazySection>

            {/* Frameworks */}
            {frameworks.length > 0 && (
              <div className="liquid-glass rounded-2xl p-6">
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
            <div className="liquid-glass rounded-2xl p-6">
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

            {/* File Heatmap */}
            <FileHeatmap tree={tree} />
          </TabsContent>

          {/* ===== STRUCTURE TAB ===== */}
          <TabsContent value="structure" className="space-y-6">
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-white">File Structure Explorer</h3>
              <ScrollArea className="h-[600px] liquid-glass rounded-xl p-4">
                <FileTree tree={tree} />
              </ScrollArea>
            </div>

            <FolderSizeGraph tree={tree} />
            
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-white">Directory Responsibilities</h3>
              <FolderResponsibility tree={tree} />
            </div>
          </TabsContent>

          {/* ===== ARCHITECTURE TAB ===== */}
          <TabsContent value="architecture" className="space-y-6">
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-white">Layered Architecture Diagram</h3>
              <ArchitectureDiagram tree={tree} frameworks={frameworks} />
            </div>

            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-white">Dependency Graph</h3>
              <DependencyGraph tree={tree} />
            </div>

            <LazySection title="Execution Flow" {...executionFlow} onLoad={executionFlow.fetch}>
              {executionFlow.data && (
                <div className="liquid-glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4 text-white">Flow of Execution</h3>
                  <ExecutionFlow flowData={executionFlow.data} />
                </div>
              )}
            </LazySection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="liquid-glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4 text-white">API Endpoint Flows</h3>
                <APIFlowDiagram tree={tree} />
              </div>
              <div className="liquid-glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4 text-white">State Management Updates</h3>
                <StateManagementFlow tree={tree} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="liquid-glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4 text-white">Component hierarchy</h3>
                <ComponentHierarchy tree={tree} />
              </div>
              <div className="liquid-glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4 text-white">Call Trace Graph</h3>
                <CallGraph tree={tree} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="liquid-glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4 text-white">Database Entities Schema</h3>
                <DatabaseERDiagram tree={tree} />
              </div>
              <div className="liquid-glass rounded-2xl p-6">
                <h3 className="font-semibold mb-4 text-white">Navigation Flow</h3>
                <PageNavigationGraph tree={tree} />
              </div>
            </div>

            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-white">Package Dependencies relationships</h3>
              <PackageRelationship tree={tree} />
            </div>
          </TabsContent>

          {/* ===== GIT & HISTORY TAB ===== */}
          <TabsContent value="git" className="space-y-6">
            {gitLoading ? (
              <LoadingCard label="Loading git history..." />
            ) : gitData ? (
              <>
                <RepoTimeline commits={gitData.commits} />
                <CommitActivityGraph commits={gitData.commits} commitActivity={gitData.commitActivity} />
                <ContributorNetwork contributors={gitData.contributors} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GitBranchViz branches={gitData.branches} />
                  <ReleaseTimeline releases={gitData.releases} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DependencyUpdateTimeline />
                  <RepoEvolution commits={gitData.commits} />
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-white/40">
                No git data available. A GitHub token may be required for this feature.
              </div>
            )}
          </TabsContent>

          {/* ===== QUALITY & SECURITY TAB ===== */}
          <TabsContent value="quality" className="space-y-6">
            <LazySection title="Code Quality" {...quality} onLoad={quality.fetch}>
              {quality.data && <CodeQualityCard quality={quality.data} />}
            </LazySection>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DocumentationCoverageComponent />
              <TestCoverage />
            </div>

            <LazySection title="Code Complexity" {...complexity} onLoad={complexity.fetch}>
              {complexity.data && <CodeComplexityRadar metrics={complexity.data} />}
            </LazySection>

            <LazySection title="Security Analysis" {...security} onLoad={security.fetch}>
              {security.data && <SecurityAnalysis report={security.data} />}
            </LazySection>

            <LazySection title="AI Suggestions" {...suggestions} onLoad={suggestions.fetch}>
              {suggestions.data?.suggestions && <AISuggestions suggestions={suggestions.data.suggestions} />}
            </LazySection>
          </TabsContent>

          {/* ===== ONBOARDING TAB ===== */}
          <TabsContent value="onboarding" className="space-y-6">
            <OnboardingRoadmap />
            <ImpactAnalysis tree={tree} />
            <LazySection title="Learning Mode" {...learning} onLoad={learning.fetch}>
              {learning.data?.steps && <LearningMode steps={learning.data.steps} />}
            </LazySection>
          </TabsContent>

          {/* ===== INSIGHTS TAB ===== */}
          <TabsContent value="insights" className="space-y-6">
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-white">Repository Knowledge Ecosystem Graph</h3>
              <RepoKnowledgeGraph />
            </div>

            <LazySection title="Issue Insights" {...issues} onLoad={issues.fetch}>
              {issues.data && <IssueAnalytics data={issues.data} />}
            </LazySection>

            <LazySection title="PR Metrics" {...pulls} onLoad={pulls.fetch}>
              {pulls.data && <PRAnalytics data={pulls.data} />}
            </LazySection>

            <RepoSimilarity />
          </TabsContent>

          {/* ===== CHAT TAB ===== */}
          <TabsContent value="chat">
            <div className="liquid-glass rounded-2xl overflow-hidden min-h-[600px]">
              <ChatInterface repoName={`${owner}/${repo}`} treeStr={treeStr} summary={summaryStr} />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
