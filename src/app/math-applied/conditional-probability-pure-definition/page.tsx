import ConditionalProbabilityExplorer from "@/components/ConditionalProbabilityExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("conditional-probability-pure-definition");

export default function ConditionalProbabilityPurePage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Conditional Probability: Given That B Happened
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="P(A given B) versus P(B given A)"
              className="h-auto w-full object-contain"
              height={500}
              src="/conditional_probability.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Unconditional probability asks how common A is in the full population. Conditional
            probability asks how common A is among cases where B already happened. That restriction
            changes the denominator.
          </p>
          <p>
            Screening is the classic trap: a positive test is not the same event as having the
            condition. P(disease | positive test) and P(positive test | disease) use the same joint
            counts but answer different questions.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Conditional probability answers: Among cases where B is true, how often is A true?
          </p>

          <ConditionalProbabilityExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="P(A | B) = P(A and B) ÷ P(B)" label="Definition">
            <p>
              Restrict to outcomes where B happened. What share of that slice also has A? If P(B) is
              zero, the conditional is undefined.
            </p>
          </MathBlock>
          <MathBlock formula="P(A and B) = P(A | B) × P(B)" label="Chain form">
            <p>
              Joint probability factors into a conditional times the probability of the condition.
              This is the bridge to dependent chains and Bayes updates.
            </p>
          </MathBlock>
          <MathBlock formula="P(A | B) ≠ P(B | A) in general" label="Do not swap">
            <p>
              High test accuracy on sick patients does not automatically mean a positive test implies
              a high chance of disease. Base rate and false positives still matter.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application</h2>
          <p>
            Before you staff a review queue from model alerts, ask what a flag means in your
            population. The conditional read is what reviewers experience, not the model&apos;s recall on
            known positives alone.
          </p>
          <p>
            The habit: name the given event out loud. &ldquo;Given this alert fired&rdquo; is a different
            sample than &ldquo;given this order is fraud.&rdquo; The applied posts on base rates, screening,
            and threshold tradeoffs build on this definition.
          </p>
        </div>

        <RelatedPosts slug="conditional-probability-pure-definition" />
      </article>
    </main>
  );
}
