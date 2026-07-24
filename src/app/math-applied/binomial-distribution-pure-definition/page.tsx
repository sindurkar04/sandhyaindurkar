import BinomialDistributionExplorer from "@/components/BinomialDistributionExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "The Binomial Distribution: Counting Successes in n Trials",
  description:
    "P(X=k) = C(n,k) p^k (1-p)^(n-k): the probability of k successes across n independent yes/no trials, with mean np and variance np(1-p).",
  path: "/math-applied/binomial-distribution-pure-definition",
  image: "/binomial_distribution.svg",
});

export default function BinomialDistributionPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          The Binomial Distribution: Counting Successes in n Trials
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Bar chart of the binomial probability mass function"
              className="h-auto w-full object-contain"
              height={500}
              src="/binomial_distribution.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Flip a biased coin ten times, run ten identical ad impressions, ship ten deploys. Each
            trial is an independent yes/no event with the same success chance p. The binomial
            distribution tells you the probability of getting exactly k successes across all n
            trials — not just the average, but the full shape of what could happen.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            The binomial answers: across n independent tries at rate p, how likely is each possible
            count of successes?
          </p>

          <BinomialDistributionExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="P(X = k) = C(n, k) · p^k · (1 - p)^(n - k)" label="Probability mass function">
            <p>
              C(n, k) counts the number of arrangements of k successes among n slots (see{" "}
              <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/combinations-pure-definition">
                combinations
              </a>
              ). p^k is the chance of those successes; (1 - p)^(n-k) covers the failures.
            </p>
          </MathBlock>
          <MathBlock formula="E[X] = n · p,   Var(X) = n · p · (1 - p)" label="Mean and variance">
            <p>
              The expected count scales linearly with n. Spread is largest at p = 0.5 and vanishes as
              p approaches 0 or 1, because near-certain trials have little to vary.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            If a checkout flow converts 8% of the time and you get 200 visitors, the binomial says how
            many purchases to expect and how noisy that count is — the foundation for reading a thin{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/sample-size-real-decisions">
              sample size
            </a>{" "}
            or a{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/probability-real-decisions">
              win rate
            </a>
            . Sum many binomial trials and the count starts to look like a{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/normal-distribution-gaussian-pure-definition">
              normal distribution
            </a>
            ; keep p tiny while n grows and it becomes{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/poisson-distribution-pure-definition">
              Poisson
            </a>
            .
          </p>
        </div>

        <RelatedPosts slug="binomial-distribution-pure-definition" />
      </article>
    </main>
  );
}
