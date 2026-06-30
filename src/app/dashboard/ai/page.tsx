"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { chatMessages, suggestions } from "@/lib/mock-data";
import { NebulaButton } from "@/components/shared/NebulaButton";

export default function AIPage() {
  const { chatMessages: messages, addChatMessage, isChatLoading, setChatLoading } = useAppStore();
  const [input, setInput] = useState("");
  const [localSuggestions, setLocalSuggestions] = useState(suggestions);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialDisplayed = useRef(false);

  useEffect(() => {
    if (!initialDisplayed.current && messages.length === 0) {
      chatMessages.forEach((msg) => addChatMessage(msg));
      initialDisplayed.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    addChatMessage({ id: Date.now().toString(), role: "user", content: input, timestamp: new Date() });
    setInput("");
    setChatLoading(true);
    setLocalSuggestions([]);

    setTimeout(() => {
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Je prends note de votre question et je prépare une réponse détaillée. En attendant, n'hésitez pas à consulter les modules de formation pour en savoir plus.",
        timestamp: new Date(),
      });
      setChatLoading(false);
    }, 1500);
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold text-star-white">Assistant IA</h1>
        <p className="text-sm text-mist">Posez vos questions sur la formation</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin mb-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet/20 to-magenta/20 border border-violet/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-violet" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed rounded-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-violet to-magenta text-white"
                    : "nebula-card"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet/20 to-magenta/20 border border-violet/20 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-violet" />
                </div>
              )}
            </motion.div>
          ))}
          {isChatLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet/20 to-magenta/20 border border-violet/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-violet" />
              </div>
              <div className="nebula-card px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-violet/50 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-violet/50 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-violet/50 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.length <= 1 && localSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {localSuggestions.map((s) => (
              <button
                key={s.text}
                onClick={() => handleSuggestion(s.text)}
                className="text-xs nebula-card px-3 py-1.5 text-mist hover:text-star-white hover:border-violet/30 transition-all"
              >
                {s.icon} {s.text}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Posez votre question..."
            className="w-full px-4 py-3 rounded-lg bg-surface border border-white/10 text-star-white text-sm placeholder:text-mist/40 focus:outline-none focus:border-violet transition-colors pr-12"
          />
        </div>
        <NebulaButton onClick={handleSend} disabled={!input.trim() || isChatLoading} className="px-4 py-3">
          <Send className="w-4 h-4" />
        </NebulaButton>
      </div>
    </div>
  );
}
