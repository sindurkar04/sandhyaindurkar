export type ApplicationSlider = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  lowLabel?: string;
  highLabel?: string;
  format?: (value: number) => string;
};

export type ApplicationScenario = {
  id: string;
  label: string;
  sliderDefaults: Record<string, number>;
};

export type ApplicationChartKind = "line" | "bar";

export type ApplicationChart = {
  id: string;
  title: string;
  labels: string[];
  values: number[];
  kind?: ApplicationChartKind;
  referenceLine?: number;
  changeLabel?: string;
  valueFormat?: (value: number) => string;
};

export type ApplicationStat = {
  label: string;
  value: string;
  note?: string;
  emphasis?: boolean;
};

export type ApplicationActions = {
  optimize: string[];
  hold: string[];
  escalateIf: string[];
};

export type ApplicationCaseState = Record<string, number>;

export type ApplicationCaseResult = {
  headline: string;
  readout: string;
  charts: ApplicationChart[];
  stats: ApplicationStat[];
  actions: ApplicationActions;
};

export type ApplicationCaseConfig = {
  slug: string;
  title: string;
  intro: string;
  scenarios?: ApplicationScenario[];
  sliders: ApplicationSlider[];
  compute: (state: ApplicationCaseState, scenarioId?: string) => ApplicationCaseResult;
};
