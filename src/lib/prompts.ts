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
