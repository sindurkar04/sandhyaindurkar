import DataTable from "@/components/DataTable";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import ExpectedValueExplorer from "@/components/ExpectedValueExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import {
  DEFAULT_OPTION_A,
  DEFAULT_OPTION_B,
  buildComparisonRows,
} from "@/lib/expected-value-data";
import Image from "next/image";

import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("expected-value-real-decisions");


const columns = [
  { key: "option" as const, header: "Option", align: "left" as const },
  { key: "cost" as const, header: "Cost", align: "right" as const },
  { key: "successRate" as const, header: "Win chance", align: "right" as const },
  { key: "payout" as const, header: "Payout if win", align: "right" as const },
  { key: "expectedProfit" as const, header: "Expected profit", align: "right" as const },
];

export default function ExpectedValuePostPage() {
  const rows = buildComparisonRows(DEFAULT_OPTION_A, DEFAULT_OPTION_B);

  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Expected Value: Compare Bets Without Guessing
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Expected value: comparing two bets"
              className="h-auto w-full object-contain"
              height={500}
              src="/expected_value.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Expected value is a weighted average of outcomes. You combine upside, chance, and cost
            into one number: what you would earn on average if you ran the same bet many times.
            It does not promise any single launch will win. It helps you compare options before you
            commit budget.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Expected value answers: Which choice is better on average, not which one has the best
            story?
          </p>

          <ExpectedValueExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Probability first</h2>
          <p>
            Expected value sits on top of probability. Before you multiply by payout, you need a
            read on how likely each outcome is. The dedicated posts on probability, base rates, and
            confidence intervals cover how to estimate that chance and when to trust it.
          </p>
          <MathBlock formula="P(win) + P(miss) = 1 for a two-outcome bet" label="Mutually exclusive outcomes">
            <p>
              A campaign either clears its ROI bar or it does not. That is why the explorer uses win
              chance and treats the rest as the miss case.
            </p>
          </MathBlock>
          <p>
            Probabilities must reflect the population you care about, not only survey responders or
            beta opt-ins. Bad inputs make expected value fiction. Start with successes and trials,
            then check sample size and interval width before you plug a rate into EV.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            Once you have probabilities, expected value weights each outcome and nets out cost.
          </p>
          <MathBlock
            formula="EV = (p × payout if win) + ((1 − p) × payout if lose) − cost"
            label="Expected value of a single bet"
          >
            <p>
              p is win probability. If you win $50k with 20% chance, lose $5k otherwise, and spend
              $8k to run the campaign: EV = (0.20 × $50k) + (0.80 × −$5k) − $8k = $10k − $4k − $8k
              = −$2k. Negative EV means you lose on average even though the upside story sounds big.
            </p>
          </MathBlock>
          <MathBlock formula="EV = sum of (probability × outcome) for each case" label="Many outcomes">
            <p>
              Launch might flop, break even, or hit big. Assign a probability to each outcome, multiply,
              and add. The explorer compares two options with different cost, win rate, and payout
              structures.
            </p>
          </MathBlock>
          <p>
            A small shift in p can flip which option wins on average. Big upside only helps if p is
            high enough to matter. Two options with the same payout and odds rank differently when
            cost differs, so always net out cost.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: comparing bets
          </h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Marketing and growth.</span>{" "}
            Compare a high-cost brand campaign with low hit rate against a cheaper always-on test
            with modest upside. Finance asks which spends more per expected dollar returned.
          </p>
          <BusinessCaseExplorer slug="expected-value-real-decisions" />

          <p>
            <span className="font-bold text-[color:var(--foreground)]">Product bets.</span>{" "}
            Build a major feature with uncertain adoption vs ship a smaller improvement with clearer
            payoff. EV forces you to write down adoption chance, not only the best-case deck slide.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Sales and partnerships.</span>{" "}
            A big deal with a 15% close rate vs three smaller deals at 55%. Expected value ranks the
            pipeline on average return, not on the single largest logo.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Ops and tooling.</span>{" "}
            Automate a workflow now with known savings vs wait for a platform rewrite with higher
            upside but long delay and execution risk. Cost, timing, and probability all belong in the
            same frame.
          </p>

          <DataTable caption="Table 1: Default scenario comparison" columns={columns} rows={rows} />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Limits and habits
          </h2>
          <p>
            You still need good inputs. If win rates are made up, expected value is fiction. Pair
            EV with sample size, intervals, and downside caps. Use it to rank options, not to ignore
            risk entirely.
          </p>
          <p>
            When two options are close in expected value, execution cost, speed, and reversibility
            break the tie. When one option leads by a wide margin, you have a clear math case to
            discuss with stakeholders.
          </p>
        </div>

        <RelatedPosts slug="expected-value-real-decisions" />
      </article>
    </main>
  );
}
