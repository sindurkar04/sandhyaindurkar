import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const WWW_HOST = "www.sandhyaindurkar.com";
const APEX_HOST = "sandhyaindurkar.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  if (host === WWW_HOST) {
    const url = request.nextUrl.clone();
    url.hostname = APEX_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
