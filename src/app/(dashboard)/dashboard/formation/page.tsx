// Route dynamique — pas de cache statique (évite l'ancienne page après login)
export const dynamic = "force-dynamic";

import FormationsContent from "./formations-content";

export default function FormationPage() {
  return <FormationsContent />;
}
