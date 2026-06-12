import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import SensitivitySpecificityExplorer from "@/components/SensitivitySpecificityExplorer";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("sensitivity-specificity-screening");

export default function SensitivitySpecificityPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Sensitivity, Specificity, and the 2×2 Screening Table
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Two by two screening table with TP FP FN TN"
              className="h-auto w-full object-contain"
              height={500}
              src="/sensitivity_specificity.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Every classifier, screen, or alert splits the world into four boxes: true positive,
            false positive, false negative, and true negative. Sensitivity and specificity describe
            how the test behaves on known positives and negatives. They are not what reviewers feel
            day to day.
          </p>
          <p>
            Positive predictive value is the conditional probability that a case is truly positive
            given a positive flag. That number depends on prevalence. A strong test on a rare
            outcome still floods the queue with false alarms.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            The 2×2 table answers: How does this test split reality, and what does a positive flag
            mean in our population?
          </p>

          <SensitivitySpecificityExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="sensitivity = TP ÷ (TP + FN)" label="Sensitivity (recall on positives)">
            <p>Of all true positives, how many did the test catch? Same as recall on the disease-plus row.</p>
          </MathBlock>
          <MathBlock formula="specificity = TN ÷ (TN + FP)" label="Specificity">
            <p>Of all true negatives, how many cleared the test? High specificity means fewer false flags.</p>
          </MathBlock>
          <MathBlock formula="PPV = TP ÷ (TP + FP)" label="Positive predictive value">
            <p>
              Of everything flagged positive, how many are real? This is precision in the flagged
              pile. It is what base rates and threshold posts build on.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Model cards often lead with sensitivity. Ops leads should ask for the full table with
            your prevalence. Staffing, auto-block policy, and reviewer training depend on PPV and
            queue volume, not sensitivity alone.
          </p>
          <p>
            The habit: draw the four counts before you debate thresholds. If false positives dominate
            the flagged column, tighten specificity or raise the cutoff before you add headcount.
          </p>
        </div>

        <RelatedPosts slug="sensitivity-specificity-screening" />
      </article>
    </main>
  );
}
