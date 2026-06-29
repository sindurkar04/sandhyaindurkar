export type MathCategoryId = "case-studies" | "foundations" | "summarize" | "experiments" | "traps";

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
    id: "foundations",
    label: "Math foundations",
    description: "Core probability, distributions, EV, and lines that unlock the business posts.",
  },
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
  {
    id: "case-studies",
    label: "Case studies",
    description: "Long decision stories with tradeoffs, explorers, and links to the underlying math.",
  },
];

export const MATH_POSTS: MathPost[] = [
  {
    slug: "case-study-northside-weekend-reorder",
    href: "/math-applied/case-study-northside-weekend-reorder",
    title: "Company X: The Weekend Reorder Decision",
    description:
      "A full case walkthrough at Company X: festival demand, three teams, reorder points, and explicit stockout risk.",
    image: "/case_study_northside_stockout.svg",
    category: "case-studies",
    tags: ["case-study", "inventory", "stockout", "reorder-point"],
    problemPhrases: [
      "inventory case study reorder point",
      "weekend stockout festival retail",
      "how to decide reorder level with probability",
    ],
  },
  {
    slug: "probability-basics-events-independence",
    href: "/math-applied/probability-basics-events-independence",
    title: "Probability Basics: Events, Joint Probability, and Independence",
    description: "Pure probability building blocks before win rates, base rates, and screening.",
    image: "/probability_basics.svg",
    category: "foundations",
    tags: ["probability", "events", "independence", "foundation"],
    problemPhrases: [
      "what does independent events mean",
      "joint probability versus separate probability",
      "when can i multiply probabilities",
    ],
  },
  {
    slug: "conditional-probability-pure-definition",
    href: "/math-applied/conditional-probability-pure-definition",
    title: "Conditional Probability: Given That B Happened",
    description:
      "P(A | B) versus P(B | A): restrict the sample space before you read a screen or alert.",
    image: "/conditional_probability.svg",
    category: "foundations",
    tags: ["probability", "conditional", "foundation", "bayes"],
    problemPhrases: [
      "what is conditional probability",
      "p a given b versus p b given a",
      "positive test does not mean disease",
    ],
  },
  {
    slug: "dependent-probability-chains-real-decisions",
    href: "/math-applied/dependent-probability-chains-real-decisions",
    title: "Dependent Chains: Funnel Math Without Bogus Independence",
    description:
      "P(step1) × P(step2 | step1) for funnels, pipelines, and onboarding paths.",
    image: "/dependent_chains.svg",
    category: "foundations",
    tags: ["probability", "funnel", "conditional", "foundation"],
    problemPhrases: [
      "funnel conversion multiply steps",
      "conditional probability product rule",
      "signup activate joint probability",
    ],
  },
  {
    slug: "sensitivity-specificity-screening",
    href: "/math-applied/sensitivity-specificity-screening",
    title: "Sensitivity, Specificity, and the 2×2 Screening Table",
    description:
      "TP, FP, FN, TN and positive predictive value before base rates and thresholds.",
    image: "/sensitivity_specificity.svg",
    category: "foundations",
    tags: ["probability", "screening", "sensitivity", "specificity", "foundation"],
    problemPhrases: [
      "sensitivity versus specificity",
      "positive predictive value screening",
      "confusion matrix tp fp fn tn",
    ],
  },
  {
    slug: "reading-distributions-percentiles-quartiles",
    href: "/math-applied/reading-distributions-percentiles-quartiles",
    title: "Reading Distributions: Percentiles and Quartiles from Scratch",
    description: "Sort data, read cutoffs, and understand P90 and quartiles before SLA metrics.",
    image: "/reading_distributions.svg",
    category: "foundations",
    tags: ["percentile", "quartile", "distribution", "foundation"],
    problemPhrases: [
      "how to read percentiles from data",
      "what is p90 in plain math",
      "quartiles from sorted values",
    ],
  },
  {
    slug: "expected-value-pure-definition",
    href: "/math-applied/expected-value-pure-definition",
    title: "Expected Value: The Pure Definition",
    description: "EV as probability-weighted average before campaign and pipeline decisions.",
    image: "/expected_value_pure.svg",
    category: "foundations",
    tags: ["expected-value", "probability", "foundation"],
    problemPhrases: [
      "expected value formula in plain math",
      "probability times payoff definition",
      "how to compute ev from outcomes",
    ],
  },
  {
    slug: "linear-models-slope-intuition",
    href: "/math-applied/linear-models-slope-intuition",
    title: "Linear Models: y = a + bx in Plain Math",
    description: "Intercept, slope, and residuals before regression forecasting posts.",
    image: "/linear_models.svg",
    category: "foundations",
    tags: ["linear-model", "slope", "intercept", "foundation"],
    problemPhrases: [
      "what does slope mean in y equals a plus bx",
      "intercept and slope intuition",
      "residual distance from a line",
    ],
  },
  {
    slug: "vectors-and-features-pure-definition",
    href: "/math-applied/vectors-and-features-pure-definition",
    title: "Vectors and Features: One Row Is a Point in Space",
    description:
      "Spreadsheet rows as feature vectors: dimensions, coordinates, and the design matrix behind ML.",
    image: "/vectors_features.svg",
    category: "foundations",
    tags: ["vector", "features", "linear-algebra", "foundation"],
    problemPhrases: [
      "what is a feature vector",
      "row as vector in machine learning",
      "design matrix rows and columns",
    ],
  },
  {
    slug: "dot-product-cosine-similarity-pure-definition",
    href: "/math-applied/dot-product-cosine-similarity-pure-definition",
    title: "Dot Product and Cosine Similarity: How Aligned Are Two Vectors?",
    description:
      "Dot product vs cosine for search, recommendations, and RAG when vector length varies.",
    image: "/dot_product_cosine.svg",
    category: "foundations",
    tags: ["dot-product", "cosine", "similarity", "linear-algebra", "foundation"],
    problemPhrases: [
      "dot product versus cosine similarity",
      "vector similarity search ranking",
      "cosine similarity rag retrieval",
    ],
  },
  {
    slug: "matrices-linear-systems-pure-definition",
    href: "/math-applied/matrices-linear-systems-pure-definition",
    title: "Matrices and Linear Systems: Regression Is Ax = b",
    description:
      "Normal equations and design matrices: the linear system regression actually solves.",
    image: "/matrices_systems.svg",
    category: "foundations",
    tags: ["matrix", "linear-system", "regression", "linear-algebra", "foundation"],
    problemPhrases: [
      "regression as matrix equation",
      "ax equals b linear system",
      "normal equations intuition",
    ],
  },
  {
    slug: "least-squares-geometry-real-decisions",
    href: "/math-applied/least-squares-geometry-real-decisions",
    title: "Least Squares: Why Squared Error Picks One Best Line",
    description:
      "Sum of squared residuals and why the best-fit line is the unique SSE minimizer.",
    image: "/least_squares_geometry.svg",
    category: "foundations",
    tags: ["least-squares", "regression", "residual", "linear-algebra", "foundation"],
    problemPhrases: [
      "why least squares regression",
      "sum of squared errors line fit",
      "minimize squared residuals",
    ],
  },
  {
    slug: "norms-and-distance-pure-definition",
    href: "/math-applied/norms-and-distance-pure-definition",
    title: "Norms and Distance: How Far Apart Are Two Feature Vectors?",
    description:
      "L1 and L2 distance for anomaly detection, duplicate search, and comparing rows in feature space.",
    image: "/norms_distance.svg",
    category: "foundations",
    tags: ["norm", "distance", "l2", "linear-algebra", "foundation"],
    problemPhrases: [
      "euclidean distance feature vector",
      "l1 versus l2 distance anomaly",
      "vector norm length machine learning",
    ],
  },
  {
    slug: "orthogonality-uncorrelated-inputs-pure-definition",
    href: "/math-applied/orthogonality-uncorrelated-inputs-pure-definition",
    title: "Orthogonality: When Two Features Carry Separate Signal",
    description:
      "Correlation as angle: orthogonal inputs read cleanly in regression; parallel inputs share credit.",
    image: "/orthogonality.svg",
    category: "foundations",
    tags: ["orthogonal", "correlation", "linear-algebra", "foundation"],
    problemPhrases: [
      "orthogonal features regression",
      "uncorrelated inputs coefficient interpretation",
      "correlation as angle between vectors",
    ],
  },
  {
    slug: "k-nearest-neighbors-classification-pure-definition",
    href: "/math-applied/k-nearest-neighbors-classification-pure-definition",
    title: "k-Nearest Neighbors: Classify by the Closest Labeled Examples",
    description:
      "Distance-based voting: fraud similarity, routing, and duplicate detection without a training phase.",
    image: "/k_nearest_neighbors.svg",
    category: "foundations",
    tags: ["knn", "classification", "distance", "nearest-neighbor", "foundation"],
    problemPhrases: [
      "k nearest neighbors classification",
      "classify by similar past examples",
      "distance based fraud detection",
    ],
  },
  {
    slug: "logistic-regression-classification-pure-definition",
    href: "/math-applied/logistic-regression-classification-pure-definition",
    title: "Logistic Regression: Linear Boundary, Probability Score",
    description:
      "Sigmoid scores, linear decision boundaries, and the bridge from regression to classification.",
    image: "/logistic_regression_classification.svg",
    category: "foundations",
    tags: ["logistic", "classification", "sigmoid", "probability", "foundation"],
    problemPhrases: [
      "logistic regression intuition",
      "sigmoid probability classifier",
      "linear decision boundary",
    ],
  },
  {
    slug: "classification-loss-functions-pure-definition",
    href: "/math-applied/classification-loss-functions-pure-definition",
    title: "Classification Loss: What Optimizers Actually Minimize",
    description:
      "Cross-entropy, hinge, and 0-1 loss: why training uses smooth penalties, not accuracy.",
    image: "/classification_loss_functions.svg",
    category: "foundations",
    tags: ["loss", "cross-entropy", "classification", "training", "foundation"],
    problemPhrases: [
      "cross entropy loss explained",
      "why not train on accuracy",
      "classification loss function",
    ],
  },
  {
    slug: "gradient-descent-optimizers-pure-definition",
    href: "/math-applied/gradient-descent-optimizers-pure-definition",
    title: "Gradient Descent: How Classifiers Learn Their Weights",
    description:
      "Learning rate, gradient steps, and SGD intuition for fitting logistic and neural models.",
    image: "/gradient_descent_optimizers.svg",
    category: "foundations",
    tags: ["gradient-descent", "optimizer", "learning-rate", "training", "foundation"],
    problemPhrases: [
      "gradient descent intuition",
      "learning rate too high",
      "how models learn weights",
    ],
  },
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
    slug: "pca-intuition-real-decisions",
    href: "/math-applied/pca-intuition-real-decisions",
    title: "PCA Intuition: One Axis for a Wall of Correlated KPIs",
    description:
      "Principal components as composite scores when dashboard metrics move together.",
    image: "/pca_intuition.svg",
    category: "summarize",
    tags: ["pca", "variance", "kpi", "dimensionality"],
    problemPhrases: [
      "pca intuition correlated metrics",
      "reduce dashboard kpis to one score",
      "principal component variance explained",
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
    slug: "cohort-analysis-real-decisions",
    href: "/math-applied/cohort-analysis-real-decisions",
    title: "The New Users Look Great: Cohort Analysis in Real Decisions",
    description: "Headline retention vs signup cohorts: when the mix shifts and when product quality actually changed.",
    image: "/cohort_analysis.svg",
    category: "summarize",
    tags: ["cohort", "retention", "mix-shift", "signup"],
    problemPhrases: [
      "new users look better but mix changed",
      "headline retention vs signup cohort",
      "retention dropped after signup surge",
      "each signup month worse at day 30",
      "user base got younger retention fell",
    ],
  },
  {
    slug: "rates-vs-counts-real-decisions",
    href: "/math-applied/rates-vs-counts-real-decisions",
    title: "More Tickets, Same Workload? Rates vs Counts in Real Data",
    description: "Total volume vs per-user rate: when headline counts rise because the base grew.",
    image: "/rates_vs_counts.svg",
    category: "summarize",
    tags: ["rate", "count", "denominator", "volume"],
    problemPhrases: [
      "total tickets up but per user flat",
      "count went up is it actually worse",
      "headline number hides the denominator",
      "more events because users grew",
    ],
  },
  {
    slug: "seasonality-real-decisions",
    href: "/math-applied/seasonality-real-decisions",
    title: "Up From Last Month: Is That Normal for March? Seasonality",
    description: "Month-over-month vs same month last year when the calendar drives the metric.",
    image: "/seasonality.svg",
    category: "summarize",
    tags: ["seasonality", "yoy", "mom", "calendar"],
    problemPhrases: [
      "down vs last month but up vs last year",
      "is this normal for the season",
      "december looks bad after november",
      "compare to same month last year",
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
    slug: "statistical-power-real-decisions",
    href: "/math-applied/statistical-power-real-decisions",
    title: "We Ran the Test: Could We Even See a Win? Statistical Power",
    description: "Detectability before you launch: sample size, baseline, and minimum lift together.",
    image: "/statistical_power.svg",
    category: "experiments",
    tags: ["power", "mde", "ab-test", "sample-size"],
    problemPhrases: [
      "was the test underpowered",
      "could we detect this lift",
      "not enough power to see a winner",
      "how big a sample to detect lift",
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
    slug: "at-least-one-failure-real-decisions",
    href: "/math-applied/at-least-one-failure-real-decisions",
    title: "At Least One Failure: When Small Risks Compound",
    description:
      "P(at least one) = 1 − (1 − p)^n for deploys, SLA misses, and repeated risky trials.",
    image: "/at_least_one.svg",
    category: "experiments",
    tags: ["probability", "risk", "reliability", "compounding"],
    problemPhrases: [
      "at least one failure probability",
      "small risk many trials",
      "deploy rollback risk compounded",
    ],
  },
  {
    slug: "stacking-rare-risks-real-decisions",
    href: "/math-applied/stacking-rare-risks-real-decisions",
    title: "Stacking Rare Risks: Alert Fatigue From Many Small False Positives",
    description:
      "Many low false-positive checks on one case: system alert rate is 1 − (1 − f)^k.",
    image: "/stacking_rare_risks.svg",
    category: "experiments",
    tags: ["probability", "false-positive", "alerts", "fraud", "rules"],
    problemPhrases: [
      "many rules false positive rate",
      "alert fatigue stacked checks",
      "system false alert probability",
    ],
  },
  {
    slug: "stockout-probability-real-decisions",
    href: "/math-applied/stockout-probability-real-decisions",
    title: "Will We Run Out? Probability of Stockout in Real Inventory Decisions",
    description: "Set reorder points using explicit stockout risk instead of gut feel.",
    image: "/stockout_probability.svg",
    category: "experiments",
    tags: ["probability", "inventory", "stockout", "reorder-point", "service-level"],
    problemPhrases: [
      "how likely are we to stock out",
      "set reorder point from risk",
      "inventory risk during lead time",
      "stockout probability before restock",
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
    slug: "classifier-metrics-precision-recall-auc",
    href: "/math-applied/classifier-metrics-precision-recall-auc",
    title: "Classifier Metrics: Precision, Recall, Accuracy, and AUC in Plain Language",
    description:
      "TP, FP, FN, TN, every major classifier score, precision vs recall tradeoffs, and draggable ROC/AUC charts.",
    image: "/classifier_metrics.svg",
    category: "experiments",
    tags: ["ai", "ml", "precision", "recall", "auc", "roc", "classifier", "confusion-matrix"],
    problemPhrases: [
      "precision recall accuracy explained",
      "confusion matrix tp fp fn tn",
      "what is auc roc curve",
      "when to optimize precision vs recall",
      "classifier metrics business tradeoff",
    ],
  },
  {
    slug: "decision-trees-classification-real-decisions",
    href: "/math-applied/decision-trees-classification-real-decisions",
    title: "Decision Trees: Readable Rules for Classification",
    description:
      "Axis-aligned splits, readable if-then policies, and depth tradeoffs for fraud and hiring screens.",
    image: "/decision_trees_classification.svg",
    category: "experiments",
    tags: ["decision-tree", "classification", "rules", "interpretable", "ml"],
    problemPhrases: [
      "decision tree classification rules",
      "interpretable ml policy tree",
      "tree depth overfitting",
    ],
  },
  {
    slug: "model-calibration-real-decisions",
    href: "/math-applied/model-calibration-real-decisions",
    title: "The Model Says 90%: Can You Trust the Score?",
    description:
      "Reliability diagrams, overconfident scores, and why accuracy can look fine while auto-block rules fail.",
    image: "/model_calibration.svg",
    category: "experiments",
    tags: ["ai", "ml", "calibration", "classifier", "fraud", "probability"],
    problemPhrases: [
      "model says 90 percent can I trust it",
      "calibration reliability diagram",
      "scores overconfident",
      "auto block threshold fraud model",
      "probability score not matching reality",
    ],
  },
  {
    slug: "threshold-tradeoffs-real-decisions",
    href: "/math-applied/threshold-tradeoffs-real-decisions",
    title: "Where Do You Draw the Line? Threshold Tradeoffs in Real Decisions",
    description:
      "Precision vs recall, review capacity, and dollar cost when you pick a classifier cutoff.",
    image: "/threshold_tradeoffs.svg",
    category: "experiments",
    tags: ["ai", "ml", "threshold", "precision", "recall", "classifier", "fraud"],
    problemPhrases: [
      "precision recall tradeoff threshold",
      "where to set classifier cutoff",
      "auto block threshold review queue",
      "lower threshold more false positives",
      "capacity cost precision recall",
    ],
  },
  {
    slug: "eval-sample-size-real-decisions",
    href: "/math-applied/eval-sample-size-real-decisions",
    title: "How Many Labels Before You Trust the Metric?",
    description:
      "Labeled-set size for precision, recall, and F1 — when the eval band is too wide to ship.",
    image: "/ml_label_sample_size.svg",
    category: "experiments",
    tags: ["ai", "ml", "eval", "precision", "recall", "sample-size", "labels"],
    problemPhrases: [
      "how many labels for model eval",
      "precision eval set too small",
      "trust ml metric sample size",
      "labeled data for recall estimate",
      "eval band too wide to ship",
    ],
  },
  {
    slug: "concept-drift-real-decisions",
    href: "/math-applied/concept-drift-real-decisions",
    title: "Last Quarter's Model, This Quarter's Data: Concept Drift",
    description:
      "When live behavior shifts but training accuracy still looks fine — and auto-decisions start misfiring.",
    image: "/concept_drift.svg",
    category: "traps",
    tags: ["ai", "ml", "concept-drift", "model", "fraud", "monitoring"],
    problemPhrases: [
      "model worked in training fails live",
      "concept drift distribution shift",
      "live false positive rate climbed",
      "retrain model after product launch",
      "training accuracy fine but production bad",
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
    slug: "multicollinearity-real-decisions",
    href: "/math-applied/multicollinearity-real-decisions",
    title: "Multicollinearity: When Two Drivers Share the Same Story",
    description:
      "Correlated regression inputs make coefficients unstable and driver credit unreliable.",
    image: "/multicollinearity.svg",
    category: "traps",
    tags: ["multicollinearity", "regression", "correlation", "drivers"],
    problemPhrases: [
      "multicollinearity regression coefficients",
      "correlated predictors unstable betas",
      "which marketing driver gets credit",
    ],
  },
  {
    slug: "ridge-regularization-real-decisions",
    href: "/math-applied/ridge-regularization-real-decisions",
    title: "Ridge Regularization: Shrink Unstable Coefficients Without Dropping Features",
    description:
      "Ridge penalty stabilizes collinear regression inputs by shrinking coefficients toward zero.",
    image: "/ridge_regularization.svg",
    category: "traps",
    tags: ["ridge", "regularization", "regression", "multicollinearity"],
    problemPhrases: [
      "ridge regression collinear features",
      "regularization shrink coefficients",
      "lambda penalty unstable betas",
    ],
  },
  {
    slug: "gamblers-fallacy-real-decisions",
    href: "/math-applied/gamblers-fallacy-real-decisions",
    title: "The Gambler's Fallacy: Streaks Do Not Load the Next Trial",
    description:
      "Five losses in a row does not make the next independent trial more likely to win.",
    image: "/gamblers_fallacy.svg",
    category: "traps",
    tags: ["probability", "fallacy", "streak", "independence"],
    problemPhrases: [
      "gambler's fallacy streak",
      "due for a win after losses",
      "hot hand fallacy independent trials",
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
    slug: "overfitting-real-decisions",
    href: "/math-applied/overfitting-real-decisions",
    title: "The Model Looked Perfect on Past Data: Overfitting in Real Decisions",
    description: "Train vs holdout: when forecasts memorize history instead of predicting new weeks.",
    image: "/overfitting.svg",
    category: "traps",
    tags: ["overfitting", "holdout", "forecast", "model"],
    problemPhrases: [
      "model perfect on training bad on holdout",
      "forecast worked in history failed live",
      "too many variables for short history",
      "memorized past data not predicting",
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
  "case-study-northside-weekend-reorder": [
    "stockout-probability-real-decisions",
    "expected-value-real-decisions",
    "reading-distributions-percentiles-quartiles",
  ],
  "probability-basics-events-independence": [
    "conditional-probability-pure-definition",
    "dependent-probability-chains-real-decisions",
    "probability-real-decisions",
  ],
  "conditional-probability-pure-definition": [
    "sensitivity-specificity-screening",
    "base-rates-real-decisions",
    "dependent-probability-chains-real-decisions",
  ],
  "dependent-probability-chains-real-decisions": [
    "probability-basics-events-independence",
    "conditional-probability-pure-definition",
    "probability-real-decisions",
  ],
  "sensitivity-specificity-screening": [
    "classifier-metrics-precision-recall-auc",
    "base-rates-real-decisions",
    "threshold-tradeoffs-real-decisions",
  ],
  "reading-distributions-percentiles-quartiles": [
    "percentiles-quartiles-real-data",
    "variance-spread-real-data",
    "mean-vs-median-real-data",
  ],
  "expected-value-pure-definition": [
    "expected-value-real-decisions",
    "probability-real-decisions",
    "stockout-probability-real-decisions",
  ],
  "linear-models-slope-intuition": [
    "least-squares-geometry-real-decisions",
    "matrices-linear-systems-pure-definition",
    "regression-real-decisions",
  ],
  "vectors-and-features-pure-definition": [
    "dot-product-cosine-similarity-pure-definition",
    "matrices-linear-systems-pure-definition",
    "linear-models-slope-intuition",
  ],
  "dot-product-cosine-similarity-pure-definition": [
    "vectors-and-features-pure-definition",
    "norms-and-distance-pure-definition",
    "model-calibration-real-decisions",
  ],
  "matrices-linear-systems-pure-definition": [
    "linear-models-slope-intuition",
    "least-squares-geometry-real-decisions",
    "regression-real-decisions",
  ],
  "least-squares-geometry-real-decisions": [
    "linear-models-slope-intuition",
    "matrices-linear-systems-pure-definition",
    "ridge-regularization-real-decisions",
  ],
  "norms-and-distance-pure-definition": [
    "k-nearest-neighbors-classification-pure-definition",
    "vectors-and-features-pure-definition",
    "dot-product-cosine-similarity-pure-definition",
  ],
  "orthogonality-uncorrelated-inputs-pure-definition": [
    "logistic-regression-classification-pure-definition",
    "multicollinearity-real-decisions",
    "correlation-vs-causation-real-decisions",
  ],
  "k-nearest-neighbors-classification-pure-definition": [
    "norms-and-distance-pure-definition",
    "dot-product-cosine-similarity-pure-definition",
    "classifier-metrics-precision-recall-auc",
  ],
  "logistic-regression-classification-pure-definition": [
    "linear-models-slope-intuition",
    "classification-loss-functions-pure-definition",
    "classifier-metrics-precision-recall-auc",
  ],
  "classification-loss-functions-pure-definition": [
    "gradient-descent-optimizers-pure-definition",
    "logistic-regression-classification-pure-definition",
    "overfitting-real-decisions",
  ],
  "gradient-descent-optimizers-pure-definition": [
    "classification-loss-functions-pure-definition",
    "least-squares-geometry-real-decisions",
    "ridge-regularization-real-decisions",
  ],
  "prime-factorization-real-problems": [
    "sample-size-real-decisions",
    "mean-vs-median-real-data",
    "percentiles-quartiles-real-data",
  ],
  "mean-vs-median-real-data": [
    "rates-vs-counts-real-decisions",
    "variance-spread-real-data",
    "percentiles-quartiles-real-data",
  ],
  "percent-change-real-decisions": [
    "benchmarks-baselines-real-decisions",
    "seasonality-real-decisions",
    "regression-to-the-mean-real-decisions",
  ],
  "variance-spread-real-data": [
    "pca-intuition-real-decisions",
    "mean-vs-median-real-data",
    "percentiles-quartiles-real-data",
  ],
  "pca-intuition-real-decisions": [
    "variance-spread-real-data",
    "multicollinearity-real-decisions",
    "correlation-vs-causation-real-decisions",
  ],
  "correlation-vs-causation-real-decisions": [
    "multicollinearity-real-decisions",
    "regression-real-decisions",
    "selection-bias-real-decisions",
  ],
  "multicollinearity-real-decisions": [
    "ridge-regularization-real-decisions",
    "regression-real-decisions",
    "orthogonality-uncorrelated-inputs-pure-definition",
  ],
  "ridge-regularization-real-decisions": [
    "multicollinearity-real-decisions",
    "overfitting-real-decisions",
    "least-squares-geometry-real-decisions",
  ],
  "percentiles-quartiles-real-data": [
    "mean-vs-median-real-data",
    "variance-spread-real-data",
    "sample-size-real-decisions",
  ],
  "sample-size-real-decisions": [
    "statistical-power-real-decisions",
    "confidence-intervals-real-decisions",
    "ab-test-readouts-real-decisions",
  ],
  "statistical-power-real-decisions": [
    "sample-size-real-decisions",
    "false-alarm-missed-win-real-decisions",
    "ab-test-readouts-real-decisions",
  ],
  "regression-real-decisions": [
    "overfitting-real-decisions",
    "multicollinearity-real-decisions",
    "matrices-linear-systems-pure-definition",
  ],
  "overfitting-real-decisions": [
    "concept-drift-real-decisions",
    "regression-real-decisions",
    "model-calibration-real-decisions",
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
    "model-calibration-real-decisions",
  ],
  "probability-real-decisions": [
    "base-rates-real-decisions",
    "at-least-one-failure-real-decisions",
    "confidence-intervals-real-decisions",
  ],
  "at-least-one-failure-real-decisions": [
    "stacking-rare-risks-real-decisions",
    "probability-real-decisions",
    "stockout-probability-real-decisions",
  ],
  "stacking-rare-risks-real-decisions": [
    "at-least-one-failure-real-decisions",
    "base-rates-real-decisions",
    "threshold-tradeoffs-real-decisions",
  ],
  "stockout-probability-real-decisions": [
    "case-study-northside-weekend-reorder",
    "probability-real-decisions",
    "expected-value-real-decisions",
    "confidence-intervals-real-decisions",
  ],
  "base-rates-real-decisions": [
    "sensitivity-specificity-screening",
    "conditional-probability-pure-definition",
    "model-calibration-real-decisions",
  ],
  "gamblers-fallacy-real-decisions": [
    "regression-to-the-mean-real-decisions",
    "probability-basics-events-independence",
    "sample-size-real-decisions",
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
    "cohort-analysis-real-decisions",
    "weighted-averages-real-data",
    "ab-test-readouts-real-decisions",
  ],
  "false-alarm-missed-win-real-decisions": [
    "model-calibration-real-decisions",
    "statistical-power-real-decisions",
    "base-rates-real-decisions",
  ],
  "model-calibration-real-decisions": [
    "classifier-metrics-precision-recall-auc",
    "threshold-tradeoffs-real-decisions",
    "eval-sample-size-real-decisions",
  ],
  "classifier-metrics-precision-recall-auc": [
    "logistic-regression-classification-pure-definition",
    "threshold-tradeoffs-real-decisions",
    "model-calibration-real-decisions",
  ],
  "decision-trees-classification-real-decisions": [
    "logistic-regression-classification-pure-definition",
    "overfitting-real-decisions",
    "classifier-metrics-precision-recall-auc",
  ],
  "threshold-tradeoffs-real-decisions": [
    "classifier-metrics-precision-recall-auc",
    "model-calibration-real-decisions",
    "false-alarm-missed-win-real-decisions",
  ],
  "eval-sample-size-real-decisions": [
    "classifier-metrics-precision-recall-auc",
    "sample-size-real-decisions",
    "threshold-tradeoffs-real-decisions",
  ],
  "concept-drift-real-decisions": [
    "overfitting-real-decisions",
    "model-calibration-real-decisions",
    "benchmarks-baselines-real-decisions",
  ],
  "weighted-averages-real-data": [
    "cohort-analysis-real-decisions",
    "benchmarks-baselines-real-decisions",
    "mean-vs-median-real-data",
  ],
  "benchmarks-baselines-real-decisions": [
    "concept-drift-real-decisions",
    "seasonality-real-decisions",
    "percent-change-real-decisions",
  ],
  "seasonality-real-decisions": [
    "benchmarks-baselines-real-decisions",
    "percent-change-real-decisions",
    "cohort-analysis-real-decisions",
  ],
  "rates-vs-counts-real-decisions": [
    "cohort-analysis-real-decisions",
    "weighted-averages-real-data",
    "mean-vs-median-real-data",
  ],
  "cohort-analysis-real-decisions": [
    "rates-vs-counts-real-decisions",
    "weighted-averages-real-data",
    "simpsons-paradox-real-decisions",
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
  })).filter((group) => group.posts.length > 0);
}

export function getRelatedPosts(slug: string, limit = 3): MathPost[] {
  const relatedSlugs = RELATED_BY_SLUG[slug] ?? [];
  return relatedSlugs
    .map((relatedSlug) => MATH_POSTS.find((post) => post.slug === relatedSlug))
    .filter((post): post is MathPost => Boolean(post))
    .slice(0, limit);
}
