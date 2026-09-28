// Snapshot all production content (Postgres + Cloudinary) to migration/extracted/.
import fs from "node:fs";
import pg from "pg";
import { v2 as cloudinary } from "cloudinary";

const out = new URL("./extracted/", import.meta.url);
const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
for (const table of ["Hero", "Content", "MediaVideo", "GalleryImage"]) {
  const { rows } = await db.query(`SELECT * FROM "${table}"`);
  fs.writeFileSync(new URL(`${table}.json`, out), JSON.stringify(rows, null, 2));
  console.log(table, rows.length);
}
await db.end();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const folder = (process.env.CLOUDINARY_FOLDER || "gallery").replace(/\/$/, "");
const res = await cloudinary.search.expression(`folder:${folder}/*`).max_results(500).execute();
fs.writeFileSync(new URL("cloudinary.json", out), JSON.stringify(res.resources, null, 2));
console.log("cloudinary", res.resources.length, "total_count", res.total_count);
