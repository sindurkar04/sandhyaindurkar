export default function MathAppliedPage() {
  return (
    <main className="w-full space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)]">
          Math, Applied
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[color:var(--muted)]">
          Exploring how math and data shape real-world decisions. Breaking down complex systems into ideas we can actually use.
        </p>
      </header>

      <section className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          First Post
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-[color:var(--foreground)]">
          Prime Factorization Isn&apos;t Just Math -- It&apos;s How You Break Down Real Problems
        </h2>
        <a
          className="mt-5 inline-flex rounded-full bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-[#222]"
          href="/math-applied/prime-factorization-real-problems"
        >
          Read post
        </a>
      </section>
    </main>
  );
}
