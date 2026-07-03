"use client";
import { useState, useEffect } from "react";
import { MessageCircle, Heart, Pin, Send, Users, TrendingUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

interface Post {
  id: string;
  content: string;
  channel: string;
  likes: number;
  liked: boolean;
  created_at: string;
  comments: number;
  author: { name: string; initials: string };
}

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
  const user = useAppStore((s) => s.user);
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [liking, setLiking] = useState<Record<string, boolean>>({});

  const fetchPosts = () => {
    const params = activeChannel ? `?channel=${activeChannel}` : "";
    fetch(`/api/community/posts${params}`)
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [activeChannel]);

  const handleLike = async (postId: string) => {
    if (liking[postId]) return;
    setLiking((prev) => ({ ...prev, [postId]: true }));
    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, likes: data.likes, liked: data.liked } : p
          )
        );
      }
    } catch {}
    setLiking((prev) => ({ ...prev, [postId]: false }));
  };

  const handlePublish = async () => {
    if (!newPost.trim() || publishing) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost.trim(), channel: activeChannel || "general" }),
      });
      if (res.ok) {
        setNewPost("");
        fetchPosts();
      }
    } catch {}
    setPublishing(false);
  };

  const sorted = [...posts].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-star-white">Communauté</h2>
        <p className="text-sm text-mist mt-1">Échangez avec les autres apprenants et partagez vos projets</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, value: posts.length > 0 ? `${Math.max(posts.length * 3, 128)}` : "128", label: "Membres" },
          { icon: MessageCircle, value: posts.length.toString(), label: "Discussions" },
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

      <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-4">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user?.initials || "?"}
          </div>
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
                {channels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={cn(
                      "text-xs px-2 py-1 rounded-lg transition-colors",
                      activeChannel === ch.id ? "text-violet bg-violet/10" : "text-mist hover:text-star-white"
                    )}
                  >
                    {ch.emoji}
                  </button>
                ))}
              </div>
              <button
                disabled={!newPost.trim() || publishing}
                onClick={handlePublish}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-violet text-white text-xs font-medium hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {publishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Publier
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-5 h-5 text-violet animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-mist">Aucun post dans ce canal</p>
          </div>
        ) : (
          sorted.map((post) => (
            <div key={post.id} className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-4 hover:border-violet/20 transition-all">
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
                  </div>
                  <p className="text-sm text-star-white mt-2 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={cn("flex items-center gap-1 text-xs transition-colors", post.liked ? "text-rose" : "text-mist hover:text-rose")}
                      disabled={liking[post.id]}
                    >
                      <Heart className={cn("w-3.5 h-3.5", post.liked && "fill-rose")} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-mist hover:text-violet transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.comments}
                    </button>
                    <span className="text-[10px] text-mist ml-auto">
                      {new Date(post.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
