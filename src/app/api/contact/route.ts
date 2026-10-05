import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { client } from "@/sanity/lib/client";
import { bookingFormQuery } from "@/lib/queries";
import {
  DEFAULT_FORM_FIELDS,
  isRequired,
  plainLabel,
  type BookingFormConfig,
  type BookingFormField,
} from "@/lib/bookingForm";

// Rate limit: max antal förfrågningar per IP inom tidsfönstret
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 min
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map<string, number[]>();

const MAX_LENGTH = { short: 500, long: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

// Everything a visitor typed ends up in an HTML email.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * The form's fields as configured in the Studio — fetched here rather
 * than trusted from the request, so a submission is checked against the
 * real form (required fields, types, lengths). Uncached, so a just-
 * published change to the form applies to the very next submission.
 */
async function getFormFields(): Promise<BookingFormField[]> {
  const form = await client
    .withConfig({ useCdn: false })
    .fetch<Pick<BookingFormConfig, "fields"> | null>(bookingFormQuery)
    .catch(() => null);
  return form?.fields?.length ? form.fields : DEFAULT_FORM_FIELDS;
}

type Answer = { field: BookingFormField; value: string | boolean };

/** Returns the cleaned answers, or a message for the visitor if something's wrong. */
function validate(fields: BookingFormField[], raw: Record<string, unknown>): { answers: Answer[] } | { error: string } {
  const answers: Answer[] = [];

  for (const field of fields) {
    if (field._type === "formCheckbox") {
      const checked = raw[field._key] === true;
      if (isRequired(field) && !checked) return { error: `Kryssa i: ${plainLabel(field)}` };
      answers.push({ field, value: checked });
      continue;
    }

    const value = typeof raw[field._key] === "string" ? (raw[field._key] as string).trim() : "";
    const max = field.kind === "textarea" ? MAX_LENGTH.long : MAX_LENGTH.short;

    if (isRequired(field) && !value) return { error: `Fyll i: ${plainLabel(field)}` };
    if (value.length > max) return { error: `${plainLabel(field)} är för långt` };
    if (value && field.kind === "email" && !EMAIL_RE.test(value)) return { error: "Ogiltig e-postadress" };
    if (value && field.kind === "name" && (value.length < 2 || !/[\p{L}]/u.test(value))) {
      return { error: "Ogiltigt namn" };
    }
    answers.push({ field, value });
  }

  return { answers };
}

const row = (label: string, value: string) =>
  `<p style="margin: 10px 0;"><strong style="color: #333;">${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { values, website } = body ?? {};

    // Honeypot – om fyllt i är det troligen en bot, avvisa tyst (returnera 200)
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ message: "E-post skickat!" }, { status: 200 });
    }

    // Rate limit
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json({ message: "För många försök. Försök igen om en stund." }, { status: 429 });
    }

    if (!values || typeof values !== "object") {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const result = validate(await getFormFields(), values as Record<string, unknown>);
    if ("error" in result) {
      return NextResponse.json({ message: result.error }, { status: 400 });
    }
    const { answers } = result;

    const textOf = (kind: string) =>
      answers.find((a) => a.field._type === "formInput" && a.field.kind === kind && a.value)?.value as
        | string
        | undefined;
    const name = textOf("name");
    const email = textOf("email");

    const inputs = answers.filter((a) => a.field._type === "formInput");
    const checkboxes = answers.filter((a) => a.field._type === "formCheckbox");

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

    // E-post till SMG – alla fält i formulärets ordning, med texterna från Studion.
    const notificationEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      ...(email ? { replyTo: email } : {}),
      subject: `Ny bokningsförfrågan${name ? ` från ${name}` : ""}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
            Ny bokningsförfrågan
          </h2>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${inputs.map((a) => row(plainLabel(a.field), (a.value as string) || "Inte angivet")).join("")}
          </div>

          ${
            checkboxes.length
              ? `<div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #333; margin-top: 0;">Kryssrutor:</h3>
                  ${checkboxes.map((a) => row(plainLabel(a.field), a.value ? "Ja" : "Nej")).join("")}
                </div>`
              : ""
          }

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Detta meddelande skickades från bokningsformuläret på webbplatsen.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(notificationEmail);

    // Bekräftelse till besökaren – deras svar utom namn och e-post.
    if (email && process.env.RECIPIENT_EMAIL !== email) {
      const details = inputs.filter(
        (a) => a.value && a.field._type === "formInput" && a.field.kind !== "name" && a.field.kind !== "email",
      );
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Tack för din förfrågan – Stockholm Music Group",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Hej${name ? ` ${escapeHtml(name)}` : ""}!</h2>

            <p style="color: #666; line-height: 1.6;">
              Tack för din förfrågan. Vi har mottagit dina uppgifter och återkommer så snart som möjligt.
            </p>

            ${
              details.length
                ? `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #333; margin-top: 0;">Dina uppgifter:</h3>
                    ${details.map((a) => row(plainLabel(a.field), a.value as string)).join("")}
                  </div>`
                : ""
            }

            <p style="color: #666; line-height: 1.6;">
              Med vänliga hälsningar,<br>
              <strong>${escapeHtml(process.env.SITE_NAME || "Stockholm Music Group")}</strong>
            </p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">
              Detta är en automatisk bekräftelse. Svara inte på detta meddelande.
            </p>
          </div>
        `,
      });
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
