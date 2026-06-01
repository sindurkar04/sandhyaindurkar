import MathBlock from "@/components/MathBlock";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import SeasonalityExplorer from "@/components/SeasonalityExplorer";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("seasonality-real-decisions");

export default function SeasonalityPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Up From Last Month: Is That Normal for March? Seasonality in Real Decisions
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Month over month vs year over year comparison"
              className="h-auto w-full object-contain"
              height={500}
              src="/seasonality.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Revenue dips after holiday peak. B2B signups jump in January. Consumer apps cool in
            summer. None of that requires a broken product. It requires the right calendar baseline.
          </p>
          <p className="rounded-lg border border-black bg-black px-4 py-4 text-base font-bold leading-relaxed text-white">
            Remember it in one line: compare to the same month last year, not only the month before.
          </p>
          <p>
            Month-over-month is fine for ops standups. Year-over-year is often better for seasonal
            businesses because it strips out the calendar shape. Benchmark posts cover which baseline
            to pick; this post covers repeating patterns in time.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Seasonality answers: Is this move unusual, or is it the calendar?
          </p>

          <SeasonalityExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="MoM change = (this month − last month) ÷ last month"
            label="Month over month"
          >
            <p>
              Sensitive to short swings. December vs November in retail often looks bad even when the
              business is healthy vs last December.
            </p>
          </MathBlock>
          <MathBlock
            formula="YoY change = (this month − same month last year) ÷ same month last year"
            label="Year over year"
          >
            <p>
              Aligns seasonality. March vs March controls for spring break, fiscal year starts, and
              holiday hangover.
            </p>
          </MathBlock>
          <MathBlock
            formula="when MoM and YoY disagree, lead with the baseline that matches the decision"
            label="Which to show"
          >
            <p>
              Ops cadence: MoM. Board and planning: YoY. Always label which clock you used.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: the monthly business review
          </h2>
          <p>
            December revenue is down 6% vs November. Leadership panics. Same December is up 10% vs
            last December. The product did not break; the calendar did what it always does after
            November peak. The slide should show both baselines and state which one drives hiring and
            inventory decisions.
          </p>
          <BusinessCaseExplorer slug="seasonality-real-decisions" />

          <p>
            The habit: plot twelve months with prior-year overlay. Flag known seasonal events before
            the review. Pair with cohort analysis when signup mix shifts at the same time.
          </p>
        </div>

        <RelatedPosts slug="seasonality-real-decisions" />
      </article>
    </main>
  );
}
