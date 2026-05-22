import Groq from "groq-sdk";
import type { AISummary, OnboardingGuide } from "@/types";

const MODEL = "llama-3.3-70b-versatile"; // Very fast and smart model

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
