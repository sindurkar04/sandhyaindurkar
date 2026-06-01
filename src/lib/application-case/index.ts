import { SUMMARIZE_APPLICATION_CASES } from "./cases-summarize";
import { EXPERIMENTS_APPLICATION_CASES } from "./cases-experiments";
import { TRAPS_APPLICATION_CASES } from "./cases-traps";
import type { ApplicationCaseConfig } from "./types";

export * from "./types";
export * from "./chart-utils";

const ALL_CASES: ApplicationCaseConfig[] = [
  ...SUMMARIZE_APPLICATION_CASES,
  ...EXPERIMENTS_APPLICATION_CASES,
  ...TRAPS_APPLICATION_CASES,
];

export const APPLICATION_CASE_BY_SLUG: Record<string, ApplicationCaseConfig> = Object.fromEntries(
  ALL_CASES.map((config) => [config.slug, config]),
);

export function getApplicationCase(slug: string): ApplicationCaseConfig | undefined {
  return APPLICATION_CASE_BY_SLUG[slug];
}

export function getAllApplicationCaseSlugs(): string[] {
  return ALL_CASES.map((c) => c.slug);
}
