import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const prompts = [
  {
    file: "STRATÉGIE PRODUIT, UXUI, CRO ET CROISSANCE.pdf",
    title: "Stratégie Produit, UX/UI, CRO et Croissance",
    desc: "Guide complet pour optimiser votre stratégie produit, design UX/UI, conversion et croissance.",
  },
  {
    file: "AUDIT COMPLET & REMISE À NIVEAU D'UNE STARTUP-CTO.pdf",
    title: "Audit Complet & Remise à Niveau d'une Startup — CTO",
    desc: "Méthodologie d'audit et plan de remise à niveau pour startup vue par un CTO.",
  },
];

const DIR = "C:/Users/DELL/Desktop/Karim/AI/BIBLIOTHEQUE";

async function main() {
  console.log("=== Upload des Master Prompts ===\n");

  for (const p of prompts) {
    try {
      const filePath = `${DIR}/${p.file}`;
      const buffer = readFileSync(filePath);

      // Upload to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resources")
        .upload(`prompts/${p.file}`, buffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (uploadError) {
        console.log(`  ❌ Upload ${p.title}: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("resources")
        .getPublicUrl(`prompts/${p.file}`);

      // Create resource in DB
      const { error: dbError } = await supabase.from("resources").insert({
        type: "prompt",
        title: p.title,
        description: p.desc,
        file_url: urlData?.publicUrl || "",
        file_size: buffer.length,
        content: null,
        module_id: null,
      });

      if (dbError) {
        console.log(`  ❌ DB error ${p.title}: ${dbError.message}`);
      } else {
        console.log(`  ✅ ${p.title} — ${(buffer.length / 1024).toFixed(0)} Ko`);
      }
    } catch (err) {
      console.error(`  ❌ Error ${p.file}: ${err.message}`);
    }
  }

  console.log("\n=== Vérification ===");
  const { data } = await supabase
    .from("resources")
    .select("count")
    .eq("type", "prompt");
  console.log(`📝 Total Master Prompts: ${data?.[0]?.count || "?"}`);
}

main().catch(console.error);
