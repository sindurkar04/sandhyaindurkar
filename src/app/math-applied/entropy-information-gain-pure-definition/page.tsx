import EntropyInformationGainExplorer from "@/components/EntropyInformationGainExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Entropy and Information Gain: How a Split Reduces Uncertainty",
  description:
    "Entropy measures the uncertainty in a label mix; information gain is how much a split lowers it. The score decision trees use to choose features.",
  path: "/math-applied/entropy-information-gain-pure-definition",
  image: "/entropy_information_gain.svg",
});

export default function EntropyInformationGainPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Entropy and Information Gain: How a Split Reduces Uncertainty
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="The binary entropy curve peaking at a fifty-fifty class mix"
              className="h-auto w-full object-contain"
              height={500}
              src="/entropy_information_gain.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A pile of rows that is 50% fraud and 50% legit is maximally uncertain — a coin flip. A
            pile that is 99% legit is nearly settled. Entropy puts a number (in bits) on that
            uncertainty. Information gain measures how much a yes/no split shrinks it, and that is
            exactly how a decision tree decides which question to ask first.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Entropy answers: how uncertain is this label mix? Information gain answers: how much did
            this split clean it up?
          </p>

          <EntropyInformationGainExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="H(S) = − Σ pᵢ · log₂(pᵢ)" label="Entropy (bits)">
            <p>
              Sum over each class probability pᵢ. For two classes, entropy peaks at 1 bit when the
              split is 50/50 and falls to 0 when the node is pure. Rare classes contribute little.
            </p>
          </MathBlock>
          <MathBlock formula="Gain = H(parent) − Σ (n_child / n) · H(child)" label="Information gain">
            <p>
              Subtract the size-weighted entropy of the children from the parent&apos;s entropy. A
              tree evaluates this for every candidate feature and greedily picks the highest gain.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Information gain is the splitting criterion behind{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/decision-trees-classification-real-decisions">
              decision trees
            </a>{" "}
            (Gini impurity is a close cousin). The same entropy term is the{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/classification-loss-functions-pure-definition">
              cross-entropy loss
            </a>{" "}
            classifiers minimize, and it connects to{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/maximum-likelihood-estimation-pure-definition">
              maximum likelihood
            </a>
            : minimizing cross-entropy is maximizing the likelihood of the labels.
          </p>
        </div>

        <RelatedPosts slug="entropy-information-gain-pure-definition" />
      </article>
    </main>
  );
}
