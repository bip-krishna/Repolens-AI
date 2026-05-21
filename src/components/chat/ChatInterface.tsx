"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Square, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import type { ChatMessage } from "@/types";

const suggestedQuestions = [
  "What does this project do?",
  "How is the project structured?",
  "Where is authentication handled?",
  "How do I run this project?",
  "What are the main dependencies?",
  "Explain the API flow",
];

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" : "glass"
      }`}>
        <div className="whitespace-pre-wrap">{message.content || (
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        )}</div>
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
}

export function ChatInterface({
  repoName, treeStr, summary,
}: {
  repoName: string; treeStr: string; summary: string;
}) {
  const { messages, sendMessage, isStreaming, stopStreaming } = useChat(repoName, treeStr, summary);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-[600px] rounded-xl glass overflow-hidden">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-12 gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20">
                <Sparkles className="h-7 w-7 text-purple-400" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-1">Chat with this repository</h3>
                <p className="text-sm text-muted-foreground">Ask anything about the codebase</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full glass hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this repository..."
            className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            disabled={isStreaming}
          />
          {isStreaming ? (
            <Button type="button" onClick={stopStreaming} variant="outline" size="icon" className="h-12 w-12 rounded-xl">
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={!input.trim()} className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600">
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
