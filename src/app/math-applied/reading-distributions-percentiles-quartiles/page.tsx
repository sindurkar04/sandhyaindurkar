import MathBlock from "@/components/MathBlock";
import ReadingDistributionsExplorer from "@/components/ReadingDistributionsExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("reading-distributions-percentiles-quartiles");

export default function ReadingDistributionsPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Reading Distributions: Percentiles and Quartiles from Scratch
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Percentile cutoff on a sorted distribution"
              className="h-auto w-full object-contain"
              height={500}
              src="/reading_distributions.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A distribution is the full set of values, not one summary number. Average alone hides
            the shape: a few very large values can pull the mean up while most observations sit
            lower. Percentiles and quartiles read the shape directly from sorted data.
          </p>
          <p>
            P90 is the cutoff where about 90% of observations fall at or below it. Quartiles are
            just special percentiles: Q1 is P25, Q2 is P50 (the median), Q3 is P75. They split
            sorted data into four equal-count regions.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Sort first, then read the cutoff. The histogram and box plot show where values pile up.
          </p>

          <ReadingDistributionsExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">How to read the charts</h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Histogram.</span>{" "}
            Counts how many values fall in each range. Tall bars mean common values. A long tail
            on one side means skew.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Box plot.</span>{" "}
            The box spans Q1 to Q3. The line inside is the median. Whiskers reach toward min and
            max. It is a compact view of spread and symmetry.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Cumulative curve.</span>{" "}
            As you move right through sorted values, the curve climbs toward 100%. A percentile
            cutoff is the x-value where the curve crosses your chosen percentage.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="P_k = value where k% of data is ≤ that value" label="Percentile">
            <p>
              Sort the data ascending. P50 is the middle value. P90 is high enough that only about
              10% of points sit above it.
            </p>
          </MathBlock>
          <MathBlock formula="Q1 = P25, Q2 = P50, Q3 = P75" label="Quartiles">
            <p>Quartiles split sorted data into four equal-count regions.</p>
          </MathBlock>
          <MathBlock formula="IQR = Q3 − Q1" label="Interquartile range">
            <p>
              IQR captures the middle 50% spread. It is less sensitive to extreme tail values than
              the full range from min to max.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Mean vs median in one glance
          </h2>
          <p>
            When mean and median diverge, the distribution is skewed. Revenue per customer, order
            sizes, and incident severity often skew right: a few large values pull the mean up while
            the median stays closer to typical experience. Percentiles keep the tail visible.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application
          </h2>
          <p>
            This is the core read for latency SLAs, support wait times, and any metric where the
            tail matters more than the average. P99 latency answers worst-case user experience for
            a slice of traffic. P90 support wait tells you what most customers see, not what the
            fastest cases pull the average toward.
          </p>
          <p>
            The applied posts on percentiles, variance, and mean vs median take these same reads
            into real dashboards and decision thresholds.
          </p>
        </div>

        <RelatedPosts slug="reading-distributions-percentiles-quartiles" />
      </article>
    </main>
  );
}
