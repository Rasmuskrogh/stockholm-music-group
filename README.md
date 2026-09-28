# Stockholm Music Group

A marketing website for **Stockholm Music Group**, a professional cover trio focused on weddings and events. The public site presents the band, media, gallery, and a booking/contact flow. All content is edited in an embedded **Sanity Studio** at `/studio`.

## Tech stack

- **Next.js** 16 (App Router) · **React** 19 · **TypeScript**
- **Sanity** (content, images, hero video) — Studio embedded at `/studio`
- **Nodemailer** (Gmail SMTP) for contact form notifications

## Features

### Public site

- Hero section (background video, titles, CTA)
- Intro text blocks (text, lists, steps, CTA buttons)
- Contact form with validation, honeypot, and rate limiting
- Media section (YouTube embeds + social links)
- Bio and gallery
- Footer with phone/email links and (on wide viewports) copy-to-clipboard actions

### Studio (`/studio`)

Log in with a Sanity account that's a member of the project (invite editors at [sanity.io/manage](https://www.sanity.io/manage/project/ptf3rcbu)). Two documents:

- **Startsida** — hero, text blocks, media/videos, bio, gallery (drag to sort, crop/hotspot per image)
- **Inställningar** — footer email/phone, social links, copyright text

Published changes appear on the live site within a minute (`revalidate = 60`). The old `/admin` URLs redirect to `/studio`.

## Environment variables

Create a `.env.local` in the project root (never commit secrets):

| Variable | Purpose |
|----------|---------|
| `EMAIL_USER` | SMTP username (Gmail address) used to send contact form mail |
| `EMAIL_PASS` | SMTP password or app-specific password |
| `RECIPIENT_EMAIL` | Inbox that receives contact form messages |
| `SITE_NAME` | Optional; used in contact email templates (defaults to “Stockholm Music Group”) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Optional; defaults to `ptf3rcbu` |
| `NEXT_PUBLIC_SANITY_DATASET` | Optional; defaults to `production` |

Contact email sending is configured for **Gmail SMTP** (`smtp.gmail.com`, port 587) in code; adjust `src/app/api/contact/route.ts` if you use another provider.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server (webpack) |
| `npm run build` | Production build |
| `npm run start` | Run the production server |
| `npm run lint` | ESLint |

## Project layout (overview)

- `src/app/(site)` — the one-page site (fetches all content with one GROQ query)
- `src/app/studio` — embedded Sanity Studio
- `src/app/api/contact` — contact form mail
- `src/components` — section components (Hero, Wedding, Contact, Media, Gallery, Footer, …) and shared UI
- `src/sanity` — schema, Studio structure, client, image URL builder
- `src/lib` — GROQ queries, helpers
- `migration/` — one-off scripts used to move content from the old Postgres/Cloudinary setup into Sanity (kept for reference)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Studio: [http://localhost:3000/studio](http://localhost:3000/studio).

---

Built with [Next.js](https://nextjs.org) and [Sanity](https://www.sanity.io).
