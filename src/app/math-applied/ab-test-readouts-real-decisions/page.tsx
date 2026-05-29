import AbTestReadoutsExplorer from "@/components/AbTestReadoutsExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";

export default function AbTestReadoutsPostPage() {
  return (
    <main className="mx-auto w-full max-w-[768px] space-y-7 px-3 py-10 sm:px-4">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          A/B Test Readouts: Significance Without Jargon
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="A/B test intervals and ship decision"
              className="h-auto w-full object-contain"
              height={500}
              src="/ab_test_readouts.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Experiment readouts often hide behind words like significant or not significant. You do
            not need that vocabulary to decide. You need three things: observed lift, how many users
            were in each arm, and whether the uncertainty bands overlap.
          </p>
          <p>
            If variant beats control by 0.7 points but the 95% intervals still overlap, the result
            is compatible with no real difference. If bands separate and lift clears your minimum
            bar, you have a stronger case to ship.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            A good readout answers: Is the lift big enough for us, and is the sample large enough
            that we are not fooling ourselves?
          </p>

          <AbTestReadoutsExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="lift = variant rate − control rate" label="Observed lift">
            <p>
              3.9% variant vs 3.2% control is +0.7 percentage points. That is the headline move.
              Decision quality depends on whether that move is real or within sampling noise.
            </p>
          </MathBlock>
          <MathBlock
            formula="95% interval around each arm (Wilson or normal approx.)"
            label="Uncertainty per arm"
          >
            <p>
              Each rate gets a band. Overlap means both stories could still be true at once: variant
              ahead by luck, or truly tied. No overlap means the arms are separated at your chosen
              confidence level.
            </p>
          </MathBlock>
          <MathBlock
            formula="ship when lift ≥ minimum bar AND intervals do not overlap"
            label="When to ship (practical rule)"
          >
            <p>
              Set a minimum lift that covers engineering cost, risk, or revenue goal. Then check
              separation. A tiny win with huge samples might be statistically separated but not worth
              the rollout tax.
            </p>
          </MathBlock>
          <p>
            Sample size shrinks the bands. Pre-set minimum detectable lift before you launch so you
            know when to stop. If bands overlap, extend the test or accept a directional read only.
            This connects directly to the sample size and confidence interval posts: same machinery,
            decision-first framing.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">A simple application: experiment readouts</h2>
          <p>
            Product and growth teams paste lift, n per arm, and interval overlap into readout docs
            instead of a lone p-value. Ops sets reversible rollouts when separation is thin. Leadership
            asks for the minimum lift bar up front so debates happen before data arrives, not after.
          </p>
          <p>
            When you report overlap clearly, the next step is obvious: ship, wait for more traffic,
            or slice the result before trusting the aggregate. That last step matters when segment
            mix can flip the story.
          </p>
        </div>

        <RelatedPosts slug="ab-test-readouts-real-decisions" />
      </article>
    </main>
  );
}
