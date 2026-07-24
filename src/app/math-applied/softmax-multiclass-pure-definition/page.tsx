import SoftmaxExplorer from "@/components/SoftmaxExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Softmax: Turning Scores Into a Probability Distribution",
  description:
    "Softmax exponentiates raw class scores and normalizes them to positive numbers that sum to one — the multiclass extension of the sigmoid.",
  path: "/math-applied/softmax-multiclass-pure-definition",
  image: "/softmax.svg",
});

export default function SoftmaxPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Softmax: Turning Scores Into a Probability Distribution
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Raw class scores converted by softmax into probabilities that sum to one"
              className="h-auto w-full object-contain"
              height={500}
              src="/softmax.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            A model scores three intents, or five product categories, or a thousand tokens, and
            spits out raw numbers called logits. Those are not probabilities — they can be negative
            and do not add up to anything. Softmax fixes both problems: it exponentiates each score
            so everything is positive, then divides by the total so the outputs form a clean
            probability distribution.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Softmax answers: how do I turn a vector of raw class scores into probabilities that are
            positive and sum to 100%?
          </p>

          <SoftmaxExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="softmax(z)ᵢ = e^(zᵢ) / Σⱼ e^(zⱼ)" label="Definition">
            <p>
              Each output depends on every score, not just its own — raise one logit and the others&apos;
              shares fall. Because it uses differences, adding a constant to all logits changes
              nothing.
            </p>
          </MathBlock>
          <MathBlock formula="softmax(z / T)   — T is temperature" label="Temperature">
            <p>
              Dividing logits by T &gt; 1 flattens the distribution (more hedged); T &lt; 1 sharpens it
              toward the top class. With two classes, softmax reduces exactly to the sigmoid.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Softmax is the output layer of nearly every multiclass classifier and language model. It
            generalizes the sigmoid from{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/logistic-regression-classification-pure-definition">
              logistic regression
            </a>{" "}
            to many classes, and it pairs with{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/classification-loss-functions-pure-definition">
              cross-entropy loss
            </a>{" "}
            during training. Whether those probabilities are trustworthy is a separate question of{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/model-calibration-real-decisions">
              calibration
            </a>
            .
          </p>
        </div>

        <RelatedPosts slug="softmax-multiclass-pure-definition" />
      </article>
    </main>
  );
}
