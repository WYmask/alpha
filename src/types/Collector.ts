import { Metrics, MetricsValue } from "./Metrics";

export interface Collector {
  start(): Promise<void>;
  stop(): Promise<void>;
  getMetrics(): Metrics;
  getMetricsValue(): MetricsValue;
  isReady(): boolean;
}
