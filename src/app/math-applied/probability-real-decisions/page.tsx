import MathBlock from "@/components/MathBlock";
import ProbabilityExplorer from "@/components/ProbabilityExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";

export default function ProbabilityPostPage() {
  return (
    <main className="mx-auto w-full max-w-[768px] space-y-7 px-3 py-10 sm:px-4">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Probability in Real Decisions: Count Wins, Not Stories
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Probability estimate from trials"
              className="h-auto w-full object-contain"
              height={500}
              src="/probability.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Probability is how often something happens out of all the chances you gave it. In
            business data, that usually means successes divided by trials: email opens, deals
            closed, users who adopted a feature.
          </p>
          <p>
            The number is simple. The hard part is knowing when to trust it. Seventeen wins out of
            forty trials is 42.5%, but that estimate wobbles more than seventeen wins out of four
            hundred.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Probability answers: If we ran this again under similar conditions, how often should we
            expect the outcome?
          </p>

          <ProbabilityExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="P(event) = successes ÷ trials" label="Estimate from data">
            <p>
              17 subject-line tests hit goal out of 40 tries gives P(win) ≈ 0.425. That is your
              best read from past data, not a promise about the next send.
            </p>
          </MathBlock>
          <MathBlock
            formula="SE ≈ √(p(1 − p) ÷ n)"
            label="How much the estimate wobbles"
          >
            <p>
              Small n or p near 50% means a wider band around your estimate. That is why
              probability posts pair naturally with sample size and confidence intervals.
            </p>
          </MathBlock>
          <MathBlock
            formula="P(A and B) = P(A) × P(B) when A and B are independent"
            label="Chained events"
          >
            <p>
              If two steps each have a 50% chance and do not affect each other, both happening is
              25%, not 50%. Product funnels and multi-step sales processes use this constantly.
            </p>
          </MathBlock>
          <p>
            Probabilities live between 0 and 1. They should describe the population you care about,
            not only the people who replied to a survey. A rate from twelve beta users is a start,
            not a final forecast.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application: win rates</h2>
          <p>
            Growth teams estimate test win rates before they rank ideas. Sales ops track close rates
            by segment. Product teams read adoption from rollouts. The habit is writing down
            successes and trials, then stating the rate with sample size in the same breath.
          </p>
          <p>
            When the estimate is shaky, gather more trials or widen your planning range. When it is
            stable, you can feed it into expected value, forecasting, or experiment design with more
            confidence.
          </p>
        </div>

        <RelatedPosts slug="probability-real-decisions" />
      </article>
    </main>
  );
}
