import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import SampleSizeExplorerLoader from "@/components/SampleSizeExplorerLoader";
import Image from "next/image";

import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("sample-size-real-decisions");


export default function SampleSizePostPage() {
  return (
    <main className="mx-auto w-full max-w-[768px] space-y-7 px-3 py-10 sm:px-4">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Twelve Data Points Isn&apos;t a Trend: What Sample Size Changes in Real Decisions
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Sample size stability visual"
              className="h-auto w-full object-contain"
              height={500}
              src="/sample_size.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Every metric you report is computed from a sample. A conversion rate from last
            week, an average order value from thirty customers, a CSAT score from one survey
            batch. The number on the slide is only as trustworthy as the sample behind it.
          </p>
          <p>
            Sample size is how many observations you include. Small samples are not wrong, but
            they are noisy. The same underlying business can look like a breakthrough, a
            disaster, or a flat result depending on how many data points you have.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Sample size answers: Do we have enough evidence to act, or are we reacting to noise?
          </p>

          <SampleSizeExplorerLoader />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            Sample size controls how much random noise shows up in your summary stats. Larger n
            does not remove bias, but it does stabilize the numbers.
          </p>
          <MathBlock
            formula="standard error ∝ 1 ÷ √n"
            label="Core idea: noise shrinks with the square root of n"
          >
            <p>
              Quadrupling sample size roughly halves the typical wobble in your mean or rate. That
              is why going from 50 to 200 observations helps more than going from 50 to 100, but
              each doubling of n buys less and less stability.
            </p>
          </MathBlock>
          <MathBlock
            formula="SE(rate) ≈ √(p(1 − p) ÷ n)"
            label="Standard error for a proportion (conversion, CSAT yes/no)"
          >
            <p>
              p is the observed rate (e.g. 12% conversion). n is sample size. At p = 0.12 and n =
              100, SE ≈ 3.3 percentage points, so a read of 12% might really be somewhere near 9%
              to 15%. At n = 1,600, SE ≈ 0.8 points. Same rate, much tighter estimate.
            </p>
          </MathBlock>
          <MathBlock
            formula="SE(mean) ≈ s ÷ √n"
            label="Standard error for an average"
          >
            <p>
              s is the sample standard deviation. More observations shrink the uncertainty around
              your average order value or handle time. The explorer shows how means and rates jump
              when n is small and settle when n grows.
            </p>
          </MathBlock>
          <p>
            Larger n stabilizes summaries: experiment lifts stop flipping sign and percentiles
            settle, especially in the tail. Noisy processes and rates near 50% stay wide even with
            more data. Slice the sample by region or device and n per slice drops; a trend that
            looks clear overall can vanish in each subgroup. More rows reduce random noise, not
            systematic bias, so report n alongside every rate and average so the audience can judge
            how much to trust the headline.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Why small samples mislead teams
          </h2>
          <p>
            When n is small, summary stats move easily. Mean, median, conversion rate, and
            percentiles can shift sharply if a few customers behave differently. That movement
            is not always a real change in the business. It is often sampling noise.
          </p>
          <p>
            This shows up in weekly reviews, experiment readouts, and pilot programs. A
            product leader sees variant B ahead by nine points on conversion and wants to ship.
            Finance sees average order value up eighteen dollars on forty orders and raises
            targets. Support sees CSAT jump after a training session with ninety responses.
          </p>
          <p>
            Each decision uses real numbers. The risk is treating a thin sample as if it were
            the full customer base.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Business examples and impact
          </h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">A/B tests.</span>{" "}
            Experiments compare conversion, click-through, or revenue per user between groups.
            With a small sample, the variant can look like a clear winner even when the
            underlying populations are nearly the same. The business impact is premature
            rollout, wasted engineering time, or rolling back a change that was actually fine.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Revenue and unit economics.</span>{" "}
            Average order value, revenue per user, and cost per acquisition all depend on
            sample size. A short window with few orders can inflate or deflate the mean. The
            impact is mispriced promotions, wrong bonus plans, and forecasts that do not
            survive the next month.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Operations and quality.</span>{" "}
            CSAT, handle time, and defect rates from a single week reflect process changes,
            staffing, and seasonality. Small samples make it hard to separate signal from
            noise. The impact is restructuring workflows or changing policies based on a
            blip.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            What to look at besides the headline
          </h2>
          <p>
            You need a habit: report n alongside every summary, then ask how stable that summary
            would be if you kept collecting data. The formulas above show why that habit works.
          </p>
          <p>
            Useful companions include the mean and median for level, spread for volatility,
            percentiles for tail experience, and the gap between your sample and a longer
            baseline. For experiments, compare observed lift to what you would expect from
            small noise, and wait for the readout to stop jumping before you ship.
          </p>
          <p>
            A practical rule: if the decision is expensive to reverse, require a larger sample
            or a longer time window. If the decision is cheap to test, you can move faster,
            but still label early results as directional, not final.
          </p>

          <p>
            Sample size is not a technical footnote. It is a business risk control. Leaders
            who always ask how many observations sit behind a metric make fewer false
            positives and fewer panic pivots.
          </p>
          <p>
            Good dashboards show n next to rate and average. Good experiment reviews show how
            the result changed as traffic accumulated. Good operations reviews compare this
            week to a band of normal weeks, not to a single small batch.
          </p>

          <p>
            Data quality is not only about clean pipelines. It is about whether you have enough
            observations to support the story you tell. Before you change pricing, ship a
            feature, or restructure a team, ask one question: if we had twice as much data,
            would this conclusion still hold?
          </p>
          <p>
            If the answer is no, you do not have a trend yet. You have a starting point. Treat
            it that way.
          </p>
        </div>

        <RelatedPosts slug="sample-size-real-decisions" />
      </article>
    </main>
  );
}
