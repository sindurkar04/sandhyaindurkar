import KNearestNeighborsExplorer from "@/components/KNearestNeighborsExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("k-nearest-neighbors-classification-pure-definition");

export default function KNearestNeighborsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">Math foundations</p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          k-Nearest Neighbors: Classify by the Closest Labeled Examples
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto flex max-w-[360px] min-h-[200px] items-center justify-center">
            <img alt="k-NN neighbors voting on a query point" className="h-auto w-full object-contain" height={500} src="/k_nearest_neighbors.svg" width={800} />
          </div>
        </div>
        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            k-NN has no training phase in the usual sense. The model is your labeled history. For a new
            row, find the k closest points in feature space and let them vote. Fraud looks like past
            fraud; support tickets route like similar resolved tickets.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            k-NN answers: What label do the nearest examples carry, and how many neighbors should vote?
          </p>
          <KNearestNeighborsExplorer />
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            k-NN is geometry plus a vote. You define how close is close (distance), how many neighbors
            get a say (k), and how ties break. Everything else is lookup on labeled history.
          </p>
          <MathBlock formula="d₂(x, xᵢ) = √(Σⱼ (xⱼ − xᵢⱼ)²)" label="Euclidean distance (L2)">
            <p>
              Default in tabular ML when features are on comparable scales. Sensitive to unit choice:
              dollars and session counts must be normalized first or distance is dominated by one column.
            </p>
          </MathBlock>
          <MathBlock formula="d₁(x, xᵢ) = Σⱼ |xⱼ − xᵢⱼ|" label="Manhattan distance (L1)">
            <p>
              Sums absolute gaps. Less sensitive to one wild coordinate than L2. Useful when outliers
              in a single feature should not dominate the neighbor search.
            </p>
          </MathBlock>
          <MathBlock formula="cos(θ) = (x · xᵢ) / (||x|| × ||xᵢ||)" label="Cosine similarity">
            <p>
              Ignores vector length; measures direction. Common for text embeddings and catalog search
              when document size varies. k-NN on cosine often uses distance = 1 − cosine.
            </p>
          </MathBlock>
          <MathBlock formula="ŷ = mode{ yᵢ : i ∈ k nearest neighbors }" label="Classification vote">
            <p>
              Each of the k closest training rows casts one ballot. Majority label wins. Ties go to the
              nearer neighbor or to a business default (for example route to human review).
            </p>
          </MathBlock>
          <MathBlock formula="ŷ = (1/k) Σ yᵢ over neighbors" label="Regression average">
            <p>
              For numeric targets (forecast amount, handle time), k-NN averages neighbor values instead
              of voting. Same distance logic, different aggregation.
            </p>
          </MathBlock>
          <MathBlock formula="error grows with dimension when data stay sparse" label="Curse of dimensionality">
            <p>
              In high dimensions, most points are far from each other. Neighbors stop being local and
              votes become noisy. Feature selection, PCA, or a parametric model often follow k-NN prototypes.
            </p>
          </MathBlock>
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Where teams get stuck</h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Unscaled features.</span>{" "}
            Transaction amount in dollars outweighs every other column. Neighbors match on money, not behavior.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">k too small or too large.</span>{" "}
            k = 1 chases noise. k = 50 washes out local structure. Plot accuracy or precision on a holdout
            grid of k before you ship.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Latency at scoring time.</span>{" "}
            Every prediction scans the training set. Fine for thousands of rows; expensive for millions
            without an index (ball tree, approximate nearest neighbor).
          </p>
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Where business uses it</h2>
          <p>Fraud similarity, catalog deduplication, content recommendations, and cold-start routing when you have labels but no time to train a parametric model. Weak when dimension is high, data is huge, or you need a compact score at millisecond latency.</p>
          <p>
            The habit: scale features, try a small grid of k on holdout data, and state which distance
            metric ranked neighbors. Pair with the norms and distance post for L1 vs L2, and classifier
            metrics for eval once labels exist.
          </p>
        </div>
        <RelatedPosts slug="k-nearest-neighbors-classification-pure-definition" />
      </article>
    </main>
  );
}
