export type MathCategoryId = "summarize" | "experiments" | "traps";

export type MathCategory = {
  id: MathCategoryId;
  label: string;
  description: string;
};

export type MathPost = {
  slug: string;
  href: string;
  title: string;
  description: string;
  image: string;
  category: MathCategoryId;
};

export const MATH_CATEGORIES: MathCategory[] = [
  {
    id: "summarize",
    label: "Summarize the data",
    description: "Means, spread, percentiles, and when one number misleads.",
  },
  {
    id: "experiments",
    label: "Experiments and uncertainty",
    description: "Sample size, probability, intervals, and when to ship.",
  },
  {
    id: "traps",
    label: "Traps and causation",
    description: "Bias, confounders, and conclusions that look right but are not.",
  },
];

export const MATH_POSTS: MathPost[] = [
  {
    slug: "prime-factorization-real-problems",
    href: "/math-applied/prime-factorization-real-problems",
    title: "Prime Factorization Isn't Just Math: It's How You Break Down Real Problems",
    description: "Clean batch splits, ETL jobs, and resource planning from number structure.",
    image: "/prime_factorization.svg",
    category: "summarize",
  },
  {
    slug: "mean-vs-median-real-data",
    href: "/math-applied/mean-vs-median-real-data",
    title: "The Average Isn't the Answer: Mean and Median in Real Data",
    description: "When one summary number misleads dashboards and product decisions.",
    image: "/mean_median.png",
    category: "summarize",
  },
  {
    slug: "percent-change-real-decisions",
    href: "/math-applied/percent-change-real-decisions",
    title: "Percent Change Isn't Intuitive: Growth Math in Real Decisions",
    description: "Why recovery percentages do not undo drops, and how to set targets.",
    image: "/percent_change.png",
    category: "summarize",
  },
  {
    slug: "variance-spread-real-data",
    href: "/math-applied/variance-spread-real-data",
    title: "Variance and Spread: Same Average, Different Story",
    description: "Standard deviation and range for delivery, ops, and reliability.",
    image: "/variance_spread.png",
    category: "summarize",
  },
  {
    slug: "percentiles-quartiles-real-data",
    href: "/math-applied/percentiles-quartiles-real-data",
    title: "The Average User Isn't Average: Percentiles and Quartiles",
    description: "P90, SLAs, latency tails, and typical vs worst-case experience.",
    image: "/percentiles_quartiles.svg",
    category: "summarize",
  },
  {
    slug: "sample-size-real-decisions",
    href: "/math-applied/sample-size-real-decisions",
    title: "Twelve Data Points Isn't a Trend: Sample Size in Real Decisions",
    description: "A/B tests, noisy averages, and when a readout is too thin to ship.",
    image: "/sample_size.svg",
    category: "experiments",
  },
  {
    slug: "probability-real-decisions",
    href: "/math-applied/probability-real-decisions",
    title: "Probability in Real Decisions: Count Wins, Not Stories",
    description: "Estimate win rates from trials and know when the read is still shaky.",
    image: "/probability.svg",
    category: "experiments",
  },
  {
    slug: "confidence-intervals-real-decisions",
    href: "/math-applied/confidence-intervals-real-decisions",
    title: "One Number Is Not Enough: Confidence Intervals",
    description: "Ranges around conversion, CSAT, and defect rates before you ship.",
    image: "/confidence_intervals.svg",
    category: "experiments",
  },
  {
    slug: "base-rates-real-decisions",
    href: "/math-applied/base-rates-real-decisions",
    title: "Base Rates and Updating Beliefs: Rare Events, Loud Alerts",
    description: "Why a strong alert can still mean mostly false alarms when the base rate is low.",
    image: "/base_rates.svg",
    category: "experiments",
  },
  {
    slug: "ab-test-readouts-real-decisions",
    href: "/math-applied/ab-test-readouts-real-decisions",
    title: "A/B Test Readouts: Significance Without Jargon",
    description: "Lift, sample size, interval overlap, and when to ship without p-value talk.",
    image: "/ab_test_readouts.svg",
    category: "experiments",
  },
  {
    slug: "simpsons-paradox-real-decisions",
    href: "/math-applied/simpsons-paradox-real-decisions",
    title: "Simpson's Paradox: When Every Slice Wins but the Total Loses",
    description: "Segment tables before rollups so mix shifts do not flip the winner.",
    image: "/simpsons_paradox.svg",
    category: "experiments",
  },
  {
    slug: "expected-value-real-decisions",
    href: "/math-applied/expected-value-real-decisions",
    title: "Expected Value: Compare Bets Without Guessing",
    description: "Rank campaigns by upside, probability, and cost before spend.",
    image: "/expected_value.svg",
    category: "experiments",
  },
  {
    slug: "correlation-vs-causation-real-decisions",
    href: "/math-applied/correlation-vs-causation-real-decisions",
    title: "Correlation Isn't Causation: Linked Data in Real Decisions",
    description: "Confounders, direction, and what you need before acting on r.",
    image: "/correlation_causation.svg",
    category: "traps",
  },
  {
    slug: "selection-bias-real-decisions",
    href: "/math-applied/selection-bias-real-decisions",
    title: "Your Best Customers Answered: Selection Bias",
    description: "Surveys, betas, and who never made it into the sample.",
    image: "/selection_bias.svg",
    category: "traps",
  },
  {
    slug: "regression-to-the-mean-real-decisions",
    href: "/math-applied/regression-to-the-mean-real-decisions",
    title: "The Star Performer Slump: Regression to the Mean",
    description: "Sales quotas, support metrics, and snap-back after extreme scores.",
    image: "/regression_to_mean.svg",
    category: "traps",
  },
  {
    slug: "regression-real-decisions",
    href: "/math-applied/regression-real-decisions",
    title: "Regression for Prediction: Data to Decisions",
    description: "Weekly orders from ad spend and email, with forecast, holdout, and scenarios.",
    image: "/regression_mean.svg",
    category: "traps",
  },
];

