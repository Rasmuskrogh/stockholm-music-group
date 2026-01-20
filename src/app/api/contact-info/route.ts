import { NextResponse } from "next/server";

export async function GET() {
  try {
    const email = process.env.EMAIL_USER;
    const phone = process.env.PHONE_USER;

    if (!email || !phone) {
      return NextResponse.json(
        { error: "Contact information not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        email,
        phone,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact information" },
      { status: 500 }
    );
  }
}
