import { Resend } from "resend";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function getContactToEmail(): string {
  return process.env.CONTACT_TO_EMAIL?.trim() || "sandhya.indurkar@gmail.com";
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";
}

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export function sanitizeText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}
