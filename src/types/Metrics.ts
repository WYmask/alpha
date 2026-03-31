type BasicValue = object | number | string | boolean;

export type MetricsValue = BasicValue | Record<string, BasicValue>;

export interface Metrics {
  name: string;
  description?: string;
  value: MetricsValue;
}

export type ScrapeMetricsValue = {
  htmlContent: string;
};
