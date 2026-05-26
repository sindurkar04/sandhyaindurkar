import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.SPOONACULAR_API_KEY?.trim();

  return NextResponse.json({
    configured: Boolean(apiKey),
    vercelEnv: process.env.VERCEL_ENV ?? "unknown",
  });
}
