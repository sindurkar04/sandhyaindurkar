import DataTable from "@/components/DataTable";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import SelectionBiasExplorer from "@/components/SelectionBiasExplorer";
import { SCENARIOS, formatCount, formatPercent } from "@/lib/selection-bias-data";
import Image from "next/image";

import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("selection-bias-real-decisions");


const columns = [
  { key: "scenario" as const, header: "Scenario", align: "left" as const },
  { key: "selected" as const, header: "Selected sample", align: "right" as const },
  { key: "full" as const, header: "Full population", align: "right" as const },
  { key: "gap" as const, header: "Gap", align: "right" as const },
  { key: "read" as const, header: "Ops read", align: "left" as const },
];

const rows = (Object.keys(SCENARIOS) as (keyof typeof SCENARIOS)[]).map((key) => {
  const s = SCENARIOS[key];
  return {
    scenario: s.shortLabel,
    selected: `${formatPercent(s.selectedPositiveRate)} (n=${formatCount(s.selectedSize)})`,
    full: `${formatPercent(s.fullPositiveRate)} (n=${formatCount(s.fullSize)})`,
    gap: `+${s.selectedPositiveRate - s.fullPositiveRate} pts`,
    read: s.businessRead.split(".")[0],
  };
});

export default function SelectionBiasPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Your Best Customers Answered: Selection Bias in Real Decisions
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Selection bias: selected sample vs full population"
              className="h-auto w-full object-contain"
              height={500}
              src="/selection_bias.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Selection bias happens when the sample you measure is not the population you care about.
            Surveys reach responders. Betas reach volunteers. Churn interviews reach people willing
            to talk. The rate in that slice can look nothing like the rate for everyone.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Selection bias answers: Who never made it into this dataset, and would the headline
            change if they had?
          </p>

          <SelectionBiasExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            Selection bias is a gap between the rate in your sample and the rate in the population
            you actually need to decide for.
          </p>
          <MathBlock
            formula="observed rate = successes in sample ÷ sample size"
            label="What you measured"
          >
            <p>
              If 72% of survey responders are satisfied but only 45% of all customers are, the
              observed 72% describes responders, not everyone. The explorer shows both bars side
              by side.
            </p>
          </MathBlock>
          <MathBlock
            formula="population rate = successes in everyone ÷ total population"
            label="What you need for decisions"
          >
            <p>
              This includes silent non-responders, users who churned before the survey, and
              customers who never opened the beta invite. Table 1 compares selected vs full
              populations across scenarios.
            </p>
          </MathBlock>
          <MathBlock
            formula="bias gap = selected rate − population rate"
            label="Size of the distortion"
          >
            <p>
              A +27 point gap means your sample overstates satisfaction (or conversion, or feature
              love) by that much. Acting on the selected rate alone scales the wrong story.
            </p>
          </MathBlock>
          <p>
            Engaged users and happy customers over-represent in voluntary samples, so the gap
            widens as response rate falls. Weighting by segment can close part of the difference
            when you have behavioral data on non-responders. A larger sample does not fix the
            problem if the missing customers never entered the dataset. The survey still tells
            you about responders; the mistake is treating that rate as the population rate
            without checking who is absent.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Business examples
          </h2>
          <p>
            Product teams launch features because beta users loved them. Marketing scales messages
            that tested well with engaged email openers. Policy teams act on complaints from the
            customers who fill out forms. In each case, the measured group is easier to reach, more
            motivated, or more patient than the full base.
          </p>

          <DataTable caption="Table 1: Selected sample vs full population" columns={columns} rows={rows} />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            What to do instead
          </h2>
          <p>
            Report who is in the sample and who is missing. Weight or stratify when you can.
            Compare survey results to behavioral data on non-responders. For betas, read holdout
            groups that did not opt in. For churn, pair interviews with exit data on silent leavers.
          </p>
          <p>
            A high score from a biased sample is still data. It is just data about the selected
            group. Treat it that way before you set roadmaps or revenue targets.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: survey bias
          </h2>
          <p>
            Lower response rate and happy-user bias. See when reported satisfaction overshoots the
            true population.
          </p>
          <BusinessCaseExplorer slug="selection-bias-real-decisions" />
        </div>

        <RelatedPosts slug="selection-bias-real-decisions" />
      </article>
    </main>
  );
}
