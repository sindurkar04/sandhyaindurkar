import DecisionTreesClassificationExplorer from "@/components/DecisionTreesClassificationExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("decision-trees-classification-real-decisions");

export default function DecisionTreesClassificationPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">Math, Applied</p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Decision Trees: Readable Rules for Classification
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto flex max-w-[360px] min-h-[200px] items-center justify-center">
            <img alt="Decision tree axis splits on a scatter plot" className="h-auto w-full object-contain" height={500} src="/decision_trees_classification.svg" width={800} />
          </div>
        </div>
        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A decision tree asks a sequence of if-then questions on individual features. Each internal
            node is a split; each leaf is a class label. Ops and compliance teams can read the policy.
            The tradeoff is depth: shallow trees generalize; deep trees memorize training noise.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Decision trees answer: Can we classify with explicit rules instead of a weighted score?
          </p>
          <DecisionTreesClassificationExplorer />
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            A tree recursively partitions feature space into boxes. Each split picks one feature and one
            threshold to make child nodes purer. Leaves output the majority class in that box.
          </p>
          <MathBlock formula="xⱼ ≤ t → left child · xⱼ &gt; t → right child" label="Axis-aligned split">
            <p>
              Only one feature j is tested at each node. Splits are vertical or horizontal lines in 2D.
              Rules read as if-then chains: if amount &gt; 500 and velocity &gt; 3, then review.
            </p>
          </MathBlock>
          <MathBlock formula="Gini = 1 − Σₖ pₖ²" label="Gini impurity">
            <p>
              pₖ is the fraction of class k in a node. Pure node (one class only) has Gini = 0. Split
              candidates are scored by how much weighted Gini drops in the children.
            </p>
          </MathBlock>
          <MathBlock formula="H = −Σₖ pₖ log pₖ" label="Entropy">
            <p>
              Alternative impurity measure. Also zero when a node is pure. Algorithms often default to
              Gini or entropy; results are usually similar on business tabular data.
            </p>
          </MathBlock>
          <MathBlock formula="leaf label = argmaxₖ countₖ" label="Leaf prediction">
            <p>
              Majority vote among training rows that reach the leaf. Regression trees average numeric
              targets instead.
            </p>
          </MathBlock>
          <MathBlock formula="depth d allows up to 2ᵈ leaves (full tree)" label="Depth and capacity">
            <p>
              Deeper trees fit more jagged regions. Shallow trees are smoother policies. The explorer
              shows how each depth adds splits and lifts training accuracy.
            </p>
          </MathBlock>
          <MathBlock formula="stop when min samples · max depth · min gain" label="Stopping rules">
            <p>
              Prune growth when a node has too few rows, gain is tiny, or depth hits a cap. Stopping
              early is the main defense against memorizing noise.
            </p>
          </MathBlock>
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Where teams get stuck</h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Training accuracy 99%, holdout 70%.</span>{" "}
            Tree memorized quirks. Cap depth, require minimum leaf size, or use random forests for variance
            reduction.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Unstable rules week to week.</span>{" "}
            Small data changes flip early splits. Ensemble many trees or prefer logistic scores when stability
            matters more than readability.
          </p>
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Fraud and hiring teams often prototype with trees before shipping logistic scores. Compliance
            can read the if-then path. Pair with the overfitting post when depth grows: training accuracy
            rises while holdout stalls. Pair with logistic regression when you need a smooth score and
            calibrated probability.
          </p>
        </div>
        <RelatedPosts slug="decision-trees-classification-real-decisions" />
      </article>
    </main>
  );
}
