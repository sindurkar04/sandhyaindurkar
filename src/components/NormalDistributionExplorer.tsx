"use client";

import {
  COLORS,
  SCENARIOS,
  formatNum,
  normalPdf,
  normalReadout,
  type ScenarioKey,
} from "@/lib/normal-distribution-data";
import { useMemo, useState } from "react";

const W = 400;
const H = 240;
const PAD = 44;

export default function NormalDistributionExplorer() {
  const [key, setKey] = useState<ScenarioKey>("delivery_time");
  const scenario = SCENARIOS[key];
  const [mu, setMu] = useState(scenario.defaultMu);
  const [sigma, setSigma] = useState(scenario.defaultSigma);
  const [showCompare, setShowCompare] = useState(false);

  function selectScenario(scenarioKey: ScenarioKey) {
    const s = SCENARIOS[scenarioKey];
    setKey(scenarioKey);
    setMu(s.defaultMu);
    setSigma(s.defaultSigma);
  }

  const xMin = mu - 4 * sigma;
  const xMax = mu + 4 * sigma;
  const steps = 120;
  const xs = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i <= steps; i++) {
      arr.push(xMin + (i / steps) * (xMax - xMin));
    }
    return arr;
  }, [xMin, xMax]);

  const ys = useMemo(() => xs.map((x) => normalPdf(x, mu, sigma)), [xs, mu, sigma]);
  const compareYs = useMemo(
    () => xs.map((x) => normalPdf(x, scenario.compareMu, scenario.compareSigma)),
    [xs, scenario.compareMu, scenario.compareSigma],
  );
  const yMax = useMemo(() => Math.max(...ys, ...(showCompare ? compareYs : [0])) * 1.15, [ys, compareYs, showCompare]);

  const plotW = W - PAD * 2;
  const plotH = H - PAD * 2;

  const toX = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * plotW;
  const toY = (y: number) => PAD + plotH - (y / yMax) * plotH;

  const curvePath = xs
    .map((x, i) => `${i === 0 ? "M" : "L"} ${toX(x)} ${toY(ys[i])}`)
    .join(" ");

  const comparePath = xs
    .map((x, i) => `${i === 0 ? "M" : "L"} ${toX(x)} ${toY(compareYs[i])}`)
    .join(" ");

  function shadeRegion(low: number, high: number, color: string, opacity: number) {
    const regionXs = xs.filter((x) => x >= low && x <= high);
    if (regionXs.length < 2) return null;
    const topPath = regionXs.map((x) => `L ${toX(x)} ${toY(normalPdf(x, mu, sigma))}`).join(" ");
    const baseLow = toX(regionXs[0]);
    const baseHigh = toX(regionXs[regionXs.length - 1]);
    return (
      <path
        d={`M ${baseLow} ${toY(0)} ${topPath} L ${baseHigh} ${toY(0)} Z`}
        fill={color}
        opacity={opacity}
      />
    );
  }

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: bell curve, mean, and sigma bands
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        The normal density clusters around mu. Sigma sets spread. Shaded bands show the 68-95-99.7
        empirical rule in action.
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
          <div>
            <label className="text-sm font-bold" htmlFor="mu">
              Mean (mu): {formatNum(mu)} {scenario.unit}
            </label>
            <input
              className="mt-2 w-full accent-black"
              id="mu"
              max={scenario.defaultMu * 1.5}
              min={scenario.defaultMu * 0.5}
              onChange={(e) => setMu(Number(e.target.value))}
              step={scenario.defaultMu > 30 ? 2 : 1}
              type="range"
              value={mu}
            />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="sigma">
              Std dev (sigma): {formatNum(sigma)} {scenario.unit}
            </label>
            <input
              className="mt-2 w-full accent-black"
              id="sigma"
              max={scenario.defaultSigma * 3}
              min={scenario.defaultSigma * 0.3}
              onChange={(e) => setSigma(Number(e.target.value))}
              step={scenario.defaultSigma > 5 ? 2 : 0.5}
              type="range"
              value={sigma}
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-bold text-[color:var(--foreground)]">
            <input
              checked={showCompare}
              className="accent-black"
              onChange={(e) => setShowCompare(e.target.checked)}
              type="checkbox"
            />
            Compare overlay (orange, mu={formatNum(scenario.compareMu)}, sigma=
            {formatNum(scenario.compareSigma)})
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[color:var(--border)] px-3 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">+/-1 sigma</p>
            <p className="mt-1 text-xl font-black" style={{ color: COLORS.teal }}>
              68%
            </p>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] px-3 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">+/-2 sigma</p>
            <p className="mt-1 text-xl font-black" style={{ color: COLORS.violet }}>
              95%
            </p>
          </div>
          <div className="rounded-lg border border-[color:var(--border)] px-3 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">+/-3 sigma</p>
            <p className="mt-1 text-xl font-black" style={{ color: COLORS.amber }}>
              99.7%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-blue-50 to-white p-3">
        <svg
          aria-label="Gaussian density curve with sigma bands"
          className="mx-auto block w-full max-w-[400px]"
          height={H}
          role="img"
          viewBox={`0 0 ${W} ${H}`}
          width={W}
        >
          <rect fill="#f8fafc" height={plotH} width={plotW} x={PAD} y={PAD} />
          {shadeRegion(mu - 3 * sigma, mu + 3 * sigma, COLORS.amber, 0.12)}
          {shadeRegion(mu - 2 * sigma, mu + 2 * sigma, COLORS.violet, 0.2)}
          {shadeRegion(mu - sigma, mu + sigma, COLORS.teal, 0.35)}
          <line stroke={COLORS.grid} x1={PAD} x2={W - PAD} y1={PAD + plotH} y2={PAD + plotH} />
          <line stroke={COLORS.blue} strokeDasharray="4 3" strokeWidth="1.5" x1={toX(mu)} x2={toX(mu)} y1={PAD} y2={PAD + plotH} />
          <path d={curvePath} fill="none" stroke={COLORS.blue} strokeWidth="2.5" />
          {showCompare && (
            <path d={comparePath} fill="none" stroke={COLORS.orange} strokeDasharray="6 4" strokeWidth="2" />
          )}
          <text fill={COLORS.blue} fontSize="11" fontWeight="700" textAnchor="middle" x={toX(mu)} y={PAD + plotH + 16}>
            mu={formatNum(mu)}
          </text>
          <text fill={COLORS.teal} fontSize="10" fontWeight="700" x={PAD + 4} y={PAD + 12}>
            68%
          </text>
          <text fill={COLORS.violet} fontSize="10" fontWeight="700" x={PAD + 4} y={PAD + 24}>
            95%
          </text>
        </svg>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {normalReadout(mu, sigma, scenario.unit)}
      </p>
    </section>
  );
}
