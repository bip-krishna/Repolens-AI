import { NextRequest, NextResponse } from "next/server";
import { getCommits, getContributors, getBranches, getReleases, getCommitActivity } from "@/lib/github-extended";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json({ success: false, error: "Missing owner or repo" }, { status: 400 });
  }

  try {
    const [commits, contributors, branches, releases, commitActivity] = await Promise.all([
      getCommits(owner, repo, 100),
      getContributors(owner, repo),
      getBranches(owner, repo),
      getReleases(owner, repo),
      getCommitActivity(owner, repo),
    ]);

    return NextResponse.json({
      success: true,
      data: { commits, contributors, branches, releases, commitActivity },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
