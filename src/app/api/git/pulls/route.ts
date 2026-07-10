import { NextRequest, NextResponse } from "next/server";
import { getPRAnalytics } from "@/lib/github-extended";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json({ success: false, error: "Missing owner or repo" }, { status: 400 });
  }

  try {
    const data = await getPRAnalytics(owner, repo);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
