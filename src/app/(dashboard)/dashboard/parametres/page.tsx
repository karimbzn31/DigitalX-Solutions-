"use client";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/useNotificationStore";
import { User, Bell, Shield, LogOut, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const notifOptions = [
  { label: "Nouveaux cours ou modules", desc: "Recevez une notification quand du contenu est ajouté" },
  { label: "Rappels de progression", desc: "Recevez des rappels pour continuer votre formation" },
  { label: "Messages de la communauté", desc: "Notifications quand quelqu'un interagit avec vos posts" },
  { label: "Offres et mises à jour", desc: "Informations sur les nouvelles fonctionnalités" },
];

export default function ParametresPage() {
  const { user, setUser } = useAppStore();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(notifOptions.map((_, i) => [i, true]))
  );
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
  ];

  const handleSaveProfile = () => {
    if (!user) return;
    setUser({ ...user, name, initials: name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2), email });
    setSaved(true);
    addNotification({ type: "success", title: "Profil mis à jour", message: "Vos informations ont été enregistrées." });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => { setUser(null); router.push("/login"); };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-star-white">Paramètres</h2>
        <p className="text-sm text-mist mt-1">Gérez votre compte et vos préférences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-48 shrink-0">
          <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-xs font-medium transition-all",
                    activeTab === tab.id ? "bg-violet/10 text-violet" : "text-mist hover:text-star-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-6">
                <h3 className="text-sm font-semibold text-star-white mb-4">Informations personnelles</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-lg font-bold text-white">
                    {user?.initials || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-star-white">{user?.name || "Utilisateur"}</p>
                    <p className="text-xs text-mist">{user?.email || ""}</p>
                    {user?.level && (
                      <p className="text-[10px] mt-1 px-2 py-0.5 rounded-full bg-violet/10 text-violet inline-block">{user.level}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-mist block mb-1.5">Nom complet</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-star-white placeholder:text-mist focus:outline-none focus:border-violet/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-mist block mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-star-white placeholder:text-mist focus:outline-none focus:border-violet/50 transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet to-magenta text-white text-xs font-medium hover:brightness-110 transition-all"
                  >
                    {saved ? <><Check className="w-3.5 h-3.5" /> Enregistré</> : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-6">
              <h3 className="text-sm font-semibold text-star-white mb-4">Préférences de notifications</h3>
              <div className="space-y-4">
                {notifOptions.map((notif, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-xs text-star-white font-medium">{notif.label}</p>
                      <p className="text-[11px] text-mist mt-0.5">{notif.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifPrefs[i]}
                        onChange={() => setNotifPrefs((prev) => ({ ...prev, [i]: !prev[i] }))}
                      />
                      <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-violet after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-6">
                <h3 className="text-sm font-semibold text-star-white mb-4">Sécurité du compte</h3>
                <div className="space-y-4">
                  <button className="flex items-center justify-between w-full py-3 border-b border-white/5 text-left hover:bg-white/5 rounded-lg px-2 transition-colors">
                    <div>
                      <p className="text-xs text-star-white font-medium">Mot de passe</p>
                      <p className="text-[11px] text-mist mt-0.5">Modifier votre mot de passe actuel</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-mist" />
                  </button>
                  <button className="flex items-center justify-between w-full py-3 border-b border-white/5 text-left hover:bg-white/5 rounded-lg px-2 transition-colors">
                    <div>
                      <p className="text-xs text-star-white font-medium">Authentification à deux facteurs</p>
                      <p className="text-[11px] text-mist mt-0.5">Ajouter une couche de sécurité supplémentaire</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-mist" />
                  </button>
                  <button className="flex items-center justify-between w-full py-3 text-left hover:bg-white/5 rounded-lg px-2 transition-colors">
                    <div>
                      <p className="text-xs text-star-white font-medium">Sessions actives</p>
                      <p className="text-[11px] text-mist mt-0.5">Gérer les appareils connectés à votre compte</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-mist" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-rose/10 text-rose text-sm font-medium hover:bg-rose/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
