"use client";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Bot, User, Send, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const user = useAppStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { id: "welcome", role: "assistant", content: `Salut ${user?.name?.split(" ")[0] || "toi"} ! Je suis le mentor DigitalX Solutions Academy. Pose-moi des questions sur le Vibe Coding, l'IA, le SaaS ou les formations.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const botMsg: Msg = { id: `b-${Date.now()}`, role: "assistant", content: data.reply || "Je n'ai pas pu répondre." };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: "assistant", content: "Service temporairement indisponible." }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 sm:w-96 h-[480px] bg-surface border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet/[0.15] to-magenta/[0.10] border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-star-white">Mentor IA</p>
                <p className="text-[10px] text-mist">DigitalXSolutions Academy</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 text-mist hover:text-star-white hover:bg-white/5 rounded-lg transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[80%] rounded-xl px-3 py-2",
                  msg.role === "user"
                    ? "bg-gradient-to-r from-violet to-magenta text-white rounded-tr-sm"
                    : "bg-void/80 border border-white/[0.06] text-star-white rounded-tl-sm"
                )}>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-void/80 border border-white/[0.06] rounded-xl rounded-tl-sm px-3 py-2">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-magenta animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-rose animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/5 p-3 bg-void/50">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pose ta question..."
                rows={1}
                className="flex-1 bg-void/80 border border-white/10 rounded-xl py-2 px-3 text-xs text-star-white placeholder:text-mist resize-none focus:outline-none focus:border-violet/50 transition-colors max-h-20"
                style={{ minHeight: "34px" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-violet to-magenta text-white disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200",
          open ? "bg-rose rotate-90" : "bg-gradient-to-r from-violet to-magenta hover:scale-105"
        )}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>
    </div>
  );
}
