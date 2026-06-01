import BenchmarksBaselinesExplorer from "@/components/BenchmarksBaselinesExplorer";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("benchmarks-baselines-real-decisions");

export default function BenchmarksBaselinesPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Up 10% Compared to What? Benchmarks and Baselines
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Same metric compared to different baselines"
              className="h-auto w-full object-contain"
              height={500}
              src="/benchmarks_baselines.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A metric without a baseline is half a sentence. Conversion is 11%. Revenue is $820k.
            CSAT is 78. Each number needs a comparison before it means anything for a decision.
          </p>
          <p className="rounded-lg border border-black bg-black px-4 py-4 text-base font-bold leading-relaxed text-white">
            Remember it in one line: say the number, then say compared to what.
          </p>
          <p>
            Last month, same month last year, plan target, and peer median can tell four different
            stories about the same current value. Pick the baseline that matches the question you
            are actually trying to answer.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Benchmarks answer: Is this good or bad, relative to the right reference point?
          </p>

          <BenchmarksBaselinesExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="percent change = (current − baseline) ÷ baseline × 100"
            label="Relative change (rates and dollars)"
          >
            <p>
              $820k vs $780k last month is +5.1%. Same $820k vs $850k target is −3.5% vs plan.
              Same current value, opposite headline depending on baseline.
            </p>
          </MathBlock>
          <MathBlock
            formula="point gap = current − baseline"
            label="Absolute gap (scores and rates)"
          >
            <p>
              11.0% conversion vs 12.0% target is −1.0 point, not −8.3%. Points and dollars are
              often clearer than percents when the baseline is a goal or peer level.
            </p>
          </MathBlock>
          <MathBlock
            formula="pick baseline by decision: MoM for ops, YoY for seasonality, target for plan, peer for market"
            label="Which baseline when"
          >
            <p>
              Month-over-month for weekly standups. Year-over-year for seasonal businesses.
              Target for board and budget reviews. Peer for competitive context. Mixing them without
              labels causes arguments.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: the leadership slide
          </h2>
          <p>
            A PM puts conversion at 11% on a slide with a green arrow because it beat last month.
            Finance notes the same 11% misses the 12% target. Strategy adds that peers sit near 13%.
            Everyone looked at one number. They answered different questions.
          </p>
          <BusinessCaseExplorer slug="benchmarks-baselines-real-decisions" />

          <p>
            Fix: one headline metric, then a small baseline table: vs last month, vs last year, vs
            plan, vs peer. State which baseline drives the decision. Percent change posts cover the
            arithmetic. This post covers the choice before you calculate.
          </p>
        </div>

        <RelatedPosts slug="benchmarks-baselines-real-decisions" />
      </article>
    </main>
  );
}
