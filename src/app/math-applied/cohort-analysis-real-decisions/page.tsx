import CohortAnalysisExplorer from "@/components/CohortAnalysisExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("cohort-analysis-real-decisions");

export default function CohortAnalysisPostPage() {
  return (
    <main className="mx-auto w-full max-w-[768px] space-y-7 px-3 py-10 sm:px-4">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          The New Users Look Great: Cohort Analysis in Real Decisions
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Headline retention vs signup cohort breakdown"
              className="h-auto w-full object-contain"
              height={500}
              src="/cohort_analysis.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Headline retention is a blend. It mixes users who signed up last week with users who
            signed up last quarter. When the blend shifts toward newer signups, the overall rate
            can move even if product quality for each signup month is unchanged.
          </p>
          <p className="rounded-lg border border-black bg-black px-4 py-4 text-base font-bold leading-relaxed text-white">
            Remember it in one line: compare signup cohorts at the same age before you react to the
            headline average.
          </p>
          <p>
            Cohort analysis groups users by when they started, then tracks each group on the same
            clock. Did January signups retain better than December signups at day 30? That is a
            product question. Did overall retention fall because January brought twice as many
            signups? That is a mix question.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Cohort analysis answers: Is the metric moving because behavior changed, or because who
            we are measuring changed?
          </p>

          <CohortAnalysisExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="headline rate = Σ (cohort rate × cohort weight) ÷ Σ weights"
            label="Weighted blend"
          >
            <p>
              Overall retention is a weighted average of cohort rates. Weights are how many users
              from each signup month sit in the measured population today. Change the weights and
              the headline moves, even when every cohort row stays fixed.
            </p>
          </MathBlock>
          <MathBlock
            formula="compare cohort A vs cohort B at the same age (e.g. day 30 after signup)"
            label="Apples to apples"
          >
            <p>
              Jan signups at day 30 vs Dec signups at day 30 is a fair product comparison. Jan
              signups at day 7 vs Oct signups at day 90 is not. Lock the age window before you
              rank months.
            </p>
          </MathBlock>
          <MathBlock
            formula="mix effect ≈ headline change with cohort rates held constant"
            label="Separate mix from quality"
          >
            <p>
              Hold cohort rows steady and only shift weights to see how much of a headline move is
              composition. Hold weights steady and move cohort rows to see real behavior change.
              Teams need both views in every retention review.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: the weekly retention review
          </h2>
          <p>
            Growth reports headline retention at 44%, down two points. The cohort table shows Oct
            through Jan signup months each two points lower at day 30 than the prior month. That is
            a product regression. If cohort rows are flat but January doubled signups, the headline
            drop is a mix story, not necessarily a broken feature.
          </p>
          <p>
            The habit: publish a cohort table beside every headline retention metric. Flag mix
            shifts after launches and campaigns. Pair with segment tables when experiments change
            who signs up. Weighted average posts cover rollups. This post covers who belongs in
            each row.
          </p>
        </div>

        <RelatedPosts slug="cohort-analysis-real-decisions" />
      </article>
    </main>
  );
}
