import MathBlock from "@/components/MathBlock";
import PcaIntuitionExplorer from "@/components/PcaIntuitionExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("pca-intuition-real-decisions");

export default function PcaIntuitionPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          PCA Intuition: One Axis for a Wall of Correlated KPIs
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Principal components as new axes through correlated data"
              className="h-auto w-full object-contain"
              height={500}
              src="/pca_intuition.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Dashboards often track ten metrics that move together: revenue, orders, active users.
            Principal Component Analysis rotates the axes to find directions of maximum variance. The
            first component (PC1) is the single score that captures most of the joint movement.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            PCA answers: Can we summarize correlated metrics with fewer composite scores without
            losing the main signal?
          </p>

          <PcaIntuitionExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="PC1 = direction of maximum variance" label="First component">
            <p>A weighted mix of standardized metrics. Weights load highest on metrics that co-move.</p>
          </MathBlock>
          <MathBlock formula="variance explained = share captured by each PC" label="Scree readout">
            <p>
              If PC1 explains 70% of variance, one composite chart may replace four redundant KPI
              lines for executive review.
            </p>
          </MathBlock>
          <MathBlock formula="standardize features before PCA" label="Scale matters">
            <p>
              Dollars and counts on different scales will dominate unless you normalize. Same rule as
              vectors and dot product posts.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Use PCA for exploration and compression, not as a causal model. PC1 is a summary axis,
            not a lever you can pull. When metrics are independent, PCA adds little. When they are
            redundant, it declutters the narrative.
          </p>
        </div>

        <RelatedPosts slug="pca-intuition-real-decisions" />
      </article>
    </main>
  );
}
