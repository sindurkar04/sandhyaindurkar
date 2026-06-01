import MathBlock from "@/components/MathBlock";
import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import StatisticalPowerExplorer from "@/components/StatisticalPowerExplorer";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("statistical-power-real-decisions");

export default function StatisticalPowerPostPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          We Ran the Test: Could We Even See a Win? Statistical Power
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Statistical power gauge for an experiment"
              className="h-auto w-full object-contain"
              height={500}
              src="/statistical_power.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Sample size tells you how much data you collected. Statistical power tells you something
            different: if the variant is actually better by the amount you care about, how often
            will this test detect it?
          </p>
          <p className="rounded-lg border border-black bg-black px-4 py-4 text-base font-bold leading-relaxed text-white">
            Remember it in one line: an underpowered test is a coin flip that looks like science.
          </p>
          <p>
            Teams launch tests with five thousand visitors, see flat results, and kill a good idea.
            Or they see a tiny bump and ship noise. Power connects baseline rate, minimum detectable
            lift, and sample size before you start.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Power answers: If the effect is real, will this experiment notice?
          </p>

          <StatisticalPowerExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock
            formula="power = P(detect lift | lift is real)"
            label="Definition"
          >
            <p>
              High power means a true improvement is likely to show up as a significant readout.
              Low power means you often conclude &ldquo;no difference&rdquo; even when the variant
              works.
            </p>
          </MathBlock>
          <MathBlock
            formula="power ↑ when sample size ↑ or minimum detectable effect ↓"
            label="Levers"
          >
            <p>
              More traffic per arm helps. So does accepting that you can only detect larger lifts.
              Trying to spot a 0.5 point move on a 5% baseline needs far more data than a 3 point
              move on 20%.
            </p>
          </MathBlock>
          <MathBlock
            formula="underpowered test → missed wins (Type II errors)"
            label="Business cost"
          >
            <p>
              False alarm posts cover shipping noise. Power covers killing winners because the test
              was too thin to see them.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: experiment planning
          </h2>
          <p>
            Product wants to detect a 1.5 point lift on 8% checkout conversion. At 3,000 users per
            arm, power sits near 35%. They extend two weeks, reach 12,000 per arm, power crosses 80%.
            The readout is still flat, but now &ldquo;no winner&rdquo; is a real conclusion, not a
            sample size excuse.
          </p>
          <BusinessCaseExplorer slug="statistical-power-real-decisions" />

          <p>
            The habit: state baseline, MDE, and target power before launch. Sample size posts cover
            noise; power covers detectability of the lift you actually care about.
          </p>
        </div>

        <RelatedPosts slug="statistical-power-real-decisions" />
      </article>
    </main>
  );
}
