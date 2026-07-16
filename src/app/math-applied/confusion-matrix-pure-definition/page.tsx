import ConfusionMatrixExplorer from "@/components/ConfusionMatrixExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Confusion Matrix: The Four Boxes Behind Every Classifier Score",
  description:
    "TP, FP, FN, TN define precision, recall, and accuracy. Interactive 2x2 grid with live derived metrics.",
  path: "/math-applied/confusion-matrix-pure-definition",
  image: "/confusion_matrix.svg",
});

export default function ConfusionMatrixPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Confusion Matrix: The Four Boxes Behind Every Classifier Score
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Confusion matrix with TP FP FN TN cells"
              className="h-auto w-full object-contain"
              height={500}
              src="/confusion_matrix.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Every classifier prediction lands in one of four boxes. True positives and true negatives
            are correct calls. False positives waste reviewer time or block good customers. False
            negatives are the silent misses you may never see in the alert queue.
          </p>
          <p>
            Precision, recall, and accuracy are just arithmetic on these four counts. Change the
            threshold and the boxes shift. That is why one accuracy number rarely tells the full story
            when classes are imbalanced.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Start with the matrix: every score you report should trace back to TP, FP, FN, and TN.
          </p>

          <ConfusionMatrixExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="TP = predicted + and actually +" label="True positive">
            <p>Correct alarm. The model flagged a row that truly belongs to the positive class.</p>
          </MathBlock>
          <MathBlock formula="FP = predicted + and actually -" label="False positive">
            <p>False alarm. A negative row flagged as positive. Drives reviewer load and customer friction.</p>
          </MathBlock>
          <MathBlock formula="FN = predicted - and actually +" label="False negative">
            <p>Missed case. A positive row scored below threshold. Often the costliest error in fraud or safety.</p>
          </MathBlock>
          <MathBlock formula="TN = predicted - and actually -" label="True negative">
            <p>Correct clearance. Negative row left alone.</p>
          </MathBlock>
          <MathBlock formula="precision = TP / (TP + FP)" label="Precision">
            <p>Of all positive predictions, how many were right? Answers what a flag means in the queue.</p>
          </MathBlock>
          <MathBlock formula="recall = TP / (TP + FN)" label="Recall">
            <p>Of all actual positives, how many did you catch? Same as sensitivity on the positive class.</p>
          </MathBlock>
          <MathBlock formula="accuracy = (TP + TN) / total" label="Accuracy">
            <p>Share of all rows classified correctly. Can look high when negatives dominate the population.</p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            In a model review, print the confusion matrix at the chosen threshold before debating AUC.
            Ask which box hurts most for your product: false alarms in the queue or missed fraud in the
            tail.
          </p>
          <p>
            The classifier-metrics and sensitivity-specificity posts build on these four counts. Master
            the matrix first and the derived scores become bookkeeping.
          </p>
        </div>

        <RelatedPosts slug="confusion-matrix-pure-definition" />
      </article>
    </main>
  );
}
