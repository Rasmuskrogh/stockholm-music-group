"use client";

export default function AdminGalleryPage() {
  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ marginBottom: 24 }}>Galleri</h1>
      <p style={{ color: "#888" }}>
        Galleriet hämtar bilder från Cloudinary (mapp: <code style={{ background: "#222", padding: "2px 6px", borderRadius: 4 }}>CLOUDINARY_FOLDER</code> i .env).
        För att lägga till eller ta bort bilder använder du Cloudinary Dashboard eller lägger till uppladdning här i en senare version.
      </p>
    </div>
  );
}
