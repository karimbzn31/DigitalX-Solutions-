import { NextResponse } from "next/server";
import { supabaseAdmin, requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 });
    }

    // Vérifier la taille (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 50MB)" }, { status: 400 });
    }

    // Générer un nom de fichier unique
    const ext = file.name.split(".").pop() || "";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `${fileName}`;

    // Upload vers Supabase Storage (bucket "resources")
    const buffer = Buffer.from(await file.arrayBuffer());

    const { data, error } = await supabaseAdmin.storage
      .from("resources")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      // Si le bucket n'existe pas encore, essayer de le créer
      if (error.message?.includes("bucket") || error.message?.includes("not found")) {
        await supabaseAdmin.storage.createBucket("resources", {
          public: true,
          fileSizeLimit: 52428800,
        });
        // Réessayer l'upload
        const retry = await supabaseAdmin.storage
          .from("resources")
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: false,
          });
        if (retry.error) {
          return NextResponse.json({ error: "Erreur de stockage: " + retry.error.message }, { status: 500 });
        }
      } else {
        return NextResponse.json({ error: "Erreur d'upload: " + error.message }, { status: 500 });
      }
    }

    // Récupérer l'URL publique
    const { data: urlData } = supabaseAdmin.storage
      .from("resources")
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: urlData.publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    console.error("Upload error:", msg);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
