import MathBlock from "@/components/MathBlock";
import FalseAlarmExplorer from "@/components/FalseAlarmExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("false-alarm-missed-win-real-decisions");

export default function FalseAlarmMissedWinPostPage() {
  return (
    <main className="mx-auto w-full max-w-[768px] space-y-7 px-3 py-10 sm:px-4">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          False Alarm vs Missed Win: Two Ways an Experiment Decision Goes Wrong
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="False alarm vs missed win tradeoff"
              className="h-auto w-full object-contain"
              height={500}
              src="/false_alarm_missed_win.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Every test decision has two mistakes. A false alarm is shipping when there is no real
            lift. A missed win is holding when a real lift was there. You cannot minimize both at
            once with the same bar.
          </p>
          <p>
            Stricter rules reduce false alarms but increase missed wins. Looser rules do the
            opposite. The A/B readout posts cover lift and intervals. This post names the two errors
            in plain language so teams can pick which mistake they can afford.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            The tradeoff answers: Which error is costlier for this launch, a false win or a missed
            win?
          </p>

          <FalseAlarmExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="false alarm rate = P(ship | no real lift)"
            label="False alarm (Type I error)"
          >
            <p>
              You roll out a checkout change that looked positive but was noise. Tighter intervals,
              higher sample size, and a higher minimum lift bar all push this rate down.
            </p>
          </MathBlock>
          <MathBlock
            formula="missed win rate = P(hold | real lift exists)"
            label="Missed win (Type II error)"
          >
            <p>
              You kill a variant that would have helped because the readout was inconclusive. Small
              samples and strict bars make this more likely.
            </p>
          </MathBlock>
          <MathBlock
            formula="stricter bar → lower false alarms, higher missed wins"
            label="The tradeoff"
          >
            <p>
              There is no free lunch. Reversible, low-cost tests can tolerate more false alarms.
              High-stakes launches should tolerate more missed wins until evidence is solid.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: launch policy
          </h2>
          <p>
            Checkout and pricing changes with rollback plans can use a moderate bar: overlap checks
            plus a minimum lift. Fraud rules and billing logic need fewer false alarms even if that
            means waiting longer. Feature launches with high build cost sit in the middle: missed
            wins waste engineering, false alarms waste trust.
          </p>
          <p>
            Write the policy before the test finishes. Name which mistake hurts more, then set
            sample size and ship rules to match. That turns significance talk into a business choice.
          </p>
        </div>

        <RelatedPosts slug="false-alarm-missed-win-real-decisions" />
      </article>
    </main>
  );
}
