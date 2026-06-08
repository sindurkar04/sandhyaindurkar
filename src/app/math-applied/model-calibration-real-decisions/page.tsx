import CalibrationExplorer from "@/components/CalibrationExplorer";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("model-calibration-real-decisions");

export default function ModelCalibrationPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          The Model Says 90%: Can You Trust the Score?
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Reliability diagram with model curve below perfect calibration line"
              className="h-auto w-full object-contain"
              height={500}
              src="/model_calibration.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A fraud model auto-blocks orders scored above 0.85. The dashboard shows 92% accuracy.
            Ops keeps overturning blocks — customers were legitimate. The model ranks reasonably well,
            but the scores are overconfident: orders labeled 90% fraud are only 60% fraud in reality.
          </p>
          <p className="rounded-lg border border-black bg-black px-4 py-4 text-base font-bold leading-relaxed text-white">
            Remember it in one line: a high score is not the same as a reliable score.
          </p>
          <p>
            Base rates teach you what happens after one alert fires. Calibration teaches whether the
            number on the score itself means what it says. A model can catch most fraud while its
            probabilities lie — and that breaks any rule tied to a fixed threshold.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Calibration answers: among everything the model scored ~90%, is roughly 90% actually
            positive?
          </p>

          <CalibrationExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="reliability: actual rate in score bucket ≈ average predicted score"
            label="Well calibrated"
          >
            <p>
              Sort predictions into buckets (70–80%, 80–90%, and so on). In each bucket, count how
              many were truly positive. If the model says 90%, about 90% should be positive. That is
              the reliability check.
            </p>
          </MathBlock>
          <MathBlock
            formula="calibration gap = average predicted − actual rate (in a bucket)"
            label="Overconfident scores"
          >
            <p>
              When the gap is positive, scores run hot: the model says 90% but only 60% are real.
              Auto-block rules and cost models built on raw scores will over-punish clean cases.
            </p>
          </MathBlock>
          <MathBlock
            formula="ranking can be fine while calibration is broken"
            label="Why accuracy misleads"
          >
            <p>
              Accuracy mixes threshold choice with score quality. A model can rank fraud above clean
              orders (good for prioritizing review) while every probability is too high (bad for
              auto-decisions). Check calibration before you wire scores to policy.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: auto-block threshold
          </h2>
          <p>
            Fraud ops sets auto-block at 0.85 and human review for 0.60–0.85. After launch, review
            queues flood and overturn rates climb. The fix is not always a higher threshold — it may
            be recalibrating scores (Platt scaling, isotonic regression) or pairing scores with base
            rate context before auto-action.
          </p>
          <BusinessCaseExplorer slug="model-calibration-real-decisions" />

          <p>
            The habit: plot reliability before you automate. Keep ranking and calibration as separate
            questions. If scores are overconfident, use them to sort the queue — not to auto-block
            without review.
          </p>
        </div>

        <RelatedPosts slug="model-calibration-real-decisions" />
      </article>
    </main>
  );
}
