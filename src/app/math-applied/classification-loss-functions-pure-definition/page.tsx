import ClassificationLossExplorer from "@/components/ClassificationLossExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("classification-loss-functions-pure-definition");

export default function ClassificationLossPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">Math foundations</p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Classification Loss: What Optimizers Actually Minimize
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto flex max-w-[360px] min-h-[200px] items-center justify-center">
            <img alt="Cross-entropy hinge and zero-one loss curves" className="h-auto w-full object-contain" height={500} src="/classification_loss_functions.svg" width={800} />
          </div>
        </div>
        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Training does not maximize accuracy directly. Accuracy is flat almost everywhere, so
            gradients are zero and the model cannot learn. Instead we minimize a smooth loss that
            punishes confident mistakes: cross-entropy for probabilistic classifiers, hinge for margins.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Loss functions answer: What numeric penalty should a wrong or uncertain prediction pay during training?
          </p>
          <ClassificationLossExplorer />
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            Training minimizes expected loss over labeled rows. Eval reports accuracy, precision, and
            recall. Those are different jobs: loss must be smooth so weights can move; metrics must match
            what the business cares about at deploy time.
          </p>
          <MathBlock formula="L₀₋₁ = 𝟙[ŷ ≠ y]" label="0-1 loss (misclassification)">
            <p>
              One if wrong, zero if right. Matches accuracy but is flat between steps: a small change in
              weights often changes zero loss. Optimizers need a slope to follow.
            </p>
          </MathBlock>
          <MathBlock formula="L_CE = −[y log p + (1−y) log(1−p)]" label="Binary cross-entropy">
            <p>
              y is 0 or 1, p = predicted P(y=1). Punishes confident mistakes heavily. Standard loss for
              logistic regression and probabilistic classifiers. The explorer shows how it rises as p
              moves away from the true label.
            </p>
          </MathBlock>
          <MathBlock formula="∂L_CE/∂p = −y/p + (1−y)/(1−p)" label="Why cross-entropy trains">
            <p>
              Gradient pushes p toward y. Wrong and confident predictions get a large slope; correct and
              confident predictions flatten out. That is the signal gradient descent uses.
            </p>
          </MathBlock>
          <MathBlock formula="L_hinge = max(0, 1 − y·f(x))" label="Hinge loss (margin)">
            <p>
              y is −1 or +1 in the classic form; f(x) is a score. Zero loss once the margin is wide enough.
              Used in support vector machines. Flat when the model is already confident and correct.
            </p>
          </MathBlock>
          <MathBlock formula="(1/N) Σᵢ L(yᵢ, pᵢ)" label="Empirical risk">
            <p>
              Average loss on the training set. What SGD minimizes in practice. Holdout loss tells you
              whether you are learning signal or memorizing noise.
            </p>
          </MathBlock>
          <MathBlock formula="train on L_CE · report precision/recall at cutoff" label="Train vs eval">
            <p>
              Optimize smooth loss during training. Choose threshold and report business metrics after.
              Never back-propagate accuracy; it has no usable gradient.
            </p>
          </MathBlock>
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Where teams get stuck</h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Training loss down, eval flat.</span>{" "}
            Model fits training noise. Pair with overfitting and eval sample size posts.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Class imbalance ignored.</span>{" "}
            Cross-entropy on 99% negatives still pushes the model toward always predicting zero. Use
            class weights, resampling, or metrics that match the decision (PR curve, not accuracy).
          </p>
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            The fraud model minimizes cross-entropy on six months of labeled chargebacks. Leadership
            cares about precision at 0.85 cutoff. Training loss and deployment metrics are related but
            not the same number. Log both on the model card.
          </p>
        </div>

        <RelatedPosts slug="classification-loss-functions-pure-definition" />
      </article>
    </main>
  );
}
