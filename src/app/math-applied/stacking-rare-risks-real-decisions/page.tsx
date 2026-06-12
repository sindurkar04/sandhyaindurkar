import BusinessCaseExplorer from "@/components/BusinessCaseExplorer";
import MathBlock from "@/components/MathBlock";
import RelatedPosts from "@/components/RelatedPosts";
import StackingRareRisksExplorer from "@/components/StackingRareRisksExplorer";
import Image from "next/image";
import { mathPostMetadata } from "@/lib/math-post-metadata";

export const metadata = mathPostMetadata("stacking-rare-risks-real-decisions");

export default function StackingRareRisksPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Stacking Rare Risks: Alert Fatigue From Many Small False Positives
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Many checks stacked with combined false alert risk"
              className="h-auto w-full object-contain"
              height={500}
              src="/stacking_rare_risks.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Fraud teams add rules. SRE teams monitor many services. Trust and safety stack
            classifiers on the same content. Each layer might false-alarm on only half a percent of
            clean cases. Stacked together, clean traffic starts looking suspicious.
          </p>
          <p>
            This is the same complement math as at-least-one failure, applied to parallel checks on
            one unit instead of repeated trials over time. The system-level false alert rate is what
            reviewers and customers experience.
          </p>
          <p className="font-bold text-[color:var(--foreground)]">
            Stacking rare risks answers: If each check is rarely wrong alone, how often does any
            check fire on a clean case?
          </p>

          <StackingRareRisksExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The math</h2>
          <MathBlock formula="P(any false alert) = 1 − (1 − f)^k" label="k independent checks">
            <p>
              f is false-positive rate per check. k is how many checks run on the same case. Twenty
              rules at 0.5% each give roughly 9.5% system false alert rate on clean orders.
            </p>
          </MathBlock>
          <MathBlock formula="expected false alerts = volume × P(any false alert)" label="Queue load">
            <p>
              Convert system rate to expected daily false alerts before you add another rule or
              model to the stack.
            </p>
          </MathBlock>
          <MathBlock formula="correlated checks → formula overstates independence" label="Caution">
            <p>
              Rules that fire together break the independence assumption. The formula is a planning
              upper bound when checks are mostly separate signals.
            </p>
          </MathBlock>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: rule sprawl
          </h2>
          <p>
            Before shipping rule twenty-one, estimate how many clean cases already trigger any prior
            rule. Consolidate, raise per-rule specificity, or route through one calibrated scorer
            instead of stacking noisy gates.
          </p>
          <BusinessCaseExplorer slug="stacking-rare-risks-real-decisions" />

          <p>
            The habit: every new check lists its standalone false-positive rate and the projected
            system rate after stacking. Alert fatigue is a probability problem, not only a tooling
            problem.
          </p>
        </div>

        <RelatedPosts slug="stacking-rare-risks-real-decisions" />
      </article>
    </main>
  );
}
