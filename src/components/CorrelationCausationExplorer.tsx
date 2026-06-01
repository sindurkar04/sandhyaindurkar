"use client";

import { useMemo, useState } from "react";

type ScenarioKey = "summer" | "launch_week" | "sleep";

type Point = { x: number; y: number; z: number };

type Scenario = {
  label: string;
  xLabel: string;
  yLabel: string;
  zLabel: string;
  naiveHeadline: string;
  confounderHeadline: string;
  naiveDetail: string;
  confounderDetail: string;
  points: Point[];
};

function seededNoise(index: number, salt = 0): number {
  const value = Math.sin((index + 1) * (12.9898 + salt)) * 43758.5453;
  return value - Math.floor(value);
}

function buildSummerScenario(): Point[] {
  const points: Point[] = [];
  for (let week = 0; week < 22; week += 1) {
    const z = 58 + (week / 21) * 32 + (seededNoise(week, 1) - 0.5) * 6;
    const x = 18 + z * 0.85 + (seededNoise(week, 2) - 0.5) * 8;
    const y = 1.5 + z * 0.07 + (seededNoise(week, 3) - 0.5) * 1.2;
    points.push({ x, y, z });
  }
  return points;
}

function buildLaunchScenario(): Point[] {
  const points: Point[] = [];
  for (let week = 0; week < 22; week += 1) {
    const isLaunch = week >= 8 && week <= 11;
    const z = isLaunch ? 1 : 0;
    const x = 12 + week * 0.9 + (seededNoise(week, 4) - 0.5) * 5 + (isLaunch ? 28 : 0);
    const y = 40 + week * 2.2 + (seededNoise(week, 5) - 0.5) * 8 + (isLaunch ? 55 : 0);
    points.push({ x, y, z });
  }
  return points;
}

function buildSleepScenario(): Point[] {
  const points: Point[] = [];
  for (let student = 0; student < 22; student += 1) {
    const z = 5.2 + seededNoise(student, 6) * 3.3;
    const x = 7.5 - z * 0.75 + (seededNoise(student, 7) - 0.5) * 1.4;
    const y = 52 + z * 9.5 + (seededNoise(student, 8) - 0.5) * 6;
    points.push({ x, y, z });
  }
  return points;
}

const SCENARIOS: Record<ScenarioKey, Scenario> = {
  summer: {
    label: "Ice cream vs drownings",
    xLabel: "Ice cream sales index",
    yLabel: "Drowning incidents",
    zLabel: "Avg. temperature (°F)",
    naiveHeadline: "Strong correlation — easy to tell a causal story",
    confounderHeadline: "Same weeks, colored by temperature",
    naiveDetail:
      "Ice cream sales and drowning deaths move together across weeks. Correlation is high, but neither variable is driving the other.",
    confounderDetail:
      "Warm weather increases swimming and ice cream demand. The shared driver creates correlation without direct causation.",
    points: buildSummerScenario(),
  },
  launch_week: {
    label: "Ad spend vs revenue",
    xLabel: "Weekly ad spend ($k)",
    yLabel: "Weekly revenue ($k)",
    zLabel: "Product launch week",
    naiveHeadline: "Marketing and revenue rise together",
    confounderHeadline: "Launch weeks highlighted",
    naiveDetail:
      "Higher ad spend lines up with higher revenue. Leadership may credit ads for the entire lift.",
    confounderDetail:
      "A major launch increases both spend and revenue in the same weeks. The launch is a confounder, not proof that every dollar of ads caused incremental sales.",
    points: buildLaunchScenario(),
  },
  sleep: {
    label: "Screen time vs grades",
    xLabel: "Daily screen time (hrs)",
    yLabel: "Test score",
    zLabel: "Sleep per night (hrs)",
    naiveHeadline: "More screen time, lower scores",
    confounderHeadline: "Sleep hours explain the pattern",
    naiveDetail:
      "Students with more screen time tend to score lower. A quick read: screens cause worse grades.",
    confounderDetail:
      "Students who sleep less tend to use screens more and score lower. Sleep is a confounder — changing screens alone may not move grades if sleep stays the same.",
    points: buildSleepScenario(),
  },
};

