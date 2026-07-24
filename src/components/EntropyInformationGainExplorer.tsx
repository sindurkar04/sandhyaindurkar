"use client";

import {
  COLORS,
  binaryEntropy,
  buildSplit,
  entropyCurve,
  entropyReadout,
  formatNum,
  formatPct,
  informationGain,
  weightedChildEntropy,
} from "@/lib/entropy-information-gain-data";
import { useMemo, useState } from "react";

const W = 340;
const H = 200;
const PAD_X = 34;
const PAD_TOP = 16;
const PAD_BOTTOM = 32;

export default function EntropyInformationGainExplorer() {
  const [parentPct, setParentPct] = useState(50);
  const [leftFracPct, setLeftFracPct] = useState(50);
  const [leftPPct, setLeftPPct] = useState(85);

  const parentP = parentPct / 100;
  const leftFraction = leftFracPct / 100;
  const leftP = leftPPct / 100;

  const split = useMemo(
    () => buildSplit(parentP, leftFraction, leftP),
    [parentP, leftFraction, leftP],
  );
  const parentH = binaryEntropy(parentP);
  const childH = weightedChildEntropy(split);
  const gain = informationGain(split);

  const curve = useMemo(() => entropyCurve(), []);
  const plotW = W - PAD_X * 2;
  const plotH = H - PAD_TOP - PAD_BOTTOM;
  const toX = (p: number) => PAD_X + p * plotW;
  const toY = (h: number) => PAD_TOP + plotH - h * plotH;
  const path = curve
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${toX(pt.p).toFixed(1)} ${toY(pt.h).toFixed(1)}`)
    .join(" ");

  return (
    <section className="my-6 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:p-5">
      <h3 className="text-lg font-bold text-[color:var(--foreground)]">
        Example: how much a split reduces uncertainty
      </h3>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[color:var(--muted)]">
        The curve is entropy for a two-class node: highest at a 50/50 mix, zero when pure. Set the
        parent mix, then split the rows into two children. Information gain is the drop in weighted
        entropy.
      </p>

      <div className="mt-5 grid gap-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="ent-parent">
            Parent positives: {parentPct}%
          </label>
          <input className="mt-2 w-full accent-[#64748b]" id="ent-parent" max={95} min={5} onChange={(e) => setParentPct(Number(e.target.value))} type="range" value={parentPct} />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="ent-frac">
            Rows in left child: {leftFracPct}%
          </label>
          <input className="mt-2 w-full accent-[#2563eb]" id="ent-frac" max={90} min={10} onChange={(e) => setLeftFracPct(Number(e.target.value))} type="range" value={leftFracPct} />
        </div>
        <div>
          <label className="text-sm font-bold text-[color:var(--foreground)]" htmlFor="ent-leftp">
            Left child positives: {leftPPct}%
          </label>
          <input className="mt-2 w-full accent-[#ea580c]" id="ent-leftp" max={100} min={0} onChange={(e) => setLeftPPct(Number(e.target.value))} type="range" value={leftPPct} />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-violet-50/40 to-white p-3">
        <svg aria-hidden="true" className="mx-auto block w-full max-w-[340px]" viewBox={`0 0 ${W} ${H}`}>
          <line stroke={COLORS.grid} x1={PAD_X} x2={W - PAD_X} y1={PAD_TOP + plotH} y2={PAD_TOP + plotH} />
          <line stroke={COLORS.grid} x1={PAD_X} x2={PAD_X} y1={PAD_TOP} y2={PAD_TOP + plotH} />
          <path d={path} fill="none" stroke={COLORS.curve} strokeWidth={2.5} />
          <circle cx={toX(parentP)} cy={toY(parentH)} fill={COLORS.parent} r={5} />
          <circle cx={toX(split.leftP)} cy={toY(binaryEntropy(split.leftP))} fill={COLORS.left} r={5} />
          <circle cx={toX(split.rightP)} cy={toY(binaryEntropy(split.rightP))} fill={COLORS.right} r={5} />
          <text fill="#374151" fontFamily="system-ui, sans-serif" fontSize={10} fontWeight={700} x={W / 2} y={H - 4} textAnchor="middle">
            Fraction positive → entropy (bits)
          </text>
        </svg>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.parent, background: `${COLORS.parent}18` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">Parent entropy</p>
          <p className="mt-1 text-2xl font-black">{formatNum(parentH)}</p>
        </div>
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.left, background: `${COLORS.left}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">Weighted children</p>
          <p className="mt-1 text-2xl font-black">{formatNum(childH)}</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            Right child is {formatPct(split.rightP)} positive.
          </p>
        </div>
        <div className="rounded-lg border-2 px-4 py-3" style={{ borderColor: COLORS.gain, background: `${COLORS.gain}12` }}>
          <p className="text-xs font-bold uppercase tracking-[0.1em]">Information gain</p>
          <p className="mt-1 text-2xl font-black">{formatNum(gain)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-base leading-relaxed text-[color:var(--muted)]">
        {entropyReadout(split)}
      </p>
    </section>
  );
}
