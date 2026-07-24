import CentralLimitTheoremExplorer from "@/components/CentralLimitTheoremExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "The Central Limit Theorem: Why Averages Go Normal",
  description:
    "Average enough independent draws from almost any distribution and the sample mean is approximately normal, centered at μ with spread σ/√n.",
  path: "/math-applied/central-limit-theorem-pure-definition",
  image: "/central_limit_theorem.svg",
});

export default function CentralLimitTheoremPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          The Central Limit Theorem: Why Averages Go Normal
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="A skewed population and the bell-shaped distribution of its sample means"
              className="h-auto w-full object-contain"
              height={500}
              src="/central_limit_theorem.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Individual data is messy: revenue is skewed by whales, latency has a long tail, sessions
            cluster. But when you take the <em>average</em> of a batch and repeat, those averages
            pile up into a smooth bell curve — even though the raw data was nothing of the sort. That
            is the central limit theorem, and it is why so much of statistics can lean on the normal
            distribution.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            The CLT answers: why does the distribution of a sample mean look normal, no matter the
            shape of the underlying population?
          </p>

          <CentralLimitTheoremExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="X̄ₙ ≈ Normal(μ, σ² / n)   as n grows" label="Distribution of the mean">
            <p>
              Draw n independent values with mean μ and variance σ². The sample mean X̄ is
              approximately normal, centered at the true μ, regardless of the population&apos;s shape.
            </p>
          </MathBlock>
          <MathBlock formula="SE = σ / √n" label="Standard error">
            <p>
              The spread of the sample mean shrinks with the square root of n. To halve your
              uncertainty you need four times the data — the reason precise estimates get expensive.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            The CLT is the engine under{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/confidence-intervals-real-decisions">
              confidence intervals
            </a>{" "}
            and{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/ab-test-readouts-real-decisions">
              A/B test readouts
            </a>
            : it lets you put a normal-shaped range around a conversion rate or an average order value.
            It also explains why a bigger{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/sample-size-real-decisions">
              sample size
            </a>{" "}
            tightens the read, and why the{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/normal-distribution-gaussian-pure-definition">
              normal distribution
            </a>{" "}
            shows up everywhere.
          </p>
        </div>

        <RelatedPosts slug="central-limit-theorem-pure-definition" />
      </article>
    </main>
  );
}
