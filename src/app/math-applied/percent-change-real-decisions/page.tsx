import MathBlock from "@/components/MathBlock";
import PercentChangeExplorer from "@/components/PercentChangeExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";

export default function PercentChangePostPage() {
  return (
    <main className="mx-auto w-full max-w-[768px] space-y-7 px-3 py-10 sm:px-4">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Percent Change Isn&apos;t Intuitive: How Growth Math Distorts Real Decisions
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Percent change recovery visual"
              className="h-auto w-full object-contain"
              height={900}
              src="/percent_change.png"
              width={1600}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Percent change sounds straightforward. Something goes down by a percentage, then goes
            up by a percentage. Many people assume those moves cancel out.
          </p>
          <p>For example, start with $100:</p>
          <p className="font-bold text-[color:var(--foreground)]">
            Drop 50% → $50. Then rise 50% → $75.
          </p>
          <p>
            You are not back to $100. The second change applies to a smaller base, so it adds less
            than the first change removed.
          </p>
          <p>
            Percent change is always relative to the current value. That is why the order and
            direction of changes matter.
          </p>

          <PercentChangeExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <p>
            Percent change is always measured from a starting value. That starting value is the
            denominator, and it changes after every step.
          </p>
          <MathBlock
            formula="percent change = ((new − old) ÷ old) × 100"
            label="One-step percent change"
          >
            <p>
              Drop from $100 to $50: (($50 − $100) ÷ $100) × 100 = −50%. Rise from $50 to $75:
              (($75 − $50) ÷ $50) × 100 = +50%. Same percentage size, different bases, different
              dollar impact.
            </p>
          </MathBlock>
          <MathBlock
            formula="recovery % = ((target − trough) ÷ trough) × 100"
            label="Recovery to a prior level"
          >
            <p>
              To return from 7,000 users to 10,000: ((10,000 − 7,000) ÷ 7,000) × 100 ≈ 43%. The
              drop was 30% of 10,000, but the recovery is 43% of 7,000 because the base changed.
            </p>
          </MathBlock>
          <p>
            The base in the denominator is what drives most surprises. A 10% move on $1,000 is
            $100; on $100 it is $10. Down then up does not undo itself because each step uses a
            different base. Starting near zero inflates percentages: a jump from 2 to 5 is +150%,
            which may be three customers. After a drop, set recovery targets from the trough, not
            the peak, and report absolute values alongside percentages so the audience sees
            whether you actually got back to the goal.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Why intuition fails
          </h2>
          <p>
            We often treat percentages like fixed units. A 10% drop and a 10% rise feel symmetric.
            In math, they are not, unless the rise is calculated from the original starting point,
            which is rarely how real metrics move.
          </p>
          <p>
            After a decline, the base is lower. A recovery percentage only restores part of what
            was lost. The bigger the initial drop, the larger the recovery percentage you need to
            return to the start.
          </p>
          <p>
            This shows up in revenue reports, product metrics, and personal finance. The headline
            can say &quot;we bounced back 50%&quot; while the business is still below where it
            began.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: metric recovery
          </h2>
          <p>
            Imagine monthly active users fall from 10,000 to 7,000. That is a 30% drop. Leadership
            wants growth back and celebrates a 30% increase the next month.
          </p>
          <p>
            A 30% increase from 7,000 is 2,100 users, which brings you to 9,100 — still below
            10,000.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            To return to 10,000 from 7,000, you need about a 43% increase, not 30%.
          </p>
          <p>
            The gap between &quot;recovery percentage&quot; and &quot;back to baseline&quot; is
            where many dashboards and narratives go wrong. Teams set targets using the original
            drop number, then wonder why they miss the goal.
          </p>
          <p>
            The fix is not more optimism. It is calculating recovery from the new base, or stating
            targets in absolute terms when clarity matters.
          </p>

          <p>
            Percent change is a lens, not a complete story. It tells you how much something moved
            relative to where it was, not where you started across multiple steps.
          </p>
          <p>
            When reporting a drop followed by a rebound, show three numbers: the starting value,
            the low point, and the current value. Then the audience can see the real gap without
            doing mental math.
          </p>
          <p>
            When setting goals after a decline, calculate the required recovery from the trough,
            not from the original peak. That single habit prevents a large class of planning
            mistakes in growth, operations, and forecasting.
          </p>

          <p>
            Most percent-change mistakes are not calculation errors. They come from assuming
            symmetry where none exists.
          </p>
          <p>
            Once you treat each percentage as relative to its own base, the numbers become easier
            to interpret and easier to communicate. You stop asking why a 50% recovery did not
            undo a 50% drop — and start designing targets that match reality.
          </p>
        </div>

        <RelatedPosts slug="percent-change-real-decisions" />
      </article>
    </main>
  );
}
