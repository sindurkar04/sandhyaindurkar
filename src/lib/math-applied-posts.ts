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
  tags?: string[];
  problemPhrases?: string[];
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
    tags: ["factorization", "batching", "etl", "planning"],
    problemPhrases: [
      "split work into even batches",
      "break down a big number for jobs",
      "prime factors for scheduling",
    ],
  },
  {
    slug: "mean-vs-median-real-data",
    href: "/math-applied/mean-vs-median-real-data",
    title: "The Average Isn't the Answer: Mean and Median in Real Data",
    description: "When one summary number misleads dashboards and product decisions.",
    image: "/mean_median.png",
    category: "summarize",
    tags: ["mean", "median", "average", "skew"],
    problemPhrases: [
      "average is misleading with outliers",
      "mean vs median for revenue",
      "one big customer skews the average",
      "one outlier is skewing the average",
      "should i use average or median",
    ],
  },
  {
    slug: "percent-change-real-decisions",
    href: "/math-applied/percent-change-real-decisions",
    title: "Percent Change Isn't Intuitive: Growth Math in Real Decisions",
    description: "Why recovery percentages do not undo drops, and how to set targets.",
    image: "/percent_change.png",
    category: "summarize",
    tags: ["percent", "growth", "recovery"],
    problemPhrases: [
      "down fifty percent then up fifty",
      "percent recovery does not undo drop",
      "set a realistic growth target",
    ],
  },
  {
    slug: "variance-spread-real-data",
    href: "/math-applied/variance-spread-real-data",
    title: "Variance and Spread: Same Average, Different Story",
    description: "Standard deviation and range for delivery, ops, and reliability.",
    image: "/variance_spread.png",
    category: "summarize",
    tags: ["variance", "spread", "standard-deviation", "reliability"],
    problemPhrases: [
      "same average different variability",
      "delivery times are inconsistent",
      "how spread out are the numbers",
    ],
  },
  {
    slug: "percentiles-quartiles-real-data",
    href: "/math-applied/percentiles-quartiles-real-data",
    title: "The Average User Isn't Average: Percentiles and Quartiles",
    description: "P90, SLAs, latency tails, and typical vs worst-case experience.",
    image: "/percentiles_quartiles.svg",
    category: "summarize",
    tags: ["percentile", "p90", "latency", "sla"],
    problemPhrases: [
      "p90 latency worse than average",
      "typical user vs worst case",
      "what does the 95th percentile mean",
    ],
  },
  {
    slug: "weighted-averages-real-data",
    href: "/math-applied/weighted-averages-real-data",
    title: "Weighted Averages: Roll Up the Number That Matches Volume",
    description: "Simple vs volume-weighted rollups when segment sizes differ.",
    image: "/weighted_averages.svg",
    category: "summarize",
    tags: ["rollup", "dashboard", "segments", "csat"],
    problemPhrases: [
      "company-wide rate from regions",
      "average of averages is wrong",
      "small segment skews headline KPI",
    ],
  },
  {
    slug: "benchmarks-baselines-real-decisions",
    href: "/math-applied/benchmarks-baselines-real-decisions",
    title: "Up 10% Compared to What? Benchmarks and Baselines",
    description: "Same metric, different story: last month, last year, plan, or peer.",
    image: "/benchmarks_baselines.svg",
    category: "summarize",
    tags: ["benchmark", "baseline", "target", "yoy"],
    problemPhrases: [
      "up 10 percent compared to what",
      "beat last month but miss plan",
      "which baseline should we use",
    ],
  },
  {
    slug: "sample-size-real-decisions",
    href: "/math-applied/sample-size-real-decisions",
    title: "Twelve Data Points Isn't a Trend: Sample Size in Real Decisions",
    description: "A/B tests, noisy averages, and when a readout is too thin to ship.",
    image: "/sample_size.svg",
    category: "experiments",
    tags: ["sample-size", "ab-test", "noise"],
    problemPhrases: [
      "twelve data points is not a trend",
      "test too small to call a winner",
      "how much data before we decide",
      "conversion went up is it noise",
      "not enough visitors in the test",
    ],
  },
  {
    slug: "probability-real-decisions",
    href: "/math-applied/probability-real-decisions",
    title: "Probability in Real Decisions: Count Wins, Not Stories",
    description: "Estimate win rates from trials and know when the read is still shaky.",
    image: "/probability.svg",
    category: "experiments",
    tags: ["probability", "win-rate", "trials"],
    problemPhrases: [
      "how often does this succeed",
      "estimate win rate from trials",
      "count wins not stories",
    ],
  },
  {
    slug: "confidence-intervals-real-decisions",
    href: "/math-applied/confidence-intervals-real-decisions",
    title: "One Number Is Not Enough: Confidence Intervals",
    description: "Ranges around conversion, CSAT, and defect rates before you ship.",
    image: "/confidence_intervals.svg",
    category: "experiments",
    tags: ["confidence-interval", "range", "uncertainty"],
    problemPhrases: [
      "one conversion number is not enough",
      "how wide is the range around the rate",
      "interval overlap before we ship",
    ],
  },
  {
    slug: "base-rates-real-decisions",
    href: "/math-applied/base-rates-real-decisions",
    title: "Base Rates and Updating Beliefs: Rare Events, Loud Alerts",
    description: "Why a strong alert can still mean mostly false alarms when the base rate is low.",
    image: "/base_rates.svg",
    category: "experiments",
    tags: ["base-rate", "bayes", "false-alarm"],
    problemPhrases: [
      "strong alert but mostly false alarms",
      "rare event loud signal",
      "how likely given this alert",
    ],
  },
  {
    slug: "ab-test-readouts-real-decisions",
    href: "/math-applied/ab-test-readouts-real-decisions",
    title: "A/B Test Readouts: Significance Without Jargon",
    description: "Lift, sample size, interval overlap, and when to ship without p-value talk.",
    image: "/ab_test_readouts.svg",
    category: "experiments",
    tags: ["ab-test", "lift", "significance"],
    problemPhrases: [
      "when to ship the ab test",
      "read the test without p values",
      "lift and sample size together",
      "should we ship this test",
      "is the lift significant enough",
    ],
  },
  {
    slug: "many-ab-tests-real-decisions",
    href: "/math-applied/many-ab-tests-real-decisions",
    title: "When Everything Wins Once: Running Many A/B Tests",
    description: "False winners multiply when you run dozens of null tests in one sprint.",
    image: "/many_ab_tests.svg",
    category: "experiments",
    tags: ["ab-test", "multiple-comparisons", "false-positive", "experiment-sprint"],
    problemPhrases: [
      "we ran twenty tests and three won",
      "how many false wins to expect",
      "experiment sprint too many winners",
    ],
  },
  {
    slug: "simpsons-paradox-real-decisions",
    href: "/math-applied/simpsons-paradox-real-decisions",
    title: "Simpson's Paradox: When Every Slice Wins but the Total Loses",
    description: "Segment tables before rollups so mix shifts do not flip the winner.",
    image: "/simpsons_paradox.svg",
    category: "experiments",
    tags: ["simpsons-paradox", "segments", "rollup"],
    problemPhrases: [
      "every segment wins but total loses",
      "mix shift flipped the winner",
      "check segment tables before rollup",
    ],
  },
  {
    slug: "false-alarm-missed-win-real-decisions",
    href: "/math-applied/false-alarm-missed-win-real-decisions",
    title: "False Alarm vs Missed Win: Two Ways an Experiment Decision Goes Wrong",
    description: "Ship a bad change vs kill a good one: pick which mistake you can afford.",
    image: "/false_alarm_missed_win.svg",
    category: "experiments",
    tags: ["ab-test", "type-i", "type-ii", "launch-policy"],
    problemPhrases: [
      "ship or wait on inconclusive test",
      "false positive vs false negative experiment",
      "how strict should our launch bar be",
    ],
  },
  {
    slug: "expected-value-real-decisions",
    href: "/math-applied/expected-value-real-decisions",
    title: "Expected Value: Compare Bets Without Guessing",
    description: "Rank campaigns by upside, probability, and cost before spend.",
    image: "/expected_value.svg",
    category: "experiments",
    tags: ["expected-value", "bets", "campaigns"],
    problemPhrases: [
      "compare campaigns by expected value",
      "rank bets by upside and probability",
      "which option is worth the cost",
    ],
  },
  {
    slug: "correlation-vs-causation-real-decisions",
    href: "/math-applied/correlation-vs-causation-real-decisions",
    title: "Correlation Isn't Causation: Linked Data in Real Decisions",
    description: "Confounders, direction, and what you need before acting on r.",
    image: "/correlation_causation.svg",
    category: "traps",
    tags: ["correlation", "causation", "confounder"],
    problemPhrases: [
      "correlated does not mean caused",
      "act on correlation in dashboard",
      "confounder explains the link",
      "correlation between two dashboard metrics",
      "does one metric cause the other",
    ],
  },
  {
    slug: "selection-bias-real-decisions",
    href: "/math-applied/selection-bias-real-decisions",
    title: "Your Best Customers Answered: Selection Bias",
    description: "Surveys, betas, and who never made it into the sample.",
    image: "/selection_bias.svg",
    category: "traps",
    tags: ["selection-bias", "survey", "sample"],
    problemPhrases: [
      "only happy customers answered survey",
      "beta users are not everyone",
      "who is missing from the sample",
    ],
  },
  {
    slug: "survivorship-bias-real-decisions",
    href: "/math-applied/survivorship-bias-real-decisions",
    title: "Only the Winners Stay Visible: Survivorship Bias",
    description: "Success stories hide failures that left the dataset before you measured.",
    image: "/survivorship_bias.svg",
    category: "traps",
    tags: ["bias", "reviews", "startups", "track-record"],
    problemPhrases: [
      "only successful customers visible",
      "app reviews look too positive",
      "portfolio of winners looks easy",
      "only happy customers left reviews",
      "success stories hide the failures",
    ],
  },
  {
    slug: "goodhart-law-real-decisions",
    href: "/math-applied/goodhart-law-real-decisions",
    title: "You Hit the Target and Missed the Point: Goodhart's Law",
    description: "When the metric becomes the goal, the dashboard greens while the real outcome reddens.",
    image: "/goodhart_law.svg",
    category: "traps",
    tags: ["metrics", "kpis", "incentives", "gaming"],
    problemPhrases: [
      "team hit the metric but customers unhappy",
      "KPI green but outcome worse",
      "people gaming the dashboard number",
      "dashboard green but users complain",
      "metric improved but real outcome did not",
    ],
  },
  {
    slug: "regression-to-the-mean-real-decisions",
    href: "/math-applied/regression-to-the-mean-real-decisions",
    title: "The Star Performer Slump: Regression to the Mean",
    description: "Sales quotas, support metrics, and snap-back after extreme scores.",
    image: "/regression_to_mean.svg",
    category: "traps",
    tags: ["regression-to-mean", "outlier", "quota"],
    problemPhrases: [
      "star performer slumped next quarter",
      "extreme score snapped back",
      "was it real improvement or luck",
      "great month then bad month",
      "did we actually improve or revert",
    ],
  },
  {
    slug: "regression-real-decisions",
    href: "/math-applied/regression-real-decisions",
    title: "Regression for Prediction: Data to Decisions",
    description: "Weekly orders from ad spend and email, with forecast, holdout, and scenarios.",
    image: "/regression_mean.svg",
    category: "traps",
    tags: ["regression", "forecast", "prediction"],
    problemPhrases: [
      "forecast orders from ad spend",
      "predict metric from drivers",
      "holdout test for a model",
    ],
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
    "benchmarks-baselines-real-decisions",
    "regression-to-the-mean-real-decisions",
    "sample-size-real-decisions",
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
    "goodhart-law-real-decisions",
    "selection-bias-real-decisions",
    "percent-change-real-decisions",
  ],
  "selection-bias-real-decisions": [
    "survivorship-bias-real-decisions",
    "goodhart-law-real-decisions",
    "confidence-intervals-real-decisions",
  ],
  "survivorship-bias-real-decisions": [
    "selection-bias-real-decisions",
    "goodhart-law-real-decisions",
    "correlation-vs-causation-real-decisions",
  ],
  "goodhart-law-real-decisions": [
    "selection-bias-real-decisions",
    "regression-to-the-mean-real-decisions",
    "percent-change-real-decisions",
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
    "many-ab-tests-real-decisions",
    "false-alarm-missed-win-real-decisions",
  ],
  "many-ab-tests-real-decisions": [
    "ab-test-readouts-real-decisions",
    "false-alarm-missed-win-real-decisions",
    "sample-size-real-decisions",
  ],
  "simpsons-paradox-real-decisions": [
    "weighted-averages-real-data",
    "ab-test-readouts-real-decisions",
    "selection-bias-real-decisions",
  ],
  "false-alarm-missed-win-real-decisions": [
    "ab-test-readouts-real-decisions",
    "many-ab-tests-real-decisions",
    "sample-size-real-decisions",
  ],
  "weighted-averages-real-data": [
    "benchmarks-baselines-real-decisions",
    "mean-vs-median-real-data",
    "simpsons-paradox-real-decisions",
  ],
  "benchmarks-baselines-real-decisions": [
    "percent-change-real-decisions",
    "weighted-averages-real-data",
    "goodhart-law-real-decisions",
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
