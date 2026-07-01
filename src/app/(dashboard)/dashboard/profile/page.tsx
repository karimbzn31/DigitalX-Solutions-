"use client";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { currentUser } from "@/lib/mock-data";
import {
  User, Mail, Award, BookOpen, Clock, Zap, LogOut
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAppStore();

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  const info = [
    { icon: User, label: "Nom", value: user?.name || currentUser.name },
    { icon: Mail, label: "Email", value: user?.email || currentUser.email },
    { icon: Award, label: "Niveau", value: currentUser.level },
    { icon: BookOpen, label: "Vidéos", value: `${currentUser.videosWatched}/${currentUser.totalVideos}` },
    { icon: Clock, label: "Temps passé", value: currentUser.timeSpent },
    { icon: Zap, label: "Progression", value: `${currentUser.totalProgress}%` },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-star-white">Profil</h2>
        <p className="text-sm text-mist mt-1">Vos informations personnelles</p>
      </div>

      {/* Avatar + Name */}
      <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-2xl font-bold text-white mx-auto">
          {user?.initials || "?"}
        </div>
        <h3 className="text-lg font-display font-semibold text-star-white mt-4">{user?.name || currentUser.name}</h3>
        <span className="inline-block text-xs px-3 py-1 rounded-full bg-violet/10 text-violet font-medium mt-1">
          {currentUser.level}
        </span>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-mist">
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-violet" />
            {currentUser.certificates} certificat{currentUser.certificates > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-violet" />
            {currentUser.videosWatched} vidéos
          </span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl overflow-hidden">
        {info.map((item) => (
          <div key={item.label} className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5 last:border-0">
            <div className="w-9 h-9 rounded-lg bg-violet/10 flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-violet" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-mist">{item.label}</p>
              <p className="text-sm text-star-white font-medium">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-mist">Progression globale</span>
          <span className="text-xs text-star-white font-medium">{currentUser.totalProgress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${currentUser.totalProgress}%`,
              background: "linear-gradient(90deg, #7C5CFF, #C45CFF)",
              boxShadow: "0 0 8px rgba(124, 92, 255, 0.3)",
            }}
          />
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-rose/10 text-rose text-sm font-medium hover:bg-rose/20 transition-all"
      >
        <LogOut className="w-4 h-4" />
        Se déconnecter
      </button>
    </div>
  );
}
