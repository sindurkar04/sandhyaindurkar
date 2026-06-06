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

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
};

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = sanitizeText(body.name ?? "", 120);
  const email = sanitizeText(body.email ?? "", 254);
  const message = sanitizeText(body.message ?? "", 4000);

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (message.length < 10) {
    return NextResponse.json({ error: "Please write a message (at least 10 characters)." }, { status: 400 });
  }

  const resend = getResendClient();
  if (!resend) {
    return NextResponse.json(
      { error: "Email is not configured yet. Please try again later or email sandhya.indurkar@gmail.com directly." },
      { status: 503 },
    );
  }

  const to = getContactToEmail();
  const from = getFromEmail();
  const subject = name ? `Site contact from ${name}` : "Site contact form message";
  const text = [
    "New message from sandhyaindurkar.com",
    "",
    name ? `Name: ${name}` : "Name: (not provided)",
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject,
    text,
  });

  if (error) {
    console.error("Contact email failed:", error);
    return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
