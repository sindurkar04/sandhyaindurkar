import { MATH_POSTS, type MathPost } from "@/lib/math-applied-posts";

export type GanitaGuideMatch = {
  post: MathPost;
  score: number;
  reason: string;
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "can",
  "did",
  "do",
  "for",
  "from",
  "had",
  "has",
  "have",
  "how",
  "i",
  "if",
  "in",
  "is",
  "it",
  "its",
  "just",
  "me",
  "my",
  "not",
  "of",
  "on",
  "or",
  "our",
  "should",
  "so",
  "that",
  "the",
  "their",
  "there",
  "they",
  "this",
  "to",
  "too",
  "up",
  "was",
  "we",
  "what",
  "when",
  "which",
  "who",
  "why",
  "with",
  "you",
  "your",
]);

const SYNONYMS: Record<string, string[]> = {
  ab: ["test", "experiment"],
  alert: ["alarm", "signal"],
  average: ["mean", "avg"],
  avg: ["average", "mean"],
  causal: ["causation", "cause"],
  cause: ["causation", "causal"],
  conversion: ["rate"],
  correlate: ["correlation"],
  correlation: ["correlate"],
  experiment: ["test", "ab"],
  false: ["alarm", "positive"],
  kpi: ["metric", "target"],
  launch: ["ship"],
  latency: ["p90", "percentile"],
  mean: ["average", "avg"],
  metric: ["kpi"],
  outlier: ["skew", "outliers"],
  outliers: ["outlier", "skew"],
  percent: ["percentage"],
  ship: ["launch", "release"],
  significance: ["significant"],
  significant: ["significance"],
  skew: ["outlier", "outliers"],
  stats: ["statistics", "data"],
  season: ["seasonality", "seasonal"],
  seasonal: ["seasonality", "season"],
  seasonality: ["seasonal", "yoy"],
  yoy: ["seasonality", "year"],
  overfit: ["overfitting", "holdout"],
  overfitting: ["overfit", "holdout"],
  holdout: ["overfitting", "validation"],
  power: ["underpowered", "mde"],
  underpowered: ["power", "sample"],
  mde: ["power", "lift"],
  inventory: ["stockout", "reorder", "demand"],
  stockout: ["inventory", "reorder", "service"],
  reorder: ["stockout", "inventory"],
  demand: ["inventory", "stockout"],
  denominator: ["rate", "count"],
  count: ["rate", "volume"],
  volume: ["count", "rate"],
  independent: ["independence", "joint"],
  independence: ["independent", "joint"],
  joint: ["independence", "independent"],
  conditional: ["given", "bayes", "posterior"],
  given: ["conditional", "bayes"],
  sensitivity: ["specificity", "screening", "ppv"],
  specificity: ["sensitivity", "screening", "false-positive"],
  screening: ["sensitivity", "specificity", "test"],
  ppv: ["precision", "predictive", "screening"],
  funnel: ["conversion", "chain", "conditional"],
  streak: ["fallacy", "gambler", "independent"],
  fallacy: ["gambler", "streak"],
  gambler: ["fallacy", "streak"],
  compound: ["at-least-one", "stacking", "trials"],
  stacking: ["rules", "alerts", "compound"],
  percentile: ["quartile", "p90", "distribution"],
  quartile: ["percentile", "median", "distribution"],
  expected: ["ev", "value"],
  ev: ["expected", "value"],
  slope: ["linear", "intercept", "regression"],
  intercept: ["slope", "linear"],
  linear: ["slope", "regression"],
  vector: ["vectors", "features", "embedding"],
  vectors: ["vector", "features"],
  features: ["vector", "columns"],
  matrix: ["matrices", "linear-system"],
  matrices: ["matrix", "regression"],
  cosine: ["similarity", "dot-product", "embedding"],
  similarity: ["cosine", "dot-product", "search"],
  embedding: ["vector", "cosine", "rag"],
  rag: ["retrieval", "cosine", "embedding"],
  pca: ["principal", "component", "variance"],
  multicollinearity: ["collinear", "correlated", "regression", "ridge"],
  collinear: ["multicollinearity", "correlation", "ridge"],
  ridge: ["regularization", "multicollinearity", "shrinkage"],
  regularization: ["ridge", "overfitting", "lambda"],
  orthogonal: ["orthogonality", "uncorrelated", "perpendicular"],
  orthogonality: ["orthogonal", "uncorrelated", "correlation"],
  norm: ["distance", "l2", "euclidean"],
  distance: ["norm", "l2", "anomaly"],
  calibration: ["reliability", "score", "overconfident"],
  overconfident: ["calibration", "score"],
  drift: ["concept-drift", "distribution"],
  "concept-drift": ["drift", "retrain", "live"],
  retrain: ["drift", "concept-drift"],
  precision: ["recall", "threshold", "classifier"],
  recall: ["precision", "threshold", "classifier"],
  threshold: ["precision", "recall", "cutoff"],
  cutoff: ["threshold", "precision"],
  classifier: ["model", "ml", "score"],
  eval: ["labels", "metric", "holdout"],
  labels: ["eval", "labeled", "annotation"],
  f1: ["precision", "recall", "metric"],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/a\s*\/\s*b/g, "ab")
    .replace(/p-value|pvalue/g, "pvalue")
    .replace(/['']/g, "'")
    .replace(/[^\w\s%]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  const raw = normalize(text).split(" ").filter(Boolean);
  const expanded: string[] = [];

  for (const word of raw) {
    if (word.length <= 2 && word !== "ab") {
      continue;
    }
    if (STOP_WORDS.has(word)) {
      continue;
    }
    expanded.push(word);
    for (const alias of SYNONYMS[word] ?? []) {
      expanded.push(alias);
    }
  }

  return Array.from(new Set(expanded));
}

