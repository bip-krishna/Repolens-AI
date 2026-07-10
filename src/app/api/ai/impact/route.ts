import { NextRequest, NextResponse } from "next/server";
import { getRepoMetadata, getRepoTree } from "@/lib/github";
import { generateImpactAnalysis } from "@/lib/ai";
import { impactAnalysisPrompt } from "@/lib/prompts";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const filePath = searchParams.get("file");

  if (!owner || !repo || !filePath) {
    return NextResponse.json({ success: false, error: "Missing owner, repo, or file" }, { status: 400 });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const metadata = await getRepoMetadata(owner, repo);
    const treeItems = await getRepoTree(owner, repo, metadata.defaultBranch);
    const treeStr = treeItems.slice(0, 300).map((i) => i.path).join("\n");

    const prompt = impactAnalysisPrompt(filePath, treeStr, `${owner}/${repo}`);
    const result = await generateImpactAnalysis(prompt);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
