import LogarithmsOddsExplorer from "@/components/LogarithmsOddsExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Logarithms and Odds: Why Log-Odds Show Up in Logistic Models",
  description:
    "Map probability to odds and log-odds. See why logistic regression is linear in log-odds and links to the sigmoid inverse.",
  path: "/math-applied/logarithms-odds-pure-definition",
  image: "/logarithms_odds.svg",
});

export default function LogarithmsOddsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Logarithms and Odds: Why Log-Odds Show Up in Logistic Models
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Probability mapped to odds and log-odds"
              className="h-auto w-full object-contain"
              height={500}
              src="/logarithms_odds.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Probability p lives between 0 and 1, but models want an open real line. Odds p / (1 - p)
            stretch as p nears 1. The logarithm of odds (log-odds, or logit) turns multiplicative
            shifts into additive ones. That is why a linear score z = w · x maps cleanly to a
            probability through the sigmoid.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Log-odds answer: How do we keep probabilities bounded while staying linear in features?
          </p>

          <LogarithmsOddsExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="log_b(x) = ln(x) / ln(b)" label="Logarithm and change of base">
            <p>
              Natural log (ln) is the default in ML. Change-of-base rewrites the same number in any
              log scale. Only the units change, not the relationships.
            </p>
          </MathBlock>
          <MathBlock formula="odds = p / (1 - p)" label="Odds">
            <p>
              p = 0.5 gives odds 1 (even). p = 0.8 gives odds 4 (four wins per loss). Odds blow up
              as p approaches 1.
            </p>
          </MathBlock>
          <MathBlock formula="logit(p) = log(odds) = log(p / (1 - p))" label="Log-odds">
            <p>
              logit maps (0, 1) to all real numbers. Adding w to log-odds multiplies odds by e^w.
              Features combine by addition on the log scale.
            </p>
          </MathBlock>
          <MathBlock formula="p = 1 / (1 + e^(-z)) ⟺ z = logit(p)" label="Sigmoid inverse">
            <p>
              Logistic regression sets z = w₀ + w₁x₁ + … and reads p from the sigmoid. z is the
              log-odds; the sigmoid is its inverse. See the{" "}
              <a
                className="font-bold text-[color:var(--foreground)] underline"
                href="/math-applied/logistic-regression-classification-pure-definition"
              >
                logistic regression
              </a>{" "}
              post for the full classification picture.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            A churn score starts at 20% (odds 0.25, log-odds -1.39). A usage feature with weight
            0.7 multiplies odds by e^0.7 ≈ 2.0 and adds 0.7 to log-odds. Reading coefficients as
            odds multipliers is often clearer than reading raw probability bumps.
          </p>
        </div>

        <RelatedPosts slug="logarithms-odds-pure-definition" />
      </article>
    </main>
  );
}
