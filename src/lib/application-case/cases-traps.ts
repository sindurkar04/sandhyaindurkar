import { clamp, pctChange } from "./chart-utils";
import type { ApplicationCaseConfig, ApplicationCaseState } from "./types";

function n(state: ApplicationCaseState, id: string, fallback: number) {
  return state[id] ?? fallback;
}

export const TRAPS_APPLICATION_CASES: ApplicationCaseConfig[] = [
  {
    slug: "correlation-vs-causation-real-decisions",
    title: "Marketing and revenue: correlation vs causation",
    intro: "Increase confounding (launch weeks). Ad spend and revenue move together — but part of lift may not be from ads.",
    sliders: [
      {
        id: "confound",
        label: "Launch / confounding strength",
        min: 0,
        max: 10,
        step: 1,
        default: 7,
        lowLabel: "Clean test",
        highLabel: "Heavy confounding",
      },
      {
        id: "adSpend",
        label: "Ad spend index",
        min: 50,
        max: 150,
        step: 5,
        default: 100,
      },
    ],
    compute: (state) => {
      const confound = n(state, "confound", 7);
      const spend = n(state, "adSpend", 100);
      const causalLift = (spend - 100) * 0.04;
      const confoundLift = confound * 1.2;
      const totalRevenue = 100 + causalLift + confoundLift;
      const correlation = clamp(0.45 + confound * 0.05 + (spend - 100) * 0.002, 0.3, 0.98);
      return {
        headline: `r ≈ ${correlation.toFixed(2)} — but only part of revenue lift is ad-driven`,
        readout:
          confound >= 6
            ? "Correlation answers: do they move together? Causation needs a design change or control. Budget as if confounding is real."
            : "Cleaner period — correlation is more informative, still not proof of causation.",
        charts: [
          {
            id: "revenue",
            title: "Revenue index",
            kind: "bar",
            labels: ["Baseline", "Ad effect", "Confound", "Total"],
            values: [100, 100 + causalLift, 100 + confoundLift, totalRevenue],
          },
          {
            id: "corr",
            title: "Correlation strength",
            kind: "line",
            labels: ["Low confound", "You", "High confound"],
            values: [0.5, correlation, 0.95],
            valueFormat: (v) => `r=${v.toFixed(2)}`,
          },
        ],
        stats: [
          { label: "Correlation", value: `~${correlation.toFixed(2)}`, emphasis: true },
          { label: "Ad-driven lift", value: `+${causalLift.toFixed(1)} idx` },
          { label: "Confound lift", value: `+${confoundLift.toFixed(1)} idx` },
        ],
        actions: {
          optimize: ["Holdout or geo test before scaling spend", "Track launch calendar beside ad/revenue charts"],
          hold: ["Budgeting every correlated dollar as incremental"],
          escalateIf: ["Spend up, revenue flat after controlling launches"],
        },
      };
    },
  },
  {
    slug: "selection-bias-real-decisions",
    title: "Survey bias: who answered vs who matters",
    intro: "Lower response rate from unhappy users. Reported satisfaction can look fine while the silent majority differs.",
    sliders: [
      {
        id: "responseRate",
        label: "Survey response rate (%)",
        min: 5,
        max: 60,
        step: 5,
        default: 22,
        format: (v) => `${v}%`,
      },
      {
        id: "happyBias",
        label: "Happy users more likely to respond",
        min: 1,
        max: 10,
        step: 1,
        default: 6,
        lowLabel: "Representative",
        highLabel: "Cheerleader sample",
      },
    ],
    compute: (state) => {
      const rate = n(state, "responseRate", 22);
      const bias = n(state, "happyBias", 6);
      const trueSat = 62;
      const reportedSat = clamp(trueSat + bias * 2.5 + (60 - rate) * 0.05, 55, 92);
      const gap = reportedSat - trueSat;
      return {
        headline: `Reported ${reportedSat.toFixed(0)}% satisfied — true population ~${trueSat}%`,
        readout:
          gap > 8
            ? "Best customers answered. Weight by segment or follow up with silent users before product calls."
            : "Sample is closer to representative at this response and bias level.",
        charts: [
          {
            id: "sat",
            title: "Satisfaction (%)",
            kind: "bar",
            labels: ["True pop.", "Reported"],
            values: [trueSat, reportedSat],
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
          {
            id: "sample",
            title: "Sample quality",
            kind: "bar",
            labels: ["Response %", "Bias index"],
            values: [rate, bias * 10],
          },
        ],
        stats: [
          { label: "Reported CSAT", value: `${reportedSat.toFixed(0)}%`, emphasis: true },
          { label: "True CSAT (est.)", value: `${trueSat}%` },
          { label: "Gap", value: `${gap.toFixed(0)} pp` },
        ],
        actions: {
          optimize: ["Weight responses by segment size", "Track non-respondent cohort behavior"],
          hold: ["Roadmap from survey alone after beta invite"],
          escalateIf: ["Usage metrics disagree with survey for two cycles"],
        },
      };
    },
  },
  {
    slug: "survivorship-bias-real-decisions",
    title: "Portfolio stories: who left the dataset",
    intro: "Raise dropout. Visible success rate rises because failures already exited.",
    sliders: [
      {
        id: "dropout",
        label: "Dropout before measurement (%)",
        min: 10,
        max: 70,
        step: 5,
        default: 40,
        format: (v) => `${v}%`,
      },
    ],
    compute: (state) => {
      const dropout = n(state, "dropout", 40) / 100;
      const trueSuccess = 45;
      const survivorsSuccess = clamp(trueSuccess + dropout * 35, 40, 85);
      const started = 1000;
      const remain = Math.round(started * (1 - dropout));
      return {
        headline: `${survivorsSuccess.toFixed(0)}% among survivors — true cohort ~${trueSuccess}%`,
        readout: "Ask how many started, how many remain, and what happened to the rest before strategy from success stories alone.",
        charts: [
          {
            id: "cohort",
            title: "Cohort flow",
            kind: "bar",
            labels: ["Started", "Remain", "Left"],
            values: [started, remain, started - remain],
          },
          {
            id: "rates",
            title: "Success rate (%)",
            kind: "bar",
            labels: ["True", "Survivors only"],
            values: [trueSuccess, survivorsSuccess],
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
        ],
        stats: [
          { label: "Survivor rate", value: `${survivorsSuccess.toFixed(0)}%`, emphasis: true },
          { label: "True rate", value: `${trueSuccess}%` },
          { label: "Dropout", value: `${(dropout * 100).toFixed(0)}%` },
        ],
        actions: {
          optimize: ["Report started vs remained on every success metric", "Pair reviews with churn/exit data"],
          hold: ["Benchmarking from league tables of survivors only"],
          escalateIf: ["Exit reasons cluster in one product area"],
        },
      };
    },
  },
  {
    slug: "goodhart-law-real-decisions",
    title: "Support targets: proxy vs outcome",
    intro: "Raise pressure on tickets closed per hour. The proxy rises; CSAT and reopen rates fall.",
    sliders: [
      {
        id: "pressure",
        label: "Metric drives pay & reviews",
        min: 0,
        max: 10,
        step: 1,
        default: 7,
        lowLabel: "Informational",
        highLabel: "Bonus-linked",
      },
    ],
    compute: (state) => {
      const p = n(state, "pressure", 7);
      const reported = clamp(50 + p * 5, 50, 98);
      const outcome = clamp(78 - p * 4.5, 25, 80);
      return {
        headline: `Closes/hr ${reported.toFixed(0)} ↑ but outcome score ${outcome.toFixed(0)} ↓`,
        readout:
          p >= 6
            ? "Pair proxy with outcome every review. If hitting the metric tomorrow would embarrass you, it is Goodhart."
            : "Low pressure — proxy still tracks outcome reasonably.",
        charts: [
          {
            id: "metrics",
            title: "Scores",
            kind: "bar",
            labels: ["Proxy (closes)", "Outcome (CSAT)"],
            values: [reported, outcome],
          },
          {
            id: "pressure",
            title: "Target pressure",
            kind: "line",
            labels: ["Low", "You", "High"],
            values: [2, p, 10],
          },
        ],
        stats: [
          { label: "Proxy metric", value: `${reported.toFixed(0)}`, emphasis: true },
          { label: "Outcome", value: `${outcome.toFixed(0)}` },
          { label: "Pressure", value: `${p}/10` },
        ],
        actions: {
          optimize: ["Pair proxy + outcome in every review", "Cap how much one metric drives pay"],
          hold: ["Bonuses on closes/hr alone"],
          escalateIf: ["Reopen rate worsens while proxy improves"],
        },
      };
    },
  },
  {
    slug: "regression-to-the-mean-real-decisions",
    title: "Spike week: expect the next period to cool",
    intro: "Move last week's spike. Extreme weeks often revert even when nothing changed in the product.",
    sliders: [
      {
        id: "spike",
        label: "Last week vs typical (%)",
        min: 110,
        max: 200,
        step: 5,
        default: 145,
        format: (v) => `+${v - 100}%`,
      },
    ],
    compute: (state) => {
      const typical = 100;
      const spike = n(state, "spike", 145);
      const expectedNext = typical + (spike - typical) * 0.25;
      const drop = pctChange(expectedNext, spike);
      return {
        headline: `Spike to ${spike} → expect ~${expectedNext.toFixed(0)} next week (${drop.toFixed(0)}% "drop")`,
        readout: "A cooling week after a spike is often regression to the mean, not a broken launch.",
        charts: [
          {
            id: "weeks",
            title: "Metric index",
            kind: "line",
            labels: ["Typical", "Spike wk", "Expected next"],
            values: [typical, spike, expectedNext],
          },
          {
            id: "revert",
            title: "Reversion pull",
            kind: "bar",
            labels: ["Spike gap", "Expected pull-back"],
            values: [spike - typical, spike - expectedNext],
          },
        ],
        stats: [
          { label: "Spike week", value: String(spike), emphasis: true },
          { label: "Expected next", value: expectedNext.toFixed(0) },
          { label: "Typical", value: String(typical) },
        ],
        actions: {
          optimize: ["Compare to baseline range, not spike peak", "Wait one cycle before rollback"],
          hold: ["Emergency rollback on first post-spike dip"],
          escalateIf: ["Metric stays below typical for 3+ weeks"],
        },
      };
    },
  },
  {
    slug: "simpsons-paradox-real-decisions",
    title: "Segment tables: aggregate vs slices",
    intro: "Shift mobile share. Aggregate conversion can favor control while every segment favors variant.",
    sliders: [
      {
        id: "mobileShare",
        label: "Mobile traffic share (%)",
        min: 20,
        max: 80,
        step: 5,
        default: 55,
        format: (v) => `${v}%`,
      },
    ],
    compute: (state) => {
      const mobileShare = n(state, "mobileShare", 55) / 100;
      const mobileCtrl = 6;
      const mobileVar = 7.2;
      const desktopCtrl = 12;
      const desktopVar = 11;
      const aggCtrl = mobileCtrl * mobileShare + desktopCtrl * (1 - mobileShare);
      const aggVar = mobileVar * mobileShare + desktopVar * (1 - mobileShare);
      const paradox = aggVar < aggCtrl && mobileVar > mobileCtrl && desktopVar > desktopCtrl;
      return {
        headline: paradox
          ? `Aggregate favors control — both segments favor variant (Simpson)`
          : `Aggregate aligns with segments at this mix`,
        readout: paradox
          ? "Report slices first. Fix assignment balance before calling a winner on the rollup."
          : "Mix is not flipping the story here.",
        charts: [
          {
            id: "segments",
            title: "Conversion by segment (%)",
            kind: "bar",
            labels: ["Mob ctrl", "Mob var", "Desk ctrl", "Desk var"],
            values: [mobileCtrl, mobileVar, desktopCtrl, desktopVar],
            valueFormat: (v) => `${v.toFixed(1)}%`,
          },
          {
            id: "aggregate",
            title: "Aggregate (%)",
            kind: "bar",
            labels: ["Control", "Variant"],
            values: [aggCtrl, aggVar],
            valueFormat: (v) => `${v.toFixed(1)}%`,
          },
        ],
        stats: [
          { label: "Aggregate lift", value: `${(aggVar - aggCtrl).toFixed(1)} pp` },
          { label: "Mobile share", value: `${(mobileShare * 100).toFixed(0)}%`, emphasis: true },
          { label: "Paradox?", value: paradox ? "Yes" : "No" },
        ],
        actions: {
          optimize: ["Require device/region/plan cuts on every readout", "Delay rollout when stories disagree"],
          hold: ["Shipping on aggregate when segments disagree"],
          escalateIf: ["Assignment mix shifted mid-test"],
        },
      };
    },
  },
  {
    slug: "overfitting-real-decisions",
    title: "Forecast review: train vs holdout",
    intro: "Add model complexity. Train error falls while holdout error rises — memorizing history.",
    sliders: [
      {
        id: "complexity",
        label: "Model complexity (terms)",
        min: 2,
        max: 18,
        step: 1,
        default: 12,
      },
    ],
    compute: (state) => {
      const c = n(state, "complexity", 12);
      const train = clamp(18 - c * 0.6, 3, 16);
      const holdout = clamp(8 + Math.max(0, c - 8) * 1.4, 6, 22);
      const gap = holdout - train;
      return {
        headline: `Train ${train.toFixed(0)}% error, holdout ${holdout.toFixed(0)}% — gap ${gap.toFixed(0)} pp`,
        readout:
          gap > 6
            ? "Drop terms until holdout improves. Do not plan inventory on train error alone."
            : "Generalization gap is acceptable for this complexity.",
        charts: [
          {
            id: "errors",
            title: "Error (%)",
            kind: "bar",
            labels: ["Train", "Holdout"],
            values: [train, holdout],
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
          {
            id: "gap",
            title: "Complexity vs holdout",
            kind: "line",
            labels: ["Low", "You", "High"],
            values: [8, holdout, 22],
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
        ],
        stats: [
          { label: "Train error", value: `${train.toFixed(0)}%` },
          { label: "Holdout error", value: `${holdout.toFixed(0)}%`, emphasis: true },
          { label: "Terms", value: String(c) },
        ],
        actions: {
          optimize: ["Always show train and holdout together", "Cap complexity when history is short"],
          hold: ["Shipping forecast on train error alone"],
          escalateIf: ["Holdout error worsens after adding drivers"],
        },
      };
    },
  },
  {
    slug: "regression-real-decisions",
    title: "Spend forecast: fit history, score holdout",
    intro: "Increase ad spend. See in-sample fit vs holdout weeks before locking budget.",
    sliders: [
      {
        id: "spend",
        label: "Weekly ad spend ($k)",
        min: 20,
        max: 120,
        step: 5,
        default: 65,
        format: (v) => `$${v}k`,
      },
    ],
    compute: (state) => {
      const spend = n(state, "spend", 65);
      const predicted = 800 + spend * 12;
      const trainErr = 4;
      const holdoutErr = clamp(8 + Math.abs(spend - 60) * 0.08, 6, 20);
      return {
        headline: `Predicted ${Math.round(predicted).toLocaleString()} orders — holdout error ~${holdoutErr.toFixed(0)}%`,
        readout:
          holdoutErr > 12
            ? "Spend is outside range you validated. Extend holdout test before budget lock."
            : "Holdout error is workable at this spend level.",
        charts: [
          {
            id: "forecast",
            title: "Orders forecast",
            kind: "line",
            labels: ["Baseline", "At spend", "Upper"],
            values: [800, predicted, predicted * 1.05],
          },
          {
            id: "errors",
            title: "Error (%)",
            kind: "bar",
            labels: ["Train", "Holdout"],
            values: [trainErr, holdoutErr],
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
        ],
        stats: [
          { label: "Ad spend", value: `$${spend}k`, emphasis: true },
          { label: "Predicted orders", value: Math.round(predicted).toLocaleString() },
          { label: "Holdout error", value: `~${holdoutErr.toFixed(0)}%` },
        ],
        actions: {
          optimize: ["Hold out recent weeks before trusting fit", "Stress-test spend outside training range"],
          hold: ["Budget from in-sample R² alone"],
          escalateIf: ["Holdout error doubles when spend steps up"],
        },
      };
    },
  },
  {
    slug: "base-rates-real-decisions",
    title: "Fraud alerts: base rate before you react",
    intro: "Move true fraud rate and alert precision. Most alerts can be false even when the model looks useful.",
    sliders: [
      {
        id: "baseRate",
        label: "True fraud rate (%)",
        min: 0.1,
        max: 5,
        step: 0.1,
        default: 0.8,
        format: (v) => `${v}%`,
      },
      {
        id: "precision",
        label: "Alert precision (%)",
        min: 10,
        max: 90,
        step: 5,
        default: 35,
        format: (v) => `${v}%`,
      },
    ],
    compute: (state) => {
      const base = n(state, "baseRate", 0.8) / 100;
      const prec = n(state, "precision", 35) / 100;
      const alertsPer1000 = 20;
      const truePos = alertsPer1000 * prec;
      const falsePos = alertsPer1000 - truePos;
      return {
        headline: `${alertsPer1000} alerts/1k txn → ~${truePos.toFixed(0)} true, ~${falsePos.toFixed(0)} false`,
        readout: `Only ~${(base * 100).toFixed(1)}% of txn are fraud. State base rate before staffing review queue.`,
        charts: [
          {
            id: "alerts",
            title: "Alerts per 1k txn",
            kind: "bar",
            labels: ["True fraud", "False alert"],
            values: [truePos, falsePos],
          },
          {
            id: "rates",
            title: "Rates (%)",
            kind: "bar",
            labels: ["Base fraud", "Precision"],
            values: [base * 100, prec * 100],
            valueFormat: (v) => `${v.toFixed(1)}%`,
          },
        ],
        stats: [
          { label: "Base fraud rate", value: `${(base * 100).toFixed(1)}%`, emphasis: true },
          { label: "Alert precision", value: `${(prec * 100).toFixed(0)}%` },
          { label: "False alerts/1k", value: `~${falsePos.toFixed(0)}` },
        ],
        actions: {
          optimize: ["State base rate out loud in queue reviews", "Calibrate staffing to precision × volume"],
          hold: ["Investigating every alert as if fraud were common"],
          escalateIf: ["False alert cost exceeds fraud loss prevented"],
        },
      };
    },
  },
  {
    slug: "concept-drift-real-decisions",
    title: "Fraud model review: train vs live after a launch",
    intro: "Increase drift severity. Training accuracy holds while live accuracy and false positives worsen.",
    sliders: [
      {
        id: "drift",
        label: "Concept drift severity",
        min: 0,
        max: 100,
        step: 1,
        default: 55,
        lowLabel: "Stable",
        highLabel: "Severe shift",
      },
      {
        id: "autoBlock",
        label: "Auto-block share (%)",
        min: 0,
        max: 15,
        step: 1,
        default: 6,
        format: (v) => `${v}%`,
      },
    ],
    compute: (state) => {
      const drift = n(state, "drift", 55);
      const autoBlock = n(state, "autoBlock", 6) / 100;
      const trainAcc = clamp(94 - drift * 0.04, 88, 96);
      const liveAcc = clamp(trainAcc - drift * 0.28, 52, 94);
      const fpRate = clamp(4 + drift * 0.38, 4, 42);
      const dailyVolume = 5000;
      const falseBlocks = Math.round(dailyVolume * autoBlock * (fpRate / 100));
      const gap = trainAcc - liveAcc;
      const curve = [0, 30, 60, 90, 100].map((d) => {
        const t = clamp(94 - d * 0.04, 88, 96);
        return clamp(t - d * 0.28, 52, 96);
      });
      return {
        headline: `Train ${trainAcc.toFixed(0)}% vs live ${liveAcc.toFixed(0)}% — ~${falseBlocks} false blocks/day`,
        readout:
          gap >= 15
            ? "Pause or narrow automation. Retrain on recent labeled data before trusting auto-block."
            : gap >= 8
              ? "Schedule retraining and replot calibration. Threshold tweaks may buy time."
              : "Drift is manageable — keep monitoring score distributions monthly.",
        charts: [
          {
            id: "accuracy",
            title: "Accuracy (%)",
            kind: "bar",
            labels: ["Train", "Live"],
            values: [trainAcc, liveAcc],
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
          {
            id: "drift-curve",
            title: "Live accuracy vs drift",
            kind: "line",
            labels: ["0", "30", "60", "90", "100"],
            values: curve,
            valueFormat: (v) => `${v.toFixed(0)}%`,
          },
        ],
        stats: [
          { label: "Train accuracy", value: `${trainAcc.toFixed(0)}%` },
          { label: "Live accuracy", value: `${liveAcc.toFixed(0)}%`, emphasis: true },
          { label: "False blocks / day", value: `~${falseBlocks}` },
        ],
        actions: {
          optimize: [
            "Monitor live labeled accuracy weekly after launches",
            "Retrain on rolling 90-day window when gap opens",
          ],
          hold: ["Trusting training accuracy after product or fraud pattern changes"],
          escalateIf: [
            "Train vs live accuracy gap exceeds 15 pp",
            "Live false-positive rate above 25%",
          ],
        },
      };
    },
  },
];
