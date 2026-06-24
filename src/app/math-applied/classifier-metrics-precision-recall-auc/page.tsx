import ClassifierMetricsExplorer from "@/components/ClassifierMetricsExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("classifier-metrics-precision-recall-auc");

export default function ClassifierMetricsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Classifier Metrics: Precision, Recall, Accuracy, and AUC in Plain Language
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto flex max-w-[360px] min-h-[200px] items-center justify-center">
            <img
              alt="Confusion matrix cells beside an ROC curve"
              className="h-auto w-full object-contain"
              height={500}
              src="/classifier_metrics.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A classifier outputs a score. Policy turns that score into an action: block, flag, advance,
            or ignore. Before you argue about the cutoff, you need a shared vocabulary for what the
            model got right and wrong. Every metric you will see in a model card or eval slide comes
            from one four-cell table.
          </p>
          <p className="rounded-lg border border-black bg-black px-4 py-4 text-base font-bold leading-relaxed text-white">
            Remember it in one line: precision is about the flagged pile; recall is about the missed
            pile; accuracy mixes both classes and lies easily when positives are rare.
          </p>
          <p>
            This post is the reference layer. The sensitivity and specificity post builds the 2×2
            table from screening. The threshold tradeoffs post adds review capacity and dollar cost.
            The eval sample size post asks whether your precision read is tight enough to ship. Start
            here when a stakeholder says &quot;the model is 94% accurate&quot; and nobody has drawn the
            confusion matrix yet.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Classifier metrics answer: Given our mistakes, which number should we optimize and which
            errors can the business afford?
          </p>

          <ClassifierMetricsExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            The four cells: TP, FP, FN, TN
          </h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">True positive (TP):</span>{" "}
            Model flagged positive, and the case was truly positive. A fraud score that caught real
            fraud. A resume screen that advanced a strong candidate.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">False positive (FP):</span>{" "}
            Model flagged positive, but the case was negative. The clean order sent to review. The
            weak candidate invited to interview. False positives consume reviewer time, customer
            goodwill, and downstream capacity.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">False negative (FN):</span>{" "}
            Model said negative, but the case was positive. Fraud that shipped. A policy violation
            that stayed live. A strong hire that never got surfaced. False negatives are often silent
            until someone audits losses.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">True negative (TN):</span>{" "}
            Model said negative, and the case was negative. Most rows in imbalanced problems land
            here. TN dominates accuracy, which is why accuracy alone misleads leadership.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="accuracy = (TP + TN) ÷ (TP + TN + FP + FN)" label="Accuracy">
            <p>
              Overall fraction correct. Useful when classes are balanced and mistakes are symmetric.
              Misleading when negatives dominate: predicting &quot;no fraud&quot; on every row can still
              score 98% on a 2% fraud rate.
            </p>
          </MathBlock>
          <MathBlock formula="precision = TP ÷ (TP + FP)" label="Precision (PPV)">
            <p>
              Of everything you flagged positive, how many were real? High precision means the review
              queue is mostly signal. Also called positive predictive value (PPV).
            </p>
          </MathBlock>
          <MathBlock formula="recall = TP ÷ (TP + FN)" label="Recall (sensitivity, TPR)">
            <p>
              Of all true positives in the population, how many did you catch? High recall means fewer
              misses. Same as sensitivity and true positive rate (TPR).
            </p>
          </MathBlock>
          <MathBlock formula="specificity = TN ÷ (TN + FP)" label="Specificity (TNR)">
            <p>
              Of all true negatives, how many cleared the bar? High specificity means fewer false
              flags. Complements recall: you can tune one up and often push the other down.
            </p>
          </MathBlock>
          <MathBlock formula="F1 = 2 × precision × recall ÷ (precision + recall)" label="F1 score">
            <p>
              Harmonic mean of precision and recall. Useful when you need one number and both mistake
              types matter. Punishes lopsided models: 99% precision with 5% recall still scores poorly.
            </p>
          </MathBlock>
          <MathBlock formula="NPV = TN ÷ (TN + FN)" label="Negative predictive value">
            <p>
              Of everything cleared as negative, how many were truly negative? Matters when a false
              clear is dangerous, for example releasing a flagged account too early.
            </p>
          </MathBlock>
          <MathBlock formula="FPR = FP ÷ (FP + TN)" label="False positive rate">
            <p>
              Fraction of real negatives that get flagged. The x-axis on an ROC curve. Lower FPR at a
              fixed recall means fewer clean cases in the queue.
            </p>
          </MathBlock>
          <MathBlock formula="balanced accuracy = (recall + specificity) ÷ 2" label="Balanced accuracy">
            <p>
              Averages performance on both classes. Better than raw accuracy when prevalence is skewed,
              but still ignores business cost asymmetry between FP and FN.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            When accuracy looks great and still misleads
          </h2>
          <p>
            Fraud at 2% prevalence: a model that never flags anything is 98% accurate. Leadership sees
            a green dashboard. Losses climb. The fix is not a better slide template. Plot precision and
            recall, report prevalence, and show the four counts.
          </p>
          <p>
            Hiring at 12% pass rate: accuracy hides whether you are wasting interviews (FP) or missing
            talent (FN). Ask which error shows up in ops metrics first.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Precision vs recall: what the business should optimize
          </h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Optimize precision when false
            alarms are expensive.</span> Auto-block with no appeal. Customer-facing denial. Interview
            slots that cost manager hours. Contractor queues that quit when most flags are clean
            content. Raising the threshold usually helps precision but drops recall.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Optimize recall when misses are
            expensive.</span> Chargebacks and policy violations. Safety incidents. Spam drowning real
            mail. Screening for a rare disease where a miss is catastrophic. Lowering the threshold
            usually helps recall but floods the queue with FP.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">You rarely get both at once.</span>{" "}
            Moving the threshold trades one error type for the other. AUC and PR curves summarize how
            good the ranker is before you pick the operating point. Dollar costs and review capacity
            pick the final cutoff.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            ROC, AUC, and precision-recall curves
          </h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">ROC curve:</span> plots true
            positive rate (recall) against false positive rate as you sweep the threshold. A model
            that ranks positives above negatives bows toward the top-left. The diagonal is random
            guessing.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">AUC (area under ROC):</span>{" "}
            one number for ranker quality across all thresholds. 0.5 is coin flip; 0.85+ is strong on
            many business problems. AUC does not tell you which threshold to ship. It answers whether
            the scores are worth tuning at all.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Precision-recall curve:</span>{" "}
            more informative when positives are rare. A model can have decent AUC while precision
            collapses at the recall level ops needs. Report both curves in model reviews for fraud,
            safety, and medical-style screens.
          </p>
          <MathBlock formula="AUC ≈ integral of TPR d(FPR) across thresholds" label="ROC AUC">
            <p>
              Higher AUC means you can achieve more recall at the same false-positive rate. Compare
              model versions on AUC before debating a single production threshold.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Where teams get stuck
          </h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">The accuracy slide.</span>{" "}
            Eval deck leads with 96% accuracy on imbalanced data. Nobody shows TP, FP, FN, TN. Policy
            ships on the wrong metric.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Precision without prevalence.</span>{" "}
            &quot;70% precision&quot; sounds fine until you learn only 40 rows were flagged in eval.
            Pair with eval sample size before you auto-block.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Recall without capacity.</span>{" "}
            Safety lowers threshold after one incident. Recall rises, precision falls, contractors
            burn out, and real violations still slip through at volume.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">AUC as a deployment metric.</span>{" "}
            Two models with the same AUC can behave very differently at the threshold your ops team
            actually uses. Always mark the operating point on the curves.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: fraud auto-block review
          </h2>
          <p>
            Fraud ops has a model with 0.88 AUC. Leadership wants to auto-block at 0.85 score.
            Precision at that cutoff is 62%: four in ten blocked orders are clean. Recall is 71%:
            nearly a third of fraud still ships. The right question is not &quot;is 0.88 AUC good?&quot;
            but &quot;what is the dollar cost of FP overturns vs FN chargebacks, and how many cases can
            humans review per day?&quot;
          </p>
          <p>
            The habit: draw the confusion matrix, report precision and recall at the proposed
            threshold, plot ROC and PR with the operating point marked, and state prevalence. Compare
            models on AUC; ship policy on costs and capacity. If the metric band is still wide, label
            more rows before you change production.
          </p>
        </div>

        <RelatedPosts slug="classifier-metrics-precision-recall-auc" />
      </article>
    </main>
  );
}
