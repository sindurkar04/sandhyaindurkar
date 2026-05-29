export type ScenarioKey = "checkout_test" | "fraud_rule" | "feature_launch";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  defaultStrictness: number;
  costOfFalseAlarm: string;
  costOfMissedWin: string;
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  checkout_test: {
    key: "checkout_test",
    shortLabel: "Checkout test",
    headline: "Ship a redesign when the readout looks positive",
    defaultStrictness: 45,
    costOfFalseAlarm: "Revenue dip while you roll back a change that never helped",
    costOfMissedWin: "Months of flat conversion while a real lift waits in the data",
  },
  fraud_rule: {
    key: "fraud_rule",
    shortLabel: "Fraud rule",
    headline: "Block orders when the model fires",
    defaultStrictness: 55,
    costOfFalseAlarm: "Good customers blocked, support load spikes",
    costOfMissedWin: "Fraud slips through, chargebacks rise",
  },
  feature_launch: {
    key: "feature_launch",
    shortLabel: "Feature launch",
    headline: "Hold a feature because beta results were mixed",
    defaultStrictness: 70,
    costOfFalseAlarm: "Engineering spent on a feature that did not move core metrics",
    costOfMissedWin: "Competitors ship while you wait for perfect certainty",
  },
};

/** 0 = loose bar, 100 = strict bar. Tighter rules cut false alarms and raise missed wins. */
export function ratesFromStrictness(strictness: number): {
  falseAlarm: number;
  missedWin: number;
} {
  const clamped = Math.min(100, Math.max(0, strictness));
  const falseAlarm = Math.round(26 - clamped * 0.21);
  const missedWin = Math.round(10 + clamped * 0.58);
  return {
    falseAlarm: Math.min(25, Math.max(4, falseAlarm)),
    missedWin: Math.min(70, Math.max(8, missedWin)),
  };
}

export function expectedOutOf100(ratePercent: number): number {
  return Math.round(ratePercent);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export type TradeoffVerdict = {
  verdict: string;
  lean: "strict" | "balanced" | "loose";
  falseAlarmLine: string;
  missedWinLine: string;
  pickLine: string;
};

export function tradeoffVerdict(
  falseAlarm: number,
  missedWin: number,
  scenario: Scenario,
): TradeoffVerdict {
  const falseCount = expectedOutOf100(falseAlarm);
  const missedCount = expectedOutOf100(missedWin);

  const falseAlarmLine = `Out of 100 tests with no real lift, about ${falseCount} would still ship (false alarms).`;
  const missedWinLine = `Out of 100 tests with a real lift, about ${missedCount} would never ship (missed wins).`;

  if (falseAlarm <= 6 && missedWin >= 40) {
    return {
      verdict: "Strict bar: fewer false alarms, more missed wins",
      lean: "strict",
      falseAlarmLine,
      missedWinLine,
      pickLine: `At ${formatPercent(falseAlarm)} false alarms vs ${formatPercent(missedWin)} missed wins, you are protecting against ${scenario.costOfFalseAlarm.toLowerCase()}.`,
    };
  }

  if (falseAlarm >= 14 && missedWin <= 22) {
    return {
      verdict: "Loose bar: more false alarms, fewer missed wins",
      lean: "loose",
      falseAlarmLine,
      missedWinLine,
      pickLine: `At ${formatPercent(falseAlarm)} false alarms vs ${formatPercent(missedWin)} missed wins, you are accepting ${scenario.costOfFalseAlarm.toLowerCase()} to avoid ${scenario.costOfMissedWin.toLowerCase()}.`,
    };
  }

  return {
    verdict: "Balanced middle: watch both error rates",
    lean: "balanced",
    falseAlarmLine,
    missedWinLine,
    pickLine: `Trading ${formatPercent(falseAlarm)} false alarms for ${formatPercent(missedWin)} missed wins. Ask which cost hurts more here: ${scenario.costOfFalseAlarm.toLowerCase()}, or ${scenario.costOfMissedWin.toLowerCase()}.`,
  };
}

export function strictnessLabel(strictness: number): string {
  if (strictness >= 70) {
    return "Strict";
  }
  if (strictness <= 30) {
    return "Loose";
  }
  return "Moderate";
}
