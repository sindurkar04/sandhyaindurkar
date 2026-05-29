import MathBlock from "@/components/MathBlock";
import PercentilesExplorerLoader from "@/components/PercentilesExplorerLoader";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";

import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("percentiles-quartiles-real-data");


export default function PercentilesQuartilesPostPage() {
  return (
    <main className="mx-auto w-full max-w-[768px] space-y-7 px-3 py-10 sm:px-4">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          The Average User Isn&apos;t Average: What Percentiles and Quartiles Tell You in Real Data
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Percentiles and quartiles visual"
              className="h-auto w-full object-contain"
              height={500}
              src="/percentiles_quartiles.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Means and medians compress a full dataset into one number. Spread tells you how wide
            the values are. Percentiles go further: they tell you where a specific slice of the
            distribution sits.
          </p>
          <p>
            The 90th percentile (P90) is the value where about 90% of observations fall at or
            below it. Quartiles mark the same idea at 25%, 50%, and 75%: Q1, Q2 (the median), and
            Q3.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            A percentile answers: What do most people or events actually experience, not just what
            is typical on average?
          </p>

          <PercentilesExplorerLoader />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            Percentiles mark positions in a sorted list. They answer where a value sits relative to
            the rest of the distribution.
          </p>
          <MathBlock
            formula="P90 = value where 90% of observations fall at or below it"
            label="Percentile"
          >
            <p>
              P50 is the median: half the data is at or below it. P90 is the value where about 90%
              of requests are faster and 10% are slower. If P90 latency is 145 ms, the slowest tenth
              of users see worse than that.
            </p>
          </MathBlock>
          <MathBlock
            formula="Q1 = P25,  Q2 = P50 (median),  Q3 = P75"
            label="Quartiles"
          >
            <p>
              Quartiles split sorted data into four equal-sized chunks. Q1 to Q3 holds the middle
              50%, which is often where everyday performance lives.
            </p>
          </MathBlock>
          <MathBlock formula="IQR = Q3 − Q1" label="Interquartile range">
            <p>
              The width of the middle half. A small IQR means most typical values cluster together.
              A large IQR means even the middle 50% is spread out. IQR is less sensitive to extreme
              tails than the full range.
            </p>
          </MathBlock>
          <p>
            The tail moves high percentiles more than the center: a few slow requests can push P99
            up while P50 barely shifts. Extreme percentiles need large n to be stable; P99 on a
            hundred points is a rough guess compared to P99 on millions of events. Pick the
            percentile that matches the decision: P50 for typical experience, P90 or P99 for SLAs
            and pain in the slow tail. IQR describes the middle 50% and stays robust when outliers
            stretch the full range.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Why one summary is not enough
          </h2>
          <p>
            The mean is sensitive to outliers. The median shows the middle of the sorted list.
            Percentiles let you name the experience of the slowest 10% or the fastest half
            without guessing.
          </p>
          <p>
            The interquartile range (IQR), Q3 minus Q1, describes where the middle 50% of values
            live. It is less sensitive to extreme tails than the full range, and pairs well with
            quartiles when you want a stable view of everyday variation.
          </p>
          <p>
            In dashboards, P50, P90, and P99 often show up together. P50 is typical. P90 and P99
            describe the slow or expensive tail that drives complaints, churn, and SLA breaches.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: API latency
          </h2>
          <p>
            Suppose your team reports average API latency of 72 ms against an 80 ms target. The
            headline is green.
          </p>
          <p>
            Then you check P90: 145 ms. That means about 10% of requests are slower than 145 ms.
            For those users, the service feels nothing like the average. Product and support
            tickets often come from that slice, not from the mean.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Mean answers: What is the arithmetic center?
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            P90 answers: What do the slower 10% of cases look like?
          </p>
          <p>
            Those are different operational questions. Capacity planning, alerting, and customer
            promises usually need percentiles, not just averages.
          </p>
          <p>
            The same logic applies to support resolution time, checkout duration, and payroll.
            Quartiles split the distribution into four parts so you can compare teams or time
            periods without letting one outlier dominate the story.
          </p>

          <p>
            Percentiles are not advanced statistics reserved for specialists. They are a practical
            way to describe experience at different points in the distribution.
          </p>
          <p>
            When you report mean or median plus P90 or P99, you give readers both center and tail.
            That combination matches how people feel systems perform: mostly fine, sometimes
            terrible.
          </p>
          <p>
            Good analysis also names the unit and the sample. A P99 on twelve data points means
            something different from a P99 on twelve million. Small samples make extreme
            percentiles unstable. Context still matters.
          </p>

          <p>
            There is no single number that captures a full distribution. Means and medians are
            useful. Spread adds volatility. Percentiles and quartiles add position: who is affected
            and how badly.
          </p>
          <p>
            When you lead with the percentile that matches the decision, you stop optimizing for
            the average case alone. You start designing for the experience people actually have,
            including the tail.
          </p>
        </div>

        <RelatedPosts slug="percentiles-quartiles-real-data" />
      </article>
    </main>
  );
}
