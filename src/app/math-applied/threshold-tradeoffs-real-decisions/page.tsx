import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import ThresholdTradeoffsExplorer from "@/components/ThresholdTradeoffsExplorer";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("threshold-tradeoffs-real-decisions");

export default function ThresholdTradeoffsPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Where Do You Draw the Line? Threshold Tradeoffs in Real Decisions
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Precision and recall tradeoff with flagged queue breakdown"
              className="h-auto w-full object-contain"
              height={500}
              src="/threshold_tradeoffs.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A classifier outputs a score. Policy turns that score into an action: auto-block, flag for
            review, advance a candidate. The cutoff is where math meets operations. Lower it and you
            catch more true positives — but you also flag more false positives, fill review queues, and
            burn analyst time.
          </p>
          <p className="rounded-lg border border-black bg-black px-4 py-4 text-base font-bold leading-relaxed text-white">
            Remember it in one line: precision and recall move in opposite directions when you move
            the threshold.
          </p>
          <p>
            Calibration asks whether 90% on the score means 90% in reality. Threshold tradeoffs ask:
            given a workable score, where should we act — and what does each mistake cost?
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Threshold choice answers: Which errors can we afford — false alarms, missed cases, or queue
            overflow?
          </p>

          <ThresholdTradeoffsExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="precision = TP ÷ (TP + FP)" label="Precision">
            <p>
              Of everything you flagged, how many were truly positive? High precision means fewer
              clean cases in the review queue. It usually falls when you lower the threshold.
            </p>
          </MathBlock>
          <MathBlock formula="recall = TP ÷ (TP + FN)" label="Recall">
            <p>
              Of all true positives in the population, how many did you catch? High recall means fewer
              misses. It usually rises when you lower the threshold.
            </p>
          </MathBlock>
          <MathBlock
            formula="expected daily cost ≈ FP × cost_false_alarm + FN × cost_miss"
            label="Capacity and cost"
          >
            <p>
              False positives consume review time and customer goodwill. False negatives consume fraud
              loss, policy risk, or missed hires. If flagged volume exceeds reviewer slots, the queue
              backs up regardless of precision on paper.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Where teams get stuck
          </h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Fraud auto-block.</span>{" "}
            Ops raises threshold to cut overturns. Recall drops, chargebacks climb, and nobody plotted
            both curves on one chart.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Content moderation.</span>{" "}
            Safety lowers threshold after one incident. Precision collapses, contractors quit from
            false-flag fatigue, and real violations still slip through at volume.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Hiring screens.</span>{" "}
            Recruiting advances more candidates to hit headcount. Interview load spikes on weak
            matches while strong passive candidates never get scored high enough to surface.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: auto-block policy
          </h2>
          <p>
            Fraud ops debates raising the block threshold from 0.80 to 0.90. Precision improves —
            fewer overturned blocks — but recall falls and more fraud slips through. The right cutoff
            depends on dollar costs and how many cases humans can review per day, not on accuracy
            alone.
          </p>
          <BusinessCaseExplorer slug="threshold-tradeoffs-real-decisions" />

          <p>
            The habit: plot precision and recall across thresholds before you lock policy. Pair with
            calibration so the scores behind the threshold mean what they say. Report flagged volume
            alongside rates — a threshold that looks good on a slide can still drown the team.
          </p>
        </div>

        <RelatedPosts slug="threshold-tradeoffs-real-decisions" />
      </article>
    </main>
  );
}
