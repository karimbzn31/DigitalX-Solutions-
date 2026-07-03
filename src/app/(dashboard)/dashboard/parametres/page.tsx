"use client";
import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/useNotificationStore";
import { supabase } from "@/lib/supabase";
import { User, Bell, Shield, LogOut, ChevronRight, Check, Gift, Copy, ExternalLink, Users } from "lucide-react";
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
  const [loggingOut, setLoggingOut] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [referralLoading, setReferralLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/referral/code")
      .then((r) => r.json())
      .then((data) => {
        setReferralCode(data.code);
        setReferralCount(data.count || 0);
        setReferralLoading(false);
      })
      .catch(() => setReferralLoading(false));
  }, []);

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "referral", label: "Parrainage", icon: Gift },
    { id: "security", label: "Sécurité", icon: Shield },
  ];

  const handleSaveProfile = () => {
    if (!user) return;
    setUser({ ...user, name, initials: name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2), email });
    setSaved(true);
    addNotification({ type: "success", title: "Profil mis à jour", message: "Vos informations ont été enregistrées." });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

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
                      <span className="text-[10px] mt-1 px-2 py-0.5 rounded-full bg-violet/10 text-violet inline-block">{user.level}</span>
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
                {notifOptions.map((opt, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group">
                    <div className={cn(
                      "w-5 h-5 rounded-lg border transition-all flex items-center justify-center shrink-0 mt-0.5",
                      notifPrefs[i] ? "bg-violet border-violet" : "border-white/10 bg-white/5"
                    )}>
                      <input
                        type="checkbox"
                        checked={notifPrefs[i]}
                        onChange={() => setNotifPrefs(prev => ({ ...prev, [i]: !prev[i] }))}
                        className="sr-only"
                      />
                      {notifPrefs[i] && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm text-star-white font-medium">{opt.label}</p>
                      <p className="text-[11px] text-mist">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === "referral" && (
            <div className="space-y-4">
              <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-star-white">Parrainage</h3>
                    <p className="text-xs text-mist">Invitez vos amis et gagnez des récompenses</p>
                  </div>
                </div>

                {referralLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-5 h-5 border-2 border-violet border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : referralCode ? (
                  <div className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-violet/5 rounded-xl p-4 border border-violet/10">
                        <p className="text-2xl font-bold text-violet">{referralCount}</p>
                        <p className="text-xs text-mist mt-0.5">Personnes parrainées</p>
                      </div>
                      <div className="bg-emerald-400/5 rounded-xl p-4 border border-emerald-400/10">
                        <p className="text-2xl font-bold text-emerald-400">{referralCount * 100}</p>
                        <p className="text-xs text-mist mt-0.5">XP gagnés (100 XP / filleul)</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-mist block mb-1.5">Votre code de parrainage</label>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-white/5 rounded-lg px-4 py-3 text-sm font-mono font-bold text-star-white tracking-wider border border-white/10">
                          {referralCode}
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`https://digital-x-solutions.vercel.app/register?ref=${referralCode}`);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet/10 text-violet text-xs font-medium hover:bg-violet/20 transition-all"
                        >
                          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? "Copié !" : "Copier"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-mist mb-2">Partagez sur :</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const url = `https://wa.me/?text=${encodeURIComponent("Rejoins-moi sur DigitalXSolutions Academy ! Parrains-nous et débloque des bonus : https://digital-x-solutions.vercel.app/register?ref=" + referralCode)}`;
                            window.open(url, "_blank");
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-medium hover:bg-[#25D366]/20 transition-all"
                        >
                          WhatsApp
                        </button>
                        <button
                          onClick={() => {
                            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://digital-x-solutions.vercel.app/register?ref=" + referralCode)}`;
                            window.open(url, "_blank");
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1877F2]/10 text-[#1877F2] text-xs font-medium hover:bg-[#1877F2]/20 transition-all"
                        >
                          Facebook
                        </button>
                        <button
                          onClick={() => {
                            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Rejoins-moi sur DigitalXSolutions Academy ! 🚀 Parrains-nous et débloque des bonus !")}&url=${encodeURIComponent("https://digital-x-solutions.vercel.app/register?ref=" + referralCode)}`;
                            window.open(url, "_blank");
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-mist text-xs font-medium hover:text-star-white hover:bg-white/10 transition-all"
                        >
                          X / Twitter
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-mist">Impossible de charger votre code. Réessayez plus tard.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-6">
                <h3 className="text-sm font-semibold text-star-white mb-4">Sécurité du compte</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-star-white">Mot de passe</p>
                      <p className="text-xs text-mist">••••••••</p>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-mist hover:text-star-white text-xs transition-all">
                      Modifier <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-xs text-mist mb-3">Session active</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs text-star-white">Connecté</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose/10 border border-rose/20 text-rose text-xs font-medium hover:bg-rose/20 transition-all disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                {loggingOut ? "Déconnexion..." : "Se déconnecter"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
