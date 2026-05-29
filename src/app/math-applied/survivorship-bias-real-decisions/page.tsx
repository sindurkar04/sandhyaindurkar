import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import SurvivorshipBiasExplorer from "@/components/SurvivorshipBiasExplorer";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("survivorship-bias-real-decisions");

export default function SurvivorshipBiasPostPage() {
  return (
    <main className="mx-auto w-full max-w-[768px] space-y-7 px-3 py-10 sm:px-4">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Only the Winners Stay Visible: Survivorship Bias in Real Decisions
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Survivorship bias: visible winners vs full cohort"
              className="h-auto w-full object-contain"
              height={500}
              src="/survivorship_bias.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Survivorship bias is selection bias after the fact. The dataset keeps the winners and
            drops the failures. Startup headlines, five-star reviews, and top-quartile fund tables
            all describe the survivors, not everyone who started.
          </p>
          <p>
            Selection bias asks who never entered the sample. Survivorship bias asks who left before
            you measured. Both distort the rate. This one is especially common when success stories
            are the only stories you can still see.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Survivorship bias answers: Who failed or disappeared, and would the headline still hold
            if they were counted?
          </p>

          <SurvivorshipBiasExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="survivor rate = successes among visible cases ÷ visible cases"
            label="What the headline shows"
          >
            <p>
              If 88% of still-operating startups look healthy, that rate ignores the ones that
              shut down. The numerator and denominator both exclude failures.
            </p>
          </MathBlock>
          <MathBlock
            formula="cohort rate = successes in full cohort ÷ everyone who started"
            label="What actually happened"
          >
            <p>
              Include launches that closed, funds that stopped reporting, and users who churned
              before leaving a review. The true rate is often far lower than the survivor rate.
            </p>
          </MathBlock>
          <MathBlock
            formula="survivorship gap = survivor rate − cohort rate"
            label="Size of the distortion"
          >
            <p>
              A +54 point gap means visible winners overstate success by that much. Copying their
              playbook without the failure data is copying a filtered slice of history.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: portfolio stories
          </h2>
          <p>
            Investors study companies that made it. Product teams read reviews from users still
            active enough to post. Leaders benchmark against peers still in the league table. In
            each case, failures left the dataset before the analysis began.
          </p>
          <p>
            Ask for the full cohort: how many started, how many remain, and what happened to the
            rest. Pair visible success rates with exit data, churn, or closed-book records before
            you set strategy from survivor stories alone.
          </p>
        </div>

        <RelatedPosts slug="survivorship-bias-real-decisions" />
      </article>
    </main>
  );
}
