import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import ConceptDriftExplorer from "@/components/ConceptDriftExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("concept-drift-real-decisions");

export default function ConceptDriftPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Last Quarter&apos;s Model, This Quarter&apos;s Data: Concept Drift
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Training accuracy high while live accuracy drops after distribution shift"
              className="h-auto w-full object-contain"
              height={500}
              src="/concept_drift.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Fraud launches a new payment scam. Product changes onboarding. Support tickets spike on
            a feature nobody trained on. The model still shows 94% accuracy on last quarter&apos;s
            holdout — but live false positives climb and ops keeps overturning automated decisions.
          </p>
          <p className="rounded-lg border border-black bg-black px-4 py-4 text-base font-bold leading-relaxed text-white">
            Remember it in one line: the world moved; the scoreboard stayed on old data.
          </p>
          <p>
            Concept drift is when the relationship between inputs and outcomes shifts in production.
            It is different from overfitting (memorizing past noise) and different from miscalibration
            (scores lying at a fixed point in time). Drift is the model getting stale while metrics
            on frozen training data still look fine.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Concept drift answers: Is live behavior still the same population the model learned?
          </p>

          <ConceptDriftExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="P(Y | X, today) ≠ P(Y | X, training period)"
            label="The shift"
          >
            <p>
              The inputs X may look similar — same columns, same dashboard — but the mapping to
              outcomes Y changed. New fraud patterns, new user cohorts, new product flows all break
              the old mapping without changing training accuracy on history.
            </p>
          </MathBlock>
          <MathBlock
            formula="monitor live accuracy, false-positive rate, and score distributions"
            label="What to watch"
          >
            <p>
              Track the same metrics on fresh labeled data weekly or monthly. A rising gap between
              train and live performance, or a shifting score histogram, is drift before revenue
              or trust damage shows up in executive reviews.
            </p>
          </MathBlock>
          <MathBlock
            formula="response: retrain, retune thresholds, or pause automation"
            label="Decision playbook"
          >
            <p>
              Mild drift may need threshold tweaks. Severe drift needs retraining on recent data or
              rolling back auto-decisions until the model catches up. Pair with calibration checks
              so new scores mean what they say after retrain.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: fraud model review
          </h2>
          <p>
            Risk reviews training accuracy monthly — still 93%. Live review overturn rate doubled
            since a wallet feature launch. Score distributions shifted toward low-risk bins for new
            scam types the model never saw. The team schedules retraining on last 90 days and pauses
            auto-block until live calibration is replotted.
          </p>
          <BusinessCaseExplorer slug="concept-drift-real-decisions" />

          <p>
            The habit: treat training metrics as history, live metrics as truth. Monitor drift on
            the same cadence as seasonality and benchmark reviews — especially after launches, policy
            changes, or new attack patterns.
          </p>
        </div>

        <RelatedPosts slug="concept-drift-real-decisions" />
      </article>
    </main>
  );
}
