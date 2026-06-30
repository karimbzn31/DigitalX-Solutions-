import { Award } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";

export default function CertificatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-star-white">Certificats</h1>
        <p className="text-sm text-mist">Téléchargez vos certificats de complétion</p>
      </div>

      <NebulaCard className="p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet/10 to-magenta/10 border border-violet/10 flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-violet" />
        </div>
        <h3 className="font-display text-lg font-semibold text-star-white mb-2">Aucun certificat pour le moment</h3>
        <p className="text-sm text-mist max-w-sm mx-auto">
          Complétez les modules de formation pour obtenir vos certificats.
        </p>
      </NebulaCard>
    </div>
  );
}
