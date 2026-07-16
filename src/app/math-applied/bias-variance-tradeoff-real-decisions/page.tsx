import BiasVarianceTradeoffExplorer from "@/components/BiasVarianceTradeoffExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Bias vs Variance: Underfit, Overfit, and the U-Shaped Error Curve",
  description:
    "Decompose expected error into bias squared, variance, and noise. See why train error falls while test error curves up.",
  path: "/math-applied/bias-variance-tradeoff-real-decisions",
  image: "/bias_variance_tradeoff.svg",
});

export default function BiasVarianceTradeoffPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Experiments and uncertainty
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Bias vs Variance: Underfit, Overfit, and the U-Shaped Error Curve
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Bias squared, variance, and total error vs model complexity"
              className="h-auto w-full object-contain"
              height={500}
              src="/bias_variance_tradeoff.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Every model sits on a dial from too simple to too flexible. A straight line on messy
            weekly orders underfits: high bias, missed patterns. A wiggly curve through every spike
            overfits: low bias on training weeks, high variance on new ones. Expected error is the
            sum of both plus irreducible noise.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Bias vs variance answers: Is the model too dumb, too memorized, or near the sweet spot?
          </p>

          <BiasVarianceTradeoffExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="E[(y - f(x))²] ≈ bias² + variance + noise"
            label="Expected error decomposition"
          >
            <p>
              Bias² is systematic miss from an overly rigid model. Variance is swing from fitting
              random quirks. Noise is what no model removes. Total error is U-shaped in complexity.
            </p>
          </MathBlock>
          <MathBlock formula="underfit: high bias², low variance" label="Too simple">
            <p>
              Train and test error stay high together. Adding features or capacity usually helps until
              you pass the sweet spot.
            </p>
          </MathBlock>
          <MathBlock formula="overfit: low bias², high variance" label="Too flexible">
            <p>
              Train error keeps falling while test error rises. The gap is the overfitting signal you
              see in holdout weeks.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            A demand forecast with complexity 9 scores 4% on training weeks and 22% on holdout weeks.
            Complexity 4 lands at 9% holdout with only slightly higher train error. That is the bias
            variance tradeoff in one meeting slide. For train vs holdout mechanics and shipping
            decisions, see{" "}
            <a
              className="font-bold text-[color:var(--foreground)] underline"
              href="/math-applied/overfitting-real-decisions"
            >
              overfitting in real decisions
            </a>
            .
          </p>
        </div>

        <RelatedPosts slug="bias-variance-tradeoff-real-decisions" />
      </article>
    </main>
  );
}
