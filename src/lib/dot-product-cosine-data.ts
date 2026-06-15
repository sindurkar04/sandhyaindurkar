export type ScenarioKey = "doc_search" | "product_match" | "resume_screen";

export type Scenario = {
  key: ScenarioKey;
  shortLabel: string;
  headline: string;
  queryLabel: string;
  candidateLabel: string;
  query: number[];
  candidate: number[];
  featureLabels: string[];
};

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  doc_search: {
    key: "doc_search",
    shortLabel: "Doc search",
    headline: "Query and doc as word-count vectors. Dot product ranks overlap; cosine fixes length bias.",
    queryLabel: "Query: refund policy",
    candidateLabel: "Doc B: Returns FAQ",
    featureLabels: ["refund", "return", "policy", "shipping"],
    query: [3, 1, 2, 0],
    candidate: [2, 4, 3, 1],
  },
  product_match: {
    key: "product_match",
    shortLabel: "Product match",
    headline: "Shopper preference vector dotted with product attribute vector.",
    queryLabel: "Shopper prefs",
    candidateLabel: "Product A",
    featureLabels: ["price sens.", "quality", "eco", "speed"],
    query: [0.2, 0.9, 0.7, 0.3],
    candidate: [0.4, 0.85, 0.8, 0.5],
  },
  resume_screen: {
    key: "resume_screen",
    shortLabel: "Resume screen",
    headline: "Job requirements vector vs candidate skill vector.",
    queryLabel: "Role requirements",
    candidateLabel: "Candidate",
    featureLabels: ["SQL", "Python", "ML", "comm."],
    query: [0.9, 0.8, 0.7, 0.6],
    candidate: [0.85, 0.75, 0.4, 0.9],
  },
};

export function dot(a: number[], b: number[]): number {
  return a.reduce((sum, v, i) => sum + v * (b[i] ?? 0), 0);
}

export function norm(v: number[]): number {
  return Math.sqrt(dot(v, v));
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const na = norm(a);
  const nb = norm(b);
  if (na === 0 || nb === 0) return 0;
  return dot(a, b) / (na * nb);
}

export function formatNum(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function similarityReadout(scenario: Scenario): string {
  const d = dot(scenario.query, scenario.candidate);
  const cos = cosineSimilarity(scenario.query, scenario.candidate);
  if (Math.abs(d - cos) > 0.15) {
    return `Dot product ${formatNum(d)} favors longer vectors. Cosine ${formatNum(cos)} is ${formatNum(cos * 100, 0)}% aligned on direction. Use cosine when document or profile length varies.`;
  }
  return `Dot product ${formatNum(d)}, cosine ${formatNum(cos)}. Vectors are similar length here; both rank about the same.`;
}
