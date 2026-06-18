import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import RidgeRegularizationExplorer from "@/components/RidgeRegularizationExplorer";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("ridge-regularization-real-decisions");

export default function RidgeRegularizationPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Ridge Regularization: Shrink Unstable Coefficients Without Dropping Features
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Ridge penalty shrinking regression coefficients toward zero"
              className="h-auto w-full object-contain"
              height={500}
              src="/ridge_regularization.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Ordinary least squares can assign huge, opposite-signed coefficients when inputs correlate.
            Ridge adds a penalty on coefficient size. Higher λ pulls betas toward zero, stabilizing
            predictions on collinear features without deleting columns from the model.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Ridge answers: Can I keep all drivers in the model while making coefficient swings less
            violent?
          </p>

          <RidgeRegularizationExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="min ||y − Xβ||² + λ||β||²" label="Ridge objective">
            <p>Fit residuals plus a penalty on squared coefficient size. λ controls shrinkage strength.</p>
          </MathBlock>
          <MathBlock formula="β̂_ridge = (XᵀX + λI)⁻¹ Xᵀy" label="Closed form (ridge)">
            <p>Adding λ to the diagonal of XᵀX dampens ill-conditioned directions from collinearity.</p>
          </MathBlock>
          <MathBlock formula="λ ↑ → |β| ↓" label="Shrinkage">
            <p>As λ grows, coefficients move toward zero. Predictions often stay stable while interpretability as causal credit does not improve.</p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: collinear marketing channels
          </h2>
          <p>
            When ad spend and branded search rise together, OLS coefficients flip week to week. Ridge
            keeps the forecast usable for planning but does not turn correlated inputs into clean
            attribution. Pair with the multicollinearity post before presenting driver slides.
          </p>
          <BusinessCaseExplorer slug="ridge-regularization-real-decisions" />

          <p>
            The habit: try ridge when you must keep correlated features and care about prediction
            stability. Still plot correlation and avoid causal language on individual coefficients.
          </p>
        </div>

        <RelatedPosts slug="ridge-regularization-real-decisions" />
      </article>
    </main>
  );
}
