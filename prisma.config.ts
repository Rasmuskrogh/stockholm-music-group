import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Dummy URL vid prisma generate när DATABASE_URL saknas (t.ex. Vercel install). Används bara för generering, inte anslutning.
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/dummy?schema=public",
  },
});
