import { NextRequest, NextResponse } from "next/server";
import { streamChat } from "@/lib/ai";
import { chatSystemPrompt } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, repoName, treeStr, summary } = body;

    if (!messages?.length) {
      return NextResponse.json({ success: false, error: "No messages provided" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const systemPrompt = chatSystemPrompt(
      repoName || "Unknown",
      treeStr || "",
      summary || "No summary available"
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamChat(systemPrompt, messages)) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk, done: false })}\n\n`));
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: "", done: true })}\n\n`));
          controller.close();
        } catch (error: any) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message, done: true })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
