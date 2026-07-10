import { NextRequest, NextResponse } from "next/server";
import { getRepoMetadata, getRepoTree, getReadme, getFileContent } from "@/lib/github";
import { generateLearningMode, generateOnboarding } from "@/lib/ai";
import { learningModePrompt, onboardingPrompt } from "@/lib/prompts";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const type = searchParams.get("type"); // "learning" | "onboarding"

  if (!owner || !repo) {
    return NextResponse.json({ success: false, error: "Missing owner or repo" }, { status: 400 });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const metadata = await getRepoMetadata(owner, repo);
    const treeItems = await getRepoTree(owner, repo, metadata.defaultBranch);
    const readme = await getReadme(owner, repo);

    let packageJsonStr: string | null = null;
    try {
      packageJsonStr = await getFileContent(owner, repo, "package.json");
    } catch { /* no package.json */ }

    const treeStr = treeItems.slice(0, 200).map((i) => i.path).join("\n");

    if (type === "learning") {
      const prompt = learningModePrompt(`${owner}/${repo}`, treeStr, readme, packageJsonStr);
      const result = await generateLearningMode(prompt);
      return NextResponse.json({ success: true, data: result });
    } else {
      const prompt = onboardingPrompt(`${owner}/${repo}`, readme, treeStr, packageJsonStr);
      const result = await generateOnboarding(prompt);
      return NextResponse.json({ success: true, data: result });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
