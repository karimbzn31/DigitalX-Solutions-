// Migration script - exécutez avec: node scripts/migrate.mjs
// Le mot de passe de la base est disponible dans:
// Dashboard Supabase > Project Settings > Database > Connection string

import pg from "pg";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PROJECT_REF = "puopprktoznyhmpzmxyw";
const REGION = "eu-west-1";

const password = process.env.SUPABASE_DB_PASSWORD;
if (!password) {
  console.error("\n❌ Mot de passe manquant !");
  console.error("\n📋 Récupère-le dans le dashboard Supabase :");
  console.error(`   1. Va sur https://supabase.com/dashboard/project/${PROJECT_REF}/settings/database`);
  console.error(`   2. Copie le mot de passe sous "Database password"`);
  console.error(`   3. Relance : $env:SUPABASE_DB_PASSWORD = "ton_mdp"; node scripts/migrate.mjs\n`);
  process.exit(1);
}

const poolUrl = `postgresql://postgres.${PROJECT_REF}:${encodeURIComponent(password)}@aws-0-${REGION}.pooler.supabase.com:6543/postgres`;

const sql = readFileSync(resolve(__dirname, "..", "supabase-schema.sql"), "utf-8");

const pool = new pg.Pool({
  connectionString: poolUrl,
  ssl: { rejectUnauthorized: false },
  max: 1,
  connectionTimeoutMillis: 10000,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("🔌 Connecté à Supabase PostgreSQL\n");

    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    let count = 0;
    for (const stmt of statements) {
      try {
        await client.query(stmt + ";");
        count++;
        process.stdout.write(".");
      } catch (err) {
        // Ignore "already exists" errors
        if (err.message?.includes("already exists") || err.message?.includes("duplicate")) {
          process.stdout.write("s");
        } else {
          console.error(`\n⚠ Erreur sur une instruction (ignorée): ${err.message.slice(0, 100)}`);
          process.stdout.write("e");
        }
      }
    }

    console.log(`\n\n✅ Migration terminée ! ${count} instructions exécutées.`);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("\n❌ Erreur:", err.message);
  process.exit(1);
});
