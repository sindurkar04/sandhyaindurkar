import LogisticRegressionClassificationExplorer from "@/components/LogisticRegressionClassificationExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("logistic-regression-classification-pure-definition");

export default function LogisticRegressionClassificationPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">Math foundations</p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Logistic Regression: Linear Boundary, Probability Score
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto flex max-w-[360px] min-h-[200px] items-center justify-center">
            <img alt="Logistic regression boundary and sigmoid curve" className="h-auto w-full object-contain" height={500} src="/logistic_regression_classification.svg" width={800} />
          </div>
        </div>
        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Logistic regression extends the line fit you already know into classification. A linear
            combination of features passes through a sigmoid to produce a probability between 0 and 1.
            Fraud models, churn scores, and hiring rankers often start here.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Logistic regression answers: What is the probability this row is positive, and where is the linear decision boundary?
          </p>
          <LogisticRegressionClassificationExplorer />
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            Logistic regression keeps the linear structure of regression but outputs a probability. The
            sigmoid squashes the score; cross-entropy (see the loss post) teaches the weights; gradient
            descent fits them.
          </p>
          <MathBlock formula="z = w₀ + w₁x₁ + w₂x₂ + … + wₙxₙ" label="Linear score (logit input)">
            <p>
              w₀ is the intercept (baseline log-odds). Each wⱼ is how much feature j pushes the score up
              or down, holding other columns fixed. Same form as y = a + bx, but z is not the final prediction.
            </p>
          </MathBlock>
          <MathBlock formula="P(y=1|x) = σ(z) = 1 / (1 + e⁻ᶻ)" label="Sigmoid">
            <p>
              Maps any real z to (0, 1). z = 0 gives P = 0.5. Large positive z approaches 1; large
              negative z approaches 0. This is the number fraud and churn dashboards show before policy
              applies a cutoff.
            </p>
          </MathBlock>
          <MathBlock formula="log(P / (1−P)) = z" label="Log-odds (logit)">
            <p>
              The linear part models log-odds, not probability directly. Adding one unit to a feature
              multiplies odds by e^wⱼ. Coefficients are interpretable on the log scale.
            </p>
          </MathBlock>
          <MathBlock formula="P(y=1|x) = 0.5 ⟺ z = 0" label="Decision boundary">
            <p>
              In two features, z = 0 is a line. In n features, it is a hyperplane. Points on one side
              score above 0.5, the other below. Nonlinear boundaries need feature engineering, trees, or
              other models.
            </p>
          </MathBlock>
          <MathBlock formula="min Σᵢ L(yᵢ, pᵢ) + λ||w||²" label="Training objective">
            <p>
              Fit weights by minimizing classification loss (usually cross-entropy) on labeled rows.
              Optional λ penalty shrinks coefficients, as in ridge, when features correlate.
            </p>
          </MathBlock>
          <MathBlock formula="softmax(zₖ) = e^zₖ / Σⱼ e^zⱼ" label="Multiclass extension">
            <p>
              More than two classes: one score per class, softmax turns scores into probabilities that
              sum to 1. Same linear core, wider output layer.
            </p>
          </MathBlock>
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Where teams get stuck</h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Treating 0.87 as calibrated.</span>{" "}
            A score is a ranking aid until calibration checks pass. See the model calibration post.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Reading coefficients as causal.</span>{" "}
            Correlated inputs share credit. wⱼ is a lever only when features are independent enough to
            interpret.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Linear boundary on nonlinear data.</span>{" "}
            If the explorer boundary misclassifies obvious clusters, add interaction terms, polynomial
            features, or switch family (trees, k-NN).
          </p>
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Fraud ops ships a logistic score from velocity and amount. Policy auto-blocks at 0.85. The
            math post stops at the boundary; the classifier metrics post asks whether 0.85 precision and
            recall are good enough, and threshold tradeoffs adds queue capacity and dollar cost.
          </p>
        </div>

        <RelatedPosts slug="logistic-regression-classification-pure-definition" />
      </article>
    </main>
  );
}
