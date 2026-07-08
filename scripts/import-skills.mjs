import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JARVIS_DIR = process.env.JARVIS_DIR || "C:/Users/DELL/Desktop/Karim/AI/Jarvis Karim";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const skills = [
  { file: "jarvis-router.js", title: "JARVIS Routeur — Routage Intelligent 5 Modèles", desc: "Routeur multi-modèle avec smart call, fallback automatique et table de routage complète." },
  { file: "jarvis-autofix.js", title: "JARVIS Auto-Fix — Correction Automatique", desc: "Moteur de détection et correction automatique des erreurs dans le terminal." },
  { file: "jarvis-learn.js", title: "JARVIS Learn — Système d'Apprentissage", desc: "Système d'apprentissage automatique avec base de connaissance et création de règles." },
  { file: "jarvis-benchmark.js", title: "JARVIS Benchmark — Test des Modèles IA", desc: "Benchmark complet pour tester et comparer les performances des modèles d'IA." },
  { file: "jarvis-design.js", title: "JARVIS Design — Génération UI/UX", desc: "Skill spécialisé dans la création de designs, logos, palettes et maquettes UI." },
  { file: "jarvis-saas.js", title: "JARVIS SaaS — Création de A à Z", desc: "Génération de SaaS complet : auth, paiements, dashboard admin et déploiement." },
  { file: "jarvis-mvp.js", title: "JARVIS MVP — Prototypage Rapide", desc: "Créez un MVP fonctionnel en quelques minutes avec des prompts optimisés." },
  { file: "jarvis-vision.js", title: "JARVIS Vision — Analyse d'Images", desc: "Analyse et description d'images avec routage vers les modèles de vision." },
  { file: "jarvis-frontend.js", title: "JARVIS Frontend — UI Components", desc: "Génération de composants React/Next.js avec Tailwind et animations." },
  { file: "jarvis-backend.js", title: "JARVIS Backend — API & Base de Données", desc: "Création d'APIs REST, bases de données Supabase, et logique métier." },
  { file: "jarvis-fullstack.js", title: "JARVIS Fullstack — App Complète", desc: "Génération d'une application complète du frontend au backend en un prompt." },
  { file: "jarvis-deploy.js", title: "JARVIS Deploy — Mise en Production", desc: "Automatisation du déploiement Vercel, configuration DNS et CI/CD." },
];

async function uploadToStorage(filename, buffer) {
  const { data, error } = await supabase.storage
    .from("resources")
    .upload(`skills/${filename}`, buffer, {
      contentType: "application/octet-stream",
      upsert: true,
    });

  if (error) {
    console.error(`  ⚠️ Storage upload failed: ${error.message}`);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("resources")
    .getPublicUrl(`skills/${filename}`);

  return urlData.publicUrl;
}

async function main() {
  console.log("=== Import des 12 Skills JARVIS ===\n");

  for (let i = 0; i < skills.length; i++) {
    const s = skills[i];
    const num = i + 1;

    try {
      const filePath = `${JARVIS_DIR}/${s.file}`;
      const content = readFileSync(filePath, "utf-8");
      const buffer = readFileSync(filePath);

      process.stdout.write(`${num}/12 ${s.title}... `);

      // Upload to storage
      const fileUrl = await uploadToStorage(s.file, buffer);

      if (!fileUrl) {
        console.log("❌ (storage failed, fallback to inline)");
      } else {
        console.log("✅");
      }

      // Create resource in DB with storage URL
      const { error: dbError } = await supabase.from("resources").insert({
        type: "skill",
        title: s.title,
        description: s.desc,
        content: null,
        file_url: fileUrl,
        file_size: buffer.length,
        module_id: null,
      });

      if (dbError) {
        console.error(`  ❌ DB error: ${dbError.message}`);
      }
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }
  }

  console.log("\n=== Vérification ===");
  const { data, error } = await supabase
    .from("resources")
    .select("id, title, type")
    .eq("type", "skill");

  if (error) {
    console.error("Erreur vérification:", error.message);
  } else {
    console.log(`✅ ${data.length} skills importés avec succès !`);
    data.forEach((s) => console.log(`  ⚡ ${s.title}`));
  }
}

main().catch(console.error);
