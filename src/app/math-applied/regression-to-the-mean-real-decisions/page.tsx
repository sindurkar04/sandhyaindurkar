import MathBlock from "@/components/MathBlock";
import RegressionMeanExplorer from "@/components/RegressionMeanExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";

import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("regression-to-the-mean-real-decisions");


export default function RegressionToTheMeanPostPage() {
  return (
    <main className="mx-auto w-full max-w-[768px] space-y-7 px-3 py-10 sm:px-4">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          The Star Performer Slump Is Often Math: Regression to the Mean in Real Work
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Regression to the mean: extremes moving toward average"
              className="h-auto w-full object-contain"
              height={500}
              src="/regression_to_mean.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Regression to the mean is a pattern, not a failure of effort. When a result is unusually
            high or low, the next read often moves back toward average. Part of that movement is
            random noise smoothing out, not proof that your intervention worked or failed.
          </p>
          <p>
            This is different from predictive regression, which builds a formula from inputs to
            forecast an outcome. Same word, different tool. Here we focus on the snap-back effect
            after extreme scores.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Regression to the mean answers: Was last period unusually extreme, and should we expect
            a quieter follow-up even if nothing changed?
          </p>

          <RegressionMeanExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            Regression to the mean is about what happens when part of a score is luck and part is
            skill. Extremes in period one often look less extreme in period two even if nothing
            changed.
          </p>
          <MathBlock
            formula="observed score = true level + noise"
            label="Decomposing a performance number"
          >
            <p>
              A rep who hits 140% of quota might have a true run rate of 105% plus a hot streak.
              Next quarter, the streak fades and the score drifts toward their true level. That
              drift is regression to the mean, not necessarily a failed incentive plan.
            </p>
          </MathBlock>
          <MathBlock
            formula="E(next score | very high this period) < this period's score"
            label="Expected follow-up after an extreme"
          >
            <p>
              Conditional on a very high result, the expected next result is usually lower because
              the noise component does not repeat. The same logic applies in reverse for unusually
              bad weeks.
            </p>
          </MathBlock>
          <MathBlock
            formula="correlation between period 1 and period 2 < 1"
            label="Why rankings shuffle"
          >
            <p>
              If performance were pure skill, scores would track perfectly period to period. Real
              metrics correlate, but not perfectly. The gap between 1.0 and the actual correlation
              is room for snap-back and rank changes.
            </p>
          </MathBlock>
          <p>
            The bigger the noise relative to true skill, the larger the snap-back. Rewarding top
            performers or fixing bottom performers after one extreme period guarantees some
            regression even with zero intervention, because you selected an outlier. Longer
            measurement windows average out luck and stabilize rankings. Before you restructure
            incentives, compare against a longer baseline and ask whether the decision still
            makes sense if next period looks ordinary.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Where teams misread it
          </h2>
          <p>
            Sales leaders reward top reps after a blowout month, then wonder why the next month
            disappoints. Support managers reassign tickets away from slow agents who were unlucky
            for one week. Marketing kills a campaign that looked weak in a small window that was
            mostly noise.
          </p>
          <p>
            Each story treats the follow-up period as evidence about people or programs. Often it is
            mostly the math of extremes. The top group was partly skill and partly a hot streak.
            The bottom group was partly a cold streak. Next period, both drift toward the team
            average.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            What to do instead
          </h2>
          <p>
            Compare against a longer baseline, not only last period&apos;s rank. Use larger windows
            or control groups before you restructure incentives. When you pilot a fix on the worst
            performers, expect partial recovery even if the fix did nothing.
          </p>
          <p>
            Good reviews separate signal from snap-back. Report whether the metric moved toward the
            long-run average, whether the sample was small, and whether the decision would still
            make sense if the next week looked ordinary.
          </p>

          <p>
            Extremes get attention because they stand out. The follow-up usually looks less
            exciting because normal is less exciting. That is regression to the mean, and it shows
            up anywhere rankings meet randomness.
          </p>
        </div>

        <RelatedPosts slug="regression-to-the-mean-real-decisions" />
      </article>
    </main>
  );
}
