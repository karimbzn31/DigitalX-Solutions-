"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { conversations as initialConversations, chatMessages as initialMessages, suggestions } from "@/lib/mock-data";
import { Send, Bot, User, MessageSquare, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

let nextConvId = initialConversations.length + 1;

export default function AiAssistantPage() {
  const { chatMessages, addChatMessage, setChatMessages, isChatLoading, setChatLoading } = useAppStore();
  const [convs, setConvs] = useState(initialConversations);
  const [activeConv, setActiveConv] = useState(convs[0]?.id || null);
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const displayMessages = useMemo(() => {
    const current = activeConv ? chatMessages[activeConv] || [] : [];
    return current.length > 0 ? current : (activeConv === convs[0]?.id ? initialMessages : []);
  }, [chatMessages, activeConv, convs]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  const handleNewConversation = () => {
    const id = `conv-${nextConvId++}`;
    setConvs((prev) => [{ id, title: "Nouvelle conversation", date: new Date() }, ...prev]);
    setActiveConv(id);
    setChatMessages(id, []);
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConvs((prev) => prev.filter((c) => c.id !== id));
    if (activeConv === id) {
      const remaining = convs.filter((c) => c.id !== id);
      setActiveConv(remaining[0]?.id || null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isChatLoading || !activeConv) return;
    const convId = activeConv;
    const userMsg = { id: `msg-${Date.now()}`, role: "user" as const, content: input.trim(), timestamp: new Date(), conversationId: convId };
    addChatMessage(convId, userMsg);
    setInput("");
    setChatLoading(true);

    setTimeout(() => {
      const responses = [
        "Excellente question ! Le Vibe Coding repose sur une collaboration étroite entre vous et l'IA. Pour maximiser l'efficacité, je vous recommande de structurer vos projets en petites tâches bien définies et d'utiliser des prompts contextuels qui décrivent précisément ce que vous attendez.",
        "C'est une excellente approche ! Pour créer un SaaS performant, commencez par valider votre idée auprès de vrais utilisateurs. Ensuite, concentrez-vous sur le MVP : une seule fonctionnalité clé, parfaitement exécutée.",
        "Les agents IA autonomes sont l'avenir du travail numérique. Avec n8n et les modèles de langage modernes, vous pouvez créer des assistants capables de gérer vos emails, répondre à vos clients et automatiser vos processus métier.",
        "Très bonne initiative ! Pour configurer votre agent WhatsApp avec n8n, assurez-vous d'utiliser le token d'accès permanent plutôt que temporaire. Vérifiez également que votre webhook est correctement configuré dans le Meta Developer Dashboard.",
      ];
      const response = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant" as const,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        conversationId: convId,
      };
      addChatMessage(convId, response);
      setChatLoading(false);
    }, 1500);
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
          <span className="text-sm font-medium text-star-white ml-2">Assistant IA</span>
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

          {isChatLoading && (
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

          {displayMessages.length <= 1 && !isChatLoading && (
            <div className="grid grid-cols-2 gap-2 mt-4">
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
                placeholder="Posez votre question à l'assistant IA..."
                rows={1}
                className="w-full bg-surface/70 border border-white/10 rounded-xl py-2.5 px-4 pr-10 text-sm text-star-white placeholder:text-mist resize-none focus:outline-none focus:border-violet/50 transition-colors max-h-32"
                style={{ minHeight: "40px" }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isChatLoading || !activeConv}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-violet to-magenta text-white disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-mist text-center mt-2">L&apos;assistant IA peut faire des erreurs. Vérifiez les informations importantes.</p>
        </div>
      </div>
    </div>
  );
}