const RELATED_BY_SLUG: Record<string, string[]> = {
  "prime-factorization-real-problems": [
    "sample-size-real-decisions",
    "mean-vs-median-real-data",
    "percentiles-quartiles-real-data",
  ],
  "mean-vs-median-real-data": [
    "variance-spread-real-data",
    "percentiles-quartiles-real-data",
    "sample-size-real-decisions",
  ],
  "percent-change-real-decisions": [
    "regression-to-the-mean-real-decisions",
    "sample-size-real-decisions",
    "confidence-intervals-real-decisions",
  ],
  "variance-spread-real-data": [
    "mean-vs-median-real-data",
    "percentiles-quartiles-real-data",
    "sample-size-real-decisions",
  ],
  "correlation-vs-causation-real-decisions": [
    "regression-real-decisions",
    "selection-bias-real-decisions",
    "sample-size-real-decisions",
  ],
  "percentiles-quartiles-real-data": [
    "mean-vs-median-real-data",
    "variance-spread-real-data",
    "sample-size-real-decisions",
  ],
  "sample-size-real-decisions": [
    "confidence-intervals-real-decisions",
    "ab-test-readouts-real-decisions",
    "probability-real-decisions",
  ],
  "regression-real-decisions": [
    "correlation-vs-causation-real-decisions",
    "confidence-intervals-real-decisions",
    "sample-size-real-decisions",
  ],
  "regression-to-the-mean-real-decisions": [
    "sample-size-real-decisions",
    "selection-bias-real-decisions",
    "percent-change-real-decisions",
  ],
  "selection-bias-real-decisions": [
    "sample-size-real-decisions",
    "confidence-intervals-real-decisions",
    "correlation-vs-causation-real-decisions",
  ],
  "confidence-intervals-real-decisions": [
    "sample-size-real-decisions",
    "ab-test-readouts-real-decisions",
    "probability-real-decisions",
  ],
  "probability-real-decisions": [
    "base-rates-real-decisions",
    "confidence-intervals-real-decisions",
    "sample-size-real-decisions",
  ],
  "base-rates-real-decisions": [
    "probability-real-decisions",
    "selection-bias-real-decisions",
    "expected-value-real-decisions",
  ],
  "ab-test-readouts-real-decisions": [
    "confidence-intervals-real-decisions",
    "sample-size-real-decisions",
    "simpsons-paradox-real-decisions",
  ],
  "simpsons-paradox-real-decisions": [
    "ab-test-readouts-real-decisions",
    "selection-bias-real-decisions",
    "sample-size-real-decisions",
  ],
  "expected-value-real-decisions": [
    "probability-real-decisions",
    "base-rates-real-decisions",
    "confidence-intervals-real-decisions",
  ],
};

export function getPostsGroupedByCategory(): { category: MathCategory; posts: MathPost[] }[] {
  return MATH_CATEGORIES.map((category) => ({
    category,
    posts: MATH_POSTS.filter((post) => post.category === category.id),
  }));
}

export function getRelatedPosts(slug: string, limit = 3): MathPost[] {
  const relatedSlugs = RELATED_BY_SLUG[slug] ?? [];
  return relatedSlugs
    .map((relatedSlug) => MATH_POSTS.find((post) => post.slug === relatedSlug))
    .filter((post): post is MathPost => Boolean(post))
    .slice(0, limit);
}
