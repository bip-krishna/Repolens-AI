import { NextRequest, NextResponse } from "next/server";
import { getRepoMetadata, getRepoTree, getLanguages, getReadme, getFileContent } from "@/lib/github";
import { buildFileTree, detectFrameworks, computeStats } from "@/lib/parser";
import { generateSummary } from "@/lib/ai";
import { repoSummaryPrompt } from "@/lib/prompts";
import type { RepoAnalysis } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json({ success: false, error: "Missing owner or repo parameter" }, { status: 400 });
  }

  try {
    // Fetch repo data in parallel
    const [metadata, languages, readme] = await Promise.all([
      getRepoMetadata(owner, repo),
      getLanguages(owner, repo),
      getReadme(owner, repo),
    ]);

    const treeItems = await getRepoTree(owner, repo, metadata.defaultBranch);
    const fileTree = buildFileTree(treeItems);
    const stats = computeStats(treeItems);

    // Try to get package.json
    let packageJson: any = null;
    let packageJsonStr: string | null = null;
    try {
      packageJsonStr = await getFileContent(owner, repo, "package.json");
      packageJson = JSON.parse(packageJsonStr);
    } catch { /* no package.json */ }

    const frameworks = detectFrameworks(treeItems, packageJson);

    // Generate AI summary (if API key is available)
    let summary = null;
    if (process.env.GOOGLE_API_KEY) {
      try {
        const treeStr = treeItems.slice(0, 200).map((i) => i.path).join("\n");
        const prompt = repoSummaryPrompt(`${owner}/${repo}`, treeStr, readme, packageJsonStr);
        summary = await generateSummary(prompt);
      } catch (err) {
        console.error("AI summary generation failed:", err);
      }
    }

    const analysis: RepoAnalysis = {
      metadata,
      tree: fileTree,
      languages,
      frameworks,
      summary,
      stats,
    };

    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to analyze repository" },
      { status: 500 }
    );
  }
}
