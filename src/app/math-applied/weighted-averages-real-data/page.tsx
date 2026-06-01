import MathBlock from "@/components/MathBlock";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import WeightedAveragesExplorer from "@/components/WeightedAveragesExplorer";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("weighted-averages-real-data");

export default function WeightedAveragesPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Weighted Averages: Roll Up the Number That Matches Volume
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Simple average vs weighted average by segment volume"
              className="h-auto w-full object-contain"
              height={500}
              src="/weighted_averages.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            You have CSAT by region, conversion by channel, or satisfaction by plan tier. A simple
            average of the segment rates treats a 120-customer region like a 880-customer region.
            The rollup is wrong when volumes differ.
          </p>
          <p>
            A weighted average counts every unit once. Multiply each segment rate by its volume,
            add, then divide by total volume. That is the company-wide number most leaders need.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Weighted averages answer: What is the true overall rate when segments are different
            sizes?
          </p>

          <WeightedAveragesExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="simple average = (rate₁ + rate₂ + …) ÷ number of segments"
            label="Unweighted mean of rates"
          >
            <p>
              North at 88% and South at 62% give a simple average of 75%. That treats both regions
              as half the story even when South has most of the customers.
            </p>
          </MathBlock>
          <MathBlock
            formula="weighted average = (rate₁×n₁ + rate₂×n₂ + …) ÷ (n₁ + n₂ + …)"
            label="Volume-weighted rollup"
          >
            <p>
              With n = 120 and 880, the weighted CSAT is about 65%. Most customers experience the
              lower region, so the company rate should sit closer to South than to the simple 75%.
            </p>
          </MathBlock>
          <p>
            Simpson&apos;s paradox is about direction reversing when you slice wrong. Weighted
            averages are about getting the level right when slices differ in size. Use both: correct
            rollup first, then segment tables to explain why.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: executive dashboards
          </h2>
          <p>
            Ops reviews often show regional KPIs averaged without weights. Product compares plan-tier
            satisfaction as if tiers were equal size. Marketing blends channel conversion the same
            way. Each headline can look better or worse than the experience most customers see.
          </p>
          <BusinessCaseExplorer slug="weighted-averages-real-data" />

          <p>
            Report the weighted company number first. Show segment breakdown second. Targets and
            bonuses should track the weighted rollup unless you explicitly care about a small slice.
          </p>
        </div>

        <RelatedPosts slug="weighted-averages-real-data" />
      </article>
    </main>
  );
}
