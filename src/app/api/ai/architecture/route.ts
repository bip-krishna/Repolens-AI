import { NextRequest, NextResponse } from "next/server";
import { getRepoMetadata, getRepoTree, getReadme, getFileContent } from "@/lib/github";
import { generateComplexityMetrics, generateExecutionFlow } from "@/lib/ai";
import { complexityMetricsPrompt, executionFlowPrompt } from "@/lib/prompts";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const type = searchParams.get("type"); // "complexity" | "execution-flow"

  if (!owner || !repo) {
    return NextResponse.json({ success: false, error: "Missing owner or repo" }, { status: 400 });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const metadata = await getRepoMetadata(owner, repo);
    const treeItems = await getRepoTree(owner, repo, metadata.defaultBranch);

    let packageJsonStr: string | null = null;
    try {
      packageJsonStr = await getFileContent(owner, repo, "package.json");
    } catch { /* no package.json */ }

    const treeStr = treeItems.slice(0, 200).map((i) => i.path).join("\n");

    if (type === "execution-flow") {
      const prompt = executionFlowPrompt(`${owner}/${repo}`, treeStr, packageJsonStr);
      const result = await generateExecutionFlow(prompt);
      return NextResponse.json({ success: true, data: result });
    } else {
      const prompt = complexityMetricsPrompt(`${owner}/${repo}`, treeStr, packageJsonStr);
      const result = await generateComplexityMetrics(prompt);
      return NextResponse.json({ success: true, data: result });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
