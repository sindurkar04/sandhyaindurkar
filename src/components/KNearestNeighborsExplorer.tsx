"use client";

import {
  COLORS,
  SCENARIOS,
  knnClassify,
  knnReadout,
  type ScenarioKey,
} from "@/lib/k-nearest-neighbors-data";
import { useCallback, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const W = 360;
const H = 300;
const PAD = 36;

function toSvg(x: number, y: number) {
  return {
    sx: PAD + x * (W - PAD * 2),
    sy: PAD + (1 - y) * (H - PAD * 2),
  };
}

function fromSvg(sx: number, sy: number) {
  return {
    x: Math.max(0, Math.min(1, (sx - PAD) / (W - PAD * 2))),
    y: Math.max(0, Math.min(1, 1 - (sy - PAD) / (H - PAD * 2))),
  };
}

export default function KNearestNeighborsExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("fraud_similarity");
  const scenario = SCENARIOS[scenarioKey];
  const [k, setK] = useState(scenario.defaultK);
  const [query, setQuery] = useState(scenario.defaultQuery);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const result = useMemo(() => knnClassify(query, scenario.points, k), [query, scenario.points, k]);

  function selectScenario(key: ScenarioKey) {
    const s = SCENARIOS[key];
    setScenarioKey(key);
    setK(s.defaultK);
    setQuery(s.defaultQuery);
  }

  const handlePointer = useCallback((event: ReactPointerEvent<SVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = ((event.clientX - rect.left) / rect.width) * W;
    const sy = ((event.clientY - rect.top) / rect.height) * H;
    setQuery(fromSvg(sx, sy));
  }, []);

  const neighborSet = new Set(result.neighbors.map((n) => n.index));
  const { sx: qx, sy: qy } = toSvg(query.x, query.y);
  const predColor = result.prediction === 1 ? COLORS.class1 : COLORS.class0;

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: drag the query point and watch neighbors vote
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        No training phase: the model is the labeled history. Distance picks the k closest rows; majority
        label wins.
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
            onClick={() => selectScenario(key)}
            type="button"
          >
            {SCENARIOS[key].shortLabel}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-bold text-[color:var(--foreground)]">{scenario.headline}</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_200px]">
        <div className="overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-slate-50 to-white p-3">
          <svg
            aria-label="k-NN scatter plot with draggable query point"
            className={`mx-auto block w-full max-w-[360px] touch-none select-none ${
              dragging ? "cursor-grabbing" : "cursor-crosshair"
            }`}
            height={H}
            onPointerLeave={() => setDragging(false)}
            ref={svgRef}
            role="img"
            viewBox={`0 0 ${W} ${H}`}
            width={W}
          >
            <rect fill="#f8fafc" height={H - PAD * 2} width={W - PAD * 2} x={PAD} y={PAD} />
            {[0.25, 0.5, 0.75].map((tick) => (
              <line
                key={`gx-${tick}`}
                stroke={COLORS.grid}
                x1={PAD + tick * (W - PAD * 2)}
                x2={PAD + tick * (W - PAD * 2)}
                y1={PAD}
                y2={H - PAD}
              />
            ))}
            {[0.25, 0.5, 0.75].map((tick) => (
              <line
                key={`gy-${tick}`}
                stroke={COLORS.grid}
                x1={PAD}
                x2={W - PAD}
                y1={PAD + tick * (H - PAD * 2)}
                y2={PAD + tick * (H - PAD * 2)}
              />
            ))}
            {result.neighbors.map((n) => {
              const { sx, sy } = toSvg(n.point.x, n.point.y);
              return (
                <line
                  key={`line-${n.index}`}
                  stroke={COLORS.neighborLine}
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  x1={qx}
                  x2={sx}
                  y1={qy}
                  y2={sy}
                />
              );
            })}
            {scenario.points.map((p, i) => {
              const { sx, sy } = toSvg(p.x, p.y);
              const isNeighbor = neighborSet.has(i);
              const fill = p.label === 1 ? COLORS.class1 : COLORS.class0;
              return (
                <circle
                  cx={sx}
                  cy={sy}
                  fill={fill}
                  key={i}
                  opacity={isNeighbor ? 1 : 0.55}
                  r={isNeighbor ? 9 : 7}
                  stroke={isNeighbor ? "#1e293b" : "white"}
                  strokeWidth={isNeighbor ? 2 : 1}
                />
              );
            })}
            <circle
              cx={qx}
              cy={qy}
              fill={COLORS.query}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setDragging(true);
                handlePointer(e);
              }}
              onPointerMove={dragging ? handlePointer : undefined}
              onPointerUp={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId);
                setDragging(false);
              }}
              r={12}
              stroke="white"
              strokeWidth={3}
              style={{ touchAction: "none", cursor: dragging ? "grabbing" : "grab" }}
            />
            <rect
              fill="transparent"
              height={H - PAD * 2}
              onPointerDown={(e) => {
                setDragging(true);
                handlePointer(e);
              }}
              onPointerMove={dragging ? handlePointer : undefined}
              onPointerUp={() => setDragging(false)}
              style={{ touchAction: "none" }}
              width={W - PAD * 2}
              x={PAD}
              y={PAD}
            />
          </svg>
          <ul className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-[color:var(--muted)]">
            <li className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ background: COLORS.class0 }} />
              {scenario.class0Label}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ background: COLORS.class1 }} />
              {scenario.class1Label}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full" style={{ background: COLORS.query }} />
              Query (drag me)
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-[color:var(--border)] p-4">
            <label className="text-sm font-bold" htmlFor="k-slider">
              k (neighbors): {k}
            </label>
            <input
              className="mt-2 w-full accent-violet-600"
              id="k-slider"
              max={15}
              min={1}
              onChange={(e) => setK(Number(e.target.value))}
              step={2}
              type="range"
              value={k}
            />
          </div>
          <div
            className="rounded-lg border-2 p-4 text-white"
            style={{ backgroundColor: predColor, borderColor: predColor }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-90">Prediction</p>
            <p className="mt-1 text-2xl font-black">
              {result.prediction === 1 ? scenario.class1Label : scenario.class0Label}
            </p>
            <p className="mt-2 text-sm opacity-90">
              Votes: {result.votes0} {scenario.class0Label} · {result.votes1} {scenario.class1Label}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {knnReadout(scenario, result, k)}
      </p>
    </section>
  );
}
