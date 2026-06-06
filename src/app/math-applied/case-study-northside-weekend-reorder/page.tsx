import DataTable from "@/components/DataTable";
import MathBlock from "@/components/MathBlock";
import NorthsideStockoutCaseExplorer from "@/components/NorthsideStockoutCaseExplorer";
import RelatedPosts from "@/components/RelatedPosts";
import { buildPolicyRows } from "@/lib/northside-stockout-case-data";
import { mathPostMetadata } from "@/lib/math-post-metadata";
import Image from "next/image";

export const metadata = mathPostMetadata("case-study-northside-weekend-reorder");

const policyColumns = [
  { key: "policy" as const, header: "Policy option", align: "left" as const },
  { key: "reorderPoint" as const, header: "Reorder point", align: "right" as const },
  { key: "stockoutRisk" as const, header: "Stockout risk", align: "right" as const },
  { key: "serviceLevel" as const, header: "Service level", align: "right" as const },
  { key: "safetyStock" as const, header: "Safety stock", align: "right" as const },
  { key: "recommendation" as const, header: "Read", align: "left" as const },
];

export default function NorthsideCaseStudyPage() {
  const policyRows = buildPolicyRows();

  return (
    <main className="mx-auto w-full max-w-[1100px] space-y-5 px-2 py-7 sm:px-3">
      <article className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Case study
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Company X: The Weekend Reorder Decision
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-[color:var(--muted)]">
          A long-form walkthrough of one inventory call before a city festival at a multi-location
          retailer: three teams, one hero SKU, and a reorder point that looked fine until marketing
          turned on paid traffic.
        </p>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Inventory level and reorder point before a festival weekend"
              className="h-auto w-full object-contain"
              height={500}
              src="/case_study_northside_stockout.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-lg leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The company</h2>
          <p>
            Company X runs twelve retail locations in one metro area. Most revenue comes from drinks,
            but the hero product is a house espresso blend sold by the bag for home brewing. It is
            high margin, high visibility, and the SKU marketing promotes during events.
          </p>
          <p>
            Inventory is centralized: one warehouse feeds all stores. When the warehouse runs low,
            stores post &ldquo;sold out&rdquo; signs within days. Last year, during a spring street
            festival, the blend stocked out on Saturday afternoon. Paid social was still running.
            Conversion collapsed, store managers got angry, and finance still had to pay for ads that
            pointed at empty shelves.
          </p>
          <p>
            This year the festival is back. The general manager asked for a single number before
            Monday&apos;s planning meeting:{" "}
            <span className="font-bold text-[color:var(--foreground)]">
              what reorder point protects the weekend without trapping cash in the warehouse?
            </span>
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Monday morning: three views</h2>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Operations</span> wanted to
            keep the current reorder point at 900 bags. Normal weeks had been fine. Their argument:
            we already carry more than a week of average demand; raising the number freezes working
            capital.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Finance</span> pushed the
            opposite. Cash was tight after a equipment upgrade. They proposed lowering the reorder
            point to 780 bags to rotate inventory faster. Their spreadsheet showed lower carrying
            cost per month.
          </p>
          <p>
            <span className="font-bold text-[color:var(--foreground)]">Marketing</span> had booked
            festival ads expecting a 35 to 40 percent traffic bump on the blend landing page. They
            asked for 1,200 bags at reorder, citing last year&apos;s stockout. &ldquo;We are not
            running ads into a sold-out page again.&rdquo;
          </p>
          <p>
            Everyone had a reasonable story. Nobody had written down{" "}
            <span className="font-bold text-[color:var(--foreground)]">
              the probability of stocking out during supplier lead time
            </span>{" "}
            under each policy.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The numbers on hand</h2>
          <p>
            The analyst pulled twelve weeks of outbound data for the blend. Non-festival weeks
            averaged about 118 bags per day across the chain. Festival-adjacent weeks ran closer to
            145. For planning, the team used 132 bags per day as a central estimate with higher
            volatility than usual: standard deviation about 34 bags per day, reflecting weekend spikes
            and uneven store sell-through.
          </p>
          <p>
            The roaster-supplier quote was clear:{" "}
            <span className="font-bold text-[color:var(--foreground)]">seven calendar days</span> from
            PO to dock, assuming no transport delay. That lead time is the window where stock has to
            cover uncertain demand once the reorder fires.
          </p>
          <div className="rounded-lg border border-[color:var(--border)] bg-[#fafafa] px-4 py-4 text-base leading-relaxed">
            <p className="font-bold text-[color:var(--foreground)]">Plain-language lead time</p>
            <p className="mt-2">
              Lead time is not how long until the truck arrives on a good day. It is how long you
              must survive on warehouse stock after you hit the reorder button. During those seven
              days, demand can swing above or below average. The reorder point is your buffer against
              that swing.
            </p>
          </div>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            Work the case: test each policy
          </h2>
          <p>
            Before debating personalities, the team modeled four policies on the table. Use the
            explorer below the way they did in the meeting: pick a preset or drag the slider, and read
            stockout probability and service level side by side.
          </p>

          <NorthsideStockoutCaseExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Policy comparison table</h2>
          <p>
            The table summarizes the four proposals. Stockout risk is the probability that demand
            during the seven-day lead time exceeds the reorder point. Service level is one minus that
            risk: the share of reorder cycles where you expect to cover demand through the window.
          </p>

          <DataTable caption="Table 1: Company X policy options before the festival" columns={policyColumns} rows={policyRows} />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">What the math was saying</h2>
          <p>
            Mean demand over seven days is roughly 924 bags (132 × 7). A reorder point of 900 sits
            slightly below that mean. On a typical week you might scrape by. On a volatile festival
            week, sitting below the mean is a deliberate bet that variance will stay kind — a bet
            last year already lost once.
          </p>
          <MathBlock
            formula="mean lead-time demand = daily mean × lead time days"
            label="Central estimate"
          >
            <p>
              For Company X: 132 × 7 ≈ 924 bags expected before the next shipment lands, before any
              safety buffer.
            </p>
          </MathBlock>
          <MathBlock
            formula="stockout probability = P(demand during lead time > reorder point)"
            label="Risk definition"
          >
            <p>
              Higher reorder points push stockout probability down. Lower points free cash but expose
              you to empty shelves when daily demand lands in the upper tail.
            </p>
          </MathBlock>
          <MathBlock formula="service level ≈ 1 − stockout probability" label="Operational readout">
            <p>
              Marketing cared about service level on the hero SKU because ads and email were already
              committed. Finance cared about the cash tied up in bags sitting in the warehouse.
            </p>
          </MathBlock>
          <p>
            The full formula write-up lives in the{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/stockout-probability-real-decisions">
              stockout probability post
            </a>
            . This case study is the narrative layer on top: names, stakes, and a meeting where the
            number had to be defensible.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The hidden cost of stocking out</h2>
          <p>
            Finance&apos;s spreadsheet only counted warehouse carrying cost. It did not count{" "}
            <span className="font-bold text-[color:var(--foreground)]">lost margin on the blend</span>{" "}
            when stores stock out during paid traffic, or the support tickets when customers arrive
            after seeing an ad. A rough margin of $9.50 per bag makes even a small expected shortfall
            expensive during a promo week.
          </p>
          <p>
            That is where expected value thinking helps without over-modeling: compare the cost of
            holding extra bags for seven days against the expected loss from stocking out. You do not
            need a perfect model. You need both sides of the trade on the same slide.
          </p>
          <p>
            See{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/expected-value-real-decisions">
              expected value for comparing bets
            </a>{" "}
            and{" "}
            <a className="font-bold text-[color:var(--foreground)] underline" href="/math-applied/reading-distributions-percentiles-quartiles">
              percentiles for reading demand tails
            </a>{" "}
            if you want the foundations behind these reads.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">What they decided</h2>
          <p>
            The GM rejected the finance cut (780 bags): stockout risk landed near one in four, too
            high for a promoted SKU. Status quo (900) was still double-digit risk once festival
            variance was in the model — better than 780, but not good enough for a repeat of last
            year.
          </p>
          <p>
            They set reorder at{" "}
            <span className="font-bold text-[color:var(--foreground)]">1,200 bags</span> for the
            three weeks around the festival, then revert to 950 for normal weeks after post-mortem
            data came in. That put stockout risk under ten percent for the promo window while keeping
            a written plan to unwind extra safety stock once ads turned off.
          </p>
          <p>
            Marketing got protection for the campaign. Finance got a time-bound policy, not a permanent
            step-up in average inventory. Ops got a number they could put on the PO instead of
            &ldquo;we will watch it daily.&rdquo;
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">What they watched the next week</h2>
          <p>
            Daily sell-through by store (not chain average alone). Two slow locations can hide a hot store
            burning through allocation. They also tracked landing-page conversion on the blend SKU so
            marketing could pause spend within hours if inventory signals slipped, instead of after
            weekend reviews.
          </p>
          <p>
            After the festival, actual demand during lead time was compared to forecast. That feedback
            loop updates the mean and standard deviation for the next event — the parameters in the
            explorer are not permanent truth.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Habits worth keeping</h2>
          <p>
            Put reorder points in planning docs with{" "}
            <span className="font-bold text-[color:var(--foreground)]">explicit stockout probability</span>
            , not only bag counts. Separate festival policies from baseline policies with start and
            end dates. Pair inventory calls with whoever is spending to drive demand — ops and
            marketing should see the same risk read.
          </p>
          <p>
            Case studies like this are not about finding the one correct reorder point for every
            business. They are about making the trade visible before the truck is late and the ads
            are already live.
          </p>
        </div>

        <RelatedPosts slug="case-study-northside-weekend-reorder" />
      </article>
    </main>
  );
}
