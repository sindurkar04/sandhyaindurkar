export default function MathAppliedPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-4xl font-black tracking-tight text-[color:var(--foreground)] sm:text-5xl">
          Exploring how math and data shape real-world decisions.
        </h1>
        <p className="text-base leading-relaxed text-[color:var(--muted)]">
          Breaking down complex systems into ideas we can actually use.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] transition hover:shadow-sm">
          <img
            alt="Prime factorization flow visual"
            className="h-52 w-full object-cover"
            src="/prime_factorization.png"
          />
          <div className="space-y-3 p-5">
            <h2 className="text-2xl font-bold tracking-tight text-[color:var(--foreground)]">
              Prime Factorization Isn&apos;t Just Math -- It&apos;s How You Break Down Real Problems
            </h2>
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              Why structure matters: using factorization thinking to make cleaner decisions in batching, systems, and resource planning.
            </p>
            <a className="text-sm font-bold text-[color:var(--foreground)] underline" href="/math-applied/prime-factorization-real-problems">
              Read post
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
