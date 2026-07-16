"use client";

import {
  COLORS,
  SCENARIOS,
  formatNum,
  l2Distance,
  scalingReadout,
  zScore,
  type ScenarioKey,
} from "@/lib/feature-scaling-zscore-data";
import { useMemo, useState } from "react";

const SCATTER_W = 320;
const SCATTER_H = 260;
const PAD = 40;
const BAR_W = 280;
const BAR_H = 180;

function rawToSvg(
  x: number,
  y: number,
  maxX: number,
  maxY: number,
): { sx: number; sy: number } {
  const plotW = SCATTER_W - PAD * 2;
  const plotH = SCATTER_H - PAD * 2;
  return {
    sx: PAD + (x / maxX) * plotW,
    sy: PAD + plotH - (y / maxY) * plotH,
  };
}

function zToSvg(zx: number, zy: number): { sx: number; sy: number } {
  const plotW = SCATTER_W - PAD * 2;
  const plotH = SCATTER_H - PAD * 2;
  const scale = 3;
  return {
    sx: PAD + plotW / 2 + (zx / scale) * (plotW / 2),
    sy: PAD + plotH / 2 - (zy / scale) * (plotH / 2),
  };
}

export default function FeatureScalingZscoreExplorer() {
  const [key, setKey] = useState<ScenarioKey>("customer_similarity");
  const scenario = SCENARIOS[key];
  const [a1, setA1] = useState(scenario.defaultPointA[0]);
  const [a2, setA2] = useState(scenario.defaultPointA[1]);
  const [b1, setB1] = useState(scenario.defaultPointB[0]);
  const [b2, setB2] = useState(scenario.defaultPointB[1]);
  const [mean1, setMean1] = useState(scenario.defaultMean1);
  const [sd1, setSd1] = useState(scenario.defaultSd1);
  const [mean2, setMean2] = useState(scenario.defaultMean2);
  const [sd2, setSd2] = useState(scenario.defaultSd2);

  function selectScenario(scenarioKey: ScenarioKey) {
    const s = SCENARIOS[scenarioKey];
    setKey(scenarioKey);
    setA1(s.defaultPointA[0]);
    setA2(s.defaultPointA[1]);
    setB1(s.defaultPointB[0]);
    setB2(s.defaultPointB[1]);
    setMean1(s.defaultMean1);
    setSd1(s.defaultSd1);
    setMean2(s.defaultMean2);
    setSd2(s.defaultSd2);
  }

  const rawDist = useMemo(() => l2Distance([a1, a2], [b1, b2]), [a1, a2, b1, b2]);
  const zA: [number, number] = [zScore(a1, mean1, sd1), zScore(a2, mean2, sd2)];
  const zB: [number, number] = [zScore(b1, mean1, sd1), zScore(b2, mean2, sd2)];
  const zDist = useMemo(() => l2Distance(zA, zB), [zA, zB]);

  const maxX = Math.max(a1, b1, mean1 + 2 * sd1) * 1.15;
  const maxY = Math.max(a2, b2, mean2 + 2 * sd2) * 1.15;
  const rawA = rawToSvg(a1, a2, maxX, maxY);
  const rawB = rawToSvg(b1, b2, maxX, maxY);
  const zSvgA = zToSvg(zA[0], zA[1]);
  const zSvgB = zToSvg(zB[0], zB[1]);

  const maxBar = Math.max(rawDist, zDist, 0.01);
  const rawBarH = (rawDist / maxBar) * (BAR_H - 40);
  const zBarH = (zDist / maxBar) * (BAR_H - 40);

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: L2 distance before and after z-scoring
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        Two features on different scales make distance follow the loud dimension. Z-scores put both
        on comparable footing so k-NN and clustering see both signals.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(SCENARIOS) as ScenarioKey[]).map((scenarioKey) => (
          <button
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              key === scenarioKey
                ? "bg-black text-white"
                : "border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] text-[color:var(--foreground)]"
            }`}
            key={scenarioKey}
            onClick={() => selectScenario(scenarioKey)}
            type="button"
          >
            {SCENARIOS[scenarioKey].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Point A ({scenario.feature1Label}, {scenario.feature2Label})
          </p>
          <div>
            <label className="text-sm font-bold" htmlFor="a1">
              {scenario.feature1Label}: {formatNum(a1, 0)} {scenario.feature1Unit}
            </label>
            <input
              className="mt-1 w-full accent-black"
              id="a1"
              max={scenario.defaultMean1 * 3}
              min={0}
              onChange={(e) => setA1(Number(e.target.value))}
              step={scenario.defaultMean1 > 100 ? 10 : 1}
              type="range"
              value={a1}
            />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="a2">
              {scenario.feature2Label}: {formatNum(a2, 0)} {scenario.feature2Unit}
            </label>
            <input
              className="mt-1 w-full accent-black"
              id="a2"
              max={scenario.defaultMean2 * 3}
              min={0}
              onChange={(e) => setA2(Number(e.target.value))}
              step={scenario.defaultMean2 > 100 ? 50 : 1}
              type="range"
              value={a2}
            />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Point B
          </p>
          <div>
            <label className="text-sm font-bold" htmlFor="b1">
              {scenario.feature1Label}: {formatNum(b1, 0)} {scenario.feature1Unit}
            </label>
            <input
              className="mt-1 w-full accent-black"
              id="b1"
              max={scenario.defaultMean1 * 3}
              min={0}
              onChange={(e) => setB1(Number(e.target.value))}
              step={scenario.defaultMean1 > 100 ? 10 : 1}
              type="range"
              value={b1}
            />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="b2">
              {scenario.feature2Label}: {formatNum(b2, 0)} {scenario.feature2Unit}
            </label>
            <input
              className="mt-1 w-full accent-black"
              id="b2"
              max={scenario.defaultMean2 * 3}
              min={0}
              onChange={(e) => setB2(Number(e.target.value))}
              step={scenario.defaultMean2 > 100 ? 50 : 1}
              type="range"
              value={b2}
            />
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Z-score parameters
          </p>
          <div>
            <label className="text-sm font-bold" htmlFor="mean1">
              Mean {scenario.feature1Label}: {formatNum(mean1, 0)}
            </label>
            <input
              className="mt-1 w-full accent-black"
              id="mean1"
              max={scenario.defaultMean1 * 2}
              min={scenario.defaultMean1 * 0.3}
              onChange={(e) => setMean1(Number(e.target.value))}
              step={scenario.defaultMean1 > 100 ? 10 : 1}
              type="range"
              value={mean1}
            />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="sd1">
              SD {scenario.feature1Label}: {formatNum(sd1, 0)}
            </label>
            <input
              className="mt-1 w-full accent-black"
              id="sd1"
              max={scenario.defaultSd1 * 3}
              min={scenario.defaultSd1 * 0.2}
              onChange={(e) => setSd1(Number(e.target.value))}
              step={scenario.defaultSd1 > 10 ? 5 : 1}
              type="range"
              value={sd1}
            />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="mean2">
              Mean {scenario.feature2Label}: {formatNum(mean2, 0)}
            </label>
            <input
              className="mt-1 w-full accent-black"
              id="mean2"
              max={scenario.defaultMean2 * 2}
              min={scenario.defaultMean2 * 0.3}
              onChange={(e) => setMean2(Number(e.target.value))}
              step={scenario.defaultMean2 > 100 ? 50 : 1}
              type="range"
              value={mean2}
            />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="sd2">
              SD {scenario.feature2Label}: {formatNum(sd2, 1)}
            </label>
            <input
              className="mt-1 w-full accent-black"
              id="sd2"
              max={scenario.defaultSd2 * 3}
              min={scenario.defaultSd2 * 0.2}
              onChange={(e) => setSd2(Number(e.target.value))}
              step={scenario.defaultSd2 > 10 ? 10 : 0.5}
              type="range"
              value={sd2}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-orange-50 to-white p-3">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Raw space (orange axis stretch)
          </p>
          <svg
            aria-label="Scatter plot in raw feature space"
            className="mx-auto block w-full max-w-[320px]"
            height={SCATTER_H}
            role="img"
            viewBox={`0 0 ${SCATTER_W} ${SCATTER_H}`}
            width={SCATTER_W}
          >
            <rect fill="#fff7ed" height={SCATTER_H - PAD * 2} width={SCATTER_W - PAD * 2} x={PAD} y={PAD} />
            <line stroke={COLORS.orange} strokeWidth="3" x1={PAD} x2={SCATTER_W - PAD} y1={SCATTER_H - PAD} y2={SCATTER_H - PAD} />
            <line stroke={COLORS.axis} strokeWidth="1" x1={PAD} x2={PAD} y1={PAD} y2={SCATTER_H - PAD} />
            <line stroke={COLORS.orange} strokeDasharray="4 3" strokeWidth="1.5" x1={rawA.sx} x2={rawB.sx} y1={rawA.sy} y2={rawB.sy} />
            <circle cx={rawA.sx} cy={rawA.sy} fill={COLORS.blue} r="7" />
            <circle cx={rawB.sx} cy={rawB.sy} fill={COLORS.violet} r="7" />
            <text fill={COLORS.orange} fontSize="10" fontWeight="700" x={PAD + 4} y={SCATTER_H - PAD + 14}>
              {scenario.feature1Label}
            </text>
            <text fill={COLORS.axis} fontSize="10" fontWeight="700" x={8} y={PAD + 4}>
              {scenario.feature2Label}
            </text>
          </svg>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-teal-50 to-white p-3">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Z-scored space (balanced)
          </p>
          <svg
            aria-label="Scatter plot in z-scored space"
            className="mx-auto block w-full max-w-[320px]"
            height={SCATTER_H}
            role="img"
            viewBox={`0 0 ${SCATTER_W} ${SCATTER_H}`}
            width={SCATTER_W}
          >
            <rect fill="#f0fdfa" height={SCATTER_H - PAD * 2} width={SCATTER_W - PAD * 2} x={PAD} y={PAD} />
            <ellipse
              cx={SCATTER_W / 2}
              cy={SCATTER_H / 2}
              fill="none"
              rx={(SCATTER_W - PAD * 2) / 2 - 8}
              ry={(SCATTER_H - PAD * 2) / 2 - 8}
              stroke={COLORS.teal}
              strokeDasharray="5 4"
              strokeWidth="1.5"
            />
            <line stroke={COLORS.grid} x1={PAD} x2={SCATTER_W - PAD} y1={SCATTER_H / 2} y2={SCATTER_H / 2} />
            <line stroke={COLORS.grid} x1={SCATTER_W / 2} x2={SCATTER_W / 2} y1={PAD} y2={SCATTER_H - PAD} />
            <line stroke={COLORS.teal} strokeWidth="2" x1={zSvgA.sx} x2={zSvgB.sx} y1={zSvgA.sy} y2={zSvgB.sy} />
            <circle cx={zSvgA.sx} cy={zSvgA.sy} fill={COLORS.blue} r="7" />
            <circle cx={zSvgB.sx} cy={zSvgB.sy} fill={COLORS.violet} r="7" />
            <text fill={COLORS.teal} fontSize="10" fontWeight="700" textAnchor="middle" x={SCATTER_W / 2} y={SCATTER_H - PAD + 14}>
              z1
            </text>
            <text fill={COLORS.teal} fontSize="10" fontWeight="700" x={8} y={PAD + 4}>
              z2
            </text>
          </svg>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            L2 distance comparison
          </p>
          <svg
            aria-label="Bar chart comparing raw and z-scored L2 distance"
            className="mx-auto block w-full max-w-[280px]"
            height={BAR_H}
            role="img"
            viewBox={`0 0 ${BAR_W} ${BAR_H}`}
            width={BAR_W}
          >
            <rect fill={COLORS.orange} height={rawBarH} rx="6" width="72" x="56" y={BAR_H - 24 - rawBarH} />
            <rect fill={COLORS.teal} height={zBarH} rx="6" width="72" x="168" y={BAR_H - 24 - zBarH} />
            <text fill={COLORS.orange} fontSize="11" fontWeight="700" textAnchor="middle" x="92" y={BAR_H - 6}>
              Raw
            </text>
            <text fill={COLORS.teal} fontSize="11" fontWeight="700" textAnchor="middle" x="204" y={BAR_H - 6}>
              Z-score
            </text>
            <text fill="#111" fontSize="12" fontWeight="800" textAnchor="middle" x="92" y={BAR_H - 30 - rawBarH}>
              {formatNum(rawDist)}
            </text>
            <text fill="#111" fontSize="12" fontWeight="800" textAnchor="middle" x="204" y={BAR_H - 30 - zBarH}>
              {formatNum(zDist)}
            </text>
          </svg>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--border)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Raw L2</p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">{formatNum(rawDist)}</p>
        </div>
        <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">Z-scored L2</p>
          <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">{formatNum(zDist)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {scalingReadout(rawDist, zDist, scenario)}
      </p>
    </section>
  );
}
