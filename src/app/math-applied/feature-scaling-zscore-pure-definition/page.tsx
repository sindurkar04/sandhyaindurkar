import FeatureScalingZscoreExplorer from "@/components/FeatureScalingZscoreExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Feature Scaling: Why Dollars Crush Session Counts Without Z-Scores",
  description:
    "Z-scores and min-max scaling put features on comparable ranges so L2 distance and k-NN do not follow the loudest column.",
  path: "/math-applied/feature-scaling-zscore-pure-definition",
  image: "/feature_scaling_zscore.svg",
});

export default function FeatureScalingZscorePage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Feature Scaling: Why Dollars Crush Session Counts Without Z-Scores
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Raw feature space versus z-scored space for distance"
              className="h-auto w-full object-contain"
              height={500}
              src="/feature_scaling_zscore.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Machine learning rows are vectors. When one feature is revenue in dollars and another is
            session count, Euclidean distance mostly measures the dollar gap. The smaller feature barely
            votes. That breaks k-NN, clustering, and any model that compares rows by distance.
          </p>
          <p>
            Feature scaling fixes the unit mismatch. Z-scores center each column at its mean and divide
            by standard deviation so a one-unit move means one standard deviation in that feature.
            Min-max scaling squeezes values into a fixed range like 0 to 1 when you need bounded inputs.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Scale before distance: otherwise the largest-magnitude feature decides who is nearest.
          </p>

          <FeatureScalingZscoreExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="z = (x - mu) / sigma" label="Z-score">
            <p>
              Subtract the column mean mu, divide by standard deviation sigma. After z-scoring, each
              feature has mean 0 and standard deviation 1 on the training sample.
            </p>
          </MathBlock>
          <MathBlock formula="x_scaled = (x - min) / (max - min)" label="Min-max scaling">
            <p>
              Maps the observed range to 0 through 1. Useful when you need bounded inputs or interpretable
              0/1 anchors. Sensitive to outliers that stretch min or max.
            </p>
          </MathBlock>
          <MathBlock formula="d2(a, b) = sqrt(sum (ai - bi)^2)" label="Why distance breaks">
            <p>
              L2 distance adds squared gaps across features. A $500 gap dominates a 5-session gap unless
              you scale first. Z-scores make each coordinate contribute in standard-deviation units.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Before you ship a similarity search or k-NN classifier, list your features and their units.
            If magnitudes differ by orders of magnitude, z-score or min-max on the training set, then apply
            the same transform at scoring time.
          </p>
          <p>
            Pair this with the norms-and-distance and k-NN posts: scaling is the step that makes those
            formulas fair across columns.
          </p>
        </div>

        <RelatedPosts slug="feature-scaling-zscore-pure-definition" />
      </article>
    </main>
  );
}
