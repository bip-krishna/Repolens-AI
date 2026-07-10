export const SYSTEM_PROMPT = `You are RepoLens AI, an expert software engineer and code analyst. You analyze GitHub repositories and help developers understand codebases quickly.

Your responses should be:
- Clear and concise
- Technical but accessible
- Structured with markdown formatting
- Focused on practical understanding

When analyzing code, identify:
1. Purpose and functionality
2. Key patterns and architecture decisions
3. Dependencies and relationships
4. Potential improvements or areas of interest`;

export function repoSummaryPrompt(repoName: string, tree: string, readme: string | null, packageJson: string | null) {
  return `Analyze this GitHub repository: ${repoName}

## File Structure:
${tree}

${readme ? `## README:\n${readme.slice(0, 3000)}` : "No README available."}

${packageJson ? `## package.json:\n${packageJson.slice(0, 2000)}` : ""}

Please provide a structured JSON response with:
{
  "overview": "2-3 sentence project overview",
  "architecture": "Description of the project architecture and patterns used",
  "keyComponents": [{"name": "string", "path": "string", "description": "string", "type": "component|utility|api|config|model|service|other"}],
  "techStack": ["list of technologies"],
  "setupInstructions": ["step by step setup"],
  "goodFirstIssues": ["suggestions for new contributors"]
}

Return ONLY valid JSON, no markdown fences.`;
}

export function codeExplainPrompt(filePath: string, code: string, repoContext: string) {
  return `Explain this code file from a repository.

Repository context: ${repoContext}

File: ${filePath}
\`\`\`
${code.slice(0, 8000)}
\`\`\`

Provide a clear, structured explanation covering:
1. **Purpose**: What this file does
2. **Key Functions/Components**: Main exports and their roles
3. **Dependencies**: What it imports and why
4. **Flow**: How data/control flows through this file
5. **Patterns**: Notable design patterns used`;
}

export function chatSystemPrompt(repoName: string, treeStr: string, summary: string) {
  return `${SYSTEM_PROMPT}

You are currently analyzing the repository: ${repoName}

## Repository Structure:
${treeStr.slice(0, 4000)}

## Summary:
${summary.slice(0, 2000)}

Answer questions about this repository. Be specific, reference file paths when relevant, and provide code examples when helpful. If unsure, say so honestly.`;
}

