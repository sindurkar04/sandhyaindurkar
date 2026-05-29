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
  avg: ["average", "mean"],
  kpi: ["metric", "target"],
  metric: ["kpi"],
  percent: ["percentage"],
  stats: ["statistics", "data"],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
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
  "Up 10% compared to what",
  "Only successful customers left reviews",
];
