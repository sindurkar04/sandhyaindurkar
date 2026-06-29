import GradientDescentExplorer from "@/components/GradientDescentExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("gradient-descent-optimizers-pure-definition");

export default function GradientDescentPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">Math foundations</p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Gradient Descent: How Classifiers Learn Their Weights
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto flex max-w-[360px] min-h-[200px] items-center justify-center">
            <img alt="Gradient descent path on a loss curve" className="h-auto w-full object-contain" height={500} src="/gradient_descent_optimizers.svg" width={800} />
          </div>
        </div>
        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Logistic regression, neural nets, and many other models start with random weights and
            repeatedly step downhill on a loss surface. The gradient points uphill; we move opposite
            it. Learning rate controls step size. Mini-batches and Adam are production refinements on
            the same idea.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Gradient descent answers: How do we find weights that lower loss when we cannot solve in one formula?
          </p>
          <GradientDescentExplorer />
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            Think of loss as height on a landscape. Weights are your position. The gradient points uphill;
            each update steps downhill. Learning rate is stride length; too long and you overshoot the valley.
          </p>
          <MathBlock formula="wₜ₊₁ = wₜ − η · ∇L(wₜ)" label="Gradient descent update">
            <p>
              η (eta) is learning rate. wₜ are current weights. ∇L is the vector of partial derivatives
              of loss with respect to each weight. Repeat until loss stops improving or a step budget ends.
            </p>
          </MathBlock>
          <MathBlock formula="∂L/∂wⱼ = limit of (L(w+εeⱼ) − L(w)) / ε" label="Partial derivative">
            <p>
              How fast loss changes when only wⱼ moves. The full gradient collects one partial derivative
              per weight. Frameworks compute this with backpropagation on large graphs.
            </p>
          </MathBlock>
          <MathBlock formula="wₜ₊₁ = wₜ − η · (1/B) Σᵢ∈batch ∇Lᵢ(wₜ)" label="Mini-batch SGD">
            <p>
              B is batch size. Each step uses a random subset of rows instead of the full table. Noisier
              path, much faster on big data. B = 1 is pure SGD; B = N is full-batch gradient descent.
            </p>
          </MathBlock>
          <MathBlock formula="η too large → oscillate · η too small → slow" label="Learning rate">
            <p>
              The explorer shows overshoot when η is high. Production training often decays η over time or
              uses adaptive methods (Adam, RMSprop) that tune step size per parameter.
            </p>
          </MathBlock>
          <MathBlock formula="mₜ = βmₜ₋₁ + (1−β)∇L · wₜ₊₁ = wₜ − η mₜ" label="Momentum (optional)">
            <p>
              Smooths zig-zags by accumulating past gradients. Helps on ravines and speeds convergence
              when the loss surface is ill-conditioned.
            </p>
          </MathBlock>
          <MathBlock formula="stop when holdout loss rises" label="Early stopping">
            <p>
              Training loss can keep falling while holdout loss climbs. Stop when validation loss worsens
              to limit overfitting. Pairs with the overfitting post.
            </p>
          </MathBlock>
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Where teams get stuck</h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Loss not decreasing at all.</span>{" "}
            Learning rate too high (divergence) or too low (crawl). Features unscaled so gradients are tiny
            on one column and huge on another.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Training loss perfect, deploy weak.</span>{" "}
            Memorized training rows. Check holdout metrics and regularization before adding model complexity.
          </p>
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Fitting logistic regression on 2M rows uses mini-batch SGD, not one matrix solve. Ops sees
            training loss curves in MLflow; product sees precision after thresholding. Gradient descent is
            the bridge between the loss post and a shipped score.
          </p>
        </div>

        <RelatedPosts slug="gradient-descent-optimizers-pure-definition" />
      </article>
    </main>
  );
}