export function onboardingPrompt(repoName: string, readme: string | null, tree: string, packageJson: string | null) {
  return `Generate a contributor onboarding guide for: ${repoName}

## File Structure:
${tree.slice(0, 3000)}

${readme ? `## README:\n${readme.slice(0, 2000)}` : ""}
${packageJson ? `## package.json:\n${packageJson.slice(0, 1500)}` : ""}

Provide a structured JSON response:
{
  "prerequisites": ["list of required tools/knowledge"],
  "setupSteps": [{"order": 1, "title": "string", "command": "string or null", "description": "string"}],
  "firstContributions": ["suggestions for first contributions"],
  "importantFiles": [{"path": "string", "description": "string"}],
  "contributionWorkflow": "markdown description of how to contribute"
}

Return ONLY valid JSON, no markdown fences.`;
}

export function repoOverviewPrompt(repoName: string, tree: string, readme: string | null, packageJson: string | null, languages: string) {
  return `Analyze this GitHub repository and provide a comprehensive overview: ${repoName}

## File Structure:
${tree.slice(0, 3000)}

${readme ? `## README:\n${readme.slice(0, 2000)}` : "No README available."}
${packageJson ? `## package.json:\n${packageJson.slice(0, 1500)}` : ""}
## Languages: ${languages}

Provide a structured JSON response:
{
  "description": "2-3 sentence description of what this project does",
  "problemSolved": "The main problem this project solves",
  "targetUsers": ["list of target user types"],
  "maturityLevel": "Prototype" | "MVP" | "Production" | "Enterprise",
  "technologies": ["list of key technologies used"],
  "complexity": "Low" | "Medium" | "High" | "Very High",
  "bestSuitedFor": ["hackathons", "production apps", "learning", etc.],
  "highlights": ["3-5 notable things about this repo"]
}

Return ONLY valid JSON, no markdown fences.`;
}

export function codeQualityPrompt(repoName: string, tree: string, packageJson: string | null, readme: string | null) {
  return `Score the code quality of this repository: ${repoName}

## File Structure:
${tree.slice(0, 3000)}

${packageJson ? `## package.json:\n${packageJson.slice(0, 1500)}` : ""}
${readme ? `## README:\n${readme.slice(0, 1500)}` : ""}

Score each dimension from 0 to 100 based on what you can infer from the structure, dependencies, and configuration:

{
  "overall": number,
  "breakdown": {
    "documentation": number,
    "testing": number,
    "naming": number,
    "architecture": number,
    "maintainability": number
  },
  "suggestions": ["3-5 improvement suggestions"]
}

Return ONLY valid JSON, no markdown fences.`;
}

export function healthDashboardPrompt(repoName: string, tree: string, packageJson: string | null, readme: string | null) {
  return `Evaluate the overall health of this repository: ${repoName}

## File Structure:
${tree.slice(0, 3000)}

${packageJson ? `## package.json:\n${packageJson.slice(0, 1500)}` : ""}
${readme ? `## README:\n${readme.slice(0, 1500)}` : ""}

Score each health dimension from 0 to 100:

{
  "architecture": number,
  "documentation": number,
  "security": number,
  "testing": number,
  "maintainability": number,
  "performance": number
}

Consider: folder structure, presence of tests, CI/CD, linting, type safety, documentation, dependency management, error handling patterns.

Return ONLY valid JSON, no markdown fences.`;
}

export function featureExtractionPrompt(repoName: string, tree: string, packageJson: string | null) {
  return `Identify all features implemented in this repository: ${repoName}

## File Structure:
${tree.slice(0, 4000)}

${packageJson ? `## package.json:\n${packageJson.slice(0, 1500)}` : ""}

Identify features from this list (and any others you detect):
Authentication, Payments, Dashboard, AI/ML, Chatbot, Admin Panel, Analytics, Notifications, OAuth, CRUD, Realtime, REST API, GraphQL, Database, Caching, File Upload, Email, Search, Internationalization, Dark Mode, SSR, PWA, Testing, CI/CD, Logging, Rate Limiting, WebSocket

{
  "features": [
    {
      "name": "Feature Name",
      "confidence": 0.0-1.0,
      "category": "auth|payments|ui|data|infra|ai|communication|other",
      "files": ["relevant/file/paths"]
    }
  ]
}

Return ONLY valid JSON, no markdown fences.`;
}

export function securityAnalysisPrompt(repoName: string, tree: string, packageJson: string | null) {
  return `Perform a security analysis of this repository: ${repoName}

## File Structure:
${tree.slice(0, 3000)}

${packageJson ? `## package.json:\n${packageJson.slice(0, 1500)}` : ""}

Analyze for:
1. Potential hardcoded secrets or API keys (based on file names/patterns)
2. Known vulnerable dependency patterns
3. Exposed API endpoints without apparent auth
4. Dangerous permissions or configurations

{
  "overallScore": 0-100,
  "secretsDetected": number,
  "vulnerabilities": [{"name": "string", "severity": "low|medium|high|critical", "description": "string"}],
  "exposedAPIs": ["list of potentially unprotected endpoints"],
  "dangerousPermissions": ["list of risky patterns found"]
}

Return ONLY valid JSON, no markdown fences.`;
}

export function aiSuggestionsPrompt(repoName: string, tree: string, packageJson: string | null) {
  return `Provide actionable improvement suggestions for this repository: ${repoName}

## File Structure:
${tree.slice(0, 4000)}

${packageJson ? `## package.json:\n${packageJson.slice(0, 1500)}` : ""}

Analyze and suggest improvements in these categories:
- refactor: Extract duplicate code, simplify complex logic
- test: Missing test files or test coverage
- dead-code: Unused files, imports, or exports
- structure: Folder reorganization, better separation of concerns
- dependency: Outdated, unused, or redundant packages
- security: Security improvements
- performance: Performance optimizations

{
  "suggestions": [
    {
      "type": "refactor|test|dead-code|structure|dependency|security|performance",
      "severity": "info|warning|error",
      "title": "Short title",
      "description": "Detailed explanation",
      "files": ["affected/files"],
      "fix": "How to fix this (optional)"
    }
  ]
}

Provide 5-10 suggestions. Return ONLY valid JSON, no markdown fences.`;
}

export function complexityMetricsPrompt(repoName: string, tree: string, packageJson: string | null) {
  return `Evaluate the complexity metrics of this repository: ${repoName}

## File Structure:
${tree.slice(0, 3000)}

${packageJson ? `## package.json:\n${packageJson.slice(0, 1500)}` : ""}

Score each dimension from 0 to 100:

{
  "maintainability": number,
  "readability": number,
  "coupling": number,
  "documentation": number,
  "testCoverage": number,
  "scalability": number
}

Return ONLY valid JSON, no markdown fences.`;
}

export function executionFlowPrompt(repoName: string, tree: string, packageJson: string | null) {
  return `Analyze the typical execution flow of this application: ${repoName}

## File Structure:
${tree.slice(0, 3000)}

${packageJson ? `## package.json:\n${packageJson.slice(0, 1500)}` : ""}

Trace the flow from user entry point through the application layers.

{
  "nodes": [
    {"id": "unique-id", "label": "Display Name", "type": "entry|frontend|middleware|backend|database|external|response", "description": "What happens at this step"}
  ],
  "edges": [
    {"source": "source-id", "target": "target-id", "label": "optional description of the connection"}
  ]
}

Include 6-12 nodes covering the full request/response cycle. Return ONLY valid JSON, no markdown fences.`;
}

export function learningModePrompt(repoName: string, tree: string, readme: string | null, packageJson: string | null) {
  return `Create an interactive learning walkthrough for newcomers to this repository: ${repoName}

## File Structure:
${tree.slice(0, 3000)}

${readme ? `## README:\n${readme.slice(0, 2000)}` : ""}
${packageJson ? `## package.json:\n${packageJson.slice(0, 1500)}` : ""}

{
  "steps": [
    {
      "order": 1,
      "title": "Step Title",
      "description": "Detailed explanation of what to learn in this step",
      "keyFiles": ["relevant/file/paths"],
      "concepts": ["key concepts to understand"],
      "tips": ["helpful tips for this step"]
    }
  ]
}

Create 6-8 progressive learning steps from overview to deep understanding.
Return ONLY valid JSON, no markdown fences.`;
}

export function impactAnalysisPrompt(filePath: string, tree: string, repoName: string) {
  return `Analyze the impact of changing this file in the repository: ${repoName}

## File being changed: ${filePath}

## Full File Structure:
${tree.slice(0, 4000)}

{
  "affectedFiles": ["list of files that would be affected by changes to this file"],
  "estimatedAffectedCount": number,
  "riskLevel": "Low|Medium|High|Critical",
  "reasoning": "Brief explanation of why this risk level",
  "dependencies": ["files this file depends on"],
  "dependents": ["files that depend on this file"]
}

Return ONLY valid JSON, no markdown fences.`;
}

