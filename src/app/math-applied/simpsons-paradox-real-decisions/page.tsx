import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import SimpsonsParadoxExplorer from "@/components/SimpsonsParadoxExplorer";
import Image from "next/image";

import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("simpsons-paradox-real-decisions");


export default function SimpsonsParadoxPostPage() {
  return (
    <main className="mx-auto w-full max-w-[768px] space-y-7 px-3 py-10 sm:px-4">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Simpson&apos;s Paradox: When Every Slice Wins but the Total Loses
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Segment wins vs aggregate reversal"
              className="h-auto w-full object-contain"
              height={500}
              src="/simpsons_paradox.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            An A/B test can show variant winning on mobile and desktop, yet losing overall. That
            sounds impossible until you look at who landed in each arm. If control received more
            high-converting desktop traffic while variant received more low-converting mobile
            traffic, the aggregate rate can reverse even when variant wins inside every slice.
          </p>
          <p>
            Simpson&apos;s paradox is not a trick formula. It is a reminder that rolled-up rates
            weight each segment by how many people were in that segment for each arm.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            The paradox answers: Did we compare like with like before we declared a winner?
          </p>

          <SimpsonsParadoxExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="aggregate rate = total successes ÷ total trials"
            label="How rollups work"
          >
            <p>
              Combine mobile and desktop by adding successes and trials across segments. The overall
              rate is a weighted mix. Different weights per arm change the total even when each slice
              moves the same direction.
            </p>
          </MathBlock>
          <MathBlock
            formula="compare variant vs control within each segment first"
            label="Slice before rollup"
          >
            <p>
              Mobile: variant ahead. Desktop: variant ahead. Aggregate: control ahead. That pattern
              means the traffic mix differed between arms, not that the slice math is wrong.
            </p>
          </MathBlock>
          <p>
            Random assignment usually balances mix over large samples, but uneven attrition,
            geo launches, or device-specific bugs can skew who saw which version. Always inspect
            segment tables in experiment tools before you ship on the headline metric alone.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application: segment tables</h2>
          <p>
            Experiment reviewers require device, region, and plan-tier cuts on every readout.
            Analytics teams flag when aggregate lift disagrees with every segment. Product leads
            delay rollouts until assignment balance is explained or results are analyzed within the
            segments that matter for the decision.
          </p>
          <p>
            The habit is simple: report slices, then aggregate. If stories disagree, trust the
            slices you care about operationally and fix the mix before you call a winner.
          </p>
        </div>

        <RelatedPosts slug="simpsons-paradox-real-decisions" />
      </article>
    </main>
  );
}
