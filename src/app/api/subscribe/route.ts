import {
  getContactToEmail,
  getFromEmail,
  getResendClient,
  isValidEmail,
  sanitizeText,
} from "@/lib/email";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SubscribePayload = {
  email?: string;
  website?: string;
};

export async function POST(request: Request) {
  let body: SubscribePayload;

  try {
    body = (await request.json()) as SubscribePayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const email = sanitizeText(body.email ?? "", 254);

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const resend = getResendClient();
  if (!resend) {
    return NextResponse.json(
      { error: "Subscribe is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  const to = getContactToEmail();
  const from = getFromEmail();

  const notifyResult = await resend.emails.send({
    from,
    to,
    subject: "New article subscriber",
    text: [`New subscriber on sandhyaindurkar.com`, "", `Email: ${email}`].join("\n"),
  });

  if (notifyResult.error) {
    console.error("Subscribe notify failed:", notifyResult.error);
    return NextResponse.json({ error: "Could not complete subscription. Please try again." }, { status: 502 });
  }

  const welcomeResult = await resend.emails.send({
    from,
    to: email,
    subject: "You are subscribed to new articles",
    text: [
      "Thanks for subscribing.",
      "",
      "I will email you when new articles are published on sandhyaindurkar.com.",
      "",
      "Sandhya",
    ].join("\n"),
  });

  if (welcomeResult.error) {
    console.error("Subscribe welcome failed:", welcomeResult.error);
    // Notification reached Sandhya; still treat as success for the visitor.
  }

  return NextResponse.json({ ok: true });
}