function slugKeywords(slug: string): string[] {
  return slug
    .split("-")
    .filter((word) => word.length > 2 && !["real", "decisions", "data", "problems"].includes(word));
}

function overlapCount(a: string[], b: string[]): number {
  const setB = new Set(b);
  return a.filter((token) => setB.has(token)).length;
}

function bestPhraseReason(query: string, tokens: string[], post: MathPost): string | null {
  const normalizedQuery = normalize(query);
  let best: { phrase: string; score: number } | null = null;

  for (const phrase of post.problemPhrases ?? []) {
    const normalizedPhrase = normalize(phrase);
    let phraseScore = 0;

    if (normalizedQuery.includes(normalizedPhrase)) {
      phraseScore = 20;
    } else {
      const phraseTokens = tokenize(phrase);
      const overlap = overlapCount(tokens, phraseTokens);
      if (overlap >= 2) {
        phraseScore = 10 + overlap * 3;
      } else if (overlap === 1) {
        phraseScore = 4;
      }
    }

    if (phraseScore > 0 && (!best || phraseScore > best.score)) {
      best = { phrase, score: phraseScore };
    }
  }

  return best ? `Matches: “${best.phrase}”` : null;
}

function scorePost(query: string, tokens: string[], post: MathPost): GanitaGuideMatch | null {
  const normalizedQuery = normalize(query);
  let score = 0;
  let reason = "";

  const phraseReason = bestPhraseReason(query, tokens, post);
  if (phraseReason) {
    score += 20;
    reason = phraseReason;
  }

  for (const tag of post.tags ?? []) {
    const tagText = tag.replace(/-/g, " ");
    if (normalizedQuery.includes(tagText) || tokens.some((token) => tagText.includes(token))) {
      score += 8;
      if (!reason) {
        reason = `Tagged: ${tag.replace(/-/g, " ")}`;
      }
    }
  }

  const titleTokens = tokenize(post.title);
  const descriptionTokens = tokenize(post.description);
  const slugTokens = slugKeywords(post.slug);

  for (const token of tokens) {
    if (titleTokens.includes(token)) {
      score += 5;
    }
    if (descriptionTokens.includes(token)) {
      score += 2;
    }
    if (slugTokens.includes(token)) {
      score += 3;
    }
  }

  if (score === 0) {
    return null;
  }

  if (!reason) {
    const titleOverlap = overlapCount(tokens, titleTokens);
    if (titleOverlap >= 2) {
      reason = "Title keywords match your question";
    } else {
      reason = "Related topic in this post";
    }
  }

  return { post, score, reason };
}

export function matchPostsForProblem(query: string, limit = 3): GanitaGuideMatch[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const tokens = tokenize(trimmed);
  if (tokens.length === 0) {
    return [];
  }

  return MATH_POSTS.map((post) => scorePost(trimmed, tokens, post))
    .filter((match): match is GanitaGuideMatch => Boolean(match))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export const GANITA_GUIDE_EXAMPLES = [
  "We ran twenty tests and three won",
  "KPI green but customers unhappy",
  "Average of averages is wrong",
  "Should we ship this A/B test",
  "Retention dropped after signup surge",
  "Correlation between two dashboard metrics",
  "Model perfect on training bad on holdout",
  "Model says 90 percent can I trust the score",
  "Live false positive rate climbed after launch",
  "Was the test underpowered",
  "Down vs last month but up vs last year",
  "Total tickets up but per user flat",
  "How likely are we to stock out before restock",
];
