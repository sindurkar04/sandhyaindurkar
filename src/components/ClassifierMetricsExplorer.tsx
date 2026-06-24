"use client";

import {
  SCENARIOS,
  aucFromRoc,
  businessReadout,
  formatNum,
  formatPct,
  metricsAtThreshold,
  nearestCurvePoint,
  precisionVsRecallGuidance,
  thresholdCurve,
  type CurvePoint,
  type ScenarioKey,
} from "@/lib/classifier-metrics-data";
import { useCallback, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const CHART = {
  ink: "#111111",
  mid: "#6b7280",
  light: "#9ca3af",
  grid: "#f3f4f6",
  axis: "#e5e7eb",
  fill: "#e5e7eb",
  accent: "#d1d5db",
} as const;

type DragChart = "roc" | "pr" | null;

function svgPoint(
  event: ReactPointerEvent<SVGElement>,
  svg: SVGSVGElement,
  viewW: number,
  viewH: number,
): { x: number; y: number } {
  const rect = svg.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * viewW,
    y: ((event.clientY - rect.top) / rect.height) * viewH,
  };
}

export default function ClassifierMetricsExplorer() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("fraud");
  const scenario = SCENARIOS[scenarioKey];
  const [threshold, setThreshold] = useState(scenario.defaultThreshold);
  const [dragChart, setDragChart] = useState<DragChart>(null);
  const rocSvgRef = useRef<SVGSVGElement>(null);
  const prSvgRef = useRef<SVGSVGElement>(null);

  const metrics = useMemo(() => metricsAtThreshold(threshold, scenario), [threshold, scenario]);
  const curve = useMemo(() => thresholdCurve(scenario), [scenario]);
  const auc = useMemo(() => aucFromRoc(curve), [curve]);
  const guidance = precisionVsRecallGuidance(scenario);
  const readout = businessReadout(scenario, threshold, metrics, auc);

  function selectScenario(key: ScenarioKey) {
    setScenarioKey(key);
    setThreshold(SCENARIOS[key].defaultThreshold);
  }

  const rocW = 280;
  const rocH = 220;
  const pad = 42;
  const plotW = rocW - pad * 2;
  const plotH = rocH - pad * 2;
  const xRoc = useCallback((fpr: number) => pad + fpr * plotW, [pad, plotW]);
  const yRoc = useCallback((tpr: number) => pad + plotH - tpr * plotH, [pad, plotH]);

  const prW = 280;
  const prH = 220;
  const prPad = 42;
  const prPlotW = prW - prPad * 2;
  const prPlotH = prH - prPad * 2;
  const xPr = useCallback((recall: number) => prPad + recall * prPlotW, [prPad, prPlotW]);
  const yPr = useCallback((precision: number) => prPad + prPlotH - precision * prPlotH, [prPad, prPlotH]);

  const rocPath = curve.map((p, i) => `${i === 0 ? "M" : "L"} ${xRoc(p.fpr)} ${yRoc(p.tpr)}`).join(" ");
  const rocArea = `${rocPath} L ${xRoc(curve[curve.length - 1].fpr)} ${yRoc(0)} L ${xRoc(curve[0].fpr)} ${yRoc(0)} Z`;
  const prPath = curve.map((p, i) => `${i === 0 ? "M" : "L"} ${xPr(p.recall)} ${yPr(p.precision)}`).join(" ");

  const applyCurvePoint = useCallback((point: CurvePoint) => {
    setThreshold(point.threshold);
  }, []);

  const handleRocPointer = useCallback(
    (event: ReactPointerEvent<SVGElement>) => {
      const svg = rocSvgRef.current;
      if (!svg) return;
      const { x, y } = svgPoint(event, svg, rocW, rocH);
      const point = nearestCurvePoint(x, y, curve, xRoc, yRoc, "fpr", "tpr");
      applyCurvePoint(point);
    },
    [applyCurvePoint, curve, xRoc, yRoc],
  );

  const handlePrPointer = useCallback(
    (event: ReactPointerEvent<SVGElement>) => {
      const svg = prSvgRef.current;
      if (!svg) return;
      const { x, y } = svgPoint(event, svg, prW, prH);
      const point = nearestCurvePoint(x, y, curve, xPr, yPr, "recall", "precision");
      applyCurvePoint(point);
    },
    [applyCurvePoint, curve, xPr, yPr],
  );

  const startRocDrag = useCallback(
    (event: ReactPointerEvent<SVGElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragChart("roc");
      handleRocPointer(event);
    },
    [handleRocPointer],
  );

  const startPrDrag = useCallback(
    (event: ReactPointerEvent<SVGElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragChart("pr");
      handlePrPointer(event);
    },
    [handlePrPointer],
  );

  const endDrag = useCallback((event: ReactPointerEvent<SVGElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragChart(null);
  }, []);

  const maxCell = Math.max(metrics.counts.tp, metrics.counts.fp, metrics.counts.fn, metrics.counts.tn, 1);

  return (
    <section className="my-6 space-y-6">
      <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
        <h3 className="text-lg font-bold text-[color:var(--foreground)]">
          Example: confusion matrix, scores, and curves at one threshold
        </h3>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
          Drag the dot on the ROC or precision-recall chart, or use the threshold slider. Everything
          stays linked: matrix, scores, and operating point move together.
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

        <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="cm-threshold">
            Score threshold: {threshold}%
          </label>
          <div className="mt-1 flex justify-between text-xs font-bold text-[color:var(--muted)]">
            <span>Lower (more flags, higher recall)</span>
            <span>Higher (fewer flags, higher precision)</span>
          </div>
          <input
            className="mt-2 w-full accent-black"
            id="cm-threshold"
            max={95}
            min={5}
            onChange={(e) => setThreshold(Number(e.target.value))}
            step={1}
            type="range"
            value={threshold}
          />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-[color:var(--border)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
              Confusion matrix (n = {scenario.population.toLocaleString()})
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                {
                  label: "TP",
                  sub: "Predicted +, actually +",
                  value: metrics.counts.tp,
                  bar: "bg-[#111111]",
                },
                {
                  label: "FP",
                  sub: "Predicted +, actually -",
                  value: metrics.counts.fp,
                  bar: "bg-[#9ca3af]",
                },
                {
                  label: "FN",
                  sub: "Predicted -, actually +",
                  value: metrics.counts.fn,
                  bar: "bg-[#6b7280]",
                },
                {
                  label: "TN",
                  sub: "Predicted -, actually -",
                  value: metrics.counts.tn,
                  bar: "bg-[#d1d5db]",
                },
              ].map((cell) => (
                <div
                  className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-3"
                  key={cell.label}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--foreground)]">
                    {cell.label}
                  </p>
                  <p className="mt-1 text-2xl font-black text-[color:var(--foreground)]">
                    {cell.value.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--muted)]">{cell.sub}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-[color:var(--border)]">
                    <div
                      className={`h-full rounded-full ${cell.bar}`}
                      style={{ width: `${(cell.value / maxCell) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-[color:var(--muted)]">
              {metrics.flagged.toLocaleString()} flagged · prevalence {formatPct(scenario.prevalence, 1)}
            </p>
          </div>

          <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
              All scores at this threshold
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {[
                ["Accuracy", formatPct(metrics.accuracy)],
                ["Precision (PPV)", formatPct(metrics.precision)],
                ["Recall (TPR)", formatPct(metrics.recall)],
                ["Specificity (TNR)", formatPct(metrics.specificity)],
                ["F1", formatPct(metrics.f1)],
                ["NPV", formatPct(metrics.npv)],
                ["FPR", formatPct(metrics.fpr)],
                ["FNR (miss rate)", formatPct(metrics.fnr)],
                ["Balanced accuracy", formatPct(metrics.balancedAccuracy)],
                ["ROC AUC", formatNum(auc)],
              ].map(([name, value]) => (
                <div key={name}>
                  <dt className="text-xs font-bold text-[color:var(--muted)]">{name}</dt>
                  <dd className="text-lg font-black text-[color:var(--foreground)]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="overflow-x-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
          <p className="text-sm font-bold text-[color:var(--foreground)]">ROC curve · AUC {formatNum(auc)}</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            Drag the dot along the curve to change threshold
          </p>
          <svg
            aria-label="ROC curve with draggable operating point"
            className={`mx-auto mt-3 block w-full max-w-[280px] touch-none select-none ${
              dragChart === "roc" ? "cursor-grabbing" : "cursor-grab"
            }`}
            height={rocH}
            onPointerLeave={() => setDragChart(null)}
            ref={rocSvgRef}
            role="img"
            viewBox={`0 0 ${rocW} ${rocH}`}
            width={rocW}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
              <line
                key={`g-${tick}`}
                stroke={CHART.grid}
                x1={pad}
                x2={pad + plotW}
                y1={yRoc(tick)}
                y2={yRoc(tick)}
              />
            ))}
            <line stroke={CHART.axis} x1={pad} x2={pad} y1={pad} y2={pad + plotH} />
            <line stroke={CHART.axis} x1={pad} x2={pad + plotW} y1={pad + plotH} y2={pad + plotH} />
            <line
              stroke={CHART.light}
              strokeDasharray="4 4"
              x1={pad}
              x2={pad + plotW}
              y1={pad + plotH}
              y2={pad}
            />
            <path d={rocArea} fill={CHART.fill} opacity={0.55} />
            <path d={rocPath} fill="none" stroke={CHART.ink} strokeWidth="2.5" />
            <rect
              fill="transparent"
              height={plotH}
              onPointerDown={startRocDrag}
              onPointerMove={dragChart === "roc" ? handleRocPointer : undefined}
              onPointerUp={endDrag}
              style={{ touchAction: "none" }}
              width={plotW}
              x={pad}
              y={pad}
            />
            <circle
              cx={xRoc(metrics.fprRate)}
              cy={yRoc(metrics.tpr)}
              fill={CHART.ink}
              onPointerDown={startRocDrag}
              onPointerMove={dragChart === "roc" ? handleRocPointer : undefined}
              onPointerUp={endDrag}
              r={10}
              stroke="#ffffff"
              strokeWidth={2}
              style={{ touchAction: "none", cursor: dragChart === "roc" ? "grabbing" : "grab" }}
            />
            <text fill={CHART.mid} fontSize="10" fontWeight="700" x={pad} y={pad - 10}>
              TPR
            </text>
            <text fill={CHART.mid} fontSize="10" fontWeight="700" textAnchor="middle" x={rocW / 2} y={rocH - 4}>
              FPR
            </text>
          </svg>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
          <p className="text-sm font-bold text-[color:var(--foreground)]">Precision-recall curve</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            Drag the dot here too. Same threshold, different view.
          </p>
          <svg
            aria-label="Precision recall curve with draggable operating point"
            className={`mx-auto mt-3 block w-full max-w-[280px] touch-none select-none ${
              dragChart === "pr" ? "cursor-grabbing" : "cursor-grab"
            }`}
            height={prH}
            onPointerLeave={() => setDragChart(null)}
            ref={prSvgRef}
            role="img"
            viewBox={`0 0 ${prW} ${prH}`}
            width={prW}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
              <line
                key={`pg-${tick}`}
                stroke={CHART.grid}
                x1={prPad}
                x2={prPad + prPlotW}
                y1={yPr(tick)}
                y2={yPr(tick)}
              />
            ))}
            <line stroke={CHART.axis} x1={prPad} x2={prPad} y1={prPad} y2={prPad + prPlotH} />
            <line stroke={CHART.axis} x1={prPad} x2={prPad + prPlotW} y1={prPad + prPlotH} y2={prPad + prPlotH} />
            <path d={prPath} fill="none" stroke={CHART.mid} strokeWidth="2.5" />
            <rect
              fill="transparent"
              height={prPlotH}
              onPointerDown={startPrDrag}
              onPointerMove={dragChart === "pr" ? handlePrPointer : undefined}
              onPointerUp={endDrag}
              style={{ touchAction: "none" }}
              width={prPlotW}
              x={prPad}
              y={prPad}
            />
            <circle
              cx={xPr(metrics.recall)}
              cy={yPr(metrics.precision)}
              fill={CHART.mid}
              onPointerDown={startPrDrag}
              onPointerMove={dragChart === "pr" ? handlePrPointer : undefined}
              onPointerUp={endDrag}
              r={10}
              stroke="#ffffff"
              strokeWidth={2}
              style={{ touchAction: "none", cursor: dragChart === "pr" ? "grabbing" : "grab" }}
            />
            <text fill={CHART.mid} fontSize="10" fontWeight="700" x={prPad} y={prPad - 10}>
              Precision
            </text>
            <text fill={CHART.mid} fontSize="10" fontWeight="700" textAnchor="middle" x={prW / 2} y={prH - 4}>
              Recall
            </text>
          </svg>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            When to optimize precision
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[color:var(--muted)]">
            {guidance.optimizePrecision.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-[color:var(--foreground)]">{scenario.precisionPriority}</p>
        </div>
        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            When to optimize recall
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[color:var(--muted)]">
            {guidance.optimizeRecall.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-[color:var(--foreground)]">{scenario.recallPriority}</p>
        </div>
      </div>

      <p className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {readout}
      </p>
    </section>
  );
}
