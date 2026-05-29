import type { Metadata } from "next";
import { Lato } from "next/font/google";
import Script from "next/script";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-P9WDL6RW5V";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/math-applied", label: "Math, Applied" },
  { href: "/learning-through-food", label: "Learning Through Food" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} min-h-screen bg-[color:var(--background)] antialiased`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        <header className="sticky top-0 z-50 border-b border-white/15 bg-black">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
            <p className="text-base font-bold tracking-[0.08em] text-white">Sandhya Indurkar</p>
            <nav className="flex flex-wrap gap-1 text-[15px]">
              {navLinks.map((link) => (
                <a
                  className="rounded px-2.5 py-1.5 text-gray-300 transition hover:text-white"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {children}

        <footer className="mt-16 border-t border-white/15 bg-black">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-gray-300">© 2026 Sandhya Indurkar</p>
              <a
                aria-label="LinkedIn profile"
                className="inline-flex items-center gap-2 rounded border border-white/25 px-3.5 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-black"
                href="https://www.linkedin.com/in/sandhya-indurkar/"
                rel="noreferrer"
                target="_blank"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM.5 8h4V24h-4V8zM8 8h3.8v2.2h.1c.5-.95 1.72-2.2 3.55-2.2C20.03 8 24 10.44 24 16.22V24h-4v-6.9c0-1.64-.03-3.75-2.29-3.75-2.29 0-2.64 1.79-2.64 3.64V24h-4V8z" />
                </svg>
                LinkedIn
              </a>
            </div>
            <a
              className="inline-flex items-center gap-3 text-sm text-gray-300 transition hover:text-white"
              href="/math-applied#ganita"
            >
              <span className="h-8 w-8 shrink-0 overflow-hidden rounded-md border border-white/20 bg-[#f5f1eb]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  aria-hidden="true"
                  className="h-12 w-8 object-cover object-top"
                  src="/ganita_logo.png"
                />
              </span>
              <span>
                <span className="font-bold text-white">Math, Applied</span> is part of{" "}
                <span className="font-bold text-white">Ganita</span>
              </span>
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
