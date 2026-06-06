import MathBlock from "@/components/MathBlock";
import ExpectedValuePureExplorer from "@/components/ExpectedValuePureExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("expected-value-pure-definition");

export default function ExpectedValuePurePostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Expected Value: The Pure Definition
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Expected value as weighted outcomes"
              className="h-auto w-full object-contain"
              height={500}
              priority
              src="/expected_value_pure.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Expected value is not optimism. It is a weighted average of outcomes, where each outcome
            is multiplied by its probability. One big win and many small losses can still average
            to a negative number. The lottery is the classic example: a huge jackpot with tiny
            probability often loses money on average once ticket cost is included.
          </p>
          <p>
            EV answers a long-run question: if you repeated the same bet many times, what would you
            earn or lose per trial on average? It does not promise any single trial will land near
            that number. It compares options on one scale before you commit.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            EV = sum of (probability x value). Probabilities across all outcomes must sum to 1.
          </p>

          <ExpectedValuePureExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Step by step</h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">1. List outcomes.</span>{" "}
            Every mutually exclusive case that can happen: win big, win small, lose, break even.
            Do not leave gaps.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">2. Assign probabilities.</span>{" "}
            Each outcome gets a weight between 0 and 1. All weights together must sum to 100%.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">3. Assign values.</span>{" "}
            Use the same unit for every outcome: dollars, points, hours saved. Losses are negative.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">4. Multiply and add.</span>{" "}
            Each row contributes p x value. Expected value is the sum of those contributions.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="EV = p₁x₁ + p₂x₂ + ... + pₙxₙ" label="Definition">
            <p>Probabilities should sum to 1 across the full outcome set.</p>
          </MathBlock>
          <MathBlock formula="Contribution_i = p_i × x_i" label="Per-outcome weight">
            <p>
              Each outcome pulls EV toward its value in proportion to how likely it is. Rare huge
              wins contribute little unless probability is high enough.
            </p>
          </MathBlock>
          <MathBlock formula="EV = 0 means break-even on average" label="Fair bet">
            <p>
              A fair coin win/lose game with equal payoffs has EV = 0. Individual trials still swing;
              the long-run average sits at zero.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Common mistakes
          </h2>
          <p>
            Using the best-case outcome instead of the full list. Forgetting to include losses or
            costs. Probabilities that do not sum to 100%. Treating a positive EV as a guarantee for
            one try. EV ranks bets; it does not remove variance or downside risk.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application
          </h2>
          <p>
            Once EV is clear, campaign bets, inventory policies, and pipeline choices become
            comparable on one scale instead of best-case storytelling. The applied posts on
            expected value, probability, and stockout risk layer business costs and constraints on
            top of this definition.
          </p>
        </div>

        <RelatedPosts slug="expected-value-pure-definition" />
      </article>
    </main>
  );
}
