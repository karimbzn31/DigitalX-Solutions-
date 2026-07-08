import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const JARVIS_DIR = "C:/Users/DELL/Desktop/Karim/AI/Jarvis Karim";

const files = [
  { file: "jarvis-router.js",    title: "JARVIS Routeur — Routage Intelligent 5 Modèles",     desc: "Routeur multi-modèle avec smart call, fallback et table de routage." },
  { file: "jarvis-autofix.js",   title: "JARVIS Auto-Fix — Correction Automatique d'Erreurs", desc: "Moteur de détection et correction automatique des erreurs." },
  { file: "jarvis-learn.js",     title: "JARVIS Learn — Système d'Apprentissage Automatique", desc: "Base de connaissance et création de règles automatiques." },
  { file: "jarvis-benchmark.js", title: "JARVIS Benchmark — Test des Modèles IA",              desc: "Benchmark complet pour tester les modèles d'IA." },
  { file: "jarvis-design.js",    title: "JARVIS Design — Génération UI/UX",                    desc: "Création de designs, logos, palettes et maquettes UI." },
  { file: "jarvis-saas.js",      title: "JARVIS SaaS — Création de A à Z",                     desc: "Génération de SaaS complet : auth, paiements, dashboard." },
  { file: "jarvis-mvp.js",       title: "JARVIS MVP — Prototypage Rapide",                     desc: "MVP fonctionnel en quelques minutes." },
  { file: "jarvis-vision.js",    title: "JARVIS Vision — Analyse d'Images",                    desc: "Analyse et description d'images par IA." },
  { file: "jarvis-frontend.js",  title: "JARVIS Frontend — Composants UI",                     desc: "Génération de composants React/Next.js + Tailwind." },
  { file: "jarvis-backend.js",   title: "JARVIS Backend — API & Base de Données",              desc: "Création d'APIs REST et bases Supabase." },
  { file: "jarvis-fullstack.js", title: "JARVIS Fullstack — Application Complète",             desc: "App complète frontend + backend en un prompt." },
  { file: "jarvis-deploy.js",    title: "JARVIS Deploy — Mise en Production",                  desc: "Déploiement Vercel, DNS et CI/CD automatisé." },
];

async function main() {
  console.log("=== Import des 12 Skills en version Code ===\n");

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const num = i + 1;
    process.stdout.write(`${num}/12 ${f.title}... `);

    try {
      const filePath = `${JARVIS_DIR}/${f.file}`;
      const content = readFileSync(filePath, "utf-8");
      const buffer = readFileSync(filePath);

      // Upload to storage
      const { error: upErr } = await supabase.storage
        .from("resources")
        .upload(`code/${f.file}`, buffer, {
          contentType: "application/javascript",
          upsert: true,
        });

      if (upErr) {
        console.log(`❌ Storage: ${upErr.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("resources")
        .getPublicUrl(`code/${f.file}`);

      // Create resource with type "code" + inline content for viewing
      const { error: dbErr } = await supabase.from("resources").insert({
        type: "code",
        title: f.title,
        description: f.desc,
        content: content,           // inline code for viewing/copying
        file_url: urlData.publicUrl, // downloadable file
        file_size: buffer.length,
        module_id: null,
      });

      console.log(dbErr ? `❌ DB: ${dbErr.message}` : "✅");
    } catch (err) {
      console.log(`❌ ${err.message}`);
    }
  }

  console.log("\n=== Vérification ===");
  const { data } = await supabase
    .from("resources")
    .select("count")
    .eq("type", "code");
  console.log(`💻 Total Code: ${data?.[0]?.count || "?"}`);
}

main().catch(console.error);
