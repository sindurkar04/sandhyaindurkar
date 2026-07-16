import BayesTheoremExplorer from "@/components/BayesTheoremExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Bayes Theorem: Update Belief When New Evidence Arrives",
  description:
    "P(A|B) combines prior belief, likelihood, and marginal probability. See how a positive test updates disease risk.",
  path: "/math-applied/bayes-theorem-pure-definition",
  image: "/bayes_theorem.svg",
});

export default function BayesTheoremPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Bayes Theorem: Update Belief When New Evidence Arrives
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Prior, likelihood, and posterior in Bayes theorem"
              className="h-auto w-full object-contain"
              height={500}
              src="/bayes_theorem.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            You start with a prior: how common the event is before new data. A test or alert arrives.
            Bayes theorem tells you how to revise belief. The posterior is not the test accuracy alone.
            It blends how often the signal fires on true cases and false cases with the base rate.
          </p>
          <p>
            Screening is the textbook case. High sensitivity means most sick patients test positive. That
            is P(positive | disease). Clinicians and reviewers need P(disease | positive), which is the
            reverse question and requires Bayes.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Bayes answers: After seeing evidence B, what is the updated chance of A?
          </p>

          <BayesTheoremExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="P(A | B) = P(B | A) P(A) / P(B)" label="Bayes theorem">
            <p>
              Posterior equals likelihood times prior, divided by the overall rate of evidence B. All
              terms are probabilities between 0 and 1.
            </p>
          </MathBlock>
          <MathBlock
            formula="P(B) = P(B | A) P(A) + P(B | not A) P(not A)"
            label="Law of total probability"
          >
            <p>
              The denominator sums true positives and false positives across the population. This is the
              expanded form you use when only sensitivity and false-positive rate are known.
            </p>
          </MathBlock>
          <MathBlock formula="odds(A | B) = odds(A) x LR" label="Odds form (optional)">
            <p>
              Likelihood ratio LR = P(B|A) / P(B|not A) multiplies prior odds. Same update, different
              bookkeeping when you think in odds instead of probabilities.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            When a fraud model fires, report the posterior chance of fraud given that alert, not just
            recall on known fraud. Include base rate and false-positive rate in the readout so reviewers
            know how many alerts to expect per true hit.
          </p>
          <p>
            Build on conditional probability, base rates, and sensitivity-specificity. Bayes is the glue
            that turns those pieces into an updated belief.
          </p>
        </div>

        <RelatedPosts slug="bayes-theorem-pure-definition" />
      </article>
    </main>
  );
}
