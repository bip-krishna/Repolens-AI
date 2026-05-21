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
