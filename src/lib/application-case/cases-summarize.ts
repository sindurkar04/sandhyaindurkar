import { pctChange } from "./chart-utils";
import type { ApplicationCaseConfig, ApplicationCaseState } from "./types";

function n(state: ApplicationCaseState, id: string, fallback: number) {
  return state[id] ?? fallback;
}

export const SUMMARIZE_APPLICATION_CASES: ApplicationCaseConfig[] = [
  {
    slug: "mean-vs-median-real-data",
    title: "Customer spend: mean vs median in a review",
    intro:
      "Move the outlier order size. Watch the mean chase one big customer while the median stays closer to typical spend.",
    sliders: [
      {
        id: "outlier",
        label: "Largest order ($)",
        min: 40,
        max: 250,
        step: 5,
        default: 128,
        lowLabel: "Modest whale",
        highLabel: "Huge outlier",
        format: (v) => `$${v}`,
      },
    ],
    compute: (state) => {
      const base = [12, 18, 20, 22];
      const outlier = n(state, "outlier", 128);
      const values = [...base, outlier];
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const sorted = [...values].sort((a, b) => a - b);
      const median = (sorted[2] + sorted[3]) / 2;
      const gap = mean - median;
      return {
        headline: `Mean $${mean.toFixed(0)} vs median $${median.toFixed(0)} — gap $${gap.toFixed(0)}`,
        readout:
          gap > 15
            ? "Leadership sees mean growth. Most customers did not change. Use median for typical spend; mean for revenue totals."
            : "Mean and median are close. Either works for a quick read, but keep both on the slide.",
        charts: [
          {
            id: "orders",
            title: "Order sizes",
            kind: "bar",
            labels: ["O1", "O2", "O3", "O4", "Outlier"],
            values,
          },
          {
            id: "center",
            title: "Center metrics",
            kind: "bar",
            labels: ["Median", "Mean"],
            values: [median, mean],
            valueFormat: (v) => `$${v.toFixed(0)}`,
          },
        ],
        stats: [
          { label: "Mean spend", value: `$${mean.toFixed(0)}`, emphasis: true },
          { label: "Median spend", value: `$${median.toFixed(0)}` },
          { label: "Gap", value: `$${gap.toFixed(0)}`, note: "Mean − median" },
        ],
        actions: {
          optimize: ["Report median for typical customer decisions", "Use mean when budgeting total revenue"],
          hold: ["Scaling a feature because mean moved when median did not"],
          escalateIf: ["Median and mean diverge for two consecutive reviews"],
        },
      };
    },
  },
  {
    slug: "variance-spread-real-data",
    title: "Delivery performance: same mean, different spread",
    intro:
      "Adjust volatility on Team B. Both teams can share an average while reliability diverges.",
    sliders: [
      {
        id: "volatility",
        label: "Team B swing (minutes)",
        min: 10,
        max: 40,
        step: 2,
        default: 28,
        lowLabel: "Tighter",
        highLabel: "Wild swings",
        format: (v) => `±${v}`,
      },
    ],
    compute: (state) => {
      const swing = n(state, "volatility", 28);
      const teamA = [47, 49, 50, 51, 53];
      const teamB = [50 - swing, 50 - swing / 2, 50, 50 + swing / 2, 50 + swing];
      const mean = 50;
      const std = (vals: number[]) => {
        const m = vals.reduce((a, b) => a + b, 0) / vals.length;
        return Math.sqrt(vals.reduce((s, v) => s + (v - m) ** 2, 0) / vals.length);
      };
      const stdA = std(teamA);
      const stdB = std(teamB);
      return {
        headline: `Both average ${mean} min — Team B std dev ${stdB.toFixed(1)} vs Team A ${stdA.toFixed(1)}`,
        readout:
          stdB > stdA * 1.5
            ? "Same headline average hides operational pain on Team B. Staff and promise SLAs using spread, not mean alone."
            : "Spreads are similar. Mean is a fair comparison for now.",
        charts: [
          { id: "team-a", title: "Team A (predictable)", kind: "line", labels: ["D1", "D2", "D3", "D4", "D5"], values: teamA },
          { id: "team-b", title: "Team B (volatile)", kind: "line", labels: ["D1", "D2", "D3", "D4", "D5"], values: teamB },
        ],
        stats: [
          { label: "Both means", value: "50 min" },
          { label: "Team A std dev", value: `${stdA.toFixed(1)} min` },
          { label: "Team B std dev", value: `${stdB.toFixed(1)} min`, emphasis: true },
        ],
        actions: {
          optimize: ["Track std dev or p90 beside mean in ops reviews", "Reward consistency when customers feel variance"],
          hold: ["Calling teams equal because averages match"],
          escalateIf: ["Team B p90 worsens while mean stays flat"],
        },
      };
    },
  },
  {
    slug: "percentiles-quartiles-real-data",
    title: "API latency: average green, tail red",
    intro: "Drag the slow tail (P90 driver). The mean can stay under target while 10% of users suffer.",
    sliders: [
      {
        id: "p90",
        label: "P90 latency (ms)",
        min: 80,
        max: 220,
        step: 5,
        default: 145,
        lowLabel: "Healthy tail",
        highLabel: "Slow tail",
        format: (v) => `${v} ms`,
      },
    ],
    compute: (state) => {
      const p90 = n(state, "p90", 145);
      const mean = 55 + (p90 - 80) * 0.12;
      const target = 80;
      return {
        headline: `Mean ${mean.toFixed(0)} ms vs P90 ${p90} ms (target ${target} ms)`,
        readout:
          p90 > target * 1.5
            ? "Headline average looks fine. Support tickets come from the slow slice. Alert on P90, not mean."
            : "Tail latency is manageable relative to target.",
        charts: [
          {
            id: "latency",
            title: "Latency snapshot",
            kind: "bar",
            labels: ["Mean", "P50", "P90"],
            values: [mean, mean * 0.95, p90],
            referenceLine: target,
            valueFormat: (v) => `${v.toFixed(0)} ms`,
          },
          {
            id: "gap",
            title: "Gap to target",
            kind: "bar",
            labels: ["Mean gap", "P90 gap"],
            values: [target - mean, target - p90],
            valueFormat: (v) => `${v >= 0 ? "+" : ""}${v.toFixed(0)} ms`,
          },
        ],
        stats: [
          { label: "Mean", value: `${mean.toFixed(0)} ms`, emphasis: mean < target },
          { label: "P90", value: `${p90} ms`, emphasis: true },
          { label: "Target", value: `${target} ms` },
        ],
        actions: {
          optimize: ["Set SLOs on P90/P95 for customer-facing APIs", "Capacity plan for tail, not average"],
          hold: ["Closing the incident because mean is green"],
          escalateIf: ["P90 above target for two release cycles"],
        },
      };
    },
  },
  {
    slug: "weighted-averages-real-data",
    title: "Executive dashboard: unweighted vs weighted KPI",
    intro: "Shift weight toward the largest region. The company rollup can diverge from a simple average of regions.",
    sliders: [
      {
        id: "largeShare",
        label: "Large region share (%)",
        min: 40,
        max: 85,
        step: 5,
        default: 70,
        lowLabel: "Balanced regions",
        highLabel: "One region dominates",
        format: (v) => `${v}%`,
      },
      {
        id: "largeKpi",
        label: "Large region KPI (%)",
        min: 55,
        max: 95,
        step: 1,
        default: 72,
        format: (v) => `${v}%`,
      },
    ],
    compute: (state) => {
      const share = n(state, "largeShare", 70) / 100;
      const large = n(state, "largeKpi", 72);
      const small = 88;
      const unweighted = (large + small) / 2;
      const weighted = large * share + small * (1 - share);
      return {
        headline: `Unweighted ${unweighted.toFixed(1)}% vs weighted ${weighted.toFixed(1)}% company KPI`,
        readout:
          Math.abs(unweighted - weighted) > 5
            ? "Simple average of regions misstates what most customers experience. Lead with weighted company number."
            : "Regions are balanced enough that either rollup is close.",
        charts: [
          {
            id: "regions",
            title: "Region KPIs",
            kind: "bar",
            labels: ["Large", "Small"],
            values: [large, small],
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
          {
            id: "rollup",
            title: "Company rollup",
            kind: "bar",
            labels: ["Unweighted", "Weighted"],
            values: [unweighted, weighted],
            valueFormat: (v) => `${v.toFixed(1)}%`,
          },
        ],
        stats: [
          { label: "Unweighted avg", value: `${unweighted.toFixed(1)}%` },
          { label: "Weighted avg", value: `${weighted.toFixed(1)}%`, emphasis: true },
          { label: "Large region share", value: `${(share * 100).toFixed(0)}%` },
        ],
        actions: {
          optimize: ["Publish weighted company KPI first", "Show segment table second with sizes"],
          hold: ["Bonuses on unweighted regional averages when weights differ"],
          escalateIf: ["Weighted and unweighted diverge after a mix shift"],
        },
      };
    },
  },
  {
    slug: "percent-change-real-decisions",
    title: "Metric recovery: percent back vs back to baseline",
    intro: "Set the drop and the recovery percent. See why matching the drop percent does not restore the baseline.",
    sliders: [
      {
        id: "baseline",
        label: "Original MAU",
        min: 5000,
        max: 20000,
        step: 500,
        default: 10000,
        format: (v) => v.toLocaleString(),
      },
      {
        id: "dropPct",
        label: "Drop (%)",
        min: 10,
        max: 50,
        step: 5,
        default: 30,
        format: (v) => `−${v}%`,
      },
      {
        id: "recoveryPct",
        label: "Recovery from trough (%)",
        min: 10,
        max: 60,
        step: 5,
        default: 30,
        format: (v) => `+${v}%`,
      },
    ],
    compute: (state) => {
      const baseline = n(state, "baseline", 10000);
      const dropPct = n(state, "dropPct", 30);
      const recoveryPct = n(state, "recoveryPct", 30);
      const trough = baseline * (1 - dropPct / 100);
      const afterRecovery = trough * (1 + recoveryPct / 100);
      const neededPct = pctChange(baseline, trough);
      const gap = baseline - afterRecovery;
      return {
        headline: `+${recoveryPct}% recovery leaves you ${gap.toLocaleString()} users short of baseline`,
        readout:
          gap > 0
            ? `You need about +${neededPct.toFixed(0)}% from the trough to fully recover, not +${dropPct}%.`
            : "Recovery percent clears the original baseline.",
        charts: [
          {
            id: "path",
            title: "User path",
            kind: "line",
            labels: ["Baseline", "Trough", "After recovery"],
            values: [baseline, trough, afterRecovery],
          },
          {
            id: "needed",
            title: "Recovery needed vs chosen",
            kind: "bar",
            labels: ["You chose", "To baseline"],
            values: [recoveryPct, neededPct],
            valueFormat: (v) => `+${v.toFixed(0)}%`,
          },
        ],
        stats: [
          { label: "Baseline", value: baseline.toLocaleString() },
          { label: "After recovery", value: Math.round(afterRecovery).toLocaleString(), emphasis: true },
          { label: "Gap to baseline", value: Math.max(0, Math.round(gap)).toLocaleString() },
        ],
        actions: {
          optimize: ["State targets in absolute users when recovering", "Calculate recovery from new base"],
          hold: ["Celebrating symmetric % when bases differ"],
          escalateIf: ["Board target is baseline but plan uses drop % only"],
        },
      };
    },
  },
  {
    slug: "benchmarks-baselines-real-decisions",
    title: "Leadership slide: one number, four baselines",
    intro: "Move conversion and see how the same 11% answers different questions vs last month, plan, and peer.",
    sliders: [
      {
        id: "conversion",
        label: "Conversion (%)",
        min: 6,
        max: 16,
        step: 0.5,
        default: 11,
        format: (v) => `${v}%`,
      },
    ],
    compute: (state) => {
      const conv = n(state, "conversion", 11);
      const lastMonth = 10;
      const plan = 12;
      const peer = 13;
      const lastYear = 9.5;
      return {
        headline: `${conv}% conversion — green vs last month, red vs plan and peer`,
        readout: "Pick the baseline that matches the decision before the room debates the arrow color.",
        charts: [
          {
            id: "baselines",
            title: "Vs baselines (pp diff)",
            kind: "bar",
            labels: ["Last mo", "Last yr", "Plan", "Peer"],
            values: [conv - lastMonth, conv - lastYear, conv - plan, conv - peer],
            valueFormat: (v) => `${v >= 0 ? "+" : ""}${v.toFixed(1)} pp`,
          },
          {
            id: "levels",
            title: "Absolute levels",
            kind: "bar",
            labels: ["You", "Plan", "Peer"],
            values: [conv, plan, peer],
            valueFormat: (v) => `${v}%`,
          },
        ],
        stats: [
          { label: "Conversion", value: `${conv}%`, emphasis: true },
          { label: "Vs plan", value: `${(conv - plan).toFixed(1)} pp` },
          { label: "Vs peer", value: `${(conv - peer).toFixed(1)} pp` },
        ],
        actions: {
          optimize: ["One headline metric + small baseline table on every leadership slide"],
          hold: ["Debating MoM alone for seasonal businesses"],
          escalateIf: ["Plan and peer baselines disagree on direction"],
        },
      };
    },
  },
  {
    slug: "seasonality-real-decisions",
    title: "Monthly business review: MoM vs YoY",
    intro: "Move December revenue. Watch month-over-month panic disagree with same-month-last-year context.",
    sliders: [
      {
        id: "december",
        label: "December revenue ($M)",
        min: 8,
        max: 14,
        step: 0.25,
        default: 10.5,
        format: (v) => `$${v.toFixed(2)}M`,
      },
    ],
    compute: (state) => {
      const dec = n(state, "december", 10.5);
      const nov = 11.2;
      const decLy = 9.5;
      const mom = pctChange(dec, nov);
      const yoy = pctChange(dec, decLy);
      return {
        headline: `Dec ${mom.toFixed(0)}% MoM but ${yoy >= 0 ? "+" : ""}${yoy.toFixed(0)}% YoY`,
        readout:
          mom < 0 && yoy > 0
            ? "Calendar hangover after November peak — not necessarily a broken product."
            : mom > 0 && yoy < 0
              ? "Beating last month but still behind last December — dig deeper."
              : "Align the baseline with whether you are in ops cadence or planning mode.",
        charts: [
          {
            id: "levels",
            title: "Revenue levels",
            kind: "bar",
            labels: ["Nov", "Dec", "Dec LY"],
            values: [nov, dec, decLy],
            valueFormat: (v) => `$${v.toFixed(1)}M`,
          },
          {
            id: "changes",
            title: "Changes",
            kind: "bar",
            labels: ["MoM", "YoY"],
            values: [mom, yoy],
            valueFormat: (v) => `${v >= 0 ? "+" : ""}${v.toFixed(0)}%`,
          },
        ],
        stats: [
          { label: "December", value: `$${dec.toFixed(2)}M`, emphasis: true },
          { label: "MoM", value: `${mom.toFixed(0)}%` },
          { label: "YoY", value: `${yoy >= 0 ? "+" : ""}${yoy.toFixed(0)}%` },
        ],
        actions: {
          optimize: ["Plot 12 months with prior-year overlay", "Label which baseline drives hiring/inventory"],
          hold: ["November-to-December panic in retail without YoY"],
          escalateIf: ["YoY also negative for core cohorts"],
        },
      };
    },
  },
  {
    slug: "cohort-analysis-real-decisions",
    title: "Weekly retention review: headline vs cohort rows",
    intro: "Shift January signup mix. Headline retention can fall while each cohort row stays flat.",
    sliders: [
      {
        id: "mixShift",
        label: "New cohort share of base (%)",
        min: 10,
        max: 45,
        step: 5,
        default: 28,
        format: (v) => `${v}%`,
      },
      {
        id: "newCohortRet",
        label: "New cohort day-30 retention (%)",
        min: 30,
        max: 55,
        step: 1,
        default: 38,
        format: (v) => `${v}%`,
      },
    ],
    compute: (state) => {
      const mix = n(state, "mixShift", 28) / 100;
      const newRet = n(state, "newCohortRet", 38);
      const oldRet = 48;
      const headline = oldRet * (1 - mix) + newRet * mix;
      const cohortFlat = oldRet;
      return {
        headline: `Headline ${headline.toFixed(0)}% retention — older cohorts still ~${oldRet}%`,
        readout:
          headline < cohortFlat - 2
            ? "Mix shift: more users from a lower-retention cohort. Check cohort table before calling a regression."
            : "Headline tracks cohort quality. Mix is not the main story.",
        charts: [
          {
            id: "retention",
            title: "Retention levels",
            kind: "bar",
            labels: ["Older cohorts", "New cohort", "Headline"],
            values: [oldRet, newRet, headline],
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
          {
            id: "mix",
            title: "Mix vs quality",
            kind: "bar",
            labels: ["New cohort %", "Ret gap (pp)"],
            values: [mix * 100, oldRet - newRet],
            valueFormat: (v) => `${v.toFixed(0)}`,
          },
        ],
        stats: [
          { label: "Headline D30", value: `${headline.toFixed(0)}%`, emphasis: true },
          { label: "Older cohorts", value: `${oldRet}%` },
          { label: "New cohort share", value: `${(mix * 100).toFixed(0)}%` },
        ],
        actions: {
          optimize: ["Publish cohort table beside headline retention", "Separate mix from quality moves"],
          hold: ["Roadmap pivots from headline alone after signup surge"],
          escalateIf: ["Each cohort row falls quarter over quarter"],
        },
      };
    },
  },
  {
    slug: "prime-factorization-real-problems",
    title: "Batching 10,000 records without orphan batches",
    intro: "Drag batch size. See remainder batches and uneven worker load when size does not divide evenly.",
    sliders: [
      {
        id: "batchSize",
        label: "Batch size",
        min: 150,
        max: 1200,
        step: 50,
        default: 700,
        format: (v) => v.toLocaleString(),
      },
    ],
    compute: (state) => {
      const total = 10000;
      const batch = n(state, "batchSize", 700);
      const fullBatches = Math.floor(total / batch);
      const remainder = total % batch;
      const evenLoad = remainder === 0;
      const cleanSizes = [100, 200, 250, 500];
      const nearestClean = cleanSizes.reduce((best, s) =>
        Math.abs(s - batch) < Math.abs(best - batch) ? s : best,
      );
      return {
        headline: evenLoad
          ? `${fullBatches} even batches of ${batch}`
          : `${fullBatches} full batches + orphan ${remainder} records`,
        readout: evenLoad
          ? "Clean divide — workers stay balanced."
          : `Try ${nearestClean} (factor of 10,000) to eliminate remainder and simplify scheduling.`,
        charts: [
          {
            id: "batches",
            title: "Batch structure",
            kind: "bar",
            labels: ["Full batches", "Orphan records"],
            values: [fullBatches, remainder],
          },
          {
            id: "load",
            title: "Worker load index",
            kind: "bar",
            labels: ["Even split", "Your split"],
            values: [100, evenLoad ? 100 : 100 + remainder / 20],
            valueFormat: (v) => `${v.toFixed(0)}`,
          },
        ],
        stats: [
          { label: "Batch size", value: batch.toLocaleString(), emphasis: true },
          { label: "Full batches", value: String(fullBatches) },
          { label: "Orphan records", value: String(remainder) },
        ],
        actions: {
          optimize: ["Pick batch sizes that divide total records evenly", "Factor the job count before scheduling"],
          hold: ["Random batch sizes that leave partial batches every run"],
          escalateIf: ["Orphan batch exceeds 5% of total volume"],
        },
      };
    },
  },
  {
    slug: "rates-vs-counts-real-decisions",
    title: "",
    intro: "",
    sliders: [],
    compute: () => ({
      headline: "",
      readout: "",
      charts: [],
      stats: [],
      actions: { optimize: [], hold: [], escalateIf: [] },
    }),
  },
];
