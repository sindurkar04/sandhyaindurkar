import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Sandhya Indurkar",
  description:
    "Math, Applied and Learning Through Food - stories on practical thinking and learning.",
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
        <header className="border-b border-[color:var(--border-strong)] bg-black text-white">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-10 lg:px-14">
            <p className="text-sm font-bold tracking-[0.08em]">Sandhya Indurkar</p>
            <nav className="flex flex-wrap gap-1 text-sm">
              {navLinks.map((link) => (
                <a
                  className="rounded-full px-3 py-1.5 transition hover:bg-white/15"
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

        <footer className="mt-16 border-t border-[color:var(--border-strong)] bg-black text-white">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-sm sm:px-10 lg:px-14">
            <p>© 2024 Sandhya Indurkar</p>
            <a
              aria-label="LinkedIn profile"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1.5 text-xs font-bold transition hover:bg-white/15"
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
        </footer>
      </body>
    </html>
  );
}
