import MathBlock from "@/components/MathBlock";
import ProbabilityBasicsExplorer from "@/components/ProbabilityBasicsExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("probability-basics-events-independence");

export default function ProbabilityBasicsPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math foundations
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Probability Basics: Events, Joint Probability, and Independence
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Two events and joint probability"
              className="h-auto w-full object-contain"
              height={500}
              src="/probability_basics.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Probability starts with events: single outcomes or groups of outcomes you care about.
            Before win rates, base rates, or screening tests, you need a clean vocabulary for how
            events combine and when one event changes the odds of another.
          </p>
          <p>
            Joint probability answers how often two events both happen. Independence means learning
            that one event happened does not change the probability of the other. That distinction
            is easy to skip, and it is one of the most common sources of overconfident forecasts.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Independence check: P(A and B) = P(A) x P(B). If that fails, do not multiply.
          </p>

          <ProbabilityBasicsExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Building blocks</h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Sample space.</span>{" "}
            The full list of possible outcomes. Two coin flips give four outcomes: HH, HT, TH, TT.
            Each single outcome in a fair setup has probability 1/4.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Event A.</span>{" "}
            A subset you label, such as heads on coin 1. You add probabilities of outcomes that
            belong to A.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Complement.</span>{" "}
            Not A covers every outcome where A did not happen. If P(A) = 0.3, then P(not A) = 0.7.
            The two must sum to 1 when A is either true or false.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Joint event.</span>{" "}
            A and B means both happen. On the Venn diagram, that is the overlap. On the coin grid,
            it is the cells where both conditions are true.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="0 ≤ P(A) ≤ 1" label="Event probability">
            <p>Probabilities are never negative and never above 100%.</p>
          </MathBlock>
          <MathBlock formula="P(not A) = 1 − P(A)" label="Complement">
            <p>
              If 30% of days are rainy, 70% are not. Complements are useful when you know one side
              of a yes/no split more reliably.
            </p>
          </MathBlock>
          <MathBlock formula="P(A and B) = P(A) × P(B) when independent" label="Independence">
            <p>
              Multiply only when events do not affect each other. Two fair coin flips qualify.
              Drawing cards without replacement does not.
            </p>
          </MathBlock>
          <MathBlock formula="P(A or B) = P(A) + P(B) − P(A and B)" label="Union (either event)">
            <p>
              When events can overlap, subtract the joint region once so you do not double count.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            When independence breaks
          </h2>
          <p>
            Without replacement, the deck changes after the first draw. Rain and traffic move
            together on many commutes. A user who already converted is no longer in the not-yet-converted
            pool. In each case, P(B) after seeing A is not the same as P(B) before.
          </p>
          <p>
            Treating dependent events as independent makes joint probability look too small or too
            large. That error shows up in security screening, funnel math, and any model that
            multiplies step-by-step conversion rates without checking overlap.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application
          </h2>
          <p>
            This is the language behind base rates, false alarms, and many A/B test assumptions.
            When events are dependent, multiplying probabilities overstates or understates confidence.
            The applied posts on probability, base rates, and false alarms build directly on these
            rules with business numbers.
          </p>
        </div>

        <RelatedPosts slug="probability-basics-events-independence" />
      </article>
    </main>
  );
}
