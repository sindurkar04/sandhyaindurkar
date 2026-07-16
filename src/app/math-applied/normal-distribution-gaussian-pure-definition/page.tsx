import MathBlock from "@/components/MathBlock";
import NormalDistributionExplorer from "@/components/NormalDistributionExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "The Normal Distribution: Bell Curves, Mean, and Standard Deviations",
  description:
    "Gaussian pdf, empirical 68-95-99.7 rule, z-score link, and when normal approximation helps in applied work.",
  path: "/math-applied/normal-distribution-gaussian-pure-definition",
  image: "/normal_distribution.svg",
});

export default function NormalDistributionPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          The Normal Distribution: Bell Curves, Mean, and Standard Deviations
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Normal distribution bell curve with sigma bands"
              className="h-auto w-full object-contain"
              height={500}
              src="/normal_distribution.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Many operational metrics cluster around a center with symmetric tails: delivery times, order
            values, measurement error. The normal distribution models that shape with two parameters:
            mean mu and standard deviation sigma.
          </p>
          <p>
            The empirical rule gives fast mental math: about 68% of mass within one sigma, 95% within
            two, 99.7% within three. Z-scores count how many standard deviations a value sits from the
            mean, linking this curve to feature scaling and outlier checks.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Normal is a working model, not a law of nature. Check fit before you trust tail probabilities.
          </p>

          <NormalDistributionExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="f(x) = (1 / (sigma sqrt(2 pi))) exp(-(x - mu)^2 / (2 sigma^2))"
            label="Probability density function"
          >
            <p>
              Bell-shaped density centered at mu. Sigma stretches or tightens the curve. Total area under
              the curve equals 1.
            </p>
          </MathBlock>
          <MathBlock formula="68% within mu +/- sigma, 95% within +/- 2 sigma, 99.7% within +/- 3 sigma" label="Empirical rule">
            <p>
              Quick coverage bands for roughly normal data. Useful for SLA bands and anomaly thresholds
              when you have not plotted the full distribution yet.
            </p>
          </MathBlock>
          <MathBlock formula="z = (x - mu) / sigma" label="Z-score link">
            <p>
              Standardizes any normal variable to mean 0, sigma 1. Connects this post to feature scaling
              and to asking how extreme one observation is.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            When you set an alert at mu + 3 sigma, you are assuming normality and targeting roughly 0.15%
            tail mass on the high side. Plot the histogram first. Heavy tails or skew mean the normal
            approximation will miss real outliers or over-flag routine noise.
          </p>
          <p>
            Use the normal model for quick capacity planning and error budgets. Pair with variance-spread
            and percentile posts when the data is not symmetric.
          </p>
        </div>

        <RelatedPosts slug="normal-distribution-gaussian-pure-definition" />
      </article>
    </main>
  );
}
