import { actualRateForPredicted } from "@/lib/calibration-data";
import { evalMetrics, SCENARIOS as EVAL_SCENARIOS } from "@/lib/eval-sample-size-data";
import { metricsAtThreshold, SCENARIOS as THRESHOLD_SCENARIOS } from "@/lib/threshold-tradeoffs-data";
import { clamp } from "./chart-utils";
import type { ApplicationCaseConfig, ApplicationCaseState } from "./types";

function n(state: ApplicationCaseState, id: string, fallback: number) {
  return state[id] ?? fallback;
}

export const EXPERIMENTS_APPLICATION_CASES: ApplicationCaseConfig[] = [
  {
    slug: "sample-size-real-decisions",
    title: "Sample size: how tight can you measure?",
    intro: "Move sample size. Watch margin of error shrink as n grows — before you lock a readout.",
    sliders: [
      {
        id: "n",
        label: "Sample size (per arm)",
        min: 500,
        max: 20000,
        step: 500,
        default: 3000,
        format: (v) => v.toLocaleString(),
      },
      {
        id: "rate",
        label: "Baseline rate (%)",
        min: 2,
        max: 20,
        step: 0.5,
        default: 8,
        format: (v) => `${v}%`,
      },
    ],
    compute: (state) => {
      const nVal = n(state, "n", 3000);
      const rate = n(state, "rate", 8) / 100;
      const se = Math.sqrt((rate * (1 - rate)) / nVal);
      const moe = 1.96 * se * 100;
      const points = [500, 2000, 5000, 10000, 20000].map((size) => {
        const s = Math.sqrt((rate * (1 - rate)) / size);
        return 1.96 * s * 100;
      });
      return {
        headline: `n=${nVal.toLocaleString()} → margin of error ±${moe.toFixed(2)} pp at 95%`,
        readout:
          moe > 2
            ? "Band is still wide. More traffic or a longer run before shipping on small lifts."
            : "Precision is reasonable for many product decisions at this baseline.",
        charts: [
          {
            id: "moe-curve",
            title: "Margin of error vs n",
            kind: "line",
            labels: ["500", "2k", "5k", "10k", "20k"],
            values: points,
            valueFormat: (v) => `±${v.toFixed(1)} pp`,
          },
          {
            id: "current",
            title: "Your readout band (pp)",
            kind: "bar",
            labels: ["Low", "Rate", "High"],
            values: [rate * 100 - moe, rate * 100, rate * 100 + moe],
            valueFormat: (v) => `${v.toFixed(1)}%`,
          },
        ],
        stats: [
          { label: "Sample / arm", value: nVal.toLocaleString(), emphasis: true },
          { label: "Margin of error", value: `±${moe.toFixed(2)} pp` },
          { label: "Baseline", value: `${(rate * 100).toFixed(1)}%` },
        ],
        actions: {
          optimize: ["Pre-register n from baseline rate before launch", "Show interval width in readout doc"],
          hold: ["Shipping on ±3 pp bands when decision threshold is 1 pp"],
          escalateIf: ["Observed lift sits inside the margin of error"],
        },
      };
    },
  },
  {
    slug: "statistical-power-real-decisions",
    title: "Experiment planning: can you see the lift you care about?",
    intro: "Adjust sample size and minimum detectable lift. Power tells you if a flat readout is informative.",
    sliders: [
      {
        id: "n",
        label: "Users per arm",
        min: 1000,
        max: 15000,
        step: 500,
        default: 3000,
        format: (v) => v.toLocaleString(),
      },
      {
        id: "mde",
        label: "Minimum lift (pp)",
        min: 0.5,
        max: 4,
        step: 0.25,
        default: 1.5,
        format: (v) => `+${v} pp`,
      },
    ],
    compute: (state) => {
      const nVal = n(state, "n", 3000);
      const mde = n(state, "mde", 1.5);
      const baseline = 8;
      const powerApprox = clamp(20 + (nVal / 15000) * 50 + (mde / 4) * 30, 15, 95);
      const curve = [1000, 3000, 6000, 9000, 12000, 15000].map((size) =>
        clamp(15 + (size / 15000) * 55 + (mde / 4) * 25, 10, 95),
      );
      return {
        headline: `Power ~${powerApprox.toFixed(0)}% to detect +${mde} pp on ${baseline}% baseline`,
        readout:
          powerApprox < 60
            ? "Underpowered: a null result might mean 'cannot see lift' not 'no lift.' Extend run or widen MDE."
            : "Power crosses a workable bar. Flat readout is more meaningful.",
        charts: [
          {
            id: "power-curve",
            title: "Power vs sample size",
            kind: "line",
            labels: ["1k", "3k", "6k", "9k", "12k", "15k"],
            values: curve,
            referenceLine: 80,
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
          {
            id: "detect",
            title: "Detectability",
            kind: "bar",
            labels: ["Current power", "Target"],
            values: [powerApprox, 80],
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
        ],
        stats: [
          { label: "Power", value: `~${powerApprox.toFixed(0)}%`, emphasis: true },
          { label: "MDE", value: `+${mde} pp` },
          { label: "Per arm", value: nVal.toLocaleString() },
        ],
        actions: {
          optimize: ["State baseline, MDE, and 80% power before launch", "Extend run when power is under 60%"],
          hold: ["Treating null as proof when underpowered"],
          escalateIf: ["Power < 50% at planned readout date"],
        },
      };
    },
  },
  {
    slug: "probability-real-decisions",
    title: "Win rates: successes, trials, and noise",
    intro: "Move wins and trials. See how rate stability changes with sample size.",
    sliders: [
      {
        id: "wins",
        label: "Successes",
        min: 3,
        max: 80,
        step: 1,
        default: 18,
      },
      {
        id: "trials",
        label: "Trials",
        min: 20,
        max: 200,
        step: 5,
        default: 60,
      },
    ],
    compute: (state) => {
      const wins = n(state, "wins", 18);
      const trials = Math.max(n(state, "trials", 60), wins + 1);
      const rate = wins / trials;
      const se = Math.sqrt((rate * (1 - rate)) / trials);
      const low = Math.max(0, (rate - 1.96 * se) * 100);
      const high = Math.min(100, (rate + 1.96 * se) * 100);
      return {
        headline: `${wins}/${trials} → ${(rate * 100).toFixed(0)}% (rough band ${low.toFixed(0)}–${high.toFixed(0)}%)`,
        readout:
          trials < 40
            ? "Few trials — rate will swing with the next outcome. Gather more before ranking bets."
            : "Rate is stabilizing. Safe to feed into EV or forecast with eyes open.",
        charts: [
          {
            id: "outcomes",
            title: "Outcomes",
            kind: "bar",
            labels: ["Wins", "Losses"],
            values: [wins, trials - wins],
          },
          {
            id: "band",
            title: "Rate band (%)",
            kind: "bar",
            labels: ["Low", "Rate", "High"],
            values: [low, rate * 100, high],
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
        ],
        stats: [
          { label: "Win rate", value: `${(rate * 100).toFixed(0)}%`, emphasis: true },
          { label: "Trials", value: String(trials) },
          { label: "Band width", value: `${(high - low).toFixed(0)} pp` },
        ],
        actions: {
          optimize: ["Report successes and trials together", "Widen planning range when trials are small"],
          hold: ["Ranking pipelines on 8/12 close rates"],
          escalateIf: ["Decision spend exceeds EV at low end of band"],
        },
      };
    },
  },
  {
    slug: "confidence-intervals-real-decisions",
    title: "Shipping decision: does the band clear the bar?",
    intro: "Move observed lift and sample size. See when the confidence band clears your ship threshold.",
    sliders: [
      {
        id: "lift",
        label: "Observed lift (pp)",
        min: -1,
        max: 5,
        step: 0.25,
        default: 1.2,
        format: (v) => `${v >= 0 ? "+" : ""}${v} pp`,
      },
      {
        id: "n",
        label: "Users per arm",
        min: 2000,
        max: 15000,
        step: 500,
        default: 6000,
        format: (v) => v.toLocaleString(),
      },
    ],
    compute: (state) => {
      const lift = n(state, "lift", 1.2);
      const nVal = n(state, "n", 6000);
      const moe = 1.96 * Math.sqrt(0.08 * 0.92 * 2 / nVal) * 100;
      const low = lift - moe;
      const high = lift + moe;
      const threshold = 1;
      const clears = low > threshold;
      return {
        headline: clears
          ? `Band +${low.toFixed(1)} to +${high.toFixed(1)} pp clears +${threshold} pp bar`
          : `Band crosses threshold — wait or gather more data`,
        readout: clears
          ? "Interval clears decision bar with room. Stronger case to ship or scale."
          : "Band overlaps threshold. Reversible rollout or more traffic before full launch.",
        charts: [
          {
            id: "band",
            title: "Lift band (pp)",
            kind: "bar",
            labels: ["Low", "Observed", "High"],
            values: [low, lift, high],
            referenceLine: threshold,
            valueFormat: (v) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}`,
          },
          {
            id: "moe",
            title: "Precision",
            kind: "bar",
            labels: ["MoE", "Threshold"],
            values: [moe, threshold],
            valueFormat: (v) => `${v.toFixed(1)} pp`,
          },
        ],
        stats: [
          { label: "Observed lift", value: `+${lift.toFixed(1)} pp`, emphasis: true },
          { label: "Band", value: `${low.toFixed(1)} to ${high.toFixed(1)}` },
          { label: "Ship bar", value: `+${threshold} pp` },
        ],
        actions: {
          optimize: ["Show interval next to every rate in readouts", "Ship when band clears bar with margin"],
          hold: ["Full launch when band still crosses zero"],
          escalateIf: ["Point estimate wins but band includes zero"],
        },
      };
    },
  },
  {
    slug: "ab-test-readouts-real-decisions",
    title: "Experiment readout: overlap and next step",
    intro: "Adjust lift and sample size. See when intervals overlap enough to wait vs ship.",
    sliders: [
      {
        id: "lift",
        label: "Variant lift (pp)",
        min: 0,
        max: 4,
        step: 0.2,
        default: 1.4,
        format: (v) => `+${v} pp`,
      },
      {
        id: "n",
        label: "Users per arm",
        min: 1500,
        max: 12000,
        step: 500,
        default: 4000,
        format: (v) => v.toLocaleString(),
      },
    ],
    compute: (state) => {
      const lift = n(state, "lift", 1.4);
      const nVal = n(state, "n", 4000);
      const moe = 1.96 * Math.sqrt(0.08 * 0.92 * 2 / nVal) * 100;
      const control = 8;
      const variant = control + lift;
      const overlap = lift < moe * 2;
      return {
        headline: overlap ? "Intervals overlap — next step: wait or slice" : "Separation is clear — ship candidate",
        readout: overlap
          ? "Report overlap explicitly. Ops can run reversible rollout while traffic accumulates."
          : "Lift exceeds noise band. Pair with segment cuts before trusting aggregate.",
        charts: [
          {
            id: "rates",
            title: "Conversion (%)",
            kind: "bar",
            labels: ["Control", "Variant"],
            values: [control, variant],
            valueFormat: (v) => `${v.toFixed(1)}%`,
          },
          {
            id: "lift-band",
            title: "Lift band (pp)",
            kind: "line",
            labels: ["Low", "Lift", "High"],
            values: [lift - moe, lift, lift + moe],
            valueFormat: (v) => `+${v.toFixed(1)}`,
          },
        ],
        stats: [
          { label: "Lift", value: `+${lift.toFixed(1)} pp`, emphasis: true },
          { label: "Overlap?", value: overlap ? "Yes" : "No" },
          { label: "Per arm", value: nVal.toLocaleString() },
        ],
        actions: {
          optimize: ["Paste lift, n, and interval overlap into readout docs", "Set minimum lift bar before data arrives"],
          hold: ["Shipping on point estimate alone"],
          escalateIf: ["Aggregate wins but every segment loses"],
        },
      };
    },
  },
  {
    slug: "many-ab-tests-real-decisions",
    title: "Experiment sprint: skepticism scales with n",
    intro: "Increase concurrent tests. Expected false wins rise even when each test looks fine alone.",
    sliders: [
      {
        id: "tests",
        label: "Concurrent tests",
        min: 3,
        max: 40,
        step: 1,
        default: 12,
      },
      {
        id: "alpha",
        label: "Significance level (%)",
        min: 1,
        max: 10,
        step: 0.5,
        default: 5,
        format: (v) => `${v}%`,
      },
    ],
    compute: (state) => {
      const tests = n(state, "tests", 12);
      const alpha = n(state, "alpha", 5) / 100;
      const expectedFalse = tests * alpha;
      const curve = [3, 8, 12, 20, 30, 40].map((t) => t * alpha);
      return {
        headline: `${tests} tests at α=${(alpha * 100).toFixed(0)}% → ~${expectedFalse.toFixed(1)} expected false wins`,
        readout:
          expectedFalse >= 2
            ? "Rank evidence before shipping a bundle. Hold winners to the same interval bar as a single test."
            : "False win risk is modest at this sprint size.",
        charts: [
          {
            id: "false-wins",
            title: "Expected false wins",
            kind: "line",
            labels: ["3", "8", "12", "20", "30", "40"],
            values: curve,
            valueFormat: (v) => `~${v.toFixed(1)}`,
          },
          {
            id: "yours",
            title: "Your sprint",
            kind: "bar",
            labels: ["Tests", "Expected false"],
            values: [tests, expectedFalse],
          },
        ],
        stats: [
          { label: "Tests", value: String(tests), emphasis: true },
          { label: "Expected false wins", value: `~${expectedFalse.toFixed(1)}` },
          { label: "α", value: `${(alpha * 100).toFixed(0)}%` },
        ],
        actions: {
          optimize: ["One primary metric per sprint", "Treat secondary wins as directional"],
          hold: ["Shipping every 'winner' from a 20-test sprint unchanged"],
          escalateIf: ["More than two winners lack interval separation"],
        },
      };
    },
  },
  {
    slug: "false-alarm-missed-win-real-decisions",
    title: "Launch policy: false alarm vs missed win",
    intro: "Tighten or loosen your ship bar. See the tradeoff between crying wolf and missing real lifts.",
    sliders: [
      {
        id: "strictness",
        label: "Ship bar strictness",
        min: 1,
        max: 10,
        step: 1,
        default: 6,
        lowLabel: "Loose (ship early)",
        highLabel: "Strict (wait for proof)",
      },
    ],
    compute: (state) => {
      const s = n(state, "strictness", 6);
      const falseAlarm = clamp(40 - s * 3, 5, 40);
      const missedWin = clamp(5 + s * 4, 5, 45);
      return {
        headline: `Strictness ${s}/10 — false alarm risk ~${falseAlarm}%, missed win ~${missedWin}%`,
        readout:
          s >= 7
            ? "Fewer false launches. Fraud, billing, and high-trust surfaces want this side."
            : "More wins captured. Reversible checkout tests can live looser with rollback plans.",
        charts: [
          {
            id: "risks",
            title: "Risk tradeoff (index)",
            kind: "bar",
            labels: ["False alarm", "Missed win"],
            values: [falseAlarm, missedWin],
            valueFormat: (v) => `${v.toFixed(0)}`,
          },
          {
            id: "strictness",
            title: "Strictness curve",
            kind: "line",
            labels: ["Loose", "You", "Strict"],
            values: [3, s, 9],
          },
        ],
        stats: [
          { label: "Strictness", value: `${s}/10`, emphasis: true },
          { label: "False alarm index", value: `${falseAlarm}` },
          { label: "Missed win index", value: `${missedWin}` },
        ],
        actions: {
          optimize: ["Write policy before the test finishes", "Match bar to cost of each mistake"],
          hold: ["One global p-value rule for fraud and UI copy tests alike"],
          escalateIf: ["Policy disagrees with finance on rollback cost"],
        },
      };
    },
  },
  {
    slug: "expected-value-real-decisions",
    title: "Comparing bets: rank on expected value",
    intro: "Move probability and payoff on two bets. EV ranks pipeline on average return, not best-case deck slides.",
    sliders: [
      {
        id: "probA",
        label: "Bet A win chance (%)",
        min: 5,
        max: 90,
        step: 5,
        default: 15,
        format: (v) => `${v}%`,
      },
      {
        id: "payoffA",
        label: "Bet A payoff ($M)",
        min: 1,
        max: 20,
        step: 0.5,
        default: 10,
        format: (v) => `$${v}M`,
      },
      {
        id: "probB",
        label: "Bet B win chance (%)",
        min: 20,
        max: 95,
        step: 5,
        default: 55,
        format: (v) => `${v}%`,
      },
      {
        id: "payoffB",
        label: "Bet B payoff ($M)",
        min: 0.5,
        max: 8,
        step: 0.25,
        default: 2.5,
        format: (v) => `$${v}M`,
      },
    ],
    compute: (state) => {
      const pA = n(state, "probA", 15) / 100;
      const pB = n(state, "probB", 55) / 100;
      const payA = n(state, "payoffA", 10);
      const payB = n(state, "payoffB", 2.5);
      const evA = pA * payA;
      const evB = pB * payB;
      const winner = evA >= evB ? "A" : "B";
      return {
        headline: `Bet ${winner} wins on EV — A: $${evA.toFixed(2)}M vs B: $${evB.toFixed(2)}M`,
        readout:
          winner === "A"
            ? "Big logo, low odds can beat three modest deals on average return."
            : "Higher chance × smaller payoff can beat lottery-ticket bets.",
        charts: [
          {
            id: "ev",
            title: "Expected value ($M)",
            kind: "bar",
            labels: ["Bet A", "Bet B"],
            values: [evA, evB],
            valueFormat: (v) => `$${v.toFixed(2)}M`,
          },
          {
            id: "components",
            title: "Win chance (%)",
            kind: "bar",
            labels: ["Bet A", "Bet B"],
            values: [pA * 100, pB * 100],
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
        ],
        stats: [
          { label: "EV Bet A", value: `$${evA.toFixed(2)}M`, emphasis: winner === "A" },
          { label: "EV Bet B", value: `$${evB.toFixed(2)}M`, emphasis: winner === "B" },
          { label: "Pick", value: `Bet ${winner}` },
        ],
        actions: {
          optimize: ["Write probability and payoff before comparing bets", "Rank pipeline on EV not logo size"],
          hold: ["Funding highest upside deck without odds"],
          escalateIf: ["EV winner differs from strategic must-win account"],
        },
      };
    },
  },
  {
    slug: "stockout-probability-real-decisions",
    title: "Reorder point: balance stockout risk and inventory drag",
    intro: "Move demand, lead time, and reorder point. See how fast stockout risk drops as you add buffer.",
    sliders: [
      {
        id: "dailyDemand",
        label: "Average daily demand",
        min: 40,
        max: 220,
        step: 5,
        default: 95,
      },
      {
        id: "leadDays",
        label: "Supplier lead time (days)",
        min: 3,
        max: 21,
        step: 1,
        default: 9,
      },
      {
        id: "reorderPoint",
        label: "Reorder point",
        min: 400,
        max: 2200,
        step: 20,
        default: 980,
      },
    ],
    compute: (state) => {
      const dailyDemand = n(state, "dailyDemand", 95);
      const leadDays = n(state, "leadDays", 9);
      const reorderPoint = n(state, "reorderPoint", 980);
      const meanLeadDemand = dailyDemand * leadDays;
      const stdLeadDemand = 0.28 * dailyDemand * Math.sqrt(leadDays);
      const z = (reorderPoint - meanLeadDemand) / Math.max(stdLeadDemand, 1);
      const service = clamp(50 + z * 18, 5, 99);
      const stockoutRisk = 100 - service;
      const safetyStock = reorderPoint - meanLeadDemand;
      const carryingIndex = clamp((reorderPoint / Math.max(meanLeadDemand, 1)) * 100, 40, 220);

      return {
        headline: `Reorder ${reorderPoint.toLocaleString()} gives ~${service.toFixed(0)}% service level (${stockoutRisk.toFixed(0)}% stockout risk)`,
        readout:
          stockoutRisk > 20
            ? "Risk is high for customer-facing SKUs. Raise reorder point or shorten lead time."
            : "Risk is in a workable band. Monitor forecast drift and supplier reliability.",
        charts: [
          {
            id: "risk-curve",
            title: "Stockout risk by reorder point (%)",
            kind: "line",
            labels: ["-20%", "-10%", "Current", "+10%", "+20%"],
            values: [stockoutRisk * 1.6, stockoutRisk * 1.25, stockoutRisk, stockoutRisk * 0.75, stockoutRisk * 0.55].map((v) =>
              clamp(v, 1, 95),
            ),
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
          {
            id: "buffer-vs-demand",
            title: "Demand vs reorder buffer",
            kind: "bar",
            labels: ["Lead-time demand", "Reorder point", "Safety stock"],
            values: [meanLeadDemand, reorderPoint, Math.max(safetyStock, 0)],
            valueFormat: (v) => Math.round(v).toLocaleString(),
          },
        ],
        stats: [
          { label: "Stockout risk", value: `${stockoutRisk.toFixed(0)}%`, emphasis: stockoutRisk <= 12 },
          { label: "Safety stock", value: `${Math.max(0, Math.round(safetyStock)).toLocaleString()} units` },
          { label: "Carrying index", value: `${carryingIndex.toFixed(0)}` },
        ],
        actions: {
          optimize: ["Set reorder points by target service level per SKU tier", "Review supplier lead-time variability monthly"],
          hold: ["One reorder rule for every SKU regardless of volatility"],
          escalateIf: ["Stockout risk > 20% on revenue-driving items"],
        },
      };
    },
  },
  {
    slug: "model-calibration-real-decisions",
    title: "Auto-block policy: threshold vs score reliability",
    intro:
      "Move block threshold, review capacity, and calibration quality. Overconfident scores inflate overturns even when ranking is fine.",
    sliders: [
      {
        id: "threshold",
        label: "Auto-block threshold",
        min: 65,
        max: 95,
        step: 1,
        default: 85,
        format: (v) => `${v}%`,
      },
      {
        id: "capacity",
        label: "Review capacity (orders/day)",
        min: 50,
        max: 400,
        step: 10,
        default: 180,
        format: (v) => v.toLocaleString(),
      },
      {
        id: "quality",
        label: "Calibration quality",
        min: 0,
        max: 100,
        step: 1,
        default: 25,
        lowLabel: "Overconfident",
        highLabel: "Well calibrated",
      },
    ],
    compute: (state) => {
      const threshold = n(state, "threshold", 85) / 100;
      const capacity = n(state, "capacity", 180);
      const quality = n(state, "quality", 25);
      const dailyVolume = 5000;
      const baseRate = 0.02;
      const blockedFraction = clamp(Math.pow(1 - threshold, 1.4) * 0.42, 0.008, 0.12);
      const blocked = Math.round(dailyVolume * blockedFraction);
      const avgPredicted = clamp(threshold + 0.06, 0.7, 0.98);
      const trueFraudRate = actualRateForPredicted(avgPredicted, quality, baseRate);
      const overturnRate = (1 - trueFraudRate) * 100;
      const overturns = Math.round(blocked * (1 - trueFraudRate));
      const overflow = Math.max(0, blocked - capacity);
      const qualityCurve = [0, 25, 50, 75, 100].map((q) => {
        const rate = actualRateForPredicted(avgPredicted, q, baseRate);
        return (1 - rate) * 100;
      });
      return {
        headline: `${blocked} auto-blocks/day → ~${overturnRate.toFixed(0)}% overturn rate (${overturns} clean orders)`,
        readout:
          quality < 45
            ? `Scores run hot at ${(avgPredicted * 100).toFixed(0)}% predicted but ~${(trueFraudRate * 100).toFixed(0)}% truly fraud. Recalibrate before tightening threshold.`
            : quality <= 55
              ? "Calibration is workable. Threshold tradeoffs dominate — tune block bar vs review load."
              : "Conservative scores: fewer false blocks, but more fraud may slip below threshold.",
        charts: [
          {
            id: "blocks",
            title: "Daily auto-blocks vs capacity",
            kind: "bar",
            labels: ["Blocked", "Capacity"],
            values: [blocked, capacity],
          },
          {
            id: "overturn-curve",
            title: "Overturn rate vs calibration",
            kind: "line",
            labels: ["0", "25", "50", "75", "100"],
            values: qualityCurve,
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
        ],
        stats: [
          { label: "Auto-blocks / day", value: blocked.toLocaleString(), emphasis: true },
          { label: "Overturn rate", value: `${overturnRate.toFixed(0)}%` },
          { label: "Queue overflow", value: overflow > 0 ? `+${overflow}` : "None" },
        ],
        actions: {
          optimize: [
            "Plot reliability before wiring scores to auto-block",
            "Recalibrate (Platt/isotonic) when overturn rate spikes",
          ],
          hold: ["Lowering threshold alone when scores are overconfident"],
          escalateIf: [
            "Review queue overflow exceeds 50 orders/day",
            "Overturn rate above 45% after auto-block",
          ],
        },
      };
    },
  },
  {
    slug: "threshold-tradeoffs-real-decisions",
    title: "Fraud policy: threshold vs precision, recall, and cost",
    intro:
      "Move block threshold and review capacity. Watch precision and recall trade off — and daily false-alarm vs miss cost.",
    sliders: [
      {
        id: "threshold",
        label: "Auto-block threshold",
        min: 60,
        max: 95,
        step: 1,
        default: 82,
        format: (v) => `${v}%`,
      },
      {
        id: "capacity",
        label: "Review capacity / day",
        min: 50,
        max: 400,
        step: 10,
        default: 200,
        format: (v) => v.toLocaleString(),
      },
      {
        id: "fpCost",
        label: "Cost per false block ($)",
        min: 20,
        max: 120,
        step: 5,
        default: 45,
        format: (v) => `$${v}`,
      },
    ],
    compute: (state) => {
      const scenario = THRESHOLD_SCENARIOS.fraud_block;
      const threshold = n(state, "threshold", 82);
      const capacity = n(state, "capacity", 200);
      const fpCost = n(state, "fpCost", 45);
      const adjusted = { ...scenario, fpCost };
      const m = metricsAtThreshold(threshold, capacity, adjusted);
      const curveP = [60, 70, 80, 90, 95].map((t) =>
        metricsAtThreshold(t, capacity, adjusted).precision * 100,
      );
      const curveR = [60, 70, 80, 90, 95].map((t) =>
        metricsAtThreshold(t, capacity, adjusted).recall * 100,
      );
      return {
        headline: `Precision ${(m.precision * 100).toFixed(0)}% · recall ${(m.recall * 100).toFixed(0)}% · ${m.flagged} flagged/day`,
        readout:
          m.overflow > 0
            ? `Queue exceeds capacity by ${m.overflow}. Raise threshold or add reviewers before tightening policy.`
            : m.precision < 0.4
              ? "Most flagged orders are clean. Lower false-alarm cost or raise threshold before auto-block."
              : "Compare total cost to a miss — threshold is a capacity and dollar problem, not accuracy alone.",
        charts: [
          {
            id: "precision-curve",
            title: "Precision vs threshold",
            kind: "line",
            labels: ["60", "70", "80", "90", "95"],
            values: curveP,
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
          {
            id: "recall-curve",
            title: "Recall vs threshold",
            kind: "line",
            labels: ["60", "70", "80", "90", "95"],
            values: curveR,
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
        ],
        stats: [
          { label: "Flagged / day", value: m.flagged.toLocaleString(), emphasis: true },
          { label: "Daily cost", value: `$${m.totalCost.toLocaleString()}` },
          { label: "Queue overflow", value: m.overflow > 0 ? `+${m.overflow}` : "None" },
        ],
        actions: {
          optimize: [
            "Plot precision-recall across thresholds before auto-policy",
            "Weight FP vs FN cost explicitly in the cutoff choice",
          ],
          hold: ["Lowering threshold when review queue is already full"],
          escalateIf: [
            "Review overflow exceeds 50 cases/day",
            "Precision below 35% at chosen threshold",
          ],
        },
      };
    },
  },
  {
    slug: "eval-sample-size-real-decisions",
    title: "Model eval: how many labels for a tight precision read?",
    intro:
      "Move labeled-set size. Watch the 95% band on precision shrink — effective n is flagged rows, not total labels.",
    sliders: [
      {
        id: "evalN",
        label: "Labeled eval rows",
        min: 100,
        max: 4000,
        step: 100,
        default: 500,
        format: (v) => v.toLocaleString(),
      },
      {
        id: "flagRate",
        label: "Share flagged in eval (%)",
        min: 2,
        max: 12,
        step: 0.5,
        default: 4,
        format: (v) => `${v}%`,
      },
    ],
    compute: (state) => {
      const evalN = n(state, "evalN", 500);
      const flagRate = n(state, "flagRate", 4) / 100;
      const scenario = { ...EVAL_SCENARIOS.fraud_precision, flagRate };
      const m = evalMetrics(scenario, evalN);
      const curve = [200, 500, 1000, 2000, 3000, 4000].map((size) => ({
        size,
        moe: evalMetrics(scenario, size).marginOfError * 100,
      }));
      return {
        headline: `Precision ${(scenario.trueMetric * 100).toFixed(0)}% ±${(m.marginOfError * 100).toFixed(0)} pp on ${m.effectiveN} flagged rows`,
        readout:
          m.reliability === "thin"
            ? "Band is too wide to change auto-block policy. Label more flagged cases first."
            : m.reliability === "directional"
              ? "Enough for monitoring and model comparison — not for irreversible policy."
              : "Metric band is tight enough to support a threshold decision with calibration checks.",
        charts: [
          {
            id: "moe-curve",
            title: "Margin of error vs eval size",
            kind: "line",
            labels: curve.map((p) => p.size.toLocaleString()),
            values: curve.map((p) => p.moe),
            valueFormat: (v) => `±${v.toFixed(1)} pp`,
          },
        ],
        stats: [
          { label: "Effective n", value: m.effectiveN.toLocaleString(), emphasis: true },
          {
            label: "95% band",
            value: `${(m.low * 100).toFixed(0)}–${(m.high * 100).toFixed(0)}%`,
          },
          { label: "Verdict", value: m.reliability === "thin" ? "Label more" : "Directional+" },
        ],
        actions: {
          optimize: [
            "Report effective n next to every precision/recall slide",
            "Stratified labeling on rare positives before launch",
          ],
          hold: ["Shipping auto-policy on thin flagged-count evals"],
          escalateIf: [
            "Fewer than 30 flagged rows in eval",
            "Precision band wider than ±12 pp",
          ],
        },
      };
    },
  },
];
