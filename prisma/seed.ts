import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEFAULT_ADMIN_PASSWORD = "BytMig123!";

const weddingBlocks = [
  {
    subtitle: "Musik som gör ert bröllop personligt, varmt och minnesvärt",
    content:
      "Att planera ett bröllop innebär många val. Ett av de viktigaste är musiken – den som ska bära känslan genom hela dagen. Stockholm Music Group hjälper er att skapa rätt stämning, utan stress eller osäkerhet. Vi är en professionell och samspelt cover-trio som guidar er från ceremoni till mingel och middag, med varm sång, personlig repertoar och en trygg helhetslösning.",
  },
  {
    subtitle: "Känner ni igen er?",
    content:
      "Ni vill att musiken ska kännas som er – inte generisk. Ni vill kunna lita på att allt fungerar på dagen. Ni vill slippa krångel med ljud, upplägg och detaljer. Ni ska inte behöva oroa er för musiken på ert bröllop. Det är där vi kommer in.",
    list: [
      "Ni vill att musiken ska kännas som er – inte generisk",
      "Ni vill kunna lita på att allt fungerar på dagen",
      "Ni vill slippa krångel med ljud, upplägg och detaljer",
    ],
  },
  {
    subtitle: "Så hjälper vi er – steg för steg",
    steps: [
      { title: "Vi lyssnar på er", text: "Era önskemål, er stil och er vision för dagen." },
      { title: "Vi planerar musiken", text: "Låtval, stämning, tider och teknisk lösning – anpassat efter er." },
      { title: "Vi levererar tryggt på dagen", text: "Ni kan slappna av och vara närvarande. Vi tar hand om resten." },
    ],
  },
  {
    subtitle: "Musik för hela bröllopsdagen",
    items: [
      { label: "🎵 Ceremoni", text: "Personliga tolkningar av era favoritlåtar – musik som förstärker ögonblicket." },
      { label: "🥂 Mingel & middag", text: "Stämningsfulla akustiska set som skapar värme och ett naturligt flöde." },
    ],
  },
  {
    subtitle: "Varför välja Stockholm Music Group?",
    list: [
      "Erfaren, samspelt och pålitlig trio",
      "Brett repertoarspann: pop, soul, jazz, rock, visor & svenska klassiker",
      "Personligt bemötande och skräddarsydda låtval",
      "Professionellt ljud och en smidig helhetslösning",
    ],
  },
  {
    subtitle: "Resultatet",
    intro: "Ett bröllop där:",
    list: ["ni kan vara helt närvarande", "gästerna känner stämningen", "musiken blir en naturlig del av minnet"],
    outro: "Stockholm Music Group – vi guidar er till ett bröllop som känns lika bra som det låter.",
  },
  { type: "cta", text: "👉 Kontakta oss för lediga datum" },
];

async function main() {
  const hash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: "admin@stockholmmusicgroup.com" },
    update: {},
    create: {
      email: "admin@stockholmmusicgroup.com",
      name: "Admin",
      passwordHash: hash,
    },
  });

  await prisma.hero.upsert({
    where: { id: "default" },
    update: {},
    create: {
      videoUrl: "/videos/hero.mp4",
      backgroundImageUrl: "/images/background.jpg",
      title: "Stockholm",
      subtitle: "Music Group",
      ctaText: "BOKA OSS",
    },
  });

  const contentEntries: { key: string; value: string }[] = [
    {
      key: "bio_text",
      value: `Stockholm Music Group är en stilren och mångsidig covertrio från Stockholm som specialiserar sig på att tolka klassiker ur pop-, rock-, soul- och jazzrepertoaren. Med två distinkta sångröster – en kvinnlig och en manlig – samt ett dynamiskt samspel mellan piano och gitarr skapar trion stämningar som passar allt från intima ceremonier till större festliga sammanhang.

Gruppen har lång erfarenhet av att framträda vid bröllop, begravningar, dop och företagsevenemang, och är uppskattade för sin förmåga att anpassa musiken efter varje tillfälle. Oavsett om det handlar om tidlös elegans, modern energi eller personlig musik skräddarsydd för ett specifikt ögonblick levererar Stockholm Music Group alltid musik med hög kvalitet, känsla och professionalism.

Med sin kombination av musikalisk värme, bred repertoar och lyhördhet inför publikens önskemål har Stockholm Music Group etablerat sig som ett givet val för evenemang där musiken får spela en viktig roll.`,
    },
    { key: "wedding_blocks", value: JSON.stringify(weddingBlocks) },
    { key: "footer_copyright", value: "© Stockholm Music Group 2026. All rights reserved." },
    /* footer_madeby_text och footer_madeby_url finns inte – styrs enbart i koden (Footer.tsx) */
    { key: "media_section_title", value: "Media" },
  ];

  for (const entry of contentEntries) {
    await prisma.content.upsert({
      where: { key: entry.key },
      update: { value: entry.value },
      create: entry,
    });
  }

  const videos = [
    { composer: "Fred Åkerström", title: "Jag ger dig min morgon", youtubeId: "ntgveY_yZAA", sortOrder: 0 },
    { composer: "Nat King Cole", title: "L-O-V-E", youtubeId: "tmXfLsj8Is0", sortOrder: 1 },
    { composer: "Leonard Cohen", title: "Hallelujah", youtubeId: "gWM82gyJuqM", sortOrder: 2 },
    { composer: "Elvis Presley", title: "Can't help falling in Love", youtubeId: "LHYlxyZUU4I", sortOrder: 3 },
  ];

  await prisma.mediaVideo.deleteMany({});
  for (const v of videos) {
    await prisma.mediaVideo.create({ data: v });
  }

  console.log("Seed done. Admin login: admin@stockholmmusicgroup.com /", DEFAULT_ADMIN_PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
