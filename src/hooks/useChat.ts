"use client";

import { useState, useCallback, useRef } from "react";
import type { ChatMessage } from "@/types";

export function useChat(repoName: string, treeStr: string, summary: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setIsStreaming(true);

    try {
      abortRef.current = new AbortController();
      const allMessages = [...messages, userMsg].map((m) => ({
        role: m.role, content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, repoName, treeStr, summary }),
        signal: abortRef.current.signal,
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response body");

      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              accumulated += data.content;
              setMessages((prev) =>
                prev.map((m) => m.id === aiMsg.id ? { ...m, content: accumulated } : m)
              );
            }
            if (data.done) break;
          } catch { /* skip malformed chunks */ }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) => m.id === aiMsg.id ? { ...m, content: "Sorry, I encountered an error. Please try again." } : m)
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }, [messages, repoName, treeStr, summary]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { messages, sendMessage, isStreaming, stopStreaming };
}
