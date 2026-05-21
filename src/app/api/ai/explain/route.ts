import { NextRequest, NextResponse } from "next/server";
import { generateExplanation } from "@/lib/ai";
import { codeExplainPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const { filePath, code, repoContext } = await request.json();

    if (!filePath || !code) {
      return NextResponse.json({ success: false, error: "Missing filePath or code" }, { status: 400 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ success: false, error: "GOOGLE_API_KEY not configured" }, { status: 500 });
    }

    const prompt = codeExplainPrompt(filePath, code, repoContext || "");
    const explanation = await generateExplanation(prompt);
    return NextResponse.json({ success: true, data: explanation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