function pearson(points: Point[]): number {
  const n = points.length;
  if (n < 2) {
    return 0;
  }

  const meanX = points.reduce((sum, point) => sum + point.x, 0) / n;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (const point of points) {
    const dx = point.x - meanX;
    const dy = point.y - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}

function formatR(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

function zToColor(z: number, minZ: number, maxZ: number): string {
  const t = maxZ === minZ ? 0.5 : (z - minZ) / (maxZ - minZ);
  const gray = Math.round(210 - t * 150);
  return `rgb(${gray}, ${gray}, ${gray})`;
}

function ScatterPanel({
  points,
  xLabel,
  yLabel,
  showConfounder,
  zLabel,
  scenarioKey,
}: {
  points: Point[];
  xLabel: string;
  yLabel: string;
  showConfounder: boolean;
  zLabel: string;
  scenarioKey: ScenarioKey;
}) {
  const width = 360;
  const height = 240;
  const pad = 44;

  const { minX, maxX, minY, maxY, minZ, maxZ } = useMemo(() => {
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    const zs = points.map((point) => point.z);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
      minZ: Math.min(...zs),
      maxZ: Math.max(...zs),
    };
  }, [points]);

  const scaleX = (value: number) =>
    pad + ((value - minX) / (maxX - minX || 1)) * (width - pad * 2);
  const scaleY = (value: number) =>
    height - pad - ((value - minY) / (maxY - minY || 1)) * (height - pad * 2);

  const regression = useMemo(() => {
    const n = points.length;
    const meanX = points.reduce((sum, point) => sum + point.x, 0) / n;
    const meanY = points.reduce((sum, point) => sum + point.y, 0) / n;

    let slopeNumerator = 0;
    let slopeDenominator = 0;

    for (const point of points) {
      slopeNumerator += (point.x - meanX) * (point.y - meanY);
      slopeDenominator += (point.x - meanX) ** 2;
    }

    const slope = slopeDenominator === 0 ? 0 : slopeNumerator / slopeDenominator;
    const intercept = meanY - slope * meanX;

    const x1 = minX;
    const x2 = maxX;

    return {
      x1,
      y1: intercept + slope * x1,
      x2,
      y2: intercept + slope * x2,
    };
  }, [maxX, minX, points]);

  return (
    <div className="mt-5 overflow-x-auto">
      <svg
        aria-label={`Scatter plot of ${xLabel} versus ${yLabel}`}
        className="mx-auto"
        height={height}
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        width={width}
      >
        <line
          stroke="#e5e7eb"
          strokeWidth="1"
          x1={pad}
          x2={width - pad}
          y1={height - pad}
          y2={height - pad}
        />
        <line
          stroke="#e5e7eb"
          strokeWidth="1"
          x1={pad}
          x2={pad}
          y1={pad}
          y2={height - pad}
        />
        <line
          stroke="#111111"
          strokeDasharray="5 4"
          strokeWidth="1.5"
          x1={scaleX(regression.x1)}
          x2={scaleX(regression.x2)}
          y1={scaleY(regression.y1)}
          y2={scaleY(regression.y2)}
        />
        {points.map((point, index) => {
          const isLaunch = scenarioKey === "launch_week" && point.z > 0;
          const fill = showConfounder
            ? isLaunch
              ? "#111111"
              : zToColor(point.z, minZ, maxZ)
            : "#9ca3af";

          return (
            <circle
              cx={scaleX(point.x)}
              cy={scaleY(point.y)}
              fill={fill}
              key={`${point.x}-${point.y}-${index}`}
              r={showConfounder && isLaunch ? 6 : 5}
              stroke={showConfounder && isLaunch ? "#111111" : "none"}
              strokeWidth={2}
            />
          );
        })}
        <text fill="#6b7280" fontSize="12" textAnchor="middle" x={width / 2} y={height - 8}>
          {xLabel}
        </text>
        <text
          fill="#6b7280"
          fontSize="12"
          textAnchor="middle"
          transform={`rotate(-90, 14, ${height / 2})`}
          x={14}
          y={height / 2}
        >
          {yLabel}
        </text>
      </svg>
      {showConfounder && (
        <p className="mt-2 text-center text-xs text-[color:var(--muted)]">
          Point color: {zLabel}
          {scenarioKey === "launch_week" ? " (dark = launch week)" : ""}
        </p>
      )}
    </div>
  );
}

const EVIDENCE_ITEMS = [
  {
    id: "time",
    label: "Cause comes before effect",
    detail: "Changes in X happen before changes in Y, not only at the same time.",
  },
  {
    id: "mechanism",
    label: "Plausible mechanism",
    detail: "You can explain how X could physically or logically change Y.",
  },
  {
    id: "experiment",
    label: "Controlled comparison",
    detail: "A test holds other factors steady while changing only X.",
  },
  {
    id: "confounders",
    label: "Confounders addressed",
    detail: "Alternative explanations were measured and ruled out or adjusted for.",
  },
] as const;

export default function CorrelationCausationExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("summer");
  const [showConfounder, setShowConfounder] = useState(false);
  const [evidence, setEvidence] = useState<Record<string, boolean>>({
    time: false,
    mechanism: false,
    experiment: false,
    confounders: false,
  });

  const scenario = SCENARIOS[scenarioKey];
  const correlation = useMemo(() => pearson(scenario.points), [scenario.points]);
  const evidenceCount = EVIDENCE_ITEMS.filter((item) => evidence[item.id]).length;

  return (
    <>
      <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
        <h3 className="text-lg font-bold text-[color:var(--foreground)]">
          Example: correlation is not causation
        </h3>
        <p className="mt-2 text-base leading-relaxed text-[color:var(--muted)]">
          Pick a real-world pattern, read the correlation, then reveal the hidden factor. The
          scatter plot stays the same — the interpretation changes.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
            <button
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                scenarioKey === key
                  ? "bg-black text-white"
                  : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
              }`}
              key={key}
              onClick={() => {
                setScenarioKey(key);
                setShowConfounder(false);
              }}
              type="button"
            >
              {SCENARIOS[key].label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
              Correlation (r)
            </p>
            <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
              {formatR(correlation)}
            </p>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
              Causal claim from r alone?
            </p>
            <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
              {Math.abs(correlation) > 0.7 ? "Still no" : "No"}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              !showConfounder
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
            }`}
            onClick={() => setShowConfounder(false)}
            type="button"
          >
            Correlation view
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              showConfounder
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
            }`}
            onClick={() => setShowConfounder(true)}
            type="button"
          >
            Reveal hidden factor
          </button>
        </div>

        <p className="mt-4 text-sm font-bold text-[color:var(--foreground)]">
          {showConfounder ? scenario.confounderHeadline : scenario.naiveHeadline}
        </p>
        <p className="mt-2 text-base leading-relaxed text-[color:var(--muted)]">
          {showConfounder ? scenario.confounderDetail : scenario.naiveDetail}
        </p>

        <ScatterPanel
          points={scenario.points}
          scenarioKey={scenarioKey}
          showConfounder={showConfounder}
          xLabel={scenario.xLabel}
          yLabel={scenario.yLabel}
          zLabel={scenario.zLabel}
        />

        <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
          Correlation measures how two variables move together ({formatR(correlation)} here). It
          does not tell you whether X causes Y, Y causes X, or a third factor drives both.
        </p>
      </section>

      <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
        <h3 className="text-lg font-bold text-[color:var(--foreground)]">
          Checklist: what supports a causal claim?
        </h3>
        <p className="mt-2 text-base leading-relaxed text-[color:var(--muted)]">
          Strong correlation is only the starting point. Toggle what you would need before acting
          on a causal story in a product or policy decision.
        </p>

        <div className="mt-5 space-y-3">
          {EVIDENCE_ITEMS.map((item) => (
            <label
              className="flex cursor-pointer gap-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3"
              key={item.id}
            >
              <input
                checked={evidence[item.id]}
                className="mt-1 accent-black"
                onChange={(event) =>
                  setEvidence((current) => ({
                    ...current,
                    [item.id]: event.target.checked,
                  }))
                }
                type="checkbox"
              />
              <span>
                <span className="text-sm font-bold text-[color:var(--foreground)]">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-[color:var(--muted)]">
                  {item.detail}
                </span>
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            <span>Evidence strength</span>
            <span>
              {evidenceCount} / {EVIDENCE_ITEMS.length}
            </span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-[color:var(--border)]">
            <div
              className="h-full rounded-full bg-black transition-all duration-300"
              style={{ width: `${(evidenceCount / EVIDENCE_ITEMS.length) * 100}%` }}
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
            {evidenceCount === 0 &&
              "With correlation only, you have a hypothesis — not a safe basis for intervention."}
            {evidenceCount > 0 && evidenceCount < 4 &&
              "You are building a case. Each unchecked item is a reason the causal story might still fail."}
            {evidenceCount === 4 &&
              "You still need domain judgment, but this is the level of thinking teams use before scaling a change."}
          </p>
        </div>
      </section>
    </>
  );
}
