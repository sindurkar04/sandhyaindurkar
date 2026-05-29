import DataTable from "@/components/DataTable";
import ConfidenceIntervalsExplorer from "@/components/ConfidenceIntervalsExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import { SCENARIOS, formatRate, wilsonInterval } from "@/lib/confidence-intervals-data";
import Image from "next/image";

const sampleSizes = [100, 400, 1600];

const columns = [
  { key: "sample" as const, header: "Sample size", align: "right" as const },
  { key: "rate" as const, header: "Observed rate", align: "right" as const },
  { key: "interval" as const, header: "95% interval", align: "left" as const },
  { key: "width" as const, header: "Band width", align: "right" as const },
];

export default function ConfidenceIntervalsPostPage() {
  const scenario = SCENARIOS.conversion;
  const rows = sampleSizes.map((n) => {
    const interval = wilsonInterval(scenario.defaultRate, n);
    return {
      sample: n.toLocaleString(),
      rate: formatRate(scenario.defaultRate),
      interval: `${formatRate(interval.low)} to ${formatRate(interval.high)}`,
      width: formatRate(interval.high - interval.low),
    };
  });

  return (
    <main className="mx-auto w-full max-w-[768px] space-y-7 px-3 py-10 sm:px-4">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          One Number Is Not Enough: Confidence Intervals for Real Decisions
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Confidence interval band around a point estimate"
              className="h-auto w-full object-contain"
              height={500}
              src="/confidence_intervals.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A conversion rate, CSAT score, or defect rate from one sample is a point estimate. It is
            the best single guess given what you observed. It is not a guarantee about the full
            customer base or every future week.
          </p>
          <p>
            A confidence interval adds a range. Plain language: if we repeated this measurement
            many times, the true rate would fall inside this band most of the time. Wider band
            means more uncertainty. Narrow band means the sample carried more information.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Confidence intervals answer: How wrong could this headline number be, given our sample
            size?
          </p>

          <ConfidenceIntervalsExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            A confidence interval wraps a point estimate with a range that reflects sample size and
            variability. Wider band means less certainty.
          </p>
          <MathBlock
            formula="point estimate p = successes ÷ n"
            label="Observed rate"
          >
            <p>
              120 conversions out of 1,000 visits gives p = 12%. That is your best single guess,
              but the true long-run rate could be a bit higher or lower.
            </p>
          </MathBlock>
          <MathBlock
            formula="SE ≈ √(p(1 − p) ÷ n)"
            label="Standard error"
          >
            <p>
              This is the typical wobble in p due to random sampling. Small n or p near 50% produces
              a larger SE. Table 1 shows the same 12% rate with bands that shrink as n grows.
            </p>
          </MathBlock>
          <MathBlock
            formula="95% interval ≈ p ± 1.96 × SE  (rough normal approximation)"
            label="Confidence interval (conceptual)"
          >
            <p>
              About 95% of the time, a procedure like this captures the true rate. The explorer
              uses a Wilson interval, which behaves better for small n and extreme rates, but the
              intuition is the same: center plus/minus a margin based on SE.
            </p>
          </MathBlock>
          <p>
            Doubling n narrows the band, but you need roughly four times as many observations to
            halve the width. Rates near 50% produce the widest intervals for a given n. A 99%
            interval is wider than a 95% interval because you are demanding more coverage. Two
            experiments can show the same headline rate with different bands if n differs. Ship
            when the whole interval clears your decision bar; if the band straddles zero lift or
            minimum ROI, gather more data.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Why sample size still matters
          </h2>
          <p>
            The same observed rate can imply a tight or loose range depending on n. That is why
            sample size posts and interval posts belong together. Small pilots produce wide bands.
            Large rollouts shrink them.
          </p>

          <DataTable
            caption={`Table 1: Same ${formatRate(scenario.defaultRate)} conversion, different sample sizes`}
            columns={columns}
            rows={rows}
          />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: shipping decisions
          </h2>
          <p>
            Report the interval in experiment readouts and ops reviews. If the band crosses your
            decision threshold, wait or gather more data. If the band clears the bar with room to
            spare, you have a stronger case to ship or scale.
          </p>
          <p>
            The habit is showing a range next to every rate. The math above explains why that
            range widens or tightens.
          </p>
        </div>

        <RelatedPosts slug="confidence-intervals-real-decisions" />
      </article>
    </main>
  );
}
