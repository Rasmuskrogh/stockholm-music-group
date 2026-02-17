import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Konfigurera Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

interface CloudinaryFolder {
  name: string;
  path: string;
}

export async function GET() {
  try {
    // Kontrollera om Cloudinary är konfigurerat
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.log("Cloudinary not configured");
      return NextResponse.json([]);
    }

    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const folder = process.env.CLOUDINARY_FOLDER || "gallery";

    if (!apiKey || !apiSecret) {
      console.log("Cloudinary API keys missing");
      return NextResponse.json([]);
    }

    // Testa credentials genom att lista alla bilder och mappar
    console.log("=== Testing Cloudinary credentials ===");
    console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("API key:", process.env.CLOUDINARY_API_KEY ? "Set" : "Missing");
    console.log("API secret:", process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing");

    // Testa att lista alla bilder (för att verifiera credentials)
    try {
      const allResources = await cloudinary.api.resources({
        type: "upload",
        max_results: 10,
      });
      console.log("✅ Credentials are valid!");
      console.log(`Total resources found: ${allResources.resources?.length || 0}`);
      if (allResources.resources && allResources.resources.length > 0) {
        console.log(
          "Sample public_ids:",
          allResources.resources.slice(0, 3).map((r: CloudinaryResource) => r.public_id)
        );
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      console.error("❌ Credentials test failed:", errorMessage);
      throw e;
    }

    // Lista alla mappar
    try {
      const foldersResult = await cloudinary.api.root_folders();
      console.log("Available root folders:", foldersResult.folders?.map((f: CloudinaryFolder) => f.name) || []);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      console.log("Could not list root folders:", errorMessage);
    }

    const baseFolder = folder.endsWith("/") ? folder.slice(0, -1) : folder;
    console.log("Base folder from env:", baseFolder);

    // Lista undermappar i överordnad mapp (om folder innehåller /)
    const rootForSubfolders = baseFolder.includes("/") ? baseFolder.split("/").slice(0, -1).join("/") : baseFolder;
    if (rootForSubfolders) {
      try {
        const subfoldersResult = await cloudinary.api.sub_folders(rootForSubfolders);
        console.log(
          `Subfolders in ${rootForSubfolders}:`,
          subfoldersResult.folders?.map((f: CloudinaryFolder) => f.path) || []
        );
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        console.log("Could not list subfolders:", errorMessage);
      }
    }

    // Prefix-variationer baserat på CLOUDINARY_FOLDER
    const prefixVariations: string[] = [`${baseFolder}/`, baseFolder, `home/${baseFolder}/`, `home/${baseFolder}`];

    interface CloudinaryApiResult {
      resources?: CloudinaryResource[];
    }

    let result: CloudinaryApiResult | null = null;
    let usedPrefix = "";

    // Försök först med search API (mer pålitlig för mappar)
    try {
      console.log("Trying search API with folder:", baseFolder);
      const searchResult = await cloudinary.search.expression(`folder:${baseFolder}/*`).max_results(50).execute();
      if (searchResult.resources && searchResult.resources.length > 0) {
        console.log(`✅ Found ${searchResult.resources.length} images using search API`);
        result = searchResult;
        usedPrefix = "search_api";
      } else {
        console.log("  No images found with search API");
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      console.log("Search API failed:", errorMessage);
    }

    // Om inget fungerade, testa prefix-variationer
    if (!result || result.resources?.length === 0) {
      for (const testPrefix of prefixVariations) {
        try {
          console.log(`Trying prefix: "${testPrefix}"`);
          const testResult = await cloudinary.api.resources({
            type: "upload",
            prefix: testPrefix,
            max_results: 50,
          });

          if (testResult.resources && testResult.resources.length > 0) {
            result = testResult;
            usedPrefix = testPrefix;
            console.log(`✅ Found ${testResult.resources.length} images with prefix: "${testPrefix}"`);
            break;
          } else {
            console.log(`  No images found with prefix: "${testPrefix}"`);
          }
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : "Unknown error";
          console.log(`  Prefix "${testPrefix}" failed:`, errorMessage);
        }
      }
    }

    if (!result || result.resources?.length === 0) {
      console.log("⚠️ No images found with any prefix variation");
      result = { resources: [] };
    }

    console.log("Cloudinary response:", {
      resourceCount: result.resources?.length || 0,
      resources: (result.resources || []).map((r) => r.public_id),
      usedPrefix: usedPrefix || "none",
    });

    // Transformera Cloudinary data till vårt format
    const images = (result.resources || []).map((resource) => ({
      id: resource.public_id,
      url: resource.secure_url,
      alt: resource.public_id.split("/").pop() || "Gallery image",
      width: resource.width,
      height: resource.height,
    }));

    console.log("Returning images:", images.length);
    return NextResponse.json(images);
  } catch (error) {
    console.error("Gallery API error:", error);

    // Returnera tom array vid fel
    return NextResponse.json([]);
  }
}
