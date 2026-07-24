import MaximumLikelihoodExplorer from "@/components/MaximumLikelihoodExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Maximum Likelihood: Pick the Parameter That Best Explains the Data",
  description:
    "MLE chooses the parameter value that makes the observed data most probable. Maximizing log-likelihood is the principle behind fitting most models.",
  path: "/math-applied/maximum-likelihood-estimation-pure-definition",
  image: "/maximum_likelihood.svg",
});

export default function MaximumLikelihoodPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Maximum Likelihood: Pick the Parameter That Best Explains the Data
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="A likelihood curve peaking at the maximum likelihood estimate"
              className="h-auto w-full object-contain"
              height={500}
              src="/maximum_likelihood.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            You saw 7 heads in 10 flips. What is the coin&apos;s bias? Maximum likelihood turns the
            question around: instead of asking how likely the data is under one fixed p, it sweeps
            every possible p and picks the one that makes what you actually observed most probable.
            For the coin, that answer is simply 7/10 — but the same principle fits regressions,
            classifiers, and distributions.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            MLE answers: of all the parameter values I could pick, which one makes the data I saw the
            least surprising?
          </p>

          <MaximumLikelihoodExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="L(θ) = ∏ P(dataᵢ | θ)" label="Likelihood">
            <p>
              The likelihood is the probability of the whole dataset as a function of the parameter θ.
              For independent observations it is the product of each point&apos;s probability.
            </p>
          </MathBlock>
          <MathBlock formula="θ̂ = argmax_θ  Σ log P(dataᵢ | θ)" label="Log-likelihood">
            <p>
              Maximizing the log turns the product into a sum, which is easier to optimize and
              numerically stable. The maximizer θ̂ is the maximum-likelihood estimate.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Maximizing likelihood is the same as minimizing a{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/classification-loss-functions-pure-definition">
              loss function
            </a>
            : negative log-likelihood for a Bernoulli model <em>is</em> cross-entropy, which is why{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/logistic-regression-classification-pure-definition">
              logistic regression
            </a>{" "}
            is fit this way. In practice you climb to the peak with{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/gradient-descent-optimizers-pure-definition">
              gradient descent
            </a>
            , and the log-odds show up because of{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/logarithms-odds-pure-definition">
              logarithms and odds
            </a>
            .
          </p>
        </div>

        <RelatedPosts slug="maximum-likelihood-estimation-pure-definition" />
      </article>
    </main>
  );
}
