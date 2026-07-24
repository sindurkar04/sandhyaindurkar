import PoissonDistributionExplorer from "@/components/PoissonDistributionExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "The Poisson Distribution: Rare Events Over a Fixed Window",
  description:
    "P(X=k) = λ^k e^-λ / k!: the count of independent events in a fixed interval when you only know the average rate λ. Mean and variance both equal λ.",
  path: "/math-applied/poisson-distribution-pure-definition",
  image: "/poisson_distribution.svg",
});

export default function PoissonDistributionPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          The Poisson Distribution: Rare Events Over a Fixed Window
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Bar chart of the Poisson probability mass function"
              className="h-auto w-full object-contain"
              height={500}
              src="/poisson_distribution.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Support tickets per hour, checkout errors per day, cars through an intersection per
            minute. You do not have a fixed number of trials — just an average rate. The Poisson
            distribution gives the probability of seeing exactly k events in one window when events
            arrive independently at that steady rate λ.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Poisson answers: given an average of λ events per window, how likely is each exact count?
          </p>

          <PoissonDistributionExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="P(X = k) = (λ^k · e^(-λ)) / k!" label="Probability mass function">
            <p>
              λ is the mean count per window. Larger λ shifts the peak right and widens the spread.
              The e^(-λ) term is the probability of zero events; each extra event multiplies by λ/k.
            </p>
          </MathBlock>
          <MathBlock formula="E[X] = λ,   Var(X) = λ" label="Mean equals variance">
            <p>
              A signature property: the mean and variance are identical. If your real-world counts are
              far more spread out than their average, the data is over-dispersed and Poisson is the
              wrong model.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Poisson is the limit of the{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/binomial-distribution-pure-definition">
              binomial
            </a>{" "}
            when trials are many and each success is rare (n → ∞, p → 0, np = λ). It powers capacity
            planning, alert-rate baselines, and staffing: if tickets average 3 per hour, Poisson tells
            you how often you will see 7+ and need overflow coverage. As λ grows it approaches the{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/normal-distribution-gaussian-pure-definition">
              normal distribution
            </a>
            .
          </p>
        </div>

        <RelatedPosts slug="poisson-distribution-pure-definition" />
      </article>
    </main>
  );
}
