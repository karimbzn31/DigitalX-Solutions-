import type { Metadata } from "next";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Mail, MapPin, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe DigitalXSolutions Academy.",
};

export default function ContactPage() {
  return (
    <section className="pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Contact"
          title="Parlons de votre projet"
          subtitle="Une question ? Un projet ? Notre &eacute;quipe est l&agrave; pour vous r&eacute;pondre."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 max-w-4xl mx-auto">
          <div>
            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-mist mb-1.5">
                  Nom complet
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-sm text-star-white placeholder:text-mist/30 outline-none focus:border-violet transition-colors"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-mist mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-sm text-star-white placeholder:text-mist/30 outline-none focus:border-violet transition-colors"
                  placeholder="vous@exemple.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-mist mb-1.5">
                  Sujet
                </label>
                <select
                  id="subject"
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-sm text-star-white outline-none focus:border-violet transition-colors"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="info">Demande d&apos;information</option>
                  <option value="pricing">Question sur les tarifs</option>
                  <option value="support">Support technique</option>
                  <option value="partnership">Partenariat</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-mist mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-sm text-star-white placeholder:text-mist/30 outline-none focus:border-violet transition-colors resize-none"
                  placeholder="Décrivez votre demande..."
                />
              </div>
              <button
                type="button"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-violet to-magenta text-star-white font-medium text-sm hover:opacity-90 transition-all duration-200"
              >
                Envoyer le message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="nebula-card rounded-[0.75rem] p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-violet/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-violet" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-star-white mb-1">Email</h3>
                  <p className="text-sm text-mist">contact@digitalxsolutions.com</p>
                </div>
              </div>
            </div>

            <div className="nebula-card rounded-[0.75rem] p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-violet/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-violet" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-star-white mb-1">Communauté</h3>
                  <p className="text-sm text-mist">Rejoignez notre serveur Discord pour échanger avec la communauté.</p>
                </div>
              </div>
            </div>

            <div className="nebula-card rounded-[0.75rem] p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-violet/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-violet" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-star-white mb-1">Basé en Algérie</h3>
                  <p className="text-sm text-mist">Nous op&eacute;rons depuis Alger et servons des apprenants dans toute l&apos;Afrique et la francophonie.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
