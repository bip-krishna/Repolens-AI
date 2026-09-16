import Groq from "groq-sdk";
import type { AISummary, OnboardingGuide } from "@/types";

const MODEL = "openai/gpt-oss-120b"; // Very fast and smart model

function getClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set. Get one at https://console.groq.com/");
  }
  return new Groq({ apiKey });
}

export async function generateSummary(prompt: string): Promise<AISummary> {
  const client = getClient();
  const result = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful AI that analyzes codebases. Return the result strictly in valid JSON format without markdown wrapping." },
      { role: "user", content: prompt }
    ],
    model: MODEL,
    response_format: { type: "json_object" },
  });

  const text = result.choices[0]?.message?.content || "";

  try {
    return JSON.parse(text);
  } catch {
    return {
      overview: text.slice(0, 500),
      architecture: "Could not parse structured response",
      keyComponents: [],
      techStack: [],
      setupInstructions: [],
      goodFirstIssues: [],
    };
  }
}

export async function generateExplanation(prompt: string): Promise<string> {
  const client = getClient();
  const result = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful AI that explains code. Be concise." },
      { role: "user", content: prompt }
    ],
    model: MODEL,
  });
  return result.choices[0]?.message?.content || "";
}

export async function* streamChat(systemPrompt: string, messages: { role: string; content: string }[]) {
  const client = getClient();
  
  // Format messages for Groq API
  const formattedMessages = messages.map(m => ({
    role: m.role as "user" | "assistant",
    content: m.content
  }));

  const stream = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are RepoLens AI assistant. " + systemPrompt },
      ...formattedMessages
    ],
    model: MODEL,
    stream: true,
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || "";
    if (text) yield text;
  }
}

export async function generateOnboarding(prompt: string): Promise<OnboardingGuide> {
  const client = getClient();
  const result = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful AI that helps onboard developers to a codebase. Return the result strictly in valid JSON format without markdown wrapping." },
      { role: "user", content: prompt }
    ],
    model: MODEL,
    response_format: { type: "json_object" },
  });

  const text = result.choices[0]?.message?.content || "";

  try {
    return JSON.parse(text);
  } catch {
    return {
      prerequisites: ["Node.js", "Git"],
      setupSteps: [{ order: 1, title: "Clone the repository", command: "git clone <url>", description: "Clone the repository to your local machine" }],
      firstContributions: ["Check the issues tab for beginner-friendly issues"],
      importantFiles: [],
      contributionWorkflow: text.slice(0, 500),
    };
  }
}

/**
 * Generic AI JSON generation function used by all analysis endpoints.
 */
export async function generateJSON<T>(prompt: string, systemMessage: string, fallback: T): Promise<T> {
  const client = getClient();
  const result = await client.chat.completions.create({
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: prompt }
    ],
    model: MODEL,
    response_format: { type: "json_object" },
  });

  const text = result.choices[0]?.message?.content || "";

  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

export async function generateRepoOverview(prompt: string) {
  return generateJSON(
    prompt,
    "You are an expert software analyst. Analyze the repository and provide a comprehensive overview. Return valid JSON only.",
    {
      description: "Could not generate overview",
      problemSolved: "Unknown",
      targetUsers: [],
      maturityLevel: "Prototype" as const,
      technologies: [],
      complexity: "Medium" as const,
      bestSuitedFor: [],
      highlights: [],
    }
  );
}

export async function generateCodeQuality(prompt: string) {
  return generateJSON(
    prompt,
    "You are a code quality expert. Score the repository's code quality. Return valid JSON only.",
    {
      overall: 70,
      breakdown: { documentation: 50, testing: 50, naming: 70, architecture: 70, maintainability: 70 },
      suggestions: ["Add more tests", "Improve documentation"],
    }
  );
}

export async function generateHealthMetrics(prompt: string) {
  return generateJSON(
    prompt,
    "You are a repository health expert. Evaluate the health of this codebase. Return valid JSON only.",
    { architecture: 70, documentation: 50, security: 70, testing: 50, maintainability: 70, performance: 70 }
  );
}

export async function generateFeatureExtraction(prompt: string) {
  return generateJSON(
    prompt,
    "You are a feature detection AI. Identify all features implemented in this repository. Return valid JSON only.",
    { features: [] }
  );
}

export async function generateSecurityAnalysis(prompt: string) {
  return generateJSON(
    prompt,
    "You are a security expert. Analyze this repository for security issues. Return valid JSON only.",
    { overallScore: 70, secretsDetected: 0, vulnerabilities: [], exposedAPIs: [], dangerousPermissions: [] }
  );
}

export async function generateAISuggestions(prompt: string) {
  return generateJSON(
    prompt,
    "You are a senior software engineer. Provide actionable improvement suggestions. Return valid JSON only.",
    { suggestions: [] }
  );
}

export async function generateComplexityMetrics(prompt: string) {
  return generateJSON(
    prompt,
    "You are a software complexity analyst. Evaluate the complexity metrics. Return valid JSON only.",
    { maintainability: 70, readability: 70, coupling: 50, documentation: 50, testCoverage: 50, scalability: 70 }
  );
}

export async function generateExecutionFlow(prompt: string) {
  return generateJSON(
    prompt,
    "You are a software architect. Analyze the execution flow of this application. Return valid JSON only.",
    { nodes: [], edges: [] }
  );
}

export async function generateLearningMode(prompt: string) {
  return generateJSON(
    prompt,
    "You are an expert technical educator. Create a learning walkthrough for this codebase. Return valid JSON only.",
    { steps: [] }
  );
}

export async function generateImpactAnalysis(prompt: string) {
  return generateJSON(
    prompt,
    "You are a software impact analyst. Analyze the blast radius of changing this file. Return valid JSON only.",
    { affectedFiles: [], estimatedAffectedCount: 0, riskLevel: "Medium", reasoning: "", dependencies: [], dependents: [] }
  );
}

