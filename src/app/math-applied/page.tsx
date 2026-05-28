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

        <article className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] transition hover:shadow-sm">
          <img
            alt="Mean vs median comparison visual"
            className="h-52 w-full object-cover"
            src="/mean_median.png"
          />
          <div className="space-y-3 p-5">
            <h2 className="text-2xl font-bold tracking-tight text-[color:var(--foreground)]">
              The Average Isn&apos;t the Answer -- What Mean and Median Actually Tell You in Real Data
            </h2>
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              Why one summary number is not enough: how mean and median answer different questions in metrics, product decisions, and everyday data.
            </p>
            <a className="text-sm font-bold text-[color:var(--foreground)] underline" href="/math-applied/mean-vs-median-real-data">
              Read post
            </a>
          </div>
        </article>

        <article className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] transition hover:shadow-sm">
          <img
            alt="Percent change recovery visual"
            className="h-52 w-full object-cover"
            src="/percent_change.png"
          />
          <div className="space-y-3 p-5">
            <h2 className="text-2xl font-bold tracking-tight text-[color:var(--foreground)]">
              Percent Change Isn&apos;t Intuitive -- How Growth Math Distorts Real Decisions
            </h2>
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              Why equal-looking percentage moves do not cancel out, and how to set recovery targets
              that match reality.
            </p>
            <a
              className="text-sm font-bold text-[color:var(--foreground)] underline"
              href="/math-applied/percent-change-real-decisions"
            >
              Read post
            </a>
          </div>
        </article>

        <article className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] transition hover:shadow-sm">
          <img
            alt="Variance and spread comparison visual"
            className="h-52 w-full object-cover"
            src="/variance_spread.png"
          />
          <div className="space-y-3 p-5">
            <h2 className="text-2xl font-bold tracking-tight text-[color:var(--foreground)]">
              Variance and Spread -- Why the Same Average Can Hide a Very Different Story
            </h2>
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              Same mean, different volatility: how standard deviation and range reveal consistency
              that averages alone cannot.
            </p>
            <a
              className="text-sm font-bold text-[color:var(--foreground)] underline"
              href="/math-applied/variance-spread-real-data"
            >
              Read post
            </a>
          </div>
        </article>

        <article className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] transition hover:shadow-sm">
          <img
            alt="Correlation versus causation scatter visual"
            className="h-52 w-full object-cover"
            src="/correlation_causation.svg"
          />
          <div className="space-y-3 p-5">
            <h2 className="text-2xl font-bold tracking-tight text-[color:var(--foreground)]">
              Correlation Isn&apos;t Causation -- How Linked Data Misleads Real Decisions
            </h2>
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              Why strong r values still fail as proof: confounders, direction, and what you need
              before acting on a pattern.
            </p>
            <a
              className="text-sm font-bold text-[color:var(--foreground)] underline"
              href="/math-applied/correlation-vs-causation-real-decisions"
            >
              Read post
            </a>
          </div>
        </article>

        <article className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] transition hover:shadow-sm">
          <img
            alt="Percentiles and quartiles visual"
            className="h-52 w-full object-cover"
            src="/percentiles_quartiles.svg"
          />
          <div className="space-y-3 p-5">
            <h2 className="text-2xl font-bold tracking-tight text-[color:var(--foreground)]">
              The Average User Isn&apos;t Average -- What Percentiles and Quartiles Tell You in Real Data
            </h2>
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              Why P90 and quartiles describe tails and typical experience better than the mean
              alone for SLAs, latency, and everyday metrics.
            </p>
            <a
              className="text-sm font-bold text-[color:var(--foreground)] underline"
              href="/math-applied/percentiles-quartiles-real-data"
            >
              Read post
            </a>
          </div>
        </article>

        <article className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] transition hover:shadow-sm">
          <img
            alt="Sample size stability visual"
            className="h-52 w-full object-cover"
            src="/sample_size.svg"
          />
          <div className="space-y-3 p-5">
            <h2 className="text-2xl font-bold tracking-tight text-[color:var(--foreground)]">
              Twelve Data Points Isn&apos;t a Trend -- What Sample Size Changes in Real Decisions
            </h2>
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              Why small samples inflate experiment wins and shaky averages, and how mean,
              spread, and percentiles shift as n grows.
            </p>
            <a
              className="text-sm font-bold text-[color:var(--foreground)] underline"
              href="/math-applied/sample-size-real-decisions"
            >
              Read post
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
