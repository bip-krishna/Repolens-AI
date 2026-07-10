import { NextRequest, NextResponse } from "next/server";
import { getRepoMetadata, getRepoTree, getReadme, getFileContent } from "@/lib/github";
import { generateRepoOverview } from "@/lib/ai";
import { repoOverviewPrompt } from "@/lib/prompts";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

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
    const languages = Object.keys(metadata).length > 0 ? (metadata.language || "Unknown") : "Unknown";

    const prompt = repoOverviewPrompt(`${owner}/${repo}`, treeStr, readme, packageJsonStr, languages);
    const overview = await generateRepoOverview(prompt);

    return NextResponse.json({ success: true, data: overview });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
