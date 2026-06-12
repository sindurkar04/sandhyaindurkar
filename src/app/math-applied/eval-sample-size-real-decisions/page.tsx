import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import EvalSampleSizeExplorer from "@/components/EvalSampleSizeExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("eval-sample-size-real-decisions");

export default function EvalSampleSizePostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          How Many Labels Before You Trust the Metric?
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Wide confidence band on model precision from a thin eval set"
              className="h-auto w-full object-contain"
              height={500}
              src="/eval_sample_size.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            The model team reports 68% precision on a held-out eval set. Leadership wants to auto-block
            at 0.85 tomorrow. The number sounds solid until you learn the eval set had 500 rows and
            only 20 flagged cases. Precision on twenty outcomes is a coin flip with extra decimals.
          </p>
          <p className="rounded-lg border border-black bg-black px-4 py-4 text-base font-bold leading-relaxed text-white">
            Remember it in one line: report the metric and the labeled count behind it.
          </p>
          <p>
            Sample size posts cover A/B tests and dashboard averages. Eval sample size is the same
            uncertainty logic applied to ML metrics: precision, recall, and F1 are proportions on a
            thin slice of labeled data. Small denominators mean wide bands.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Eval sample size answers: Is this precision/recall read tight enough to change policy?
          </p>

          <EvalSampleSizeExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="SE(metric) ≈ √(p(1 − p) ÷ n_effective)"
            label="Binomial uncertainty on a rate"
          >
            <p>
              p is the observed precision, recall, or F1. n_effective is the count in the denominator
              you care about: flagged rows for precision, true positives for recall. Not always total
              labeled rows.
            </p>
          </MathBlock>
          <MathBlock
            formula="95% band ≈ p ± 1.96 × SE"
            label="Margin of error"
          >
            <p>
              At p = 0.68 and n_effective = 20, SE ≈ 0.10, so the band is roughly 48%–88%. At
              n_effective = 200, SE ≈ 0.03, band narrows to about 62%–74%. Same model, different
              label budget.
            </p>
          </MathBlock>
          <MathBlock
            formula="rare positives → need more labels than headline row count suggests"
            label="Imbalanced eval sets"
          >
            <p>
              A 2,000-row eval with 1% fraud may include only ~20 fraud cases. Recall bands stay wide
              even when total rows look impressive. Stratified labeling buys tighter reads on the
              metrics that drive policy.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Where teams get stuck
          </h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Launch reviews.</span>{" "}
            A slide shows precision up 6 points. Nobody asks how many flagged eval rows supported
            that read. Policy ships on noise.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Model comparisons.</span>{" "}
            Version B beats version A 71% vs 68% precision. Bands overlap by 15 points. The team
            rewrites infrastructure anyway.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Rare events.</span>{" "}
            Fraud or safety classes are 1–3% of traffic. Total eval rows look healthy while positive
            counts stay in the twenties. Recall and precision both look stable week to week but swing
            wildly.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: ship or label more?
          </h2>
          <p>
            Before moving a fraud model to auto-block, ask how many flagged eval rows supported the
            precision readout. If the band spans 50%–85%, label another few hundred flagged cases or
            run a shadow period. Threshold and calibration posts assume you can measure the metric.
            This post checks whether you have enough labels to do that.
          </p>
          <BusinessCaseExplorer slug="eval-sample-size-real-decisions" />

          <p>
            The habit: every model metric slide shows n_effective next to the point estimate. Compare
            model versions only when bands barely overlap. Labeling budget is part of the launch plan,
            not a footnote after the fact.
          </p>
        </div>

        <RelatedPosts slug="eval-sample-size-real-decisions" />
      </article>
    </main>
  );
}
