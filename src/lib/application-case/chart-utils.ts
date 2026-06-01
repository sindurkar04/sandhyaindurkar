export const CHART_WIDTH = 600;
export const CHART_HEIGHT = 260;
export const CHART_PAD_X = 40;
export const CHART_PAD_Y = 28;
export const CHART_LABEL_SIZE = 12;

export function buildYScale(values: number[], padRatio = 0.12, includeZero = false) {
  const plotH = CHART_HEIGHT - CHART_PAD_Y * 2;
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (includeZero) {
    min = Math.min(min, 0);
    max = Math.max(max, 0);
  }
  const pad = (max - min) * padRatio || Math.abs(max) * 0.05 || 1;
  return {
    y: (v: number) =>
      CHART_PAD_Y + plotH - ((v - (min - pad)) / (max - min + pad * 2)) * plotH,
    zeroY: () => {
      const lo = min - pad;
      const span = max - min + pad * 2;
      return CHART_PAD_Y + plotH - ((0 - lo) / span) * plotH;
    },
  };
}

export function xCenter(index: number, count: number) {
  const plotW = CHART_WIDTH - CHART_PAD_X * 2;
  return CHART_PAD_X + (index / Math.max(count - 1, 1)) * plotW;
}

export function linePath(values: number[], scale: { y: (v: number) => number }) {
  return values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${xCenter(i, values.length)} ${scale.y(v)}`)
    .join(" ");
}

export function barWidth(count: number) {
  const plotW = CHART_WIDTH - CHART_PAD_X * 2;
  const gap = plotW / count;
  return Math.min(48, gap * 0.55);
}

export function pctChange(current: number, prior: number): number {
  if (prior === 0) return 0;
  return ((current - prior) / prior) * 100;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
