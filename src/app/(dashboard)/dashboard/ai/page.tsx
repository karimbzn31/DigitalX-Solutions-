"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Send, Bot, User, MessageSquare, Plus, Trash2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  conversationId: string;
}

interface Conversation {
  id: string;
  title: string;
  date: Date;
}

let nextConvId = 2;

const suggestions = [
  { icon: "💡", text: "Comment créer un SaaS rentable ?" },
  { icon: "🤖", text: "Expliquez-moi le Vibe Coding" },
  { icon: "⚡", text: "Astuce pour n8n ?" },
  { icon: "🚀", text: "Configurer un agent WhatsApp ?" },
];

export default function AiAssistantPage() {
  const user = useAppStore((s) => s.user);
  const [convs, setConvs] = useState<Conversation[]>([
    { id: "conv-1", title: "Nouvelle conversation", date: new Date() },
  ]);
  const [activeConv, setActiveConv] = useState(convs[0]?.id || null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const displayMessages = useMemo(() => {
    return activeConv ? messages[activeConv] || [] : [];
  }, [messages, activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  const updateConvTitle = useCallback((convId: string, msg: string) => {
    setConvs((prev) => prev.map((c) =>
      c.id === convId && c.title === "Nouvelle conversation"
        ? { ...c, title: msg.length > 35 ? msg.slice(0, 35) + "..." : msg }
        : c
    ));
  }, []);

  const handleNewConversation = () => {
    const id = `conv-${nextConvId++}`;
    setConvs((prev) => [{ id, title: "Nouvelle conversation", date: new Date() }, ...prev]);
    setActiveConv(id);
    setMessages((prev) => ({ ...prev, [id]: [] }));
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConvs((prev) => prev.filter((c) => c.id !== id));
    if (activeConv === id) {
      const remaining = convs.filter((c) => c.id !== id);
      setActiveConv(remaining[0]?.id || null);
    }
    setMessages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || loading || !activeConv) return;
    const convId = activeConv;
    const userText = input.trim();
    const userMsg: ChatMessage = { id: `msg-${Date.now()}`, role: "user", content: userText, timestamp: new Date(), conversationId: convId };
    setMessages((prev) => ({ ...prev, [convId]: [...(prev[convId] || []), userMsg] }));
    setInput("");
    setLoading(true);
    updateConvTitle(convId, userText);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.reply || "Désolé, je n'ai pas pu générer de réponse.",
        timestamp: new Date(),
        conversationId: convId,
      };
      setMessages((prev) => ({ ...prev, [convId]: [...(prev[convId] || []), botMsg] }));
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant" as const,
        content: "Désolé, le service IA est temporairement indisponible. Réessaie plus tard.",
        timestamp: new Date(),
        conversationId: convId,
      };
      setMessages((prev) => ({ ...prev, [convId]: [...(prev[convId] || []), fallbackMsg] }));
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Conversations sidebar */}
      <div className={cn(
        "w-72 bg-surface/80 backdrop-blur-sm border-r border-white/5 flex flex-col shrink-0 transition-all",
        showSidebar ? "fixed inset-y-0 left-0 z-40 md:relative md:inset-auto md:z-auto" : "hidden md:flex"
      )}>
        <div className="p-4 border-b border-white/5">
          <button
            onClick={handleNewConversation}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-gradient-to-r from-violet to-magenta text-white text-xs font-medium hover:brightness-110 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Nouvelle conversation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
          {convs.map((conv) => (
            <button
              key={conv.id}
              onClick={() => { setActiveConv(conv.id); setShowSidebar(false); }}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all group",
                activeConv === conv.id ? "bg-violet/10 border-l-2 border-violet" : "hover:bg-white/5"
              )}
            >
              <MessageSquare className={cn("w-4 h-4 shrink-0", activeConv === conv.id ? "text-violet" : "text-mist")} />
              <div className="flex-1 min-w-0">
                <p className={cn("text-xs truncate", activeConv === conv.id ? "text-star-white font-medium" : "text-mist")}>{conv.title}</p>
                <p className="text-[10px] text-mist">{conv.date.toLocaleDateString("fr-FR")}</p>
              </div>
              <button onClick={(e) => handleDeleteConversation(e, conv.id)} className="opacity-0 group-hover:opacity-100 text-mist hover:text-rose transition-all">
                <Trash2 className="w-3 h-3" />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0 bg-void">
        <div className="md:hidden flex items-center p-3 border-b border-white/5">
          <button onClick={() => setShowSidebar(!showSidebar)} className="p-1 text-mist hover:text-star-white">
            <MessageSquare className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 ml-2">
            <Sparkles className="w-4 h-4 text-violet" />
            <span className="text-sm font-medium text-star-white">DigitalX IA</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
          {displayMessages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={cn(
                "max-w-[85%] sm:max-w-[70%] rounded-xl p-4",
                msg.role === "user"
                  ? "bg-gradient-to-r from-violet to-magenta text-white rounded-tr-sm"
                  : "bg-surface/80 border border-white/[0.07] text-star-white rounded-tl-sm"
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <span className="block text-[10px] mt-2 opacity-50">
                  {msg.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-surface/80 border border-white/[0.07] rounded-xl rounded-tl-sm p-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-violet animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-magenta animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-rose animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {displayMessages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet/20 to-magenta/10 flex items-center justify-center mb-4 border border-violet/20">
                <Sparkles className="w-7 h-7 text-violet" />
              </div>
              <h2 className="text-lg font-semibold text-star-white mb-1">DigitalX IA</h2>
              <p className="text-xs text-mist mb-6 max-w-xs">
                Propulsé par <span className="text-violet font-medium">DigitalX Solutions Academy</span>. Posez votre question sur nos formations, le Vibe Coding, l&apos;IA ou le SaaS.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(s.text); }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface/50 border border-white/[0.07] text-xs text-mist hover:text-star-white hover:border-violet/30 transition-all text-left"
                  >
                    <span>{s.icon}</span>
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-white/5 p-4 bg-surface/30 backdrop-blur-sm">
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Posez votre question, ${user?.name?.split(' ')[0] || "cher apprenant"}...`}
                rows={1}
                className="w-full bg-surface/70 border border-white/10 rounded-xl py-2.5 px-4 pr-10 text-sm text-star-white placeholder:text-mist resize-none focus:outline-none focus:border-violet/50 transition-colors max-h-32"
                style={{ minHeight: "40px" }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading || !activeConv}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-violet to-magenta text-white disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-mist text-center mt-2">DigitalX IA peut faire des erreurs. Vérifiez les informations importantes.</p>
        </div>
      </div>
    </div>
  );
}
