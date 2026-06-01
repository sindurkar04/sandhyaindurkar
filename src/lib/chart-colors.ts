/** Shared chart palette — readable, color-coded series on white backgrounds. */
export const CHART_PALETTE = [
  "#2563eb", // blue
  "#059669", // emerald
  "#d97706", // amber
  "#7c3aed", // violet
  "#dc2626", // red
  "#0891b2", // cyan
] as const;

export const CHART_LINE = "#2563eb";
export const CHART_LINE_MUTED = "#93c5fd";
export const CHART_GRID = "#e5e7eb";
export const CHART_LABEL = "#374151";
export const CHART_REFERENCE = "#9ca3af";

export function chartColor(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length];
}

export function chartColorAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
