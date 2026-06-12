import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import GamblersFallacyExplorer from "@/components/GamblersFallacyExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("gamblers-fallacy-real-decisions");

export default function GamblersFallacyPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          The Gambler&apos;s Fallacy: Streaks Do Not Load the Next Trial
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Coin flip streak does not change next flip odds"
              className="h-auto w-full object-contain"
              height={500}
              src="/gamblers_fallacy.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Five losing trades in a row feels like a win is due. Four red spins on roulette feels
            like black is loaded next. A sales rep misses quota three weeks and leadership expects a
            bounce simply because the streak has gone on long enough.
          </p>
          <p>
            For independent trials with a fixed probability, the next outcome does not compensate
            for the past. The streak was unlikely. The next flip is still the same odds.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Gambler&apos;s fallacy answers: Does this process have memory, or are we imposing a story
            on independent noise?
          </p>

          <GamblersFallacyExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="P(k wins in a row) = p^k" label="Streak probability">
            <p>
              A five-win streak at p = 50% has probability about 3%. Rare, but not evidence that
              the process changed.
            </p>
          </MathBlock>
          <MathBlock formula="P(next win | past streak) = p when independent" label="No memory">
            <p>
              Fair coins, fair dice, and stable conversion rates with enough volume do not owe you a
              reversal after a run of losses.
            </p>
          </MathBlock>
          <MathBlock formula="regression to the mean ≠ gambler's fallacy" label="Do not confuse">
            <p>
              Extreme performers often snap back because luck mixed with skill. That is a different
              post. Gambler&apos;s fallacy is claiming the next independent trial must balance the
              last few.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: quota pressure
          </h2>
          <p>
            Managers sometimes push harder after a slump as if outcomes must rebalance within the
            month. Check whether the underlying win rate changed or the streak is normal variance on
            a small sample. Pair with sample size and regression-to-the-mean posts before you
            reorganize the team.
          </p>
          <BusinessCaseExplorer slug="gamblers-fallacy-real-decisions" />

          <p>
            The habit: when someone says we are due, ask whether trials are independent and whether
            p actually moved. Stories about balance are not probability models.
          </p>
        </div>

        <RelatedPosts slug="gamblers-fallacy-real-decisions" />
      </article>
    </main>
  );
}
