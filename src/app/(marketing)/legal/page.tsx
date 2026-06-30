import type { Metadata } from "next";
import { SectionHeader } from "@/components/shared/SectionHeader";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "CGU de DigitalXSolutions Academy.",
};

export default function LegalPage() {
  return (
    <section className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Légal"
          title="Conditions Générales d'Utilisation"
          subtitle="Dernière mise à jour : Juin 2026"
        />

        <div className="mt-12 space-y-8 text-mist text-sm leading-relaxed">
          <div>
            <h2 className="font-display text-xl font-semibold text-star-white mb-3">1. Objet</h2>
            <p>Les pr&eacute;sentes CGU r&eacute;gissent l&apos;acc&egrave;s et l&apos;utilisation de la plateforme DigitalXSolutions Academy. En vous inscrivant, vous acceptez ces conditions sans r&eacute;serve.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-star-white mb-3">2. Accès à la plateforme</h2>
            <p>L&apos;acc&egrave;s &agrave; la plateforme est r&eacute;serv&eacute; aux utilisateurs ayant cr&eacute;&eacute; un compte. Vous &ecirc;tes responsable de la confidentialit&eacute; de vos identifiants. Tout acc&egrave;s non autoris&eacute; doit &ecirc;tre signal&eacute; imm&eacute;diatement.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-star-white mb-3">3. Propriété intellectuelle</h2>
            <p>Tout le contenu de la formation (vid&eacute;os, textes, exercices) est la propri&eacute;t&eacute; exclusive de DigitalXSolutions Academy. Toute reproduction ou distribution sans autorisation est interdite.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-star-white mb-3">4. Abonnement et remboursement</h2>
            <p>L&apos;abonnement est mensuel ou annuel selon la formule choisie. Vous pouvez annuler &agrave; tout moment. Le remboursement est possible sous 14 jours conform&eacute;ment &agrave; la l&eacute;gislation alg&eacute;rienne et fran&ccedil;aise.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-star-white mb-3">5. Protection des données</h2>
            <p>Nous collectons vos donn&eacute;es personnelles uniquement dans le cadre de votre inscription et de votre suivi p&eacute;dagogique. Conform&eacute;ment au RGPD, vous disposez d&apos;un droit d&apos;acc&egrave;s, de rectification et de suppression.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-star-white mb-3">6. Contact</h2>
            <p>Pour toute question concernant ces CGU, contactez-nous &agrave; l&apos;adresse : <span className="text-violet">contact@digitalxsolutions.com</span>.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
