import DataTable from "@/components/DataTable";
import PrimeFactorizationExplorer from "@/components/PrimeFactorizationExplorer";
import {
  SCENARIOS,
  buildBatchComparisonRows,
  formatFactorizationPlain,
} from "@/lib/prime-factorization-data";
import Image from "next/image";

const cleanColumns = [
  { key: "batchSize" as const, header: "Batch size", align: "right" as const },
  { key: "batches" as const, header: "Jobs needed", align: "right" as const },
  { key: "leftover" as const, header: "Leftover", align: "left" as const },
  { key: "read" as const, header: "Ops read", align: "left" as const },
];

const messyColumns = cleanColumns;

const pipeline = SCENARIOS.data_pipeline;
const cleanRows = buildBatchComparisonRows(pipeline.total, pipeline.goodBatches, "clean");
const messyRows = buildBatchComparisonRows(pipeline.total, pipeline.badBatches, "messy");

export default function PrimeFactorizationPostPage() {
  const factorization = formatFactorizationPlain(10_000);

  return (
    <main className="mx-auto w-full max-w-[720px] space-y-7 px-4 py-10 sm:px-6">
      <article className="space-y-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          Math, Applied
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
          Prime Factorization Isn&apos;t Just Math -- It&apos;s How You Break Down Real Problems
        </h1>
        <div className="overflow-hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
          <div className="mx-auto max-w-[360px]">
            <Image
              alt="Prime factorization: structure and clean batch splits"
              className="h-auto w-full object-contain"
              height={500}
              src="/prime_factorization.svg"
              width={800}
            />
          </div>
        </div>

        <div className="space-y-5 text-[17px] leading-8 text-[color:var(--muted)]">
          <h2 className="text-xl font-bold text-[color:var(--foreground)]">The idea</h2>
          <p>
            Prime factorization is usually taught as a mechanical exercise. You take a number and
            break it into its smallest building blocks.
          </p>
          <p>For example:</p>
          <p className="font-bold text-[color:var(--foreground)]">10,000 = {factorization}</p>
          <p>Most of us stop there. We have &quot;solved&quot; the problem.</p>
          <p>
            But this way of thinking misses the point. Prime factorization is not just about
            simplifying numbers. It is about understanding the structure behind them.
          </p>

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">Why structure matters</h2>
          <p>
            When you look at 10,000 as a single number, it is hard to work with. When you look at
            it as {factorization}, patterns start to appear.
          </p>
          <p>
            You can immediately see that the number is highly divisible. It can be split into clean,
            even parts without awkward remainders. That structure gives you flexibility.
          </p>
          <p>
            This matters because most real world problems are not about numbers. They are about how
            efficiently you can divide and organize work.
          </p>

          <PrimeFactorizationExplorer />

          <h2 className="text-xl font-bold text-[color:var(--foreground)]">
            A simple application: batching
          </h2>
          <p>
            Imagine you are processing 10,000 records in a data pipeline. If you do not think about
            structure, you might choose arbitrary batch sizes like 300, 700, or 1,200. That often
            leaves a partial batch at the end, uneven worker load, and extra scheduling overhead.
          </p>
          <p>
            Factorization tells you that clean sizes exist: 100, 200, 250, and 500 all divide 10,000
            with nothing left over. Those are not random picks. They come from how the number is
            built.
          </p>

          <DataTable
            caption="Table 1: Clean batch sizes for 10,000 records"
            columns={cleanColumns}
            rows={cleanRows.map((row) => ({
              batchSize: row.batchSize,
              batches: row.batches,
              leftover: row.leftover,
              read: row.read,
            }))}
          />

          <DataTable
            caption="Table 2: Common messy picks (partial tail batch)"
            columns={messyColumns}
            rows={messyRows.map((row) => ({
              batchSize: row.batchSize,
              batches: row.batches,
              leftover: row.leftover,
              read: row.read,
            }))}
          />

          <p>
            Prime factorization is a way of asking what something is made of. Once you understand
            that, decisions become more straightforward. You can choose better ways to divide work,
            design systems, and avoid unnecessary complexity.
          </p>
          <p>
            This idea applies beyond data pipelines. It shows up in resource allocation,
            scheduling, system design, and even financial planning. When you understand structure
            early, you avoid fixing problems later.
          </p>

          <p>
            Most problems feel complex because we try to handle them as a whole. Once you understand
            what they are made of, the decisions around them become much simpler. Prime factorization
            reveals structure early, so you can design cleaner and more efficient solutions instead
            of fixing issues later.
          </p>
        </div>
      </article>
    </main>
  );
}
