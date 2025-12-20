import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, tel, message } = await request.json();

    // Validering
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validera e-postformat
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Skapa transporter för nodemailer
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // E-post till dig (formulärmeddelandet)
    const notificationEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `Nytt meddelande från ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">
            Nytt kontaktformulärmeddelande
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #333;">Namn:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">E-post:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Telefon:</strong> ${
              tel || "Inte angivet"
            }</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Meddelande:</h3>
            <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #333; border-radius: 4px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Detta meddelande skickades från ditt kontaktformulär.
          </p>
        </div>
      `,
    };

    // Bekräftelse till användaren (valfritt)
    const confirmationEmail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Tack för ditt meddelande",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hej ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Tack för ditt meddelande. Jag har mottagit ditt meddelande och kommer att svara så snart som möjligt.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Ditt meddelande:</h3>
            <p style="color: #666; font-style: italic;">
              "${message}"
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Med vänliga hälsningar,<br>
            <strong>${process.env.SITE_NAME || "Din webbplats"}</strong>
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
    return NextResponse.json(
      { message: "Fel vid skickande av e-post" },
      { status: 500 }
    );
  }
}

// Hantera andra HTTP-metoder
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
