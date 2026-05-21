import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AISummary, OnboardingGuide } from "@/types";

function getClient() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not set. Get one at https://aistudio.google.com/");
  }
  return new GoogleGenerativeAI(apiKey);
}

export async function generateSummary(prompt: string): Promise<AISummary> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    // Try to parse JSON from the response (may be wrapped in markdown)
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
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
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function* streamChat(systemPrompt: string, messages: { role: string; content: string }[]) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: "You are RepoLens AI assistant. " + systemPrompt }] },
      { role: "model", parts: [{ text: "I understand. I'm ready to help analyze this repository. What would you like to know?" }] },
      ...messages.slice(0, -1).map((m) => ({
        role: m.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: m.content }],
      })),
    ],
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessageStream(lastMessage.content);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

export async function generateOnboarding(prompt: string): Promise<OnboardingGuide> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
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
