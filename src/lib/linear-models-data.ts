export const POINTS: { x: number; y: number; label: string }[] = [
  { x: 1, y: 3.2, label: "Week 1" },
  { x: 2, y: 4.1, label: "Week 2" },
  { x: 3, y: 5.0, label: "Week 3" },
  { x: 4, y: 5.8, label: "Week 4" },
  { x: 5, y: 6.9, label: "Week 5" },
  { x: 6, y: 7.6, label: "Week 6" },
  { x: 7, y: 8.8, label: "Week 7" },
  { x: 8, y: 9.4, label: "Week 8" },
];

export function predict(intercept: number, slope: number, x: number): number {
  return intercept + slope * x;
}

export function residual(actual: number, predicted: number): number {
  return actual - predicted;
}

export function totalSquaredError(intercept: number, slope: number, points = POINTS): number {
  return points.reduce((sum, p) => {
    const err = residual(p.y, predict(intercept, slope, p.x));
    return sum + err * err;
  }, 0);
}

export function bestFit(points = POINTS): { intercept: number; slope: number } {
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { intercept, slope };
}

export function pointRows(intercept: number, slope: number, points = POINTS) {
  return points.map((p) => {
    const predicted = predict(intercept, slope, p.x);
    return {
      label: p.label,
      x: p.x,
      actual: p.y,
      predicted,
      residual: residual(p.y, predicted),
    };
  });
}

export function lineRead(intercept: number, slope: number): string {
  const delta = predict(intercept, slope, 2) - predict(intercept, slope, 1);
  return `Line: y = ${intercept.toFixed(2)} + ${slope.toFixed(2)}x. When x goes from 1 to 2, y moves by about ${delta.toFixed(2)}. That step size is the slope.`;
}

export function interceptMeaning(intercept: number): string {
  return `Intercept ${intercept.toFixed(2)} is the predicted y when x = 0. It anchors the line vertically.`;
}
