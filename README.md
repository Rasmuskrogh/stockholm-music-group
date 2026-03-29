# Stockholm Music Group

A marketing website for **Stockholm Music Group**, a professional cover trio focused on weddings and events. The public site presents the band, media, gallery, and a booking/contact flow. A password-protected **admin area** lets you edit hero content, wedding copy, embedded videos, gallery images, and site text stored in PostgreSQL.

## Tech stack

- **Next.js** 16 (App Router) · **React** 19 · **TypeScript**
- **PostgreSQL** via **Prisma** (with the `pg` adapter)
- **NextAuth.js** (credentials login against the `User` table)
- **Nodemailer** (Gmail SMTP) for contact form notifications
- **Cloudinary** for gallery image hosting and delivery

## Features

### Public site

- Hero section (video / background, titles, CTA)
- Wedding-focused content blocks
- Contact form with validation, honeypot, and rate limiting
- Media section (YouTube embeds)
- Bio and gallery
- Footer with phone/email links and (on wide viewports) copy-to-clipboard actions

### Admin (`/admin`)

- Sign-in at `/admin/login`
- Protected routes for hero, wedding content, media, gallery, and editable key/value content (e.g. footer copyright)
- Gallery uploads go to Cloudinary; metadata and sort order live in the database

## Prerequisites

- **Node.js** (version compatible with Next.js 16 — see [Next.js requirements](https://nextjs.org/docs/app/getting-started/installation))
- A **PostgreSQL** database
- Optional: **Cloudinary** account for gallery features
- Optional: **Gmail** (or compatible SMTP) app password for outbound mail

## Environment variables

Create a `.env.local` in the project root (never commit secrets). Typical variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (required for Prisma and auth) |
| `NEXTAUTH_SECRET` | Secret for signing JWT sessions ([generate](https://generate-secret.vercel.app/32) a random string) |
| `NEXTAUTH_URL` | Canonical site URL in production (e.g. `https://your-domain.com`) |
| `EMAIL_USER` | SMTP username (e.g. Gmail address); also shown in `/api/contact-info` for the footer |
| `EMAIL_PASS` | SMTP password or app-specific password |
| `RECIPIENT_EMAIL` | Inbox that receives contact form messages; seed script uses this for the initial admin user |
| `PHONE_USER` | Phone number exposed via `/api/contact-info` (footer `tel:` link) |
| `SITE_NAME` | Optional; used in contact email templates (defaults to “Stockholm Music Group”) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLOUDINARY_FOLDER` | Optional; upload folder (defaults to `gallery`) |

Contact email sending is configured for **Gmail SMTP** (`smtp.gmail.com`, port 587) in code; adjust `src/app/api/contact/route.ts` if you use another provider.

## Database

Generate the client and apply migrations (or push schema in development):

```bash
npm run db:generate
npm run db:migrate
# or during early setup: npm run db:push
```

### Seed

The seed script expects `DATABASE_URL` and `RECIPIENT_EMAIL` in `.env.local`. It creates default hero/content records and an admin user tied to `RECIPIENT_EMAIL`. See `prisma/seed.ts` for the default password placeholder — **change the password after first login** in production.

```bash
npm run db:seed
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server (webpack) |
| `npm run build` | `prisma generate` then production build |
| `npm run start` | Run the production server |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Deploy migrations |
| `npm run db:push` | Push schema without migration files (dev-friendly) |
| `npm run db:seed` | Run `prisma/seed.ts` |

## Project layout (overview)

- `src/app` — App Router pages, layouts, and API routes (`/api/contact`, `/api/contact-info`, `/api/auth`, admin APIs, etc.)
- `src/components` — Section components (Hero, Wedding, Contact, Media, Gallery, Footer, …) and shared UI
- `src/lib` — Prisma client, NextAuth options
- `prisma` — Schema, migrations, seed

## Local development

```bash
npm install
# configure .env.local and DATABASE_URL
npm run db:migrate   # or db:push
npm run db:seed      # optional but useful for first run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Production notes

- Set `NEXTAUTH_URL` and `NEXTAUTH_SECRET` for your deployment host.
- Ensure `DATABASE_URL` points at your production database and run migrations (`npm run db:migrate`) as part of deploy.
- Gallery and admin uploads require valid Cloudinary env vars.
- Contact form and footer contact info require mail and phone env vars as documented above.

---

Built with [Next.js](https://nextjs.org).
