// === Repository & Analysis Types ===

export interface RepoMetadata {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  license: string | null;
  homepage: string | null;
  isArchived: boolean;
  size: number; // KB
}

export interface RepoTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
  size?: number;
  extension?: string;
  aiDescription?: string;
}

export interface LanguageBreakdown {
  [language: string]: number; // bytes
}

export interface RepoAnalysis {
  metadata: RepoMetadata;
  tree: FileTreeNode;
  languages: LanguageBreakdown;
  frameworks: Framework[];
  summary: AISummary | null;
  stats: RepoStats;
}

export interface Framework {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'testing' | 'styling' | 'other';
  confidence: number; // 0-1
  icon?: string;
}

export interface RepoStats {
  totalFiles: number;
  totalDirectories: number;
  totalSize: number;
  filesByExtension: Record<string, number>;
  largestFiles: { path: string; size: number }[];
}

// === AI Types ===

export interface AISummary {
  overview: string;
  architecture: string;
  keyComponents: KeyComponent[];
  techStack: string[];
  setupInstructions: string[];
  goodFirstIssues: string[];
}

export interface KeyComponent {
  name: string;
  path: string;
  description: string;
  type: 'component' | 'utility' | 'api' | 'config' | 'model' | 'service' | 'other';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface OnboardingGuide {
  prerequisites: string[];
  setupSteps: SetupStep[];
  firstContributions: string[];
  importantFiles: { path: string; description: string }[];
  contributionWorkflow: string;
}

export interface SetupStep {
  order: number;
  title: string;
  command?: string;
  description: string;
}

// === Visualization Types ===

export interface DependencyNode {
  id: string;
  label: string;
  type: 'component' | 'utility' | 'api' | 'config' | 'page' | 'layout' | 'service' | 'model';
  path: string;
  imports: string[];
  exports: string[];
}

export interface DependencyEdge {
  source: string;
  target: string;
  type: 'import' | 'export' | 'dependency';
}

export interface ArchitectureLayer {
  name: string;
  type: 'frontend' | 'backend' | 'data' | 'infrastructure';
  modules: { name: string; description: string }[];
}

// === Enhanced AI Types ===

export interface RepoOverview {
  description: string;
  problemSolved: string;
  targetUsers: string[];
  maturityLevel: 'Prototype' | 'MVP' | 'Production' | 'Enterprise';
  technologies: string[];
  complexity: 'Low' | 'Medium' | 'High' | 'Very High';
  bestSuitedFor: string[];
  highlights: string[];
}

export interface CodeQualityScore {
  overall: number; // 0-100
  breakdown: {
    documentation: number;
    testing: number;
    naming: number;
    architecture: number;
    maintainability: number;
  };
  suggestions: string[];
}

export interface HealthMetrics {
  architecture: number;
  documentation: number;
  security: number;
  testing: number;
  maintainability: number;
  performance: number;
}

export interface DetectedFeature {
  name: string;
  confidence: number; // 0-1
  category: string;
  files: string[];
  icon?: string;
}

export interface FileImportance {
  path: string;
  name: string;
  loc: number;
  importCount: number;
  dependencyCount: number;
  complexity: number;
  score: number; // 0-5
}

export interface SecurityReport {
  overallScore: number; // 0-100
  secretsDetected: number;
  vulnerabilities: { name: string; severity: 'low' | 'medium' | 'high' | 'critical'; description: string }[];
  exposedAPIs: string[];
  dangerousPermissions: string[];
}

export interface AISuggestion {
  type: 'refactor' | 'test' | 'dead-code' | 'structure' | 'dependency' | 'security' | 'performance';
  severity: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  files: string[];
  fix?: string;
}

// === Git Data Types ===

export interface GitCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  avatar?: string;
}

export interface GitContributor {
  login: string;
  avatar: string;
  contributions: number;
  expertise?: string[];
  ownership?: number; // percentage
}

export interface GitBranch {
  name: string;
  isDefault: boolean;
  isProtected: boolean;
  lastCommitDate?: string;
}

export interface GitRelease {
  tagName: string;
  name: string;
  date: string;
  body: string;
  isPrerelease: boolean;
}

export interface CommitActivity {
  week: string;
  count: number;
}

export interface GitData {
  commits: GitCommit[];
  contributors: GitContributor[];
  branches: GitBranch[];
  releases: GitRelease[];
  commitActivity: CommitActivity[];
}

// === Flow & Architecture Types ===

export interface FlowNode {
  id: string;
  label: string;
  type: string;
  description?: string;
}

export interface FlowEdge {
  source: string;
  target: string;
  label?: string;
}

export interface ExecutionFlowData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface APIEndpoint {
  method: string;
  path: string;
  handler: string;
  description?: string;
}

export interface ComponentNode {
  name: string;
  path: string;
  children: ComponentNode[];
  type: 'page' | 'layout' | 'component' | 'provider';
}

export interface FolderInfo {
  name: string;
  path: string;
  size: number;
  fileCount: number;
  responsibility: string;
  category: 'frontend' | 'backend' | 'database' | 'config' | 'assets' | 'tests' | 'other';
}

export interface DatabaseEntity {
  name: string;
  fields: { name: string; type: string; isPrimary?: boolean; isForeign?: boolean }[];
  relations: { target: string; type: 'one-to-one' | 'one-to-many' | 'many-to-many' }[];
}

// === Coverage Types ===

export interface DocumentationCoverage {
  readme: number;
  comments: number;
  functions: number;
  examples: number;
}

export interface TestCoverageData {
  modules: { name: string; coverage: number }[];
  overall: number;
}

export interface ComplexityMetrics {
  maintainability: number;
  readability: number;
  coupling: number;
  documentation: number;
  testCoverage: number;
  scalability: number;
}

// === Analytics Types ===

export interface IssueAnalytics {
  total: number;
  open: number;
  closed: number;
  bugs: number;
  features: number;
  avgResponseTime: string;
  timeline: { date: string; opened: number; closed: number }[];
}

export interface PRAnalytics {
  total: number;
  merged: number;
  rejected: number;
  open: number;
  avgReviewTime: string;
  reviewDistribution: { reviewer: string; count: number }[];
}

export interface RepoSimilarityResult {
  name: string;
  similarity: number;
  matchingTech: string[];
  matchingFeatures: string[];
}

// === Knowledge Graph Types ===

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'user' | 'feature' | 'service' | 'data' | 'external';
  size?: number;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  strength: number;
}

// === API Response Types ===

export interface AnalyzeResponse {
  success: boolean;
  data?: RepoAnalysis;
  error?: string;
}

export interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}
