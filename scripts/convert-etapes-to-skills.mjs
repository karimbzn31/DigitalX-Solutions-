import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function main() {
  console.log("=== Conversion des ETAPES → Skills JARVIS ===\n");

  // Récupérer les ressources de type "file" qui sont des ETAPES
  const { data: resources, error } = await supabase
    .from("resources")
    .select("*")
    .eq("type", "file");

  if (error) {
    console.error("Erreur:", error.message);
    return;
  }

  if (!resources || resources.length === 0) {
    console.log("Aucune ressource à convertir.");
    return;
  }

  console.log(`📦 ${resources.length} ressources trouvées\n`);

  for (const r of resources) {
    // Upload content to storage if present
    let fileUrl = r.file_url;

    if (r.content && !r.file_url) {
      const filename = `etapes/${r.title.toLowerCase().replace(/\s+/g, "-")}.md`;
      const buffer = Buffer.from(r.content, "utf-8");

      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(filename, buffer, {
          contentType: "text/markdown; charset=utf-8",
          upsert: true,
        });

      if (uploadError) {
        console.log(`  ❌ Upload ${r.title}: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("resources")
        .getPublicUrl(filename);

      fileUrl = urlData.publicUrl;
    }

    // Mettre à jour : type → skill, file_url, content → null
    const updates = {
      type: "skill",
      file_url: fileUrl || r.file_url,
      content: null,
    };

    const { error: updateError } = await supabase
      .from("resources")
      .update(updates)
      .eq("id", r.id);

    if (updateError) {
      console.log(`  ❌ Update ${r.title}: ${updateError.message}`);
    } else {
      console.log(`  ✅ ${r.title} → Skill JARVIS`);
    }
  }

  console.log("\n=== Vérification finale ===");
  const { data: skills } = await supabase
    .from("resources")
    .select("id, title, type")
    .eq("type", "skill");

  console.log(`\n⚡ Total skills: ${skills?.length || 0}`);
  skills?.forEach((s) => console.log(`  ⚡ ${s.title}`));
}

main().catch(console.error);
