"use client";
import { useState } from "react";
import { communityPosts } from "@/lib/mock-data";
import { MessageCircle, Heart, Pin, Send, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const channels = [
  { id: "general", label: "Général", emoji: "💬" },
  { id: "entraide", label: "Entraide", emoji: "🤝" },
  { id: "ressources", label: "Ressources", emoji: "📚" },
  { id: "succes", label: "Succès", emoji: "🎉" },
];

const channelColors: Record<string, string> = {
  general: "text-violet bg-violet/10 border-violet/20",
  entraide: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  ressources: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  succes: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

export default function CommunautePage() {
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [newPost, setNewPost] = useState("");

  const filtered = activeChannel
    ? communityPosts.filter((p) => p.channel === activeChannel)
    : communityPosts;

  const sorted = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-star-white">Communauté</h2>
        <p className="text-sm text-mist mt-1">Échangez avec les autres apprenants et partagez vos projets</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, value: "128", label: "Membres" },
          { icon: MessageCircle, value: communityPosts.length.toString(), label: "Discussions" },
          { icon: TrendingUp, value: "24", label: "En ligne" },
        ].map((s) => (
          <div key={s.label} className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet/20 to-magenta/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-violet" />
              </div>
              <div>
                <p className="text-xl font-bold text-star-white">{s.value}</p>
                <p className="text-xs text-mist">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Channels */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setActiveChannel(null)}
          className={cn("px-4 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border", !activeChannel ? "bg-violet text-white border-violet" : "bg-white/5 text-mist border-white/10 hover:text-star-white")}
        >Tous les canaux</button>
        {channels.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChannel(activeChannel === ch.id ? null : ch.id)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border flex items-center gap-1.5",
              activeChannel === ch.id ? channelColors[ch.id] + " border-current" : "bg-white/5 text-mist border-white/10 hover:text-star-white"
            )}
          >
            <span>{ch.emoji}</span>
            {ch.label}
          </button>
        ))}
      </div>

      {/* New Post */}
      <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-4">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-xs font-bold text-white shrink-0">KM</div>
          <div className="flex-1">
            <textarea
              placeholder="Partagez quelque chose avec la communauté..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={2}
              className="w-full bg-transparent text-sm text-star-white placeholder:text-mist resize-none focus:outline-none"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
              <div className="flex gap-2">
                {channels.slice(0, 3).map((ch) => (
                  <button key={ch.id} className="text-xs text-mist hover:text-star-white transition-colors">{ch.emoji}</button>
                ))}
              </div>
              <button
                disabled={!newPost.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-violet text-white text-xs font-medium hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3 h-3" />
                Publier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {sorted.map((post) => (
          <div key={post.id} className={cn("bg-surface/70 backdrop-blur-sm border rounded-xl p-4 transition-all", post.pinned ? "border-violet/30" : "border-white/[0.07] hover:border-violet/20")}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-xs font-bold text-white shrink-0">
                {post.author.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-star-white">{post.author.name}</span>
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium border", channelColors[post.channel] || "text-mist bg-white/5 border-white/10")}>
                    {channels.find((c) => c.id === post.channel)?.emoji} {channels.find((c) => c.id === post.channel)?.label}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet/10 text-violet font-medium">{post.author.badge}</span>
                  {post.pinned && (
                    <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
                      <Pin className="w-2.5 h-2.5" /> Épinglé
                    </span>
                  )}
                </div>
                <p className="text-sm text-star-white mt-2 leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-4 mt-3">
                  <button className="flex items-center gap-1 text-xs text-mist hover:text-rose transition-colors">
                    <Heart className="w-3.5 h-3.5" />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1 text-xs text-mist hover:text-violet transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comments}
                  </button>
                  <span className="text-[10px] text-mist ml-auto">
                    {post.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
