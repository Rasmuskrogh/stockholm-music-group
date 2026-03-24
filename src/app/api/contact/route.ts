import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Rate limit: max antal förfrågningar per IP inom tidsfönstret
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 min
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map<string, number[]>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const withinWindow = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (withinWindow.length >= RATE_LIMIT_MAX) return true;
  rateLimitMap.set(ip, [...withinWindow, now]);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, tel, date, place, music, terms, agree, info, website } = body;

    // Honeypot – om fyllt i är det troligen en bot, avvisa tyst (returnera 200)
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ message: "E-post skickat!" }, { status: 200 });
    }

    // Rate limit
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json({ message: "För många försök. Försök igen om en stund." }, { status: 429 });
    }

    // Obligatoriska fält
    if (!name || !email || !date || !place /* || !terms || !agree */) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const nameTrimmed = String(name).trim();
    const placeTrimmed = String(place).trim();

    // Minimilängd
    if (nameTrimmed.length < 2) {
      return NextResponse.json({ message: "Namn måste vara minst 2 tecken" }, { status: 400 });
    }
    if (placeTrimmed.length < 2) {
      return NextResponse.json({ message: "Plats måste vara minst 2 tecken" }, { status: 400 });
    }

    // Enkel regex: namn ska innehålla minst en bokstav (svenska + vanliga tecken)
    if (!/[\p{L}]/u.test(nameTrimmed)) {
      return NextResponse.json({ message: "Ogiltigt namn" }, { status: 400 });
    }

    // E-postformat
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    // Skapa transporter för nodemailer (explicit host/port så det fungerar på Netlify)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    // E-post till dig (formulärmeddelandet)
    const notificationEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `Nytt tävlingsanmälan från ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
            Nytt tävlingsanmälan / kontaktformulär
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #333;">Namn:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">E-post:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Telefon:</strong> ${tel || "Inte angivet"}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Datum för bröllopet:</strong> ${date}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Plats (stad/region):</strong> ${place}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Önskad låt eller musikstil:</strong> ${music || "Inte angivet"}</p>
          </div>
          
          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Samtycken:</h3>
            <p style="margin: 6px 0;"><strong>Tävlingsvillkor godkända:</strong> ${terms ? "Ja" : "Nej"}</p>
            <p style="margin: 6px 0;"><strong>Personuppgifter för tävlingen:</strong> ${agree ? "Ja" : "Nej"}</p>
            <p style="margin: 6px 0;"><strong>Kontakt om spelningar/erbjudanden:</strong> ${info ? "Ja" : "Nej"}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Detta meddelande skickades från kontaktformuläret på webbplatsen.
          </p>
        </div>
      `,
    };

    // Bekräftelse till användaren (valfritt)
    const confirmationEmail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Tack för din anmälan – Stockholm Music Group",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hej ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Tack för din anmälan. Vi har mottagit dina uppgifter och återkommer så snart som möjligt.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Dina uppgifter:</h3>
            <p style="margin: 6px 0;"><strong>Datum för bröllopet:</strong> ${date}</p>
            <p style="margin: 6px 0;"><strong>Plats:</strong> ${place}</p>
            ${music ? `<p style="margin: 6px 0;"><strong>Önskad låt/musikstil:</strong> ${music}</p>` : ""}
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Med vänliga hälsningar,<br>
            <strong>${process.env.SITE_NAME || "Stockholm Music Group"}</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">
            Detta är en automatisk bekräftelse. Svara inte på detta meddelande.
          </p>
        </div>
      `,
    };

    // Skicka e-postmeddelanden
    await transporter.sendMail(notificationEmail);

    // Skicka bekräftelse endast om RECIPIENT_EMAIL är annorlunda än avsändaren
    if (process.env.RECIPIENT_EMAIL !== email) {
      await transporter.sendMail(confirmationEmail);
    }

    return NextResponse.json({ message: "E-post skickat!" }, { status: 200 });
  } catch (error) {
    console.error("E-post fel:", error);
    return NextResponse.json({ message: "Fel vid skickande av e-post" }, { status: 500 });
  }
}

// Hantera andra HTTP-metoder
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
